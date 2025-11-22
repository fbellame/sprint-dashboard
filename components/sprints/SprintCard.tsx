import Link from 'next/link';
import type { Sprint } from '@/lib/api/types';

interface SprintCardProps {
  sprint: Sprint;
}

/**
 * Sprint Card Component
 *
 * Displays sprint information in a card format.
 * Clicking the card navigates to the sprint detail page.
 */
export function SprintCard({ sprint }: SprintCardProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Link
      href={`/sprints/${sprint.id}`}
      className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-primary hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            {sprint.sprint_name}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Sprint #{sprint.sprint_number}
          </p>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        {/* Dates */}
        <div className="flex flex-col sm:flex-row sm:gap-4">
          <div className="flex-1">
            <span className="text-gray-500">Start:</span>{' '}
            <span className="text-gray-900 font-medium">
              {formatDate(sprint.start_date)}
            </span>
          </div>
          <div className="flex-1">
            <span className="text-gray-500">End:</span>{' '}
            <span className="text-gray-900 font-medium">
              {formatDate(sprint.end_date)}
            </span>
          </div>
        </div>

        {/* Team Name */}
        {sprint.team_name && (
          <div>
            <span className="text-gray-500">Team:</span>{' '}
            <span className="text-gray-900 font-medium">
              {sprint.team_name}
            </span>
          </div>
        )}

        {/* Created Date */}
        <div className="text-xs text-gray-400 pt-2 border-t border-gray-100">
          Created: {formatDate(sprint.created_at)}
        </div>
      </div>
    </Link>
  );
}

