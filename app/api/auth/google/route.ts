import { NextRequest, NextResponse } from 'next/server';
import { resolvePostLoginDestination } from '@/lib/auth-redirect';
import { getSiteOrigin } from '@/lib/site-origin';

export const dynamic = 'force-dynamic';

/**
 * Start Google OAuth on snapprohead.com (not *.supabase.co).
 * Google consent screen will show "Continue to snapprohead.com".
 */
export async function GET(req: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(
      new URL(
        `/login?error=${encodeURIComponent('Google sign-in is not configured. Please use email login.')}`,
        req.url
      )
    );
  }

  const origin = getSiteOrigin(req);
  const redirectUri = `${origin}/api/auth/google/callback`;
  const afterLogin = resolvePostLoginDestination(
    req.nextUrl.searchParams.get('redirect')
  );

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'online',
    prompt: 'select_account',
    state: afterLogin,
  });

  return NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  );
}
