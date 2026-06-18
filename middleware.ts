import { createServerClient, parseCookieHeader } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isPublicMarketingPath } from '@/lib/public-paths'

// Rate limiting store (in-memory, per-region, resets on cold start)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const CLEANUP_INTERVAL = 60_000;
let lastCleanup = Date.now();

function getRateLimitKey(request: NextRequest): string {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown';
  const route = request.nextUrl.pathname;
  return `${ip}:${route}`;
}

function getRateLimitConfig(pathname: string): { maxRequests: number; windowMs: number } {
  if (pathname.startsWith('/api/')) return { maxRequests: 60, windowMs: 60_000 };
  if (pathname.startsWith('/auth/')) return { maxRequests: 40, windowMs: 60_000 };
  return { maxRequests: 120, windowMs: 60_000 };
}

/** Payment + Astria webhooks can burst (100+ callbacks per order) — never rate-limit. */
function isWebhookPath(pathname: string): boolean {
  return (
    pathname === '/astria/train-webhook' ||
    pathname === '/astria/prompt-webhook' ||
    pathname === '/api/webhook/creem'
  );
}

function checkRateLimit(request: NextRequest): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  if (now - lastCleanup > CLEANUP_INTERVAL) {
    rateLimitStore.forEach((entry, key) => {
      if (now > entry.resetTime) rateLimitStore.delete(key);
    });
    lastCleanup = now;
  }
  const key = getRateLimitKey(request);
  const config = getRateLimitConfig(request.nextUrl.pathname);
  const entry = rateLimitStore.get(key);
  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + config.windowMs });
    return { allowed: true };
  }
  entry.count++;
  if (entry.count > config.maxRequests) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetTime - now) / 1000) };
  }
  return { allowed: true };
}

function withPathHeaders(request: NextRequest): Headers {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', request.nextUrl.pathname);
  requestHeaders.set('x-search', request.nextUrl.search);
  return requestHeaders;
}

function continueWithPath(request: NextRequest, init?: ResponseInit) {
  return NextResponse.next({
    request: { headers: withPathHeaders(request) },
    ...init,
  });
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Webhooks must never hit per-IP rate limits (Executive tier ≈ 100+ prompt callbacks).
  if (!isWebhookPath(pathname)) {
    const rateLimitResult = checkRateLimit(request);
    if (!rateLimitResult.allowed) {
      return new NextResponse(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(rateLimitResult.retryAfter || 60),
          },
        }
      );
    }
  }

  // 判断是否为 localhost 环境
  const isLocalhost = request.nextUrl.hostname === 'localhost' || request.nextUrl.hostname === '127.0.0.1';

  // ⚠️ 关键修复：跳过 /auth/ 路由，避免 middleware 干扰 PKCE 认证流程
  if (request.nextUrl.pathname.startsWith('/auth/')) {
    const response = continueWithPath(request);
    response.headers.set('Cache-Control', 'private, no-store');
    return response;
  }

  // Checkout API validates auth itself; skip getSession() to avoid duplicate Supabase RTT (~300–800ms)
  if (request.nextUrl.pathname.startsWith('/api/creem/')) {
    const response = continueWithPath(request);
    response.headers.set('Cache-Control', 'private, no-store');
    return response;
  }

  // 🚀 公开页跳过 Supabase getSession() — 减少 TTFB，允许 CDN 缓存
  if (isPublicMarketingPath(request.nextUrl.pathname)) {    const response = continueWithPath(request);
    // ISR 缓存：公开页面可以被 CDN 缓存
    response.headers.set('Cache-Control', 'public, max-age=60, s-maxage=3600, stale-while-revalidate=86400');
    return response;
  }

  const response = continueWithPath(request)

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // 本地开发时如果 Supabase 未配置，跳过认证检查直接放行
  if (!supabaseUrl || supabaseUrl === 'your-project-url' || !supabaseAnonKey || supabaseAnonKey === 'your-anon-key') {
    response.headers.set('Cache-Control', 'private, no-store')
    return response
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return parseCookieHeader(request.headers.get('Cookie') ?? '').map(
            (c) => ({ name: c.name, value: c.value ?? '' })
          )
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            // 同时设置到请求和响应中
            request.cookies.set(name, value)
            response.cookies.set(name, value, {
              httpOnly: options?.httpOnly ?? true,
              secure: options?.secure ?? !isLocalhost,
              sameSite: options?.sameSite ?? 'lax',
              path: options?.path ?? '/',
              maxAge: options?.maxAge,
              domain: options?.domain,
            })
          })
        },
      },
    }
  )

  // 这会触发 cookie 刷新，确保 PKCE verifier 被正确传递
  await supabase.auth.getSession()

  // 防止 CDN 缓存认证页面，避免会话泄露
  response.headers.set('Cache-Control', 'private, no-store')

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|homepage/.*|assets/.*|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

