"use client";

import { Database } from "@/types/supabase";
import { createBrowserClient } from "@supabase/ssr";
import { useEffect, useMemo, useRef } from "react";
import { logger } from "@/lib/logger";
import { hardNavigate } from "@/lib/hard-navigate";

/**
 * Handles Supabase auth redirects that land on the root URL.
 *
 * Supports two auth flows:
 * 1. Implicit flow: tokens in URL hash (#access_token=...&refresh_token=...)
 * 2. PKCE flow: code in query params (?code=xxx)
 *
 * No loading overlay — setState before hardNavigate caused removeChild DOM errors.
 */
export function HashAuthHandler() {
  const hasRun = useRef(false);

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
    if (hasRun.current) return;

    const handleAuth = async () => {
      hasRun.current = true;

      const searchParams = new URLSearchParams(window.location.search);
      const code = searchParams.get("code");

      if (code) {
        try {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            logger.error("[HashAuthHandler] ✗ PKCE exchange error:", exchangeError);
            hardNavigate(`/login?error=${encodeURIComponent("Login link expired or invalid. Please try again.")}`);
            return;
          }
          hardNavigate(getPostLoginUrl());
          return;
        } catch (err) {
          logger.error("[HashAuthHandler] ✗ PKCE exchange unexpected error:", err);
          hardNavigate(`/login?error=${encodeURIComponent("Login failed. Please try again.")}`);
          return;
        }
      }

      const hash = window.location.hash.substring(1);
      if (!hash) return;

      const hashParams = new URLSearchParams(hash);
      const error = hashParams.get("error");
      const errorDescription = hashParams.get("error_description");
      if (error) {
        logger.error("[HashAuthHandler] ✗ Auth error in hash:", error, errorDescription);
        hardNavigate(`/login?error=${encodeURIComponent(errorDescription || error)}`);
        return;
      }

      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");
      if (!accessToken || !refreshToken) return;

      try {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (sessionError) {
          logger.error("[HashAuthHandler] ✗ Set session error:", sessionError);
          hardNavigate(`/login?error=${encodeURIComponent("Login failed. Please try again.")}`);
          return;
        }

        hardNavigate(getPostLoginUrl());
      } catch (err) {
        logger.error("[HashAuthHandler] ✗ Unexpected error:", err);
        hardNavigate(`/login?error=${encodeURIComponent("Login failed. Please try again.")}`);
      }
    };

    handleAuth();
  }, [supabase]);

  return null;
}
