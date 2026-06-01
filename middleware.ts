import { createServerClient, parseCookieHeader } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // 判断是否为 localhost 环境
  const isLocalhost = request.nextUrl.hostname === 'localhost' || request.nextUrl.hostname === '127.0.0.1';

  // ⚠️ 关键修复：跳过 /auth/ 路由，避免 middleware 干扰 PKCE 认证流程
  // middleware 中的 getSession() 会读取并可能清除 code_verifier cookie，
  // 导致 /auth/callback 中的 exchangeCodeForSession() 找不到 verifier 而失败
  // 这是 Supabase SSR + Next.js 的已知问题
  if (request.nextUrl.pathname.startsWith('/auth/')) {
    const response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
    response.headers.set('Cache-Control', 'private, no-store');
    return response;
  }

  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

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

