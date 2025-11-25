'use client';

import { Calendar } from 'lucide-react';
import type { Sprint } from '@/lib/api/types';

interface SprintHeaderProps {
  sprint: Sprint;
  className?: string;
}

/**
 * Sprint Header Component
 *
 * Displays sprint information with visual design matching PRD:
 * - Sprint name/number (e.g., "Sprint 31 Overview")
 * - Green vertical accent strip on left
 * - Calendar/checklist icon in top right
 * - Sprint dates (start - end)
 * - White content area background
 * - Professional, clean layout
 * - Responsive design
 *
 * @example
 * ```tsx
 * <SprintHeader sprint={sprintData} />
 * ```
 */
export function SprintHeader({ sprint, className = '' }: SprintHeaderProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const startDate = formatDate(sprint.start_date);
  const endDate = formatDate(sprint.end_date);

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden ${className}`}
    >
      {/* Green vertical accent strip on left */}
      <div className="flex">
        <div className="w-1 bg-primary flex-shrink-0" aria-hidden="true" />

        {/* Content area */}
        <div className="flex-1 p-6 sm:p-8">
          <div className="flex items-start justify-between">
            {/* Left side: Sprint title and dates */}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                {sprint.sprint_name} Overview
              </h1>

              {/* Sprint dates */}
              {(startDate || endDate) && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 text-sm text-gray-600">
                  {startDate && (
                    <div className="flex items-center">
                      <span className="font-medium mr-2">Start:</span>
                      <span>{startDate}</span>
                    </div>
                  )}
                  {endDate && (
                    <div className="flex items-center">
                      <span className="font-medium mr-2">End:</span>
                      <span>{endDate}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Team name (if available) */}
              {sprint.team_name && (
                <div className="mt-2 text-sm text-gray-500">
                  <span className="font-medium">Team:</span> {sprint.team_name}
                </div>
              )}
            </div>

            {/* Right side: Calendar icon */}
            <div className="ml-4 flex-shrink-0">
              <div className="p-2 bg-primary-50 rounded-lg">
                <Calendar className="w-6 h-6 text-primary" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
