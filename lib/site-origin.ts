import type { NextRequest } from 'next/server';

/** Production-safe site origin (respects Vercel forwarded headers). */
export function getSiteOrigin(req: NextRequest): string {
  const host =
    req.headers.get('x-forwarded-host')?.split(',')[0]?.trim() ??
    req.headers.get('host') ??
    'snapprohead.com';
  const forwardedProto = req.headers.get('x-forwarded-proto')?.split(',')[0]?.trim();
  const proto =
    forwardedProto ??
    (host.includes('localhost') || host.startsWith('127.0.0.1') ? 'http' : 'https');
  return `${proto}://${host}`;
}
