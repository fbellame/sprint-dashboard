'use client';

import { useState } from 'react';
import type { TopFeature } from '@/lib/types/database';

interface TopFeaturesTableProps {
  features: TopFeature[] | null;
  sprintNumber?: number;
  maxFeatures?: number;
  isLoading?: boolean;
}

type SortField = 'story_points' | 'story_count';
type SortDirection = 'asc' | 'desc';

/**
 * Top Features Table Component
 *
 * Displays top features impacted by the sprint, showing feature name,
 * committed story points, and committed story count.
 *
 * Location: Bottom right section of dashboard
 */
export function TopFeaturesTable({
  features,
  sprintNumber,
  maxFeatures = 5,
  isLoading = false,
}: TopFeaturesTableProps) {
  const [sortField, setSortField] = useState<SortField>('story_points');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Sort and limit features
  const sortedFeatures = features
    ? [...features]
        .sort((a, b) => {
          const aValue = a[sortField] || 0;
          const bValue = b[sortField] || 0;
          return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
        })
        .slice(0, maxFeatures)
    : [];

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return (
        <span className="text-gray-400 ml-1" aria-label="Not sorted">
          ↕
        </span>
      );
    }
    return (
      <span className="ml-1" aria-label={`Sorted ${sortDirection}`}>
        {sortDirection === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Top Features
        </h3>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (!features || features.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Top Features
        </h3>
        <p className="text-sm text-gray-500">No features available</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Top Features</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Feature Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('story_points')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSort('story_points');
                  }
                }}
                aria-label="Sort by story points"
              >
                <div className="flex items-center justify-end">
                  Committed Story Points in S
                  {sprintNumber !== undefined ? sprintNumber : '#'}
                  <SortIcon field="story_points" />
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('story_count')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSort('story_count');
                  }
                }}
                aria-label="Sort by story count"
              >
                <div className="flex items-center justify-end">
                  Committed Story Count in S
                  {sprintNumber !== undefined ? sprintNumber : '#'}
                  <SortIcon field="story_count" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedFeatures.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No features available
                </td>
              </tr>
            ) : (
              sortedFeatures.map((feature, index) => (
                <tr
                  key={`${feature.feature_name}-${index}`}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {feature.feature_name || 'Unknown Feature'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    {feature.story_points || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    {feature.story_count || 0}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
