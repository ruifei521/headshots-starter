import { NextRequest, NextResponse } from 'next/server';
import { PRICING, PRODUCT_IDS } from '@/lib/pricing';

const CREEM_API_KEY = process.env.CREEM_API_KEY!;
const CREEM_API_BASE = 'https://api.creem.io/v1';

// Product definitions from shared pricing
const PRODUCTS = [
  { id: PRODUCT_IDS.starter, name: 'Starter Pack', credits: PRICING.starter.credits, price: PRICING.starter.price * 100 },
  { id: PRODUCT_IDS.pro, name: 'Pro Pack', credits: PRICING.pro.credits, price: PRICING.pro.price * 100 },
  { id: PRODUCT_IDS.executive, name: 'Executive Pack', credits: PRICING.executive.credits, price: PRICING.executive.price * 100 },
];

export async function POST(req: NextRequest) {
  try {
    const { productId, userId, email, name } = await req.json();

    if (!productId || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: productId, userId' },
        { status: 400 }
      );
    }

    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    // Create a checkout session via CREEM API
    // POST /v1/checkouts — creates a hosted checkout page
    // Docs: https://docs.creem.io/api-reference/checkout
    const response = await fetch(`${CREEM_API_BASE}/checkouts`, {
      method: 'POST',
      headers: {
        'x-api-key': CREEM_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product_id: productId,
        success_url: 'https://snapprohead.com/get-credits?success=true',
        cancel_url: 'https://snapprohead.com/get-credits?canceled=true',
        request_id: userId,   // Used by CREEM to identify the user in webhook
        customer: email ? { email, name: name || '' } : undefined,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('CREEM checkout API error:', response.status, errorBody);
      return NextResponse.json(
        { error: `CREEM API error: ${response.status}`, details: errorBody },
        { status: 502 }
      );
    }

    const data = await response.json();
    
    // CREEM returns a checkout session with a checkout_url
    // The user should be redirected to this URL to complete payment
    const checkoutUrl = data.checkout_url || data.url;
    
    if (!checkoutUrl) {
      console.error('CREEM checkout response missing URL:', JSON.stringify(data));
      return NextResponse.json(
        { error: 'CREEM did not return a checkout URL' },
        { status: 502 }
      );
    }

    return NextResponse.json({ url: checkoutUrl, session_id: data.id });

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
