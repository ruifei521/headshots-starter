"use client";

import { Database } from "@/types/supabase";
import { createBrowserClient } from "@supabase/ssr";
import { useEffect, useMemo, useState } from "react";
import { logger } from "@/lib/logger";
import { hardNavigate } from "@/lib/hard-navigate";
import { resolvePostLoginDestination } from "@/lib/auth-redirect";

/**
 * Client-only auth completion page (/auth/complete).
 * Magic links from email apps must land here — tokens in URL hash are invisible to server routes.
 */
export function AuthCompleteClient() {
  const [message, setMessage] = useState("Signing you in…");
  const [errorMsg, setErrorMsg] = useState("");

  const supabase = useMemo(
    () =>
      createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { auth: { flowType: "implicit" } }
      ),
    []
  );

  useEffect(() => {
    let cancelled = false;

    const finish = (path: string) => {
      if (!cancelled) hardNavigate(resolvePostLoginDestination(path));
    };

    const fail = (msg: string) => {
      if (!cancelled) {
        setErrorMsg(msg);
        setMessage("");
      }
    };

    async function run() {
      const url = new URL(window.location.href);
      const next =
        url.searchParams.get("next") ||
        sessionStorage.getItem("postLoginRedirect") ||
        "/overview";
      sessionStorage.removeItem("postLoginRedirect");

      const tokenHash = url.searchParams.get("token_hash");
      const type = url.searchParams.get("type") || "magiclink";
      const code = url.searchParams.get("code");
      const error = url.searchParams.get("error");

      if (error) {
        fail("Login link expired or invalid. Please try again.");
        return;
      }

      // Query: token_hash (works in email in-app browsers)
      if (tokenHash) {
        setMessage("Verifying your link…");
        const { error: verifyError } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: type as "magiclink" | "email",
        });
        if (verifyError) {
          logger.error("[AuthComplete] token_hash failed:", verifyError.message);
          fail(`Token verify failed: ${verifyError.message}`);
          return;
        }
        finish(next);
        return;
      }

      // Query: PKCE code — try server callback (same-browser); else show login
      if (code) {
        setMessage("Completing sign-in…");
        hardNavigate(
          `/auth/callback?code=${encodeURIComponent(code)}&next=${encodeURIComponent(next)}`
        );
        return;
      }

      // Hash: implicit flow (#access_token=…)
      const hash = window.location.hash.substring(1);
      if (hash) {
        const hashParams = new URLSearchParams(hash);
        const hashError = hashParams.get("error");
        if (hashError) {
          fail(hashParams.get("error_description") || hashError);
          return;
        }

        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");
        if (accessToken && refreshToken) {
          setMessage("Setting up your session…");
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (sessionError) {
            logger.error("[AuthComplete] setSession failed:", sessionError.message);
            fail(`Session setup failed: ${sessionError.message}`);
            return;
          }
          // Clear hash from URL before navigate
          window.history.replaceState({}, "", url.pathname + url.search);
          finish(next);
          return;
        }
      }

      fail("Invalid login link. Please request a new one from the login page.");
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [supabase]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center p-8">
      {errorMsg ? (
        <div className="text-center max-w-md">
          <p className="text-sm text-red-500 mb-2 font-semibold">Login failed</p>
          <p className="text-xs text-red-400 mb-4 whitespace-pre-wrap">{errorMsg}</p>
          <button
            className="text-sm text-blue-500 underline"
            onClick={() => window.location.href = "/login"}
          >
            Back to login
          </button>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">{message}</p>
      )}
    </div>
  );
}
