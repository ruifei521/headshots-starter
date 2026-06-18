import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import { resolvePostLoginDestination } from '@/lib/auth-redirect';
import { getSiteOrigin } from '@/lib/site-origin';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const origin = getSiteOrigin(req);
  const isLocalhost = origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1');

  const loginError = (message: string) =>
    NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(message)}`, origin)
    );

  const oauthError = req.nextUrl.searchParams.get('error');
  if (oauthError) {
    const message =
      oauthError === 'access_denied'
        ? 'Google sign-in was cancelled.'
        : 'Google sign-in failed. Please try again.';
    return loginError(message);
  }

  const code = req.nextUrl.searchParams.get('code');
  if (!code) {
    return loginError('Google sign-in did not complete. Please try again.');
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return loginError('Google sign-in is not configured.');
  }

  const redirectUri = `${origin}/api/auth/google/callback`;
  const afterLogin = resolvePostLoginDestination(req.nextUrl.searchParams.get('state'));

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  });

  const tokens = await tokenRes.json();
  if (!tokenRes.ok || !tokens.id_token) {
    logger.error('Google token exchange failed:', tokens);
    return loginError('Google sign-in failed. Please try again.');
  }

  const redirectResponse = NextResponse.redirect(new URL(afterLogin, origin));

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            redirectResponse.cookies.set(name, value, {
              httpOnly: options?.httpOnly ?? true,
              secure: options?.secure ?? !isLocalhost,
              sameSite: (options?.sameSite as 'lax' | 'strict' | 'none') ?? 'lax',
              path: options?.path ?? '/',
              maxAge: options?.maxAge,
            });
          });
        },
      },
    }
  );

  const { error: signInError } = await supabase.auth.signInWithIdToken({
    provider: 'google',
    token: tokens.id_token,
    access_token: tokens.access_token,
  });

  if (signInError) {
    logger.error('Supabase signInWithIdToken failed:', signInError.message);
    return loginError(
      'Could not complete Google sign-in. Ensure Google provider uses the same OAuth client in Supabase.'
    );
  }

  return redirectResponse;
}
