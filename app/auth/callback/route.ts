import { createServerClient, parseCookieHeader } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const requestUrl = new URL(req.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/overview";
  const error = requestUrl.searchParams.get("error");
  const errorDescription = requestUrl.searchParams.get("error_description");

  if (error) {
    console.error("[auth/callback] Error from provider:", error, errorDescription);
    return NextResponse.redirect(
      `${requestUrl.origin}/login?error=${encodeURIComponent(errorDescription || error)}`
    );
  }

  if (code) {
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
      console.error("[auth/callback] Code exchange error:", exchangeError);
      return NextResponse.redirect(
        `${requestUrl.origin}/login?error=${encodeURIComponent(exchangeError.message)}`
      );
    }

    return res;
  }

  // No code parameter - nothing to process
  return NextResponse.redirect(`${requestUrl.origin}/login`);
}
