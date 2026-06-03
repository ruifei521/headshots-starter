'use client';

import { useCallback, useRef } from 'react';
import { usePolling } from './use-polling';
import type { UsePollingResult } from './use-polling';

// ============================================
// Credits Hook
// ============================================

export interface CreditsData {
  credits: number;
  tier: string;
}

export type UseCreditsResult = CreditsData & UsePollingResult<CreditsData>;

// Module-level refresh callback registry
type RefreshCallback = () => void;
let refreshCallbacks: RefreshCallback[] = [];

function notifyRefresh() {
  refreshCallbacks.forEach((cb) => cb());
}

/**
 * Imperatively trigger a credit refresh across all active useCredits instances.
 * Call this after a successful payment or credit-consuming operation.
 */
export function refreshCredits(): void {
  notifyRefresh();
}

export function useCredits(): UseCreditsResult {
  const refreshRef = useRef<() => void>();

  // Register/unregister the refetch callback
  const onRefetchReady = useCallback((refetch: () => Promise<void>) => {
    refreshRef.current = () => {
      refetch();
    };
    refreshCallbacks.push(refreshRef.current);

    // Return cleanup
    return () => {
      if (refreshRef.current) {
        refreshCallbacks = refreshCallbacks.filter((cb) => cb !== refreshRef.current);
      }
    };
  }, []);

  const result = usePolling<CreditsData>(
    () =>
      fetch('/api/user/credits').then(async (res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch credits: ${res.status}`);
        }
        return res.json();
      }),
    {
      interval: 10000,
      enabled: true,
    },
  );

  // Register for imperative refresh
  const cleanupRef = useRef<(() => void) | null>(null);
  if (!cleanupRef.current) {
    cleanupRef.current = onRefetchReady(result.refetch);
  }

  return {
    credits: result.data?.credits ?? 0,
    tier: result.data?.tier ?? 'starter',
    data: result.data,
    error: result.error,
    isLoading: result.isLoading,
    refetch: result.refetch,
  };
}

export default useCredits;
