import { reportError } from "@/lib/report-error";

/**
 * Logger — log/warn fire only in development, error always fires.
 * In production, error logs use sanitized output (no raw secrets/keys)
 * and are forwarded to Sentry when NEXT_PUBLIC_SENTRY_DSN is set.
 */
const isDev = process.env.NODE_ENV === "development";

/** Strip potential secrets from log output (API keys, tokens) */
const sanitize = (args: unknown[]): unknown[] =>
  args.map((arg) => {
    if (typeof arg === "string") {
      return arg
        .replace(/Bearer\s+[^\s"']+/gi, "Bearer ***")
        .replace(/sd_[a-zA-Z0-9]+/g, "astria_key_***")
        .replace(/sk_live_[a-zA-Z0-9]+/g, "stripe_sk_***")
        .replace(/creem_[a-zA-Z0-9]+/g, "creem_key_***")
        .replace(/eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/g, "jwt_***");
    }
    if (typeof arg === "object" && arg !== null && "message" in arg) {
      // Axios/Fetch errors — keep message but strip Authorization header
      const obj = { ...(arg as Record<string, unknown>) };
      if (obj.config && typeof obj.config === "object") {
        const config = { ...(obj.config as Record<string, unknown>) };
        delete config.headers;
        obj.config = config;
      }
      return obj;
    }
    return arg;
  });

export const logger = {
  log: (...args: unknown[]) => {
    if (isDev) console.log(...args);
  },
  warn: (...args: unknown[]) => {
    if (isDev) console.warn(...args);
    // In production, warnings also log (they're non-sensitive operational alerts)
    else console.warn("[WARN]", ...sanitize(args));
  },
  error: (...args: unknown[]) => {
    const safe = sanitize(args);
    if (isDev) console.error(...args);
    else console.error("[ERROR]", ...safe);

    const err = args.find((a): a is Error => a instanceof Error);
    const summary = safe
      .map((a) => {
        if (typeof a === "string") return a;
        if (a instanceof Error) return a.message;
        try {
          return JSON.stringify(a);
        } catch {
          return String(a);
        }
      })
      .join(" ");
    reportError(err ?? summary, {
      area: "logger",
      extra: { details: safe },
    });
  },
};
