import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { createCreemCheckoutUrl } from '@/lib/creem-create-checkout';
import { loginForCheckoutPath } from '@/lib/checkout-url';
import { parseCheckoutTier } from '@/lib/tiers';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

import { resolveBaseUrl } from "@/lib/resolve-base-url";

/**
 * Server-side checkout entry: browser follows redirects without client fetch/setState.
 * Guests are sent to /login?intent=checkout (never see a raw API error page).
 */
export async function GET(req: NextRequest) {
  const tier = req.nextUrl.searchParams.get('tier');
  const pack = req.nextUrl.searchParams.get('pack') || undefined;

  if (!parseCheckoutTier(tier)) {
    logger.error('Checkout go: invalid or missing tier param', tier);
    const fallback = new URL('/pricing', req.url);
    fallback.searchParams.set('checkout', 'error');
    fallback.searchParams.set('reason', 'invalid_tier');
    return NextResponse.redirect(fallback);
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
          setAll() {},
        },
      }
    );

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const user = session?.user;

    if (!user) {
      if (tier) {
        return NextResponse.redirect(new URL(loginForCheckoutPath(tier, pack), req.url));
      }
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('redirect', `${req.nextUrl.pathname}${req.nextUrl.search}`);
      return NextResponse.redirect(loginUrl);
    }

    const result = await createCreemCheckoutUrl({
      userId: user.id,
      email: user.email,
      tier,
      pack,
      baseUrl: resolveBaseUrl(req),
    });

    if ('error' in result) {
      logger.error('Creem checkout failed:', result.error);
      const fallback = new URL('/pricing', req.url);
      fallback.searchParams.set('checkout', 'error');
      fallback.searchParams.set('reason', result.error);
      return NextResponse.redirect(fallback);
    }

    return NextResponse.redirect(result.url);
  } catch (err) {
    logger.error('Checkout go route error:', err);
    const fallback = new URL('/pricing', req.url);
    fallback.searchParams.set('checkout', 'error');
    return NextResponse.redirect(fallback);
  }
}
