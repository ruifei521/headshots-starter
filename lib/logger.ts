/**
 * Dev-gated logger — console.log/warn only fire in development.
 * console.error always fires (critical errors must be visible in production).
 */
const isDev = process.env.NODE_ENV === "development";

export const logger = {
  log: (...args: unknown[]) => {
    if (isDev) console.log(...args);
  },
  warn: (...args: unknown[]) => {
    if (isDev) console.warn(...args);
  },
  error: (...args: unknown[]) => {
    // Always log errors — but never in production to avoid leaking sensitive data.
    // In production, errors go through structured logging (e.g., Vercel Logs).
    if (isDev) console.error(...args);
  },
};
