import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
  notFoundResponse,
} from '@/lib/api/utils/response';
import { sprintIdSchema } from '@/lib/api/schemas/sprint';
import type { CsvUpload } from '@/lib/types/database';

/**
 * POST /api/sprints/:id/upload
 * Upload CSV file for a sprint
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

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return errorResponse('No file provided', 400, 'MISSING_FILE');
    }

    // Validate file type
    const isValidType =
      file.type === 'text/csv' ||
      file.type === 'application/vnd.ms-excel' ||
      file.name.toLowerCase().endsWith('.csv');

    if (!isValidType) {
      return errorResponse(
        'Invalid file type. Only CSV files are allowed.',
        400,
        'INVALID_FILE_TYPE'
      );
    }

    // Validate file size (max 10MB)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_FILE_SIZE) {
      return errorResponse(
        `File size exceeds maximum allowed size of 10MB. File size: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
        400,
        'FILE_TOO_LARGE'
      );
    }

    if (file.size === 0) {
      return errorResponse('File cannot be empty', 400, 'EMPTY_FILE');
    }

    // Read file content to count rows (approximate)
    const fileContent = await file.text();
    const rowCount =
      fileContent.split('\n').filter((line) => line.trim()).length - 1; // Subtract header row

    // Store file metadata in csv_uploads table
    const { data: uploadRecord, error: uploadError } = await supabaseAdmin
      .from('csv_uploads')
      .insert({
        sprint_id: id,
        file_name: file.name,
        file_size: file.size,
        row_count: rowCount > 0 ? rowCount : null,
        status: 'uploaded', // Will be updated to 'processing' and 'processed' later
        error_message: null,
      })
      .select()
      .single();

    if (uploadError) {
      return errorResponse(
        'Failed to store upload metadata',
        500,
        'DATABASE_ERROR',
        uploadError
      );
    }

    // Return upload ID and status
    return successResponse<CsvUpload>(
      {
        id: uploadRecord.id,
        sprint_id: uploadRecord.sprint_id,
        file_name: uploadRecord.file_name,
        file_size: uploadRecord.file_size,
        upload_date: uploadRecord.upload_date,
        row_count: uploadRecord.row_count,
        status: uploadRecord.status,
        error_message: uploadRecord.error_message,
      },
      201
    );
  } catch (error) {
    return errorResponse(
      'An unexpected error occurred during file upload',
      500,
      'INTERNAL_ERROR',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}
