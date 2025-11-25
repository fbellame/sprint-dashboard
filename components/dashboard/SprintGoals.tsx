'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import type { WorkItem } from '@/lib/api/types';
import { StatusIndicator } from '@/components/common/StatusIndicator';
import { formatError } from '@/lib/utils/errors';
import { createLoadingState } from '@/lib/utils/loading';
import type { StatusType } from '@/components/common/StatusIndicator';

interface SprintGoalsProps {
  sprintId: string;
  className?: string;
}

/**
 * Sprint Goals Component
 *
 * Displays a list of sprint goals with their status indicators.
 * Filters work items where is_sprint_goal = true.
 * Displays 3-7 sprint goals.
 *
 * @example
 * ```tsx
 * <SprintGoals sprintId={sprint.id} />
 * ```
 */
export function SprintGoals({ sprintId, className = '' }: SprintGoalsProps) {
  // Fetch sprint goals
  const {
    data: goals,
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery<WorkItem[]>({
    queryKey: ['sprint-goals', sprintId],
    queryFn: () =>
      apiClient.get<WorkItem[]>(
        `/api/sprints/${sprintId}/work-items?is_sprint_goal=true&limit=7`
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
          Sprint Goals
        </h2>
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary mb-2"></div>
            <p className="text-sm text-gray-600">Loading sprint goals...</p>
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
          Sprint Goals
        </h2>
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">{formattedError.userMessage}</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!goals || goals.length === 0) {
    return (
      <div
        className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Sprint Goals
        </h2>
        <div className="text-center py-8">
          <p className="text-sm text-gray-500">
            No sprint goals found for this sprint.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Sprint goals are work items tagged with "Sprint Goal".
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Sprint Goals</h2>
      <ul className="space-y-3">
        {goals.map((goal) => (
          <li
            key={goal.id}
            className="flex items-start gap-3 p-3 rounded-md hover:bg-gray-50 transition-colors"
          >
            <div className="flex-shrink-0 mt-0.5">
              <StatusIndicator
                status={getStatusType(goal.status_indicator)}
                size="md"
                aria-label={`Status: ${goal.status_indicator || 'Not Done'}`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{goal.title}</p>
              {goal.work_item_id && (
                <p className="text-xs text-gray-500 mt-1">
                  Work Item #{goal.work_item_id}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
      {goals.length >= 7 && (
        <p className="text-xs text-gray-500 mt-4 text-center">
          Showing first 7 of {goals.length} goals
        </p>
      )}
    </div>
  );
}
