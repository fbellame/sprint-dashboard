'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import type { WorkItem } from '@/lib/api/types';
import { formatError } from '@/lib/utils/errors';
import { createLoadingState } from '@/lib/utils/loading';
import ReactMarkdown from 'react-markdown';

interface SprintHighlightsProps {
  sprintId: string;
  className?: string;
}

/**
 * Sprint Highlights Component
 *
 * Displays a bullet-point list of sprint highlights with markdown support.
 * Filters work items where is_highlight = true.
 * Displays 3-10 highlight items.
 *
 * @example
 * ```tsx
 * <SprintHighlights sprintId={sprint.id} />
 * ```
 */
export function SprintHighlights({
  sprintId,
  className = '',
}: SprintHighlightsProps) {
  // Fetch sprint highlights
  const {
    data: highlights,
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery<WorkItem[]>({
    queryKey: ['sprint-highlights', sprintId],
    queryFn: () =>
      apiClient.get<WorkItem[]>(
        `/api/sprints/${sprintId}/work-items?is_highlight=true&limit=10`
      ),
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
      <div
        className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Sprint Highlights
        </h2>
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary mb-2"></div>
            <p className="text-sm text-gray-600">Loading highlights...</p>
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
          Sprint Highlights
        </h2>
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">{formattedError.userMessage}</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!highlights || highlights.length === 0) {
    return (
      <div
        className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Sprint Highlights
        </h2>
        <div className="text-center py-8">
          <p className="text-sm text-gray-500">
            No sprint highlights found for this sprint.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Highlights are work items tagged with "Highlight" or "Key
            Achievement".
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
        Sprint Highlights
      </h2>
      <ul className="space-y-2 list-disc list-inside">
        {highlights.map((highlight) => (
          <li key={highlight.id} className="text-sm text-gray-700">
            <div className="markdown-content">
              <ReactMarkdown
                components={{
                  // Customize link rendering
                  a: ({ node, ...props }) => (
                    <a
                      {...props}
                      className="text-primary hover:text-primary-600 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  ),
                  // Customize paragraph rendering
                  p: ({ node, ...props }) => (
                    <span {...props} className="inline" />
                  ),
                  // Customize strong/bold rendering
                  strong: ({ node, ...props }) => (
                    <strong {...props} className="font-semibold" />
                  ),
                  // Customize emphasis/italic rendering
                  em: ({ node, ...props }) => (
                    <em {...props} className="italic" />
                  ),
                }}
              >
                {highlight.title}
              </ReactMarkdown>
            </div>
          </li>
        ))}
      </ul>
      {highlights.length >= 10 && (
        <p className="text-xs text-gray-500 mt-4 text-center">
          Showing first 10 of {highlights.length} highlights
        </p>
      )}
    </div>
  );
}
