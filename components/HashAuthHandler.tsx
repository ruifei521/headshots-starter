"use client";

import { Database } from "@/types/supabase";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { logger } from "@/lib/logger";

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
  const [hasRun, setHasRun] = useState(false);

  // Check if there's a post-login redirect
  const getPostLoginUrl = () => {
    if (typeof window === 'undefined') return '/overview';
    const redirect = sessionStorage.getItem('postLoginRedirect');
    if (redirect) {
      sessionStorage.removeItem('postLoginRedirect');
      return redirect;
    }
    return '/overview';
  };

  const supabase = useMemo(() => {
    return createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }, []);

  useEffect(() => {
    // Prevent running multiple times
    if (hasRun) {
      return;
    }

    const handleAuth = async () => {
      setHasRun(true);

      // ===== Flow 1: Check for PKCE code in query params =====
      const searchParams = new URLSearchParams(window.location.search);
      const code = searchParams.get("code");

      if (code) {
        setProcessing(true);
        try {
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            logger.error("[HashAuthHandler] ✗ PKCE exchange error:", exchangeError);
            window.location.href = `/login?error=${encodeURIComponent("Login link expired or invalid. Please try again.")}`;
            return;
          }

          window.history.replaceState({}, '', window.location.pathname);
          setProcessing(false);
          router.push(getPostLoginUrl());
          return;
        } catch (err) {
          logger.error("[HashAuthHandler] ✗ PKCE exchange unexpected error:", err);
          window.location.href = `/login?error=${encodeURIComponent("Login failed. Please try again.")}`;
          return;
        }
      }

      // ===== Flow 2: Check for implicit flow tokens in hash =====
      const hash = window.location.hash.substring(1);
      if (!hash) {
        return;
      }

      const hashParams = new URLSearchParams(hash);

      // Check for error in hash
      const error = hashParams.get("error");
      const errorDescription = hashParams.get("error_description");
      if (error) {
        logger.error("[HashAuthHandler] ✗ Auth error in hash:", error, errorDescription);
        window.location.hash = "";
        router.push(`/login?error=${encodeURIComponent(errorDescription || error)}`);
        return;
      }

      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");

      if (!accessToken || !refreshToken) {
        return;
      }

      // Found auth tokens in hash - process them
      setProcessing(true);

      try {
        const { data, error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (sessionError) {
          logger.error("[HashAuthHandler] ✗ Set session error:", sessionError);
          window.location.href = `/login?error=${encodeURIComponent("Login failed. Please try again.")}`;
          return;
        }

        window.location.hash = "";
        setProcessing(false);
        router.push(getPostLoginUrl());
      } catch (err) {
        logger.error("[HashAuthHandler] ✗ Unexpected error:", err);
        window.location.href = `/login?error=${encodeURIComponent("Login failed. Please try again.")}`;
        return;
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
