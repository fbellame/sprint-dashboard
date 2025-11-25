import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
  notFoundResponse,
} from '@/lib/api/utils/response';
import { updateSprintSchema, sprintIdSchema } from '@/lib/api/schemas/sprint';
import type { Sprint } from '@/lib/types/database';

/**
 * GET /api/sprints/:id
 * Get sprint details
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate ID format
    const idValidation = sprintIdSchema.safeParse({ id });
    if (!idValidation.success) {
      return validationErrorResponse(idValidation.error);
    }

    const { data, error } = await supabaseAdmin
      .from('sprints')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found
        return notFoundResponse('Sprint');
      }

      return errorResponse(
        'Failed to fetch sprint',
        500,
        'DATABASE_ERROR',
        error
      );
    }

    if (!data) {
      return notFoundResponse('Sprint');
    }

    return successResponse<Sprint>(data);
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
 * PUT /api/sprints/:id
 * Update sprint
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validate ID format
    const idValidation = sprintIdSchema.safeParse({ id });
    if (!idValidation.success) {
      return validationErrorResponse(idValidation.error);
    }

    // Validate input
    const validationResult = updateSprintSchema.safeParse(body);
    if (!validationResult.success) {
      return validationErrorResponse(validationResult.error);
    }

    const input = validationResult.data;

    // Check if sprint exists
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('sprints')
      .select('id')
      .eq('id', id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return notFoundResponse('Sprint');
      }
      return errorResponse(
        'Failed to check sprint existence',
        500,
        'DATABASE_ERROR',
        fetchError
      );
    }

    if (!existing) {
      return notFoundResponse('Sprint');
    }

    // Check for duplicate sprint number if sprint_number or team_name is being updated
    // Sprint numbers must be unique per team, matching database constraint UNIQUE(sprint_number, team_name)
    if (input.sprint_number !== undefined || input.team_name !== undefined) {
      // Get the current sprint to check against
      const { data: currentSprint, error: currentSprintError } =
        await supabaseAdmin
          .from('sprints')
          .select('sprint_number, team_name')
          .eq('id', id)
          .single();

      if (currentSprintError || !currentSprint) {
        return notFoundResponse('Sprint');
      }

      // Get the team_name to check (use updated value if provided, otherwise current sprint's team_name)
      const checkTeamName =
        input.team_name !== undefined
          ? input.team_name
          : currentSprint.team_name;
      const checkSprintNumber =
        input.sprint_number !== undefined
          ? input.sprint_number
          : currentSprint.sprint_number;

      // Build duplicate check query
      let duplicateQuery = supabaseAdmin
        .from('sprints')
        .select('id, sprint_number, team_name')
        .eq('sprint_number', checkSprintNumber)
        .neq('id', id);

      // Match team_name: if provided, check exact match; if null, check for null
      if (checkTeamName) {
        duplicateQuery = duplicateQuery.eq('team_name', checkTeamName);
      } else {
        duplicateQuery = duplicateQuery.is('team_name', null);
      }

      const { data: duplicate, error: duplicateError } =
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

      // If duplicate exists, return conflict error
      if (duplicate) {
        const teamContext = checkTeamName
          ? ` for team "${checkTeamName}"`
          : ' (no team)';
        return errorResponse(
          `A sprint with number ${checkSprintNumber} already exists${teamContext}.`,
          409,
          'DUPLICATE_ENTRY'
        );
      }
    }

    // Update sprint
    const { data, error } = await supabaseAdmin
      .from('sprints')
      .update({
        ...(input.sprint_number !== undefined && {
          sprint_number: input.sprint_number,
        }),
        ...(input.sprint_name !== undefined && {
          sprint_name: input.sprint_name,
        }),
        ...(input.start_date !== undefined && { start_date: input.start_date }),
        ...(input.end_date !== undefined && { end_date: input.end_date }),
        ...(input.team_name !== undefined && { team_name: input.team_name }),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return errorResponse(
          'Sprint with this number already exists',
          409,
          'DUPLICATE_ENTRY'
        );
      }

      return errorResponse(
        'Failed to update sprint',
        500,
        'DATABASE_ERROR',
        error
      );
    }

    if (!data) {
      return notFoundResponse('Sprint');
    }

    return successResponse<Sprint>(data);
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

/**
 * DELETE /api/sprints/:id
 * Delete sprint
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate ID format
    const idValidation = sprintIdSchema.safeParse({ id });
    if (!idValidation.success) {
      return validationErrorResponse(idValidation.error);
    }

    // Check if sprint exists
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('sprints')
      .select('id')
      .eq('id', id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return notFoundResponse('Sprint');
      }
      return errorResponse(
        'Failed to check sprint existence',
        500,
        'DATABASE_ERROR',
        fetchError
      );
    }

    if (!existing) {
      return notFoundResponse('Sprint');
    }

    // Delete sprint (CASCADE will delete related work_items)
    const { error } = await supabaseAdmin.from('sprints').delete().eq('id', id);

    if (error) {
      return errorResponse(
        'Failed to delete sprint',
        500,
        'DATABASE_ERROR',
        error
      );
    }

    return successResponse({ message: 'Sprint deleted successfully' }, 200);
  } catch (error) {
    return errorResponse(
      'An unexpected error occurred',
      500,
      'INTERNAL_ERROR',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}
