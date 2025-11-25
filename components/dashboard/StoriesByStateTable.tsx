'use client';

import type { StoriesByState } from '@/lib/types/database';

interface StoriesByStateTableProps {
  data: StoriesByState[] | null;
  sprintNumber?: number;
  isLoading?: boolean;
}

interface StateCounts {
  new: number;
  active: number;
  resolved: number;
  closed: number;
  total: number;
}

/**
 * Stories by State Table Component
 *
 * Displays stories broken down by state for User Stories and Prod Support Tickets.
 * Shows counts for New, Active, Resolved, Closed in S[#], and Total.
 *
 * Location: Middle right section of dashboard
 */
export function StoriesByStateTable({
  data,
  sprintNumber,
  isLoading = false,
}: StoriesByStateTableProps) {
  // Process data to aggregate by work item type and state
  const processData = (
    rawData: StoriesByState[]
  ): {
    userStories: StateCounts;
    supportTickets: StateCounts;
  } => {
    const userStories: StateCounts = {
      new: 0,
      active: 0,
      resolved: 0,
      closed: 0,
      total: 0,
    };

    const supportTickets: StateCounts = {
      new: 0,
      active: 0,
      resolved: 0,
      closed: 0,
      total: 0,
    };

    rawData.forEach((item) => {
      const count = item.count || 0;
      const state = item.state?.toLowerCase() || '';

      // Categorize by work item type
      const isUserStory =
        item.work_item_type?.toLowerCase() === 'user story' ||
        item.work_item_type?.toLowerCase() === 'story';
      const isSupportTicket =
        item.work_item_type?.toLowerCase() === 'support ticket' ||
        item.work_item_type?.toLowerCase() === 'prod support ticket' ||
        item.work_item_type?.toLowerCase() === 'bug';

      let target: StateCounts | null = null;

      if (isUserStory) {
        target = userStories;
      } else if (isSupportTicket) {
        target = supportTickets;
      }

      if (target) {
        if (state === 'new') {
          target.new += count;
        } else if (state === 'active') {
          target.active += count;
        } else if (state === 'resolved') {
          target.resolved += count;
        } else if (state === 'closed') {
          target.closed += count;
        }

        target.total += count;
      }
    });

    return { userStories, supportTickets };
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Stories by State
        </h3>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Stories by State
        </h3>
        <p className="text-sm text-gray-500">No data available</p>
      </div>
    );
  }

  const { userStories, supportTickets } = processData(data);

  const formatCount = (count: number): string => {
    return count === 0 ? 'n/a' : count.toString();
  };

  const renderSection = (
    title: string,
    counts: StateCounts,
    sprintNum?: number
  ) => (
    <div className="mb-6 last:mb-0">
      <h4 className="text-sm font-semibold text-gray-900 mb-3 px-6 pt-4">
        {title}
      </h4>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                State
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Count
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                New
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                {formatCount(counts.new)}
              </td>
            </tr>
            <tr className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Active
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                {formatCount(counts.active)}
              </td>
            </tr>
            <tr className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Resolved
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                {formatCount(counts.resolved)}
              </td>
            </tr>
            <tr className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Closed in S{sprintNum !== undefined ? sprintNum : '#'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                {formatCount(counts.closed)}
              </td>
            </tr>
            <tr className="bg-gray-50 hover:bg-gray-100 transition-colors font-semibold">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                Total
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 text-right">
                {formatCount(counts.total)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Stories by State
        </h3>
      </div>
      <div className="divide-y divide-gray-200">
        {renderSection('User Stories', userStories, sprintNumber)}
        {renderSection('Prod Support Tickets', supportTickets, sprintNumber)}
      </div>
    </div>
  );
}
