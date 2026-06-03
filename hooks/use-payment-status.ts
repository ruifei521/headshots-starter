'use client';

import { useCallback, useRef } from 'react';
import { usePolling } from './use-polling';
import type { UsePollingResult } from './use-polling';

// ============================================
// Payment Status Hook
// ============================================

export interface PaymentStatus {
  status: string;
  tier: string;
  amount_cents: number;
  currency: string;
  created_at: string;
}

export type UsePaymentStatusResult = PaymentStatus & UsePollingResult<PaymentStatus>;

export function usePaymentStatus(checkoutId: string | null): UsePaymentStatusResult {
  const enabledRef = useRef<boolean>(checkoutId !== null);

  const result = usePolling<PaymentStatus>(
    () =>
      fetch(`/api/creem/status?checkout_id=${checkoutId}`).then(async (res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch payment status: ${res.status}`);
        }
        return res.json();
      }),
    {
      interval: 3000,
      enabled: checkoutId !== null,
      onSuccess: (data: PaymentStatus) => {
        // Auto-stop polling when payment reaches a terminal state
        if (data.status === 'completed' || data.status === 'failed') {
          enabledRef.current = false;
        }
      },
    },
  );

  // Override enabledRef when checkoutId changes
  if (checkoutId === null && enabledRef.current) {
    enabledRef.current = false;
  }

  return {
    status: result.data?.status ?? '',
    tier: result.data?.tier ?? '',
    amount_cents: result.data?.amount_cents ?? 0,
    currency: result.data?.currency ?? '',
    created_at: result.data?.created_at ?? '',
    data: result.data,
    error: result.error,
    isLoading: result.isLoading,
    refetch: result.refetch,
  };
}

export default usePaymentStatus;
