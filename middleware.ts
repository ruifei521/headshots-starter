import { createServerClient, parseCookieHeader } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
              secure: options?.secure ?? true,
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

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
