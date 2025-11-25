'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import type { Sprint } from '@/lib/api/types';
import type {
  TeamBacklogMetrics,
  StoriesByState,
  TopFeature,
} from '@/lib/types/database';
import { SprintHeader } from '@/components/dashboard/SprintHeader';
import { PICommitments } from '@/components/dashboard/PICommitments';
import { SprintGoals } from '@/components/dashboard/SprintGoals';
import { SprintHighlights } from '@/components/dashboard/SprintHighlights';
import {
  TeamBacklogTable,
  StoriesByStateTable,
  TopFeaturesTable,
  TeamVelocityDisplay,
} from '@/components/dashboard';
import { StatusIndicatorLegend } from '@/components/common/StatusIndicator';
import { formatError } from '@/lib/utils/errors';
import { createLoadingState } from '@/lib/utils/loading';

interface DashboardData {
  sprint: Sprint;
  team_backlog: TeamBacklogMetrics | null;
  stories_by_state: StoriesByState[];
  top_features: TopFeature[];
  velocity: number | null;
}

interface SprintDetailPageProps {
  params: { id: string };
}

/**
 * Sprint Detail Page
 *
 * Displays sprint information and dashboard.
 * Uses SprintHeader component from Story 2.1.
 */
export default function SprintDetailPage({ params }: SprintDetailPageProps) {
  const sprintId = params.id;

  // Fetch sprint data
  const {
    data: sprint,
    isLoading: sprintLoading,
    isFetching: sprintFetching,
    isError: sprintError,
    error: sprintErrorData,
  } = useQuery<Sprint>({
    queryKey: ['sprint', sprintId],
    queryFn: () => apiClient.get<Sprint>(`/api/sprints/${sprintId}`),
    enabled: !!sprintId,
  });

  // Fetch dashboard metrics
  const {
    data: dashboardData,
    isLoading: dashboardLoading,
    isFetching: dashboardFetching,
    isError: dashboardError,
    error: dashboardErrorData,
  } = useQuery<DashboardData>({
    queryKey: ['dashboard', sprintId],
    queryFn: () =>
      apiClient.get<DashboardData>(`/api/sprints/${sprintId}/dashboard`),
    enabled: !!sprintId,
  });

  const isLoading = sprintLoading || dashboardLoading;
  const isFetching = sprintFetching || dashboardFetching;
  const isError = sprintError || dashboardError;
  const error = sprintErrorData || dashboardErrorData;

  const loadingState = createLoadingState(
    isLoading,
    isFetching,
    isError,
    error
  );

  // Loading state
  if (loadingState.isInitialLoading) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
              <p className="text-gray-600">Loading sprint information...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (loadingState.isError) {
    const formattedError = formatError(error);
    return (
      <div className="min-h-screen bg-background p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Error Loading Sprint
            </h3>
            <p className="text-sm text-red-600 mb-4">
              {formattedError.userMessage}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // No sprint data
  if (!sprint) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-gray-600">Sprint not found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Sprint Header Component */}
        <SprintHeader sprint={sprint} className="mb-8" />

        {/* PI Commitments Component */}
        <PICommitments sprintId={sprint.id} className="mb-8" />

        {/* Sprint Goals Component */}
        <SprintGoals sprintId={sprint.id} className="mb-8" />

        {/* Sprint Highlights Component */}
        <SprintHighlights sprintId={sprint.id} className="mb-8" />

        {/* Dashboard Tables Section - Grid Layout per PRD */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Left Column: Team Backlog and Velocity */}
          <div className="space-y-6">
            {/* Team Backlog Table - Bottom left section per PRD */}
            <TeamBacklogTable
              metrics={dashboardData?.team_backlog ?? null}
              isLoading={dashboardLoading || dashboardFetching}
            />

            {/* Team Velocity Display - Below Team Backlog per PRD */}
            <TeamVelocityDisplay
              velocity={dashboardData?.velocity ?? null}
              isLoading={dashboardLoading || dashboardFetching}
            />
          </div>

          {/* Right Column: Stories and Top Features */}
          <div className="space-y-6">
            {/* Stories Table - Middle right section per PRD */}
            <StoriesByStateTable
              data={dashboardData?.stories_by_state ?? null}
              sprintNumber={sprint.sprint_number}
              isLoading={dashboardLoading || dashboardFetching}
            />

            {/* Top Features Table - Bottom right section per PRD */}
            <TopFeaturesTable
              features={dashboardData?.top_features ?? null}
              sprintNumber={sprint.sprint_number}
              maxFeatures={5}
              isLoading={dashboardLoading || dashboardFetching}
            />
          </div>
        </div>

        {/* Status Legend Component - At bottom of page per PRD */}
        <StatusIndicatorLegend />
      </div>
    </div>
  );
}
