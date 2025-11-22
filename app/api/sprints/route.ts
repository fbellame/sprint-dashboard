import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
} from '@/lib/api/utils/response';
import { createSprintSchema } from '@/lib/api/schemas/sprint';
import type { Sprint } from '@/lib/types/database';

/**
 * GET /api/sprints
 * List all sprints
 */
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('sprints')
      .select('*')
      .order('sprint_number', { ascending: false });

    if (error) {
      return errorResponse(
        'Failed to fetch sprints',
        500,
        'DATABASE_ERROR',
        error
      );
    }

    return successResponse<Sprint[]>(data || []);
  } catch (error) {
    return errorResponse(
      'An unexpected error occurred',
      500,
      'INTERNAL_ERROR',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}

/**
 * POST /api/sprints
 * Create a new sprint
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = createSprintSchema.safeParse(body);
    if (!validationResult.success) {
      return validationErrorResponse(validationResult.error);
    }

    const input = validationResult.data;

    // Check for duplicate sprint number (if team_name is provided)
    if (input.team_name) {
      const { data: existing } = await supabaseAdmin
        .from('sprints')
        .select('id')
        .eq('sprint_number', input.sprint_number)
        .eq('team_name', input.team_name)
        .single();

      if (existing) {
        return errorResponse(
          'Sprint with this number already exists for this team',
          409,
          'DUPLICATE_ENTRY'
        );
      }
    } else {
      // Check for duplicate sprint number (without team_name)
      const { data: existing } = await supabaseAdmin
        .from('sprints')
        .select('id')
        .eq('sprint_number', input.sprint_number)
        .is('team_name', null)
        .single();

      if (existing) {
        return errorResponse(
          'Sprint with this number already exists',
          409,
          'DUPLICATE_ENTRY'
        );
      }
    }

    // Create sprint
    const { data, error } = await supabaseAdmin
      .from('sprints')
      .insert({
        sprint_number: input.sprint_number,
        sprint_name: input.sprint_name,
        start_date: input.start_date || null,
        end_date: input.end_date || null,
        team_name: input.team_name || null,
      })
      .select()
      .single();

    if (error) {
      // Handle unique constraint violation
      if (error.code === '23505') {
        return errorResponse(
          'Sprint with this number already exists',
          409,
          'DUPLICATE_ENTRY'
        );
      }

      return errorResponse(
        'Failed to create sprint',
        500,
        'DATABASE_ERROR',
        error
      );
    }

    return successResponse<Sprint>(data, 201);
  } catch (error) {
    // Handle JSON parse errors
    if (error instanceof SyntaxError) {
      return errorResponse('Invalid JSON in request body', 400, 'INVALID_JSON');
    }

    return errorResponse(
      'An unexpected error occurred',
      500,
      'INTERNAL_ERROR',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}
