/**
 * Loading State Utilities
 *
 * Utilities for managing loading states consistently across the application.
 */

// ============================================================================
// Loading State Types
// ============================================================================

export interface LoadingState {
  isLoading: boolean;
  isInitialLoading: boolean;
  isRefetching: boolean;
  isError: boolean;
  error: Error | null;
}

// ============================================================================
// Loading State Helpers
// ============================================================================

/**
 * Create a loading state object from React Query state
 */
export function createLoadingState(
  isLoading: boolean,
  isFetching: boolean,
  isError: boolean,
  error: Error | null
): LoadingState {
  return {
    isLoading: isLoading || isFetching,
    isInitialLoading: isLoading,
    isRefetching: isFetching && !isLoading,
    isError,
    error,
  };
}

/**
 * Check if data is being loaded (initial load or refetch)
 */
export function isLoading(loadingState: LoadingState): boolean {
  return loadingState.isLoading;
}

/**
 * Check if this is the initial load (not a refetch)
 */
export function isInitialLoading(loadingState: LoadingState): boolean {
  return loadingState.isInitialLoading;
}

/**
 * Check if data is being refetched (not initial load)
 */
export function isRefetching(loadingState: LoadingState): boolean {
  return loadingState.isRefetching;
}

/**
 * Check if there's an error
 */
export function hasError(loadingState: LoadingState): boolean {
  return loadingState.isError;
}

/**
 * Get error message from loading state
 */
export function getErrorMessage(loadingState: LoadingState): string | null {
  return loadingState.error?.message || null;
}

// ============================================================================
// Loading State Hooks (for use with React Query)
// ============================================================================

/**
 * Extract loading state from React Query result
 *
 * Usage:
 * ```tsx
 * const { data, isLoading, isFetching, isError, error } = useQuery(...);
 * const loadingState = useLoadingState(isLoading, isFetching, isError, error);
 * ```
 */
export function useLoadingState(
  isLoading: boolean,
  isFetching: boolean,
  isError: boolean,
  error: Error | null
): LoadingState {
  return createLoadingState(isLoading, isFetching, isError, error);
}

// ============================================================================
// Loading State Display Helpers
// ============================================================================

/**
 * Determine what to show based on loading state
 */
export function getDisplayState(loadingState: LoadingState): {
  showLoading: boolean;
  showError: boolean;
  showData: boolean;
  showEmpty: boolean;
} {
  return {
    showLoading: loadingState.isInitialLoading,
    showError: loadingState.isError,
    showData: !loadingState.isInitialLoading && !loadingState.isError,
    showEmpty: false, // This should be determined by data presence
  };
}

/**
 * Get loading message based on state
 */
export function getLoadingMessage(loadingState: LoadingState): string {
  if (loadingState.isInitialLoading) {
    return 'Loading...';
  }
  if (loadingState.isRefetching) {
    return 'Refreshing...';
  }
  if (loadingState.isError) {
    return 'Error loading data';
  }
  return '';
}
