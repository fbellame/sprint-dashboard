'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import type { WorkItem } from '@/lib/api/types';
import { StatusIndicator } from '@/components/common/StatusIndicator';
import { formatError } from '@/lib/utils/errors';
import { createLoadingState } from '@/lib/utils/loading';
import type { StatusType } from '@/components/common/StatusIndicator';

interface PICommitmentsProps {
  sprintId: string;
  className?: string;
}

/**
 * PI Commitments Component
 *
 * Displays a list of PI (Program Increment) commitments with their status indicators.
 * Filters work items where is_pi_commitment = true.
 *
 * @example
 * ```tsx
 * <PICommitments sprintId={sprint.id} />
 * ```
 */
export function PICommitments({
  sprintId,
  className = '',
}: PICommitmentsProps) {
  // Fetch PI commitments
  const {
    data: commitments,
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery<WorkItem[]>({
    queryKey: ['pi-commitments', sprintId],
    queryFn: () =>
      apiClient.get<WorkItem[]>(
        `/api/sprints/${sprintId}/work-items?is_pi_commitment=true&limit=10`
      ),
    enabled: !!sprintId,
  });

  const loadingState = createLoadingState(
    isLoading,
    isFetching,
    isError,
    error
  );

  // Convert status_indicator string to StatusType
  const getStatusType = (statusIndicator: string | null): StatusType => {
    if (!statusIndicator) return 'not-done';
    switch (statusIndicator) {
      case '*':
        return 'team-focus';
      case '✓':
        return 'done';
      case '|':
        return 'ongoing';
      case '✗':
        return 'not-done';
      default:
        return 'not-done';
    }
  };

  // Loading state
  if (loadingState.isInitialLoading) {
    return (
      <div
        className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          PI Commitments
        </h2>
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary mb-2"></div>
            <p className="text-sm text-gray-600">Loading commitments...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (loadingState.isError) {
    const formattedError = formatError(error);
    return (
      <div
        className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          PI Commitments
        </h2>
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">{formattedError.userMessage}</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!commitments || commitments.length === 0) {
    return (
      <div
        className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          PI Commitments
        </h2>
        <div className="text-center py-8">
          <p className="text-sm text-gray-500">
            No PI commitments found for this sprint.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            PI commitments are work items tagged with "PI Commitment".
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        PI Commitments
      </h2>
      <ul className="space-y-3">
        {commitments.map((commitment) => (
          <li
            key={commitment.id}
            className="flex items-start gap-3 p-3 rounded-md hover:bg-gray-50 transition-colors"
          >
            <div className="flex-shrink-0 mt-0.5">
              <StatusIndicator
                status={getStatusType(commitment.status_indicator)}
                size="md"
                aria-label={`Status: ${commitment.status_indicator || 'Not Done'}`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                {commitment.title}
              </p>
              {commitment.work_item_id && (
                <p className="text-xs text-gray-500 mt-1">
                  Work Item #{commitment.work_item_id}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
      {commitments.length >= 10 && (
        <p className="text-xs text-gray-500 mt-4 text-center">
          Showing first 10 of {commitments.length} commitments
        </p>
      )}
    </div>
  );
}
