import {
  getSprintById,
  getTeamBacklogMetrics,
  getStoriesByState,
  getTopFeatures,
  getSprintConfiguration,
} from '@/lib/api/supabase-helpers';
import {
  successResponse,
  errorResponse,
  notFoundResponse,
} from '@/lib/api/utils/response';

/**
 * GET /api/sprints/:id/dashboard
 *
 * Returns all dashboard metrics for a sprint including:
 * - Team backlog metrics
 * - Stories by state
 * - Top features
 * - Team velocity
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sprintId } = await params;

    // Fetch all dashboard data in parallel
    const [sprint, backlogMetrics, storiesByState, topFeatures, sprintConfig] =
      await Promise.all([
        getSprintById(sprintId),
        getTeamBacklogMetrics(sprintId).catch(() => null),
        getStoriesByState(sprintId).catch(() => []),
        getTopFeatures(sprintId, 5).catch(() => []),
        getSprintConfiguration(sprintId).catch(() => null),
      ]);

    if (!sprint) {
      return notFoundResponse('Sprint');
    }

    // Extract velocity from sprint configuration
    const velocity = sprintConfig?.team_velocity ?? null;

    return successResponse(
      {
        sprint,
        team_backlog: backlogMetrics,
        stories_by_state: storiesByState,
        top_features: topFeatures,
        velocity,
      },
      200
    );
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return errorResponse(
      'Failed to fetch dashboard data',
      500,
      'DATABASE_ERROR'
    );
  }
}
