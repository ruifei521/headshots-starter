'use client';

import { Button } from "@/components/ui/button";
import { reportError } from "@/lib/report-error";
import { useEffect, useState } from "react";

function dumpError(err: unknown): string {
  if (err === null) return "null";
  if (err === undefined) return "undefined";
  if (err instanceof Error) {
    const d = err as Error & { digest?: string; cause?: unknown };
    return [
      `Type: Error`,
      `Name: ${d.name}`,
      `Message: ${d.message}`,
      d.digest ? `Digest: ${d.digest}` : null,
      d.cause ? `Cause: ${dumpError(d.cause)}` : null,
      `Stack: ${d.stack || "(none)"}`,
    ].filter(Boolean).join("\n");
  }
  if (typeof err === "object") {
    const lines = [`Type: ${(err as any).constructor?.name || "Object"}`];
    // Show all own properties (including non-enumerable)
    const props = new Set<string>();
    for (const k in (err as object)) props.add(k);
    Object.getOwnPropertyNames(err).forEach(k => props.add(k));
    Object.getOwnPropertySymbols(err).forEach(k => props.add(k.toString()));
    if (props.size > 0) {
      lines.push("Properties:");
      props.forEach(k => {
        try { lines.push(`  ${k}: ${JSON.stringify((err as any)[k])}`); } catch {}
      });
    } else {
      lines.push("(empty object — no own properties)");
    }
    // Try raw toString
    try { lines.push(`toString: ${String(err)}`); } catch {}
    return lines.join("\n");
  }
  return String(err);
}

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [browserInfo] = useState(() => {
    if (typeof window === "undefined") return "";
    try {
      return `URL: ${window.location.href}\nSearch: ${window.location.search}\nHash: ${window.location.hash}`;
    } catch { return ""; }
  });

  useEffect(() => {
    reportError(error, {
      area: "error-boundary",
      extra: {
        digest: error.digest,
        dump: dumpError(error),
        url: window.location.href,
      },
    });
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

        <details className="text-left w-full">
          <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
            Error details
          </summary>
          <pre className="mt-2 p-3 bg-muted rounded-md text-xs overflow-auto max-h-80 whitespace-pre-wrap break-all">
            {dumpError(error)}
          </pre>
        </details>

        {browserInfo && (
          <details className="text-left w-full">
            <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
              Browser Info
            </summary>
            <pre className="mt-2 p-3 bg-muted rounded-md text-xs overflow-auto max-h-32 whitespace-pre-wrap break-all">
              {browserInfo}
            </pre>
          </details>
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
