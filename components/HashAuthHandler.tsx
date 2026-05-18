"use client";

import { Database } from "@/types/supabase";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

/**
 * Handles Supabase auth redirects that land on the root URL.
 *
 * Supports two auth flows:
 * 1. Implicit flow: tokens in URL hash (#access_token=...&refresh_token=...)
 *    - Used by Supabase Magic Link (signInWithOtp)
 * 2. PKCE flow: code in query params (?code=xxx)
 *    - Used by Supabase OAuth and newer PKCE-based magic links
 *
 * IMPORTANT: emailRedirectTo for Magic Link must point to the ROOT URL (e.g. https://snapprohead.com),
 * NOT /auth/callback. This is because hash fragments (#) are not sent to the server,
 * so server-side route handlers cannot read them. The HashAuthHandler is a client component
 * that can access both hash fragments and query parameters.
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
    const handleAuth = async () => {
      // ====== Flow 1: Check for PKCE code in query params ======
      const searchParams = new URLSearchParams(window.location.search);
      const code = searchParams.get("code");

      if (code) {
        console.log("[HashAuthHandler] PKCE code found, exchanging for session...");
        setProcessing(true);
        try {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            console.error("[HashAuthHandler] PKCE exchange error:", exchangeError.message);
            // Redirect to login with error
            window.location.href = `/login?error=${encodeURIComponent('Login link expired or invalid. Please try again.')}`;
            return;
          }

          console.log("[HashAuthHandler] PKCE exchange success");
          // Clean up URL
          searchParams.delete("code");
          searchParams.delete("next");
          searchParams.delete("type");
          const cleanUrl = `${window.location.origin}${window.location.pathname}${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
          window.history.replaceState({}, '', cleanUrl);

          router.push("/overview");
          return;
        } catch (err) {
          console.error("[HashAuthHandler] PKCE exchange unexpected error:", err);
          window.location.href = `/login?error=${encodeURIComponent('Login failed. Please try again.')}`;
          return;
        } finally {
          setProcessing(false);
        }
      }

      // ====== Flow 2: Check for implicit flow tokens in hash ======
      const hash = window.location.hash.substring(1);
      if (!hash) return;

      const hashParams = new URLSearchParams(hash);

      // Check for error in hash
      const error = hashParams.get("error");
      const errorDescription = hashParams.get("error_description");
      if (error) {
        console.error("[HashAuthHandler] Auth error:", error, errorDescription);
        // Clear the hash so we don't keep retrying
        window.location.hash = "";
        // Redirect to login with error message
        router.push(`/login?error=${encodeURIComponent(errorDescription || error)}`);
        return;
      }

      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");

      if (!accessToken || !refreshToken) return;

      // Found auth tokens in hash - process them
      console.log("[HashAuthHandler] Implicit flow tokens found, establishing session...");
      setProcessing(true);

      try {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (sessionError) {
          console.error("[HashAuthHandler] Set session error:", sessionError);
          window.location.href = `/login?error=${encodeURIComponent('Login failed. Please try again.')}`;
          return;
        }

        console.log("[HashAuthHandler] Session established successfully");
        // Clear the hash
        window.location.hash = "";

        // Redirect to overview
        router.push("/overview");
      } catch (err) {
        console.error("[HashAuthHandler] Unexpected error:", err);
        window.location.href = `/login?error=${encodeURIComponent('Login failed. Please try again.')}`;
        return;
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
