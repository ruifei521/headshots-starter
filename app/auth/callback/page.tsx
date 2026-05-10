"use client";

import { Database } from "@/types/supabase";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createBrowserClient<Database>(supabaseUrl, supabaseKey);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Check for PKCE code in query params
        const code = searchParams.get("code");
        const next = searchParams.get("next") || "/overview";
        const errorParam = searchParams.get("error");
        const errorDescription = searchParams.get("error_description");

        if (errorParam) {
          console.error("[auth/callback] Error from provider:", errorParam, errorDescription);
          setError(errorDescription || errorParam);
          return;
        }

        if (code) {
          // PKCE OAuth flow - exchange code for session
          const { error: exchangeError } =
            await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            console.error("[auth/callback] Code exchange error:", exchangeError);
            setError(exchangeError.message);
            return;
          }
        } else {
          // Check for token hash (Magic Link flow)
          const tokenHash = searchParams.get("token_hash");
          const type = searchParams.get("type");
          const next = searchParams.get("next") || "/overview";
          
          if (tokenHash || type === "magiclink") {
            // For Magic Link, get session from the URL parameters
            // Supabase client handles this automatically when we call getSession
            const { data, error: sessionError } = await supabase.auth.getSession();
            
            if (sessionError) {
              console.error("[auth/callback] Magic Link session error:", sessionError);
              setError(sessionError.message);
              return;
            }
            
            // If no session yet, we might need to verify the token server-side
            // But Supabase JS client should handle this automatically
            if (!data.session) {
              // Try to get the token from URL and set session
              const accessToken = searchParams.get("access_token");
              const refreshToken = searchParams.get("refresh_token");
              
              if (accessToken && refreshToken) {
                const { error: setSessionError } = await supabase.auth.setSession({
                  access_token: accessToken,
                  refresh_token: refreshToken,
                });
                if (setSessionError) {
                  console.error("[auth/callback] Set session error:", setSessionError);
                  setError(setSessionError.message);
                  return;
                }
              } else {
                // Magic Link verification - the token is in the URL but we need
                // to let Supabase handle it. Try refreshing the session.
                const { error: refreshError } = await supabase.auth.refreshSession();
                if (refreshError) {
                  console.error("[auth/callback] Refresh session error:", refreshError);
                  setError("Authentication failed. Please try again.");
                  return;
                }
              }
            }
          } else {
            // Fallback: check for hash fragment (implicit flow)
            const hash = window.location.hash.substring(1); // remove #
            const hashParams = new URLSearchParams(hash);
            const accessToken = hashParams.get("access_token");
            const refreshToken = hashParams.get("refresh_token");

            if (accessToken && refreshToken) {
              const { error: sessionError } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
              });
              if (sessionError) {
                console.error("[auth/callback] Set session error:", sessionError);
                setError(sessionError.message);
                return;
              }
            } else {
              setError("No authentication credentials found in URL");
              return;
            }
          }
        }

        // Clear the hash from the URL
        window.location.hash = "";

        // Redirect to the next page
        router.push(next);
      } catch (err) {
        console.error("[auth/callback] Unexpected error:", err);
        setError(err instanceof Error ? err.message : "Authentication failed");
      }
    };

    handleCallback();
  }, [searchParams, supabase, router]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold text-red-500">
            Authentication Error
          </h1>
          <p className="mt-2 text-sm text-gray-500">{error}</p>
          <a
            href="/login"
            className="mt-4 inline-block text-blue-500 hover:underline"
          >
            Try again
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-xl">Authenticating...</h1>
        <p className="mt-2 text-sm text-gray-500">
          Please wait while we verify your credentials.
        </p>
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="text-xl">Loading...</h1>
          </div>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
