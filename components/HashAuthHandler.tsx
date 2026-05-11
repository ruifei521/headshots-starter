"use client";

import { Database } from "@/types/supabase";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

/**
 * Handles Supabase auth hash fragments that land on the root URL.
 * When Supabase verifies a magic link, it redirects to the Site URL
 * (e.g. http://localhost:3000/) with the auth tokens in the URL hash.
 * This component detects those tokens, establishes a session, and redirects.
 */
export function HashAuthHandler() {
  const router = useRouter();
  const [processing, setProcessing] = useState(false);

  const supabase = useMemo(() => {
    return createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }, []);

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (!hash) return;

    const params = new URLSearchParams(hash);

    // Check for error in hash
    const error = params.get("error");
    const errorDescription = params.get("error_description");
    if (error) {
      console.error("[HashAuthHandler] Auth error:", error, errorDescription);
      // Clear the hash so we don't keep retrying
      window.location.hash = "";
      return;
    }

    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");

    if (!accessToken || !refreshToken) return;

    // Found auth tokens in hash - process them
    setProcessing(true);

    const handleAuth = async () => {
      try {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (sessionError) {
          console.error("[HashAuthHandler] Set session error:", sessionError);
          return;
        }

        // Clear the hash
        window.location.hash = "";

        // Redirect to overview
        router.push("/overview");
      } catch (err) {
        console.error("[HashAuthHandler] Unexpected error:", err);
      } finally {
        setProcessing(false);
      }
    };

    handleAuth();
  }, [supabase, router]);

  if (!processing) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 dark:bg-black/80">
      <div className="text-center">
        <div className="mb-3 h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 mx-auto" />
        <p className="text-sm text-gray-600 dark:text-gray-400">Signing you in...</p>
      </div>
    </div>
  );
}