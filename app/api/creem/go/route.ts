import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { createCreemCheckoutUrl } from '@/lib/creem-create-checkout';

export const dynamic = 'force-dynamic';

function resolveBaseUrl(req: NextRequest): string {
  const origin = req.headers.get('origin');
  if (origin?.startsWith('http')) return origin;
  const host = req.headers.get('host');
  if (host) {
    const proto = host.includes('localhost') ? 'http' : 'https';
    return `${proto}://${host}`;
  }
  return 'https://snapprohead.com';
}

/**
 * Server-side checkout entry: browser follows redirects without client fetch/setState,
 * avoiding React removeChild races on the homepage.
 */
export async function GET(req: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll() {},
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('redirect', '/#pricing');
    return NextResponse.redirect(loginUrl);
  }

  const tier = req.nextUrl.searchParams.get('tier');
  const pack = req.nextUrl.searchParams.get('pack');

  const result = await createCreemCheckoutUrl({
    userId: user.id,
    email: user.email,
    tier,
    pack,
    baseUrl: resolveBaseUrl(req),
  });

  if ('error' in result) {
    const fallback = new URL('/#pricing', req.url);
    fallback.searchParams.set('checkout', 'error');
    return NextResponse.redirect(fallback);
  }

  return NextResponse.redirect(result.url);
}
