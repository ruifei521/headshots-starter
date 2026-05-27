import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

const CREEM_API_KEY = process.env.CREEM_API_KEY!;
const CREEM_API_BASE = 'https://api.creem.io/v1';
const SINGLE_PRODUCT_ID = 'prod_6F4zKTNhL3V7vWPUhnjZDZ';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // Check auth from request cookies
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
      return NextResponse.json(
        { error: 'Not authenticated', code: 'AUTH_REQUIRED' },
        { status: 401 }
      );
    }

    const { pack } = await req.json();

    if (!pack) {
      return NextResponse.json(
        { error: 'Missing pack' },
        { status: 400 }
      );
    }

    // Create CREEM checkout
    const response = await fetch(`${CREEM_API_BASE}/checkouts`, {
      method: 'POST',
      headers: {
        'x-api-key': CREEM_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product_id: SINGLE_PRODUCT_ID,
        success_url: `https://snapprohead.com/overview/models/train/${pack}`,
        request_id: user.id,
        customer: user.email ? { email: user.email } : undefined,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('CREEM checkout API error:', response.status, errorBody);
      return NextResponse.json(
        { error: 'CREEM API error' },
        { status: 502 }
      );
    }

    const data = await response.json();
    const checkoutUrl = data.checkout_url || data.url;
    
    if (!checkoutUrl) {
      console.error('CREEM checkout response missing URL:', JSON.stringify(data));
      return NextResponse.json(
        { error: 'CREEM did not return a checkout URL' },
        { status: 502 }
      );
    }

    return NextResponse.json({ url: checkoutUrl });

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
