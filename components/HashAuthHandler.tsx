"use client";

import { Database } from "@/types/supabase";
import { createBrowserClient } from "@supabase/ssr";
import { useEffect, useMemo, useRef } from "react";
import { hardNavigate } from "@/lib/hard-navigate";

/**
 * Legacy magic links may land on / or /login — forward to /auth/complete.
 */
export function HashAuthHandler() {
  const hasRun = useRef(false);

  const supabase = useMemo(
    () =>
      createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
  );

  useEffect(() => {
    if (hasRun.current) return;

    const path = window.location.pathname;
    if (path.startsWith("/auth/complete") || path.startsWith("/auth/callback")) {
      return;
    }

    const search = window.location.search;
    const hash = window.location.hash;

    const hasQueryAuth =
      search.includes("code=") ||
      search.includes("token_hash=") ||
      search.includes("error=");

    const hasHashAuth =
      hash.includes("access_token=") || hash.includes("error=");

    if (!hasQueryAuth && !hasHashAuth) return;

    hasRun.current = true;

    // Forward full URL (query + hash) to dedicated client auth page
    const next = new URLSearchParams(search).get("redirect") || "";
    let target = `/auth/complete${search}`;
    if (next && !search.includes("next=")) {
      target += `${search ? "&" : "?"}next=${encodeURIComponent(next)}`;
    }
    target += hash;
    hardNavigate(target);
  }, [supabase]);

  return null;
}
