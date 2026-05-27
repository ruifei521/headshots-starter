import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');

  if (error) {
    return new Response(`<html><body><h2>Error: ${error}</h2></body></html>`, {
      status: 200, headers: { 'content-type': 'text/html' }
    });
  }

  if (code) {
    return new Response(`<html><body>
      <h2>✅ 授权成功！</h2>
      <p>请复制下面的 code 发给我：</p>
      <textarea rows="3" cols="80" onclick="this.select()">${code}</textarea>
      <p style="color:#666;font-size:14px">code=4/${code.split('/')[1] || code.substring(0,50)}...</p>
    </body></html>`, {
      status: 200, headers: { 'content-type': 'text/html' }
    });
  }

  // No code - redirect to Google OAuth
  const CLIENT_ID = '929789267603-jfve8a1m1o7gulthopu0l0i8tgmg0ag4.apps.googleusercontent.com';
  const REDIRECT_URI = 'https://snapprohead.com/api/auth/google/get-code';
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: 'https://www.googleapis.com/auth/webmasters email profile',
    access_type: 'offline',
    prompt: 'consent',
  });

  return NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
}
