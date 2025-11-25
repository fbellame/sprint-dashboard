'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import type { Sprint } from '@/lib/api/types';
import { SprintHeader } from '@/components/dashboard/SprintHeader';
import { PICommitments } from '@/components/dashboard/PICommitments';
import { formatError } from '@/lib/utils/errors';
import { createLoadingState } from '@/lib/utils/loading';

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
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery<Sprint>({
    queryKey: ['sprint', sprintId],
    queryFn: () => apiClient.get<Sprint>(`/api/sprints/${sprintId}`),
    enabled: !!sprintId,
  });

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

        {/* Placeholder for future dashboard components */}
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-sm text-gray-600">
            Additional dashboard components will be added in future stories.
          </p>
        </div>
      </div>
    </div>
  );
}
