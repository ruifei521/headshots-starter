import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/google-proxy — Make authenticated Google API calls
 * Body: { token: string, url: string, method?: string, body?: any }
 */
export async function POST(req: NextRequest) {
  try {
    const { token, url, method, body } = await req.json();
    
    if (!token || !url) {
      return NextResponse.json({ error: 'Missing token or url' }, { status: 400 });
    }

    const fetchOptions: any = {
      method: method || 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
    
    if (body && method !== 'GET') {
      fetchOptions.body = JSON.stringify(body);
    }

    const resp = await fetch(url, fetchOptions);
    const text = await resp.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }

    return NextResponse.json({ status: resp.status, data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
