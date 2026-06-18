"use client";

import { useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/types/supabase";
import { reportError, setErrorReporterUser } from "@/lib/report-error";

/**
 * Global client hooks: unhandled errors + optional user context for Sentry.
 */
export function ClientErrorReporter() {
  useEffect(() => {
    const onError = (event: ErrorEvent) => {
      reportError(event.error ?? event.message, {
        area: "client",
        tags: { type: "window.error" },
        extra: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
      });
    };

    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      reportError(event.reason, {
        area: "client",
        tags: { type: "unhandledrejection" },
      });
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onUnhandledRejection);

    let supabase: ReturnType<typeof createBrowserClient<Database>> | null = null;
    try {
      supabase = createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
    } catch {
      // Supabase not configured — still report anonymous errors
    }

    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setErrorReporterUser(session?.user?.id ?? null);
      });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setErrorReporterUser(session?.user?.id ?? null);
      });

      return () => {
        window.removeEventListener("error", onError);
        window.removeEventListener("unhandledrejection", onUnhandledRejection);
        subscription.unsubscribe();
      };
    }

    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onUnhandledRejection);
    };
  }, []);

  return null;
}
