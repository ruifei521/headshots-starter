import { createServerClient, type CookieOptions } from "@supabase/ssr";
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
    // Create a response object that we can use to set cookies on
    let res = NextResponse.redirect(new URL(next, req.url));

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return req.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            // Set cookie on both the request and response
            req.cookies.set({ name, value, ...options });
            res = NextResponse.redirect(new URL(next, req.url));
            res.cookies.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            req.cookies.set({ name, value: "", ...options });
            res = NextResponse.redirect(new URL(next, req.url));
            res.cookies.set({ name, value: "", ...options });
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

    // Return the response with cookies set
    return res;
  }

  // No code parameter - nothing to process
  return NextResponse.redirect(`${requestUrl.origin}/login`);
}
