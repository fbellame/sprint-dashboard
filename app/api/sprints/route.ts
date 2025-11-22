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

    // Check for duplicate sprint number based on (sprint_number, team_name) combination
    // The database has UNIQUE(sprint_number, team_name) constraint
    // This allows same sprint number for different teams, but not for same team
    let duplicateQuery = supabaseAdmin
      .from('sprints')
      .select('id')
      .eq('sprint_number', input.sprint_number);

    // Match team_name (including null)
    if (input.team_name) {
      duplicateQuery = duplicateQuery.eq('team_name', input.team_name);
    } else {
      duplicateQuery = duplicateQuery.is('team_name', null);
    }

    // Use maybeSingle() instead of single() to handle "not found" gracefully
    const { data: existing, error: duplicateError } =
      await duplicateQuery.maybeSingle();

    // If query error (not "not found"), return error
    if (duplicateError && duplicateError.code !== 'PGRST116') {
      return errorResponse(
        'Failed to check for duplicate sprint',
        500,
        'DATABASE_ERROR',
        duplicateError
      );
    }

    // If sprint exists, return conflict error
    if (existing) {
      const errorMessage = input.team_name
        ? `A sprint with number ${input.sprint_number} already exists for team "${input.team_name}".`
        : `A sprint with number ${input.sprint_number} already exists (no team specified).`;

      return errorResponse(errorMessage, 409, 'DUPLICATE_ENTRY');
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
