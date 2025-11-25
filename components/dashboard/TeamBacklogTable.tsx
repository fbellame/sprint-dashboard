'use client';

import type { TeamBacklogMetrics } from '@/lib/types/database';

interface TeamBacklogTableProps {
  metrics: TeamBacklogMetrics | null;
  isLoading?: boolean;
}

/**
 * Team Backlog Table Component
 *
 * Displays team backlog metrics including planned, removed, added, and total
 * story points and counts. Shows "n/a" for zero values.
 *
 * Location: Bottom left section of dashboard
 */
export function TeamBacklogTable({
  metrics,
  isLoading = false,
}: TeamBacklogTableProps) {
  // Calculate totals
  const totalCount =
    (metrics?.planned_count || 0) +
    (metrics?.removed_count || 0) +
    (metrics?.added_count || 0);
  const totalPoints =
    (metrics?.planned_story_points || 0) +
    (metrics?.removed_story_points || 0) +
    (metrics?.added_story_points || 0);

  // Format number or return "n/a" for zero
  const formatValue = (value: number): string => {
    return value === 0 ? 'n/a' : value.toString();
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Team Backlog
        </h3>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Team Backlog
        </h3>
        <p className="text-sm text-gray-500">No data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Team Backlog</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Category
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Story Points
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Story Count
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Planned */}
            <tr className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Stories/Bugs Planned
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                {formatValue(metrics.planned_story_points)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                {formatValue(metrics.planned_count)}
              </td>
            </tr>

            {/* Removed */}
            <tr className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Stories Removed mid-sprint
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                {formatValue(metrics.removed_story_points)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                {formatValue(metrics.removed_count)}
              </td>
            </tr>

            {/* Added */}
            <tr className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Stories/Bugs added mid-sprint
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                {formatValue(metrics.added_story_points)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                {formatValue(metrics.added_count)}
              </td>
            </tr>

            {/* Total */}
            <tr className="bg-gray-50 hover:bg-gray-100 transition-colors font-semibold">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                Total
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 text-right">
                {formatValue(totalPoints)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 text-right">
                {formatValue(totalCount)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
