/**
 * POST /api/sprints/:id/upload/process
 * Process CSV file content - Parse, validate, transform, and store work items
 * 
 * Stories: 1.6 (CSV Parsing) + 1.7 (CSV Transformation) + 1.8 (Work Items Storage)
 * 
 * This endpoint:
 * 1. Parses and validates CSV content
 * 2. Transforms CSV rows to work items
 * 3. Stores work items in database (bulk insert/update with conflict resolution)
 * 4. Updates CSV upload status
 * 5. Returns processing results
 * 
 * The file content should be sent in the request body as text or as a File object.
 */

import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
  notFoundResponse,
} from '@/lib/api/utils/response';
import { sprintIdSchema } from '@/lib/api/schemas/sprint';
import { parseCsvFile, formatParsingErrors } from '@/lib/transformers/csvParser';
import { transformCsvRowsToWorkItems } from '@/lib/transformers/csvToWorkItem';
import { bulkStoreWorkItems } from '@/lib/api/workItemsStorage';

/**
 * Process CSV file content
 * 
 * Accepts CSV content in request body and returns parsing/validation results.
 * This is used after file upload to parse and validate the CSV data.
 * 
 * Request body can be:
 * - { file_content: string } - CSV content as string
 * - FormData with 'file' field - File object
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate sprint ID format
    const idValidation = sprintIdSchema.safeParse({ id });
    if (!idValidation.success) {
      return validationErrorResponse(idValidation.error);
    }

    // Check if sprint exists
    const { data: sprint, error: sprintError } = await supabaseAdmin
      .from('sprints')
      .select('id')
      .eq('id', id)
      .single();

    if (sprintError || !sprint) {
      if (sprintError?.code === 'PGRST116') {
        return notFoundResponse('Sprint');
      }
      return errorResponse(
        'Failed to verify sprint',
        500,
        'DATABASE_ERROR',
        sprintError
      );
    }

    // Get CSV content and optional upload_id from request
    const contentType = request.headers.get('content-type') || '';

    let csvContent: string;
    let uploadId: string | null = null;

    if (contentType.includes('application/json')) {
      // JSON body with file_content and optional upload_id
      const body = await request.json();
      if (!body.file_content || typeof body.file_content !== 'string') {
        return errorResponse(
          'file_content is required and must be a string',
          400,
          'MISSING_FILE_CONTENT'
        );
      }
      csvContent = body.file_content;
      uploadId = body.upload_id || null;
    } else if (contentType.includes('multipart/form-data')) {
      // FormData with file
      const formData = await request.formData();
      const file = formData.get('file') as File | null;

      if (!file) {
        return errorResponse('No file provided', 400, 'MISSING_FILE');
      }

      csvContent = await file.text();
    } else if (contentType.includes('text/csv') || contentType.includes('text/plain')) {
      // Direct CSV content
      csvContent = await request.text();
    } else {
      return errorResponse(
        'Unsupported content type. Use application/json with file_content, multipart/form-data with file, or text/csv',
        400,
        'UNSUPPORTED_CONTENT_TYPE'
      );
    }

    // Validate CSV content is not empty
    if (!csvContent || csvContent.trim().length === 0) {
      return errorResponse('CSV content cannot be empty', 400, 'EMPTY_CSV_CONTENT');
    }

    // Parse and validate CSV
    const result = await parseCsvFile(csvContent);

    // Format errors if any
    const errorDetails =
      result.errors.length > 0 ? formatParsingErrors(result.errors) : null;

    // Transform valid CSV rows to work items
    const workItems = transformCsvRowsToWorkItems(result.data, id);

    // Store work items in database (bulk insert/update with conflict resolution)
    const storageResult = await bulkStoreWorkItems(workItems);

    // Update CSV upload status if upload_id provided
    if (uploadId) {
      const hasErrors = storageResult.failed > 0 || result.errors.length > 0;
      const status = hasErrors ? 'failed' : 'processed';
      const errorMessage =
        hasErrors && storageResult.errors.length > 0
          ? `Storage errors: ${storageResult.errors.length} items failed`
          : null;

      await supabaseAdmin
        .from('csv_uploads')
        .update({
          status,
          error_message: errorMessage,
          row_count: storageResult.inserted + storageResult.updated,
        })
        .eq('id', uploadId)
        .eq('sprint_id', id);
    }

    // Return complete processing results
    return successResponse({
      parsing_result: {
        total_rows: result.meta.totalRows,
        valid_rows: result.meta.validRows,
        invalid_rows: result.meta.invalidRows,
        skipped_rows: result.meta.skippedRows,
        errors: errorDetails,
      },
      transformation_result: {
        work_items_count: workItems.length,
      },
      storage_result: {
        inserted: storageResult.inserted,
        updated: storageResult.updated,
        failed: storageResult.failed,
        total_stored: storageResult.inserted + storageResult.updated,
        errors:
          storageResult.errors.length > 0 ? storageResult.errors : null,
      },
    });
  } catch (error) {
    return errorResponse(
      'An unexpected error occurred during CSV processing',
      500,
      'INTERNAL_ERROR',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}

