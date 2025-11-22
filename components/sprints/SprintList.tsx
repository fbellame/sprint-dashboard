'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import type { Sprint } from '@/lib/api/types';
import { SprintCard } from './SprintCard';
import { Button } from '@/components/common/Button';
import { formatError } from '@/lib/utils/errors';
import { createLoadingState } from '@/lib/utils/loading';
import Link from 'next/link';

/**
 * Sprint List Component
 *
 * Fetches and displays a list of all sprints.
 * Handles loading, error, and empty states.
 */
export function SprintList() {
  const {
    data: sprints,
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery<Sprint[]>({
    queryKey: ['sprints'],
    queryFn: () => apiClient.get<Sprint[]>('/api/sprints'),
  });

  const loadingState = createLoadingState(isLoading, isFetching, isError, error);

  // Loading state
  if (loadingState.isInitialLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-600">Loading sprints...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (loadingState.isError) {
    const formattedError = formatError(error);
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-lg font-semibold text-red-800 mb-2">
          Error Loading Sprints
        </h3>
        <p className="text-sm text-red-600 mb-4">{formattedError.userMessage}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }

  // Empty state
  if (!sprints || sprints.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Sprints Yet
          </h3>
          <p className="text-gray-600 mb-6">
            Get started by creating your first sprint.
          </p>
          <Link href="/sprints/new">
            <Button variant="primary" size="lg">
              Create Your First Sprint
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Sprint list
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">All Sprints</h2>
        <Link href="/sprints/new" className="w-full sm:w-auto">
          <Button variant="primary" className="w-full sm:w-auto">
            Create New Sprint
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sprints.map((sprint) => (
          <SprintCard key={sprint.id} sprint={sprint} />
        ))}
      </div>
    </div>
  );
}

