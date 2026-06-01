import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { logger } from "@/lib/logger";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const token_hash = req.nextUrl.searchParams.get('token_hash');
  const type = req.nextUrl.searchParams.get('type') || 'email';

  if (!token_hash) {
    return NextResponse.redirect(new URL('/login?error=missing_token', req.url));
  }

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return req.cookies.getAll();
          },
          setAll(cookiesToSet) {
            // We can't set cookies in a middleware-like route directly,
            // but verifyOtp returns a session that we handle via redirect
          },
        },
      }
    );

    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as 'email' | 'signup' | 'recovery' | 'invite' | 'magiclink',
    });

    if (error) {
      logger.error('Email verification failed:', error.message);
      return NextResponse.redirect(new URL('/login?error=verification_failed', req.url));
    }

    // Success — redirect to overview
    return NextResponse.redirect(new URL('/overview', req.url));
  } catch (e) {
    logger.error('Auth confirm error:', e);
    return NextResponse.redirect(new URL('/login?error=server_error', req.url));
  }
}
