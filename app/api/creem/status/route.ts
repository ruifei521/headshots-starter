import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const checkoutId = searchParams.get('checkout_id');

    // Validate required param
    if (!checkoutId) {
      return NextResponse.json({ error: 'missing_checkout_id' }, { status: 400 });
    }

    // Authenticate via server client
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return req.cookies.getAll(); },
          setAll() {},
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    // Query the order, must belong to current user
    const { data, error } = await supabase
      .from('orders')
      .select('status, tier, amount_cents, currency, created_at')
      .eq('creem_checkout_id', checkoutId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('[creem/status] Query error:', error);
      return NextResponse.json({ error: 'server_error' }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'not_found' }, { status: 404 });
    }

    return NextResponse.json({
      status: data.status,
      tier: data.tier,
      amount_cents: data.amount_cents,
      currency: data.currency,
      created_at: data.created_at,
    });
  } catch (e) {
    console.error('[creem/status] Unexpected error:', e);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
