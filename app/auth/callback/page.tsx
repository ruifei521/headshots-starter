"use client";

import { Database } from "@/types/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient<Database>();
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
          // PKCE flow - exchange code for session
          const { error: exchangeError } =
            await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            console.error("[auth/callback] Code exchange error:", exchangeError);
            setError(exchangeError.message);
            return;
          }
        } else {
          // Implicit flow - check for hash fragment
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
