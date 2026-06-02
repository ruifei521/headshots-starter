'use client';

import { useEffect } from 'react';
import { logger } from '@/lib/logger';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error('Global error boundary caught:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
      digest: error.digest,
    });
    console.error('=== GLOBAL ERROR BOUNDARY ===', error);

    // TEMP: 发送错误到捕获端点用于调试
    fetch('/api/capture-error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source: 'app/global-error.tsx',
        error: error instanceof Error
          ? { name: error.name, message: error.message, stack: error.stack, digest: (error as any).digest }
          : JSON.stringify(error),
        url: typeof window !== 'undefined' ? window.location.href : 'unknown',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      }),
    }).catch(() => {}); // 静默失败
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 text-center max-w-lg w-full px-4">
          <div className="rounded-full bg-destructive/10 p-4">
            <svg
              className="h-8 w-8 text-destructive"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold">Something went wrong</h2>
          <p className="text-sm text-muted-foreground">
            A critical error occurred. Please try refreshing the page.
          </p>
          <details className="text-left w-full">
            <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
              Error details (for debugging)
            </summary>
            <pre className="mt-2 p-3 bg-muted rounded-md text-xs overflow-auto max-h-48 whitespace-pre-wrap break-all">
              {error instanceof Error
                ? `${error.name}: ${error.message}${error.stack ? '\n\n' + error.stack : ''}${error.digest ? '\n\nDigest: ' + error.digest : ''}`
                : JSON.stringify(error, null, 2)}
            </pre>
          </details>
          <div className="flex gap-3 mt-2">
            <button
              onClick={() => reset()}
              className="px-4 py-2 rounded-md border border-input bg-background hover:bg-accent text-sm font-medium"
            >
              Try Again
            </button>
            <button
              onClick={() => (window.location.href = '/')}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium"
            >
              Go Home
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
