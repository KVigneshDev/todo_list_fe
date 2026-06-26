import { QueryClient } from '@tanstack/react-query';

import { ApiError } from '@/api/client';

/**
 * Shared TanStack Query client.
 *
 * Defaults chosen for a snappy, resilient UX:
 *   - a short `staleTime` avoids redundant refetches while typing/filtering,
 *   - failed reads retry a couple of times, but never on 4xx (including 429),
 *     because retrying a client error just wastes requests.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10_000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.status < 500) return false;
        return failureCount < 2;
      },
    },
    mutations: {
      retry: false,
    },
  },
});
