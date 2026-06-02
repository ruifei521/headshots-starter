'use client';

import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { logger } from "@/lib/logger";

export default function TrainPageError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error("Train page error boundary:", {
      message: error.message,
      name: error.name,
      stack: error.stack,
      digest: error.digest,
      cause: error.cause,
    });
    console.error("=== TRAIN PAGE ERROR ===", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 text-center px-4">
      <div className="rounded-full bg-destructive/10 p-4">
        <svg className="h-8 w-8 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold">Something went wrong</h2>
      <p className="text-sm text-muted-foreground max-w-md">
        The train page encountered an error. This might be temporary.
      </p>
      
      {/* Debug: show actual error for troubleshooting */}
      <details className="text-left max-w-lg w-full">
        <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
          Error details (for debugging)
        </summary>
        <pre className="mt-2 p-3 bg-muted rounded-md text-xs overflow-auto max-h-48 whitespace-pre-wrap break-all">
          {error.name}: {error.message}
          {error.stack ? '\n\n' + error.stack : ''}
          {error.digest ? '\n\nDigest: ' + error.digest : ''}
          {error.cause ? '\n\nCause: ' + JSON.stringify(error.cause) : ''}
        </pre>
      </details>

      <div className="flex gap-3 mt-2">
        <Button variant="outline" onClick={() => reset()}>
          Try Again
        </Button>
        <Button onClick={() => (window.location.href = "/overview")}>
          Back to Models
        </Button>
      </div>
    </div>
  );
}
