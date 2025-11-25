import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
  notFoundResponse,
} from '@/lib/api/utils/response';
import { sprintIdSchema } from '@/lib/api/schemas/sprint';
import type { WorkItem } from '@/lib/types/database';

/**
 * GET /api/sprints/:id/work-items
 * Get work items for a sprint
 *
 * Query parameters:
 * - is_pi_commitment: boolean - Filter by PI commitment
 * - is_sprint_goal: boolean - Filter by sprint goal
 * - limit: number - Limit number of results (default: 10)
 */
export async function GET(
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

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const isPICommitment = searchParams.get('is_pi_commitment');
    const isSprintGoal = searchParams.get('is_sprint_goal');
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 10;

    // Build query
    let query = supabaseAdmin
      .from('work_items')
      .select('*')
      .eq('sprint_id', id)
      .order('created_at', { ascending: false });

    // Apply filters
    if (isPICommitment === 'true') {
      query = query.eq('is_pi_commitment', true);
    }
    if (isSprintGoal === 'true') {
      query = query.eq('is_sprint_goal', true);
    }

    // Apply limit
    if (limit > 0) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      return errorResponse(
        'Failed to fetch work items',
        500,
        'DATABASE_ERROR',
        error
      );
    }

    return successResponse<WorkItem[]>(data || []);
  } catch (error) {
    return errorResponse(
      'An unexpected error occurred',
      500,
      'INTERNAL_ERROR',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}
