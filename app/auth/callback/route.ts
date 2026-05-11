import { createServerClient, parseCookieHeader, type CookieOptions } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const requestUrl = new URL(req.url);
  const code = requestUrl.searchParams.get("code");
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const token = requestUrl.searchParams.get("token");
  const type = requestUrl.searchParams.get("type");
  const next = requestUrl.searchParams.get("next") || "/overview";
  const error = requestUrl.searchParams.get("error");
  const errorDescription = requestUrl.searchParams.get("error_description");

  // Log all params for debugging
  console.log("[auth/callback] Full URL:", req.url);
  console.log("[auth/callback] Params:", { code, token_hash: tokenHash, token, type, error, errorDescription });
  console.log("[auth/callback] Cookies:", req.headers.get("Cookie")?.substring(0, 200));

  if (error) {
    console.error("[auth/callback] Error from provider:", error, errorDescription);
    return NextResponse.redirect(
      `${requestUrl.origin}/login?error=${encodeURIComponent(errorDescription || error)}`
    );
  }

  // PKCE flow: exchange code for session
  if (code) {
    console.log("[auth/callback] PKCE flow: exchanging code for session");
    const res = NextResponse.redirect(new URL(next, req.url));

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return parseCookieHeader(req.headers.get("Cookie") ?? "").map(
              (c) => ({ name: c.name, value: c.value ?? "" })
            );
          },
          setAll(cookiesToSet, headers) {
            cookiesToSet.forEach(({ name, value, options }) =>
              res.cookies.set(name, value, options ?? {})
            );
            if (headers) {
              Object.entries(headers).forEach(([key, value]) =>
                res.headers.set(key, value)
              );
            }
          },
        },
      }
    );

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error("[auth/callback] Code exchange error:", exchangeError.message);
      return NextResponse.redirect(
        `${requestUrl.origin}/login?error=${encodeURIComponent(exchangeError.message)}`
      );
    }

    console.log("[auth/callback] PKCE exchange success, redirecting to:", next);
    return res;
  }

  // Legacy token flow: verify token_hash
  if (tokenHash && type === "magiclink") {
    console.log("[auth/callback] Legacy token_hash flow");
    const res = NextResponse.redirect(new URL(next, req.url));

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return parseCookieHeader(req.headers.get("Cookie") ?? "").map(
              (c) => ({ name: c.name, value: c.value ?? "" })
            );
          },
          setAll(cookiesToSet, headers) {
            cookiesToSet.forEach(({ name, value, options }) =>
              res.cookies.set(name, value, options ?? {})
            );
            if (headers) {
              Object.entries(headers).forEach(([key, value]) =>
                res.headers.set(key, value)
              );
            }
          },
        },
      }
    );

    const { error: verifyError } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: "magiclink",
    });

    if (verifyError) {
      console.error("[auth/callback] Token verify error:", verifyError.message);
      return NextResponse.redirect(
        `${requestUrl.origin}/login?error=${encodeURIComponent(verifyError.message)}`
      );
    }

    console.log("[auth/callback] Token verify success, redirecting to:", next);
    return res;
  }

  // Legacy token flow (plain token)
  if (token && type === "magiclink") {
    console.log("[auth/callback] Legacy token flow (plain token)");
    const res = NextResponse.redirect(new URL(next, req.url));

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return parseCookieHeader(req.headers.get("Cookie") ?? "").map(
              (c) => ({ name: c.name, value: c.value ?? "" })
            );
          },
          setAll(cookiesToSet, headers) {
            cookiesToSet.forEach(({ name, value, options }) =>
              res.cookies.set(name, value, options ?? {})
            );
            if (headers) {
              Object.entries(headers).forEach(([key, value]) =>
                res.headers.set(key, value)
              );
            }
          },
        },
      }
    );

    const { error: verifyError } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: "magiclink",
    });

    if (verifyError) {
      console.error("[auth/callback] Token verify error:", verifyError.message);
      return NextResponse.redirect(
        `${requestUrl.origin}/login?error=${encodeURIComponent(verifyError.message)}`
      );
    }

    console.log("[auth/callback] Token verify success, redirecting to:", next);
    return res;
  }

  // No recognized parameter
  console.log("[auth/callback] No recognized auth parameter, redirecting to login");
  return NextResponse.redirect(`${requestUrl.origin}/login`);
}
