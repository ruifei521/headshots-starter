import { NextRequest, NextResponse } from 'next/server';

// Store device codes in memory (Vercel serverless — resets on cold start, acceptable)
const pendingAuths = new Map<string, { deviceCode: string; expiresAt: number; interval: number }>();

/**
 * POST /api/google-auth/start — Start device OAuth flow
 */
export async function POST(req: NextRequest) {
  try {
    const { action } = await req.json();

    if (action === 'start') {
      // Initiate device code flow
      const resp = await fetch('https://oauth2.googleapis.com/device/code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: '32555940559.apps.googleusercontent.com',
          scope: 'openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/cloud-platform',
        }).toString(),
      });

      const data = await resp.json();
      
      if (data.error) {
        return NextResponse.json({ error: 'Device code error', details: data }, { status: 502 });
      }

      // Store for polling
      const sessionId = crypto.randomUUID();
      pendingAuths.set(sessionId, {
        deviceCode: data.device_code,
        expiresAt: Date.now() + (data.expires_in || 1800) * 1000,
        interval: (data.interval || 5) * 1000,
      });

      return NextResponse.json({
        session_id: sessionId,
        verification_url: data.verification_url,
        user_code: data.user_code,
        expires_in: data.expires_in,
      });
    }

    if (action === 'poll') {
      const { session_id } = await req.json();
      const pending = pendingAuths.get(session_id);
      
      if (!pending) {
        return NextResponse.json({ error: 'Session not found' }, { status: 404 });
      }

      if (Date.now() > pending.expiresAt) {
        pendingAuths.delete(session_id);
        return NextResponse.json({ error: 'Authorization expired' }, { status: 410 });
      }

      const resp = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: '32555940559.apps.googleusercontent.com',
          client_secret: '',  // Try empty secret for installed app type
          code: pending.deviceCode,
          grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
        }).toString(),
      });

      const data = await resp.json();

      if (data.error) {
        if (data.error === 'authorization_pending') {
          return NextResponse.json({ status: 'pending' });
        }
        if (data.error === 'slow_down') {
          pending.interval += 5000;
          return NextResponse.json({ status: 'pending' });
        }
        pendingAuths.delete(session_id);
        return NextResponse.json({ error: data.error, details: data }, { status: 502 });
      }

      // Success! Got tokens
      pendingAuths.delete(session_id);
      // Don't expose refresh_token in response for security
      return NextResponse.json({
        status: 'done',
        access_token: data.access_token,
        expires_in: data.expires_in,
        token_type: data.token_type,
      });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
