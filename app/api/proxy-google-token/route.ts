import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy for Google OAuth token exchange.
 * Vercel can reach Google APIs where the local server can't.
 */
export async function POST(req: NextRequest) {
  try {
    const { code, code_verifier } = await req.json();
    
    if (!code || !code_verifier) {
      return NextResponse.json({ error: 'Missing code or code_verifier' }, { status: 400 });
    }

    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: '32555940559.apps.googleusercontent.com',
        client_secret: '',
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
