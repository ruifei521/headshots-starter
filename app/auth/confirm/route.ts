import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, parseCookieHeader } from '@supabase/ssr';
import { logger } from "@/lib/logger";
import { resolvePostLoginDestination } from '@/lib/auth-redirect';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const token_hash = req.nextUrl.searchParams.get('token_hash');
  const type = req.nextUrl.searchParams.get('type') || 'email';
  const next = req.nextUrl.searchParams.get('next') || '/overview';
  const destination = resolvePostLoginDestination(next);
  const isLocalhost =
    req.nextUrl.hostname === 'localhost' || req.nextUrl.hostname === '127.0.0.1';

  if (!token_hash) {
    return NextResponse.redirect(new URL('/login?error=missing_token', req.url));
  }

  try {
    const res = NextResponse.redirect(new URL(destination, req.url));
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return parseCookieHeader(req.headers.get('Cookie') ?? '').map((c) => ({
              name: c.name,
              value: c.value ?? '',
            }));
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              res.cookies.set(name, value, {
                httpOnly: options?.httpOnly ?? true,
                secure: options?.secure ?? !isLocalhost,
                sameSite: options?.sameSite ?? 'lax',
                path: options?.path ?? '/',
                maxAge: options?.maxAge,
                domain: options?.domain,
              });
            });
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

    return res;
  } catch (e) {
    logger.error('Auth confirm error:', e);
    return NextResponse.redirect(new URL('/login?error=server_error', req.url));
  }
}
