'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

// ============================================
// Generic Polling Hook
// ============================================

export interface UsePollingOptions<T> {
  /** Polling interval in milliseconds (default: 3000) */
  interval?: number;
  /** Whether polling is enabled (default: true) */
  enabled?: boolean;
  /** Called on successful fetch with the parsed data */
  onSuccess?: (data: T) => void;
  /** Called on fetch error */
  onError?: (error: Error) => void;
}

export interface UsePollingResult<T> {
  /** The latest fetched data, or null if not yet fetched */
  data: T | null;
  /** The last fetch error, or null */
  error: Error | null;
  /** True during the initial fetch (data is null) */
  isLoading: boolean;
  /** Manually trigger a fetch immediately, resetting the interval timer */
  refetch: () => Promise<void>;
}

export function usePolling<T>(
  fetcher: () => Promise<T>,
  options: UsePollingOptions<T> = {},
): UsePollingResult<T> {
  const {
    interval = 3000,
    enabled = true,
    onSuccess,
    onError,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  const executeFetch = useCallback(async () => {
    try {
      const result = await fetcher();
      setData(result);
      setError(null);
      setIsLoading(false);
      onSuccess?.(result);
    } catch (err) {
      const fetchError = err instanceof Error ? err : new Error(String(err));
      setError(fetchError);
      setIsLoading(false);
      onError?.(fetchError);
    }
  }, [fetcher, onSuccess, onError]);

  const refetch = useCallback(async () => {
    // Clear existing interval
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }

    // Fetch immediately
    await executeFetch();

    // Restart interval if enabled
    if (enabledRef.current) {
      intervalRef.current = setInterval(executeFetch, interval);
    }
  }, [executeFetch, interval]);

  useEffect(() => {
    if (!enabled) {
      // Clear interval and stop polling
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Fetch immediately on enable
    executeFetch();

    // Start polling
    intervalRef.current = setInterval(executeFetch, interval);

    // Cleanup on unmount or when enabled/interval changes
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled, interval, executeFetch]);

  return { data, error, isLoading, refetch };
}

export default usePolling;
