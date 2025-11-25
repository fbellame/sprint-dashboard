'use client';

interface TeamVelocityDisplayProps {
  velocity: number | null;
  isLoading?: boolean;
}

/**
 * Team Velocity Display Component
 *
 * Displays team velocity as a prominent metric.
 * Shows "Team Velocity: [number]" or "n/a" if velocity is not available.
 *
 * Location: Below Team Backlog table
 */
export function TeamVelocityDisplay({
  velocity,
  isLoading = false,
}: TeamVelocityDisplayProps) {
  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    );
  }

  const displayValue =
    velocity !== null && velocity !== undefined ? velocity : 'n/a';

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex flex-col">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
          Team Velocity
        </h3>
        <div className="flex items-baseline">
          <span className="text-4xl font-bold text-gray-900">
            {displayValue}
          </span>
          {velocity !== null && velocity !== undefined && (
            <span className="ml-2 text-lg text-gray-500">story points</span>
          )}
        </div>
        {velocity === null || velocity === undefined ? (
          <p className="mt-2 text-sm text-gray-500">
            Velocity not configured for this sprint
          </p>
        ) : null}
      </div>
    </div>
  );
}
