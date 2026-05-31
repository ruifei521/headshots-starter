import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { getCreemProductId, isTier, type Tier } from '@/lib/tiers';

const CREEM_API_KEY = process.env.CREEM_API_KEY!;
const CREEM_API_BASE = 'https://api.creem.io/v1';

// 向后兼容：旧代码可能不传 tier，默认使用 starter
const DEFAULT_TIER: Tier = 'starter';
const DEFAULT_PRODUCT_ID = getCreemProductId(DEFAULT_TIER);

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

    const body = await req.json();
    // 接收 tier（优先）或向后兼容 pack 参数
    const { tier, pack } = body;

    // 确定实际 tier：tier 参数优先，否则向后兼容 pack 参数，最后默认 starter
    const effectiveTier: Tier = tier && isTier(tier) ? tier : DEFAULT_TIER;

    const productId = getCreemProductId(effectiveTier);
    const packParam = pack || 'corporate-headshots'; // 向后兼容

    if (!productId) {
      return NextResponse.json(
        { error: `Unknown tier: ${effectiveTier}` },
        { status: 400 }
      );
    }

    // Build success_url: redirect to train page for the pack, include tier for GA4 tracking
    const successUrl = `https://snapprohead.com/overview/models/train/${packParam}?tier=${effectiveTier}`;

    // Create CREEM checkout
    const response = await fetch(`${CREEM_API_BASE}/checkouts`, {
      method: 'POST',
      headers: {
        'x-api-key': CREEM_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product_id: productId,
        success_url: successUrl,
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
