'use client';

import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { logger } from "@/lib/logger";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 打印完整错误信息用于 Vercel 日志排查
    if (error instanceof Error) {
      logger.error("Global error boundary caught:", {
        message: error.message,
        name: error.name,
        stack: error.stack,
        digest: error.digest,
        cause: error.cause,
      });
    } else {
      // 某些库可能抛出 plain object
      logger.error("Global error boundary caught (non-Error):", JSON.stringify(error));
    }
    // 浏览器 console 也打印一份
    console.error("=== GLOBAL ERROR BOUNDARY ===", error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="flex flex-col items-center gap-4 text-center max-w-lg w-full">
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
          An unexpected error occurred. Please try again or contact support if the problem persists.
        </p>

        {/* Debug: show actual error for troubleshooting */}
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
          <Button variant="outline" onClick={() => reset()}>
            Try Again
          </Button>
          <Button onClick={() => (window.location.href = "/")}>
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
