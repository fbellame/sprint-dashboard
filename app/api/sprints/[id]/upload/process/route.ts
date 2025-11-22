/**
 * POST /api/sprints/:id/upload/process
 * Process CSV file content - Parse and validate CSV data
 * 
 * Story: 1.6 - CSV Parsing and Validation
 * 
 * This endpoint accepts CSV file content and returns parsing/validation results.
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

    // Get CSV content from request
    const contentType = request.headers.get('content-type') || '';

    let csvContent: string;

    if (contentType.includes('application/json')) {
      // JSON body with file_content
      const body = await request.json();
      if (!body.file_content || typeof body.file_content !== 'string') {
        return errorResponse(
          'file_content is required and must be a string',
          400,
          'MISSING_FILE_CONTENT'
        );
      }
      csvContent = body.file_content;
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

    // Return parsing results
    return successResponse({
      parsing_result: {
        total_rows: result.meta.totalRows,
        valid_rows: result.meta.validRows,
        invalid_rows: result.meta.invalidRows,
        skipped_rows: result.meta.skippedRows,
        errors: errorDetails,
      },
      // Include sample of valid data (first 5 rows) for preview
      sample_data: result.data.slice(0, 5),
      // Note: Full data will be transformed and stored in Story 1.7
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

