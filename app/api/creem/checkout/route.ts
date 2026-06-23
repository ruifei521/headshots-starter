import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { createCreemCheckoutUrl } from '@/lib/creem-create-checkout';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

import { resolveBaseUrl } from "@/lib/resolve-base-url";

export async function POST(req: NextRequest) {
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
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated', code: 'AUTH_REQUIRED' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { tier, pack } = body;

    const result = await createCreemCheckoutUrl({
      userId: user.id,
      email: user.email,
      tier,
      pack,
      baseUrl: resolveBaseUrl(req),
    });

    if ('error' in result) {
      const status =
        result.error === 'invalid_tier' || result.error.includes('Unknown tier')
          ? 400
          : 502;
      return NextResponse.json({ error: result.error }, { status });
    }

    return NextResponse.json({ url: result.url });
  } catch (error) {
    logger.error('Checkout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
