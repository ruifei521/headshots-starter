import { createServerClient, parseCookieHeader } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { resolvePostLoginDestination } from "@/lib/auth-redirect";

export async function GET(req: NextRequest) {
  const requestUrl = new URL(req.url);

  // 判断是否为 localhost 环境
  const isLocalhost = requestUrl.hostname === 'localhost' || requestUrl.hostname === '127.0.0.1';

  // 读取请求中的所有 cookie，用于诊断
  const requestCookies = parseCookieHeader(req.headers.get("Cookie") ?? "");
  const cookieNames = requestCookies.map(c => c.name);

  // 提取所有可能的参数
  const code = requestUrl.searchParams.get("code");
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const token = requestUrl.searchParams.get("token");
  const type = requestUrl.searchParams.get("type");
  const next = resolvePostLoginDestination(requestUrl.searchParams.get("next"));
  const error = requestUrl.searchParams.get("error");
  const errorDescription = requestUrl.searchParams.get("error_description");
  const email = requestUrl.searchParams.get("email");

  // 如果 Supabase 直接返回错误
  if (error) {
    logger.error("Supabase error:", error, errorDescription);
    return NextResponse.redirect(
      `${requestUrl.origin}/login?error=${encodeURIComponent('Login link expired or invalid. Please try again.')}`
    );
  }

  // 创建 Supabase 服务端客户端的辅助函数
  const createSupabaseClient = (redirectTo: string) => {
    const res = NextResponse.redirect(new URL(redirectTo, req.url));
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return parseCookieHeader(req.headers.get("Cookie") ?? "").map(
              (c) => ({ name: c.name, value: c.value ?? "" })
            );
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              res.cookies.set(name, value, {
                httpOnly: options?.httpOnly ?? true,
                secure: options?.secure ?? !isLocalhost,
                sameSite: options?.sameSite ?? 'lax',
                path: options?.path ?? '/',
                maxAge: options?.maxAge,
                domain: options?.domain,
              });
            });
          },
        },
      }
    );
    return { supabase, res };
  };

  // 优先 token_hash / OTP（邮箱 App 内打开无需 PKCE cookie）
  if (tokenHash || (token && type === "magiclink")) {
    const { supabase, res } = createSupabaseClient(next);

    const { error: verifyError } = await supabase.auth.verifyOtp({
      token_hash: (tokenHash || token) as string,
      type: "magiclink",
    });

    if (verifyError) {
      logger.error("token_hash verify failed:", verifyError.message);
      return NextResponse.redirect(
        `${requestUrl.origin}/login?error=${encodeURIComponent('Login link expired or invalid. Please try again.')}`
      );
    }

    return res;
  }

  if (token && email) {
    const { supabase, res } = createSupabaseClient(next);

    const { error: verifyError } = await supabase.auth.verifyOtp({
      email: email,
      token: token,
      type: "magiclink",
    });

    if (verifyError) {
      logger.error("verifyOtp (email+token) failed:", verifyError.message);
      return NextResponse.redirect(
        `${requestUrl.origin}/login?error=${encodeURIComponent('Login link expired or invalid. Please try again.')}`
      );
    }

    return res;
  }

  if (token) {
    const { supabase, res } = createSupabaseClient(next);

    const { error: verifyError } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: "magiclink",
    });

    if (verifyError) {
      logger.error("plain token verify failed:", verifyError.message);
      return NextResponse.redirect(
        `${requestUrl.origin}/login?error=${encodeURIComponent('Login link expired or invalid. Please try again.')}`
      );
    }

    return res;
  }

  // PKCE code — 仅在同浏览器点击 magic link 时有效
  if (code) {
    // 诊断：检查 code_verifier cookie 是否存在
    const hasCodeVerifier = cookieNames.some(name =>
      name.includes('code-verifier') || name.includes('code_verifier')
    );
    if (!hasCodeVerifier) {
      logger.warn("⚠️ code_verifier cookie NOT found! This will likely cause PKCE exchange to fail.");
      logger.warn("Possible causes:");
      logger.warn("  - Link opened in a different browser/in-app browser");
      logger.warn("  - Browser cookies were cleared");
      logger.warn("  - Incognito/private window");
      logger.warn("  - Middleware cleared the cookie (should be fixed by skipping /auth/ in middleware)");
    }

    const { supabase, res } = createSupabaseClient(next);

    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      logger.error("PKCE exchange failed:", exchangeError.message);
      logger.error("Error details:", JSON.stringify({
        message: exchangeError.message,
        status: exchangeError.status,
        name: exchangeError.name,
      }));

      // PKCE 失败的友好错误提示
      let userMessage = 'Login link expired or invalid. Please try again.';
      if (exchangeError.message.includes('code challenge') || exchangeError.message.includes('code verifier')) {
        userMessage = 'Your login session has expired. Please request a new magic link.';
        logger.error("Root cause: PKCE code verifier cookie was lost or expired. This can happen if:");
        logger.error("  - The link was opened in a different browser");
        logger.error("  - Browser cookies were cleared between sending the link and clicking it");
        logger.error("  - The link was opened in an incognito/private window");
        logger.error("  - Cookie SameSite settings blocked the verifier cookie");
      }

      return NextResponse.redirect(
        `${requestUrl.origin}/login?error=${encodeURIComponent(userMessage)}`
      );
    }

    // 确保所有 auth cookie 都被正确设置
    const setCookies = res.cookies.getAll();

    return res;
  }

  // 没有任何参数
  return NextResponse.redirect(`${requestUrl.origin}/login?error=${encodeURIComponent('Invalid login link. Please request a new one.')}`);
}
