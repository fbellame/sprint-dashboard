'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

/**
 * React Query Provider
 * 
 * Wraps the application with React Query for server state management.
 * Provides default query options for caching and refetching behavior.
 */
export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Data is considered fresh for 1 minute
            staleTime: 60 * 1000,
            // Don't refetch on window focus (reduce unnecessary requests)
            refetchOnWindowFocus: false,
            // Retry failed requests once
            retry: 1,
            // Show error state after 5 seconds
            retryDelay: 5000,
          },
          mutations: {
            // Retry failed mutations once
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

