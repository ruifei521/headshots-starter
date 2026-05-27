import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

const CREEM_API_KEY = process.env.CREEM_API_KEY!;
const CREEM_API_BASE = 'https://api.creem.io/v1';
const SINGLE_PRODUCT_ID = 'prod_6F4zKTNhL3V7vWPUhnjZDZ';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const pack = req.nextUrl.searchParams.get('pack') || '';
    if (!pack) {
      return NextResponse.redirect(new URL('/packs', req.url));
    }

    // Check auth
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
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('redirect', `/packs/${pack}.html`);
      return NextResponse.redirect(loginUrl);
    }

    // Create CREEM checkout
    const res = await fetch(`${CREEM_API_BASE}/checkouts`, {
      method: 'POST',
      headers: { 'x-api-key': CREEM_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product_id: SINGLE_PRODUCT_ID,
        success_url: `https://snapprohead.com/overview/models/train/${pack}`,
        request_id: user.id,
        customer: user.email ? { email: user.email } : undefined,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('CREEM error:', res.status, err);
      return NextResponse.redirect(new URL(`/packs/${pack}.html?error=payment_error`, req.url));
    }

    const data = await res.json();
    const checkoutUrl = data.checkout_url || data.url;

    if (!checkoutUrl) {
      return NextResponse.redirect(new URL(`/packs/${pack}.html?error=no_url`, req.url));
    }

    // Return HTML page with auto-redirect
    // This works in all browsers including WeChat
    return new Response(
      `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="refresh" content="0;url=${checkoutUrl}">
  <title>Redirecting to payment...</title>
  <style>
    body { font-family: -apple-system, sans-serif; text-align: center; padding-top: 100px; color: #666; }
    .spinner { border: 3px solid #f3f3f3; border-top: 3px solid #2563eb; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 20px auto; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <h2>Redirecting to payment...</h2>
  <div class="spinner"></div>
  <p>If not redirected, <a href="${checkoutUrl}">click here</a>.</p>
  <script>window.location.replace("${checkoutUrl}");</script>
</body>
</html>`,
      {
        status: 200,
        headers: { 'content-type': 'text/html;charset=utf-8' },
      }
    );

  } catch (error) {
    console.error('Checkout redirect error:', error);
    return NextResponse.redirect(new URL('/packs?error=server_error', req.url));
  }
}
