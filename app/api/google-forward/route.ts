import { NextRequest, NextResponse } from 'next/server';

/**
 * Generic HTTP forward proxy on Vercel.
 * POST { url, method, headers, body } → forwards and returns result.
 */
export async function POST(req: NextRequest) {
  try {
    const { url, method, headers: reqHeaders, body, contentType } = await req.json();
    if (!url) return NextResponse.json({ error: 'Missing url' }, { status: 400 });

    const fetchHeaders: Record<string, string> = {};
    if (contentType) {
      fetchHeaders['Content-Type'] = contentType;
    }
    if (reqHeaders) {
      for (const [k, v] of Object.entries(reqHeaders)) {
        const lk = k.toLowerCase();
        if (!['host', 'connection', 'proxy-connection', 'transfer-encoding', 'content-type'].includes(lk)) {
          fetchHeaders[k] = v as string;
        }
      }
    }

    const resp = await fetch(url, {
      method: method || 'GET',
      headers: fetchHeaders,
      body: body && method !== 'GET' && method !== 'HEAD' ? body : undefined,
    });

    const respBody = await resp.text();
    const respHeaders: Record<string, string> = {};
    resp.headers.forEach((v, k) => { respHeaders[k] = v; });

    return NextResponse.json({
      status: resp.status,
      headers: respHeaders,
      body: respBody,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message, status: 502 }, { status: 502 });
  }
}
