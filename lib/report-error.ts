/**
 * Central error reporting — Vercel logs + Sentry (when DSN is configured).
 * Call from error boundaries, logger.error, and critical catch blocks.
 */
import * as Sentry from "@sentry/nextjs";

export type ErrorContext = {
  /** Logical area, e.g. checkout, auth, training, gallery */
  area?: string;
  tags?: Record<string, string>;
  extra?: Record<string, unknown>;
  level?: "error" | "warning" | "fatal";
  userId?: string;
};

function toError(value: unknown): Error {
  if (value instanceof Error) return value;
  if (typeof value === "string") return new Error(value);
  try {
    return new Error(JSON.stringify(value));
  } catch {
    return new Error(String(value));
  }
}

function scrubExtra(extra: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(extra)) {
    const lower = key.toLowerCase();
    if (
      lower.includes("password") ||
      lower.includes("token") ||
      lower.includes("secret") ||
      lower.includes("authorization")
    ) {
      out[key] = "[redacted]";
    } else {
      out[key] = val;
    }
  }
  return out;
}

/** Report to Sentry in production; always safe to call (no-op without DSN). */
export function reportError(error: unknown, context: ErrorContext = {}): void {
  const err = toError(error);

  if (process.env.NODE_ENV !== "production") {
    console.error("[reportError]", context.area ?? "app", err, context.extra);
    return;
  }

  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return;

  Sentry.withScope((scope) => {
    scope.setLevel(context.level ?? "error");
    if (context.area) {
      scope.setTag("area", context.area);
    }
    if (context.userId) {
      scope.setUser({ id: context.userId });
    }
    if (context.tags) {
      for (const [k, v] of Object.entries(context.tags)) {
        scope.setTag(k, v);
      }
    }
    if (context.extra) {
      scope.setExtras(scrubExtra(context.extra));
    }
    if (typeof window !== "undefined") {
      scope.setExtra("url", window.location.href);
      scope.setExtra("userAgent", navigator.userAgent);
    }
    Sentry.captureException(err);
  });
}

/** Attach Supabase user id to later Sentry events (client-only). */
export function setErrorReporterUser(userId: string | null): void {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return;
  Sentry.setUser(userId ? { id: userId } : null);
}
