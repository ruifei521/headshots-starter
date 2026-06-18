import type { ComponentType } from "react";

const RETRY_DELAY_MS = 800;

/**
 * Retry dynamic import() — helps when a deploy invalidates old chunk hashes.
 */
export async function importWithRetry<T>(
  loader: () => Promise<T>,
  retries = 3
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await loader();
    } catch (error) {
      lastError = error;
      if (attempt < retries - 1) {
        await new Promise((resolve) =>
          setTimeout(resolve, RETRY_DELAY_MS * (attempt + 1))
        );
      }
    }
  }
  throw lastError;
}

export type LazyDefaultModule<P> = { default: ComponentType<P> };
