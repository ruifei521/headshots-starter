"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    console.error("Global error boundary caught:", error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="flex flex-col items-center gap-4 text-center max-w-md">
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
        
        {/* Debug: show error message toggle */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs text-muted-foreground underline"
        >
          {showDetails ? "Hide" : "Show"} details
        </button>
        {showDetails && (
          <pre className="text-xs text-left bg-muted p-3 rounded-md max-w-full overflow-auto">
            {error.message || "Unknown error"}
            {error.digest && `\nDigest: ${error.digest}`}
          </pre>
        )}

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
