import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

/**
 * Proxy for Google OAuth token exchange.
 * Vercel can reach Google APIs where the local server can't.
 * Requires: valid Supabase session (user logged in).
 */
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  // ✅ 鉴权：必须登录
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

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { code, code_verifier } = await req.json();

    if (!code || !code_verifier) {
      return NextResponse.json({ error: 'Missing code or code_verifier' }, { status: 400 });
    }

    // ✅ client_secret 不再接受客户端传值，installed app 类型用空字符串
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: '32555940559.apps.googleusercontent.com',
        client_secret: '',  // installed app: no secret needed
        redirect_uri: 'https://sdk.cloud.google.com/authcode.html',
        grant_type: 'authorization_code',
        code_verifier,
      }).toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: 'Google API error', details: data }, { status: 502 });
    }

    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
