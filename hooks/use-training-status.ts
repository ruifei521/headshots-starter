'use client';

import { usePolling } from './use-polling';
import type { UsePollingResult } from './use-polling';

// ============================================
// Training Status Hook
// ============================================

export interface TrainingStatus {
  status: string;
  images_generated: number;
  total_images: number;
  name: string | null;
}

export type UseTrainingStatusResult = TrainingStatus & UsePollingResult<TrainingStatus>;

export function useTrainingStatus(modelId: number | null): UseTrainingStatusResult {
  const result = usePolling<TrainingStatus>(
    () =>
      fetch(`/api/astria/status?modelId=${modelId}`).then(async (res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch training status: ${res.status}`);
        }
        return res.json();
      }),
    {
      interval: 3000,
      enabled: modelId !== null,
    },
  );

  return {
    status: result.data?.status ?? '',
    images_generated: result.data?.images_generated ?? 0,
    total_images: result.data?.total_images ?? 0,
    name: result.data?.name ?? null,
    data: result.data,
    error: result.error,
    isLoading: result.isLoading,
    refetch: result.refetch,
  };
}

export default useTrainingStatus;
