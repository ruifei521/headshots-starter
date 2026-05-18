import { createServerClient, parseCookieHeader, serializeCookieHeader } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const requestUrl = new URL(req.url);
  const params = Object.fromEntries(requestUrl.searchParams.entries());

  // 判断是否为 localhost 环境
  const isLocalhost = requestUrl.hostname === 'localhost' || requestUrl.hostname === '127.0.0.1';

  // 读取请求中的所有 cookie，用于诊断
  const requestCookies = parseCookieHeader(req.headers.get("Cookie") ?? "");
  const cookieNames = requestCookies.map(c => c.name);

  // 详细日志
  console.log("========== AUTH CALLBACK ==========");
  console.log("Full URL:", req.url);
  console.log("All params:", JSON.stringify(params, null, 2));
  console.log("Cookie names in request:", cookieNames);
  console.log("Is localhost:", isLocalhost);
  console.log("===================================");

  // 提取所有可能的参数
  const code = requestUrl.searchParams.get("code");
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const token = requestUrl.searchParams.get("token");
  const type = requestUrl.searchParams.get("type");
  const next = requestUrl.searchParams.get("next") || "/overview";
  const error = requestUrl.searchParams.get("error");
  const errorDescription = requestUrl.searchParams.get("error_description");
  const email = requestUrl.searchParams.get("email");

  // 如果 Supabase 直接返回错误
  if (error) {
    console.error("Supabase error:", error, errorDescription);
    return NextResponse.redirect(
      `${requestUrl.origin}/login?error=${encodeURIComponent('Login link expired or invalid. Please try again.')}`
    );
  }

  // 创建 Supabase 服务端客户端的辅助函数
  const createSupabaseClient = () => {
    const res = NextResponse.redirect(new URL(next, req.url));
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

  // 方法 1: PKCE 流程 - 使用 code 交换 session (新版 Supabase 默认)
  if (code) {
    console.log("Flow: PKCE (code exchange)");

    // 诊断：检查 code_verifier cookie 是否存在
    const hasCodeVerifier = cookieNames.some(name =>
      name.includes('code-verifier') || name.includes('code_verifier')
    );
    console.log("PKCE code_verifier cookie present:", hasCodeVerifier);
    if (!hasCodeVerifier) {
      console.warn("⚠️ code_verifier cookie NOT found! This will likely cause PKCE exchange to fail.");
      console.warn("Possible causes:");
      console.warn("  - Link opened in a different browser/in-app browser");
      console.warn("  - Browser cookies were cleared");
      console.warn("  - Incognito/private window");
      console.warn("  - Middleware cleared the cookie (should be fixed by skipping /auth/ in middleware)");
    }

    const { supabase, res } = createSupabaseClient();

    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error("PKCE exchange failed:", exchangeError.message);
      console.error("Error details:", JSON.stringify({
        message: exchangeError.message,
        status: exchangeError.status,
        name: exchangeError.name,
      }));

      // PKCE 失败的友好错误提示
      let userMessage = 'Login link expired or invalid. Please try again.';
      if (exchangeError.message.includes('code challenge') || exchangeError.message.includes('code verifier')) {
        userMessage = 'Your login session has expired. Please request a new magic link.';
        console.error("Root cause: PKCE code verifier cookie was lost or expired. This can happen if:");
        console.error("  - The link was opened in a different browser");
        console.error("  - Browser cookies were cleared between sending the link and clicking it");
        console.error("  - The link was opened in an incognito/private window");
        console.error("  - Cookie SameSite settings blocked the verifier cookie");
      }

      return NextResponse.redirect(
        `${requestUrl.origin}/login?error=${encodeURIComponent(userMessage)}`
      );
    }

    console.log("PKCE success! User:", data.user?.email);
    console.log("Session established, redirecting to:", next);

    // 确保所有 auth cookie 都被正确设置
    const setCookies = res.cookies.getAll();
    console.log("Cookies being set:", setCookies.map(c => c.name));

    return res;
  }

  // 方法 2: 带 email 的 token (新版 Magic Link)
  if (token && email) {
    console.log("Flow: verifyOtp with email + token");
    const { supabase, res } = createSupabaseClient();

    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      email: email,
      token: token,
      type: "magiclink",
    });

    if (verifyError) {
      console.error("verifyOtp (email+token) failed:", verifyError.message);
      return NextResponse.redirect(
        `${requestUrl.origin}/login?error=${encodeURIComponent('Login link expired or invalid. Please try again.')}`
      );
    }

    console.log("verifyOtp success, user:", data.user?.email);
    return res;
  }

  // 方法 3: token_hash (旧版 Magic Link)
  if (tokenHash || (token && type === "magiclink")) {
    console.log("Flow: verifyOtp with token_hash");
    const { supabase, res } = createSupabaseClient();

    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      token_hash: (tokenHash || token) as string,
      type: "magiclink",
    });

    if (verifyError) {
      console.error("token_hash verify failed:", verifyError.message);
      return NextResponse.redirect(
        `${requestUrl.origin}/login?error=${encodeURIComponent('Login link expired or invalid. Please try again.')}`
      );
    }

    console.log("token_hash verify success, user:", data.user?.email);
    return res;
  }

  // 方法 4: 纯 token (不带 email)
  if (token) {
    console.log("Flow: verifyOtp plain token (no email)");
    const { supabase, res } = createSupabaseClient();

    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: "magiclink",
    });

    if (verifyError) {
      console.error("plain token verify failed:", verifyError.message);
      return NextResponse.redirect(
        `${requestUrl.origin}/login?error=${encodeURIComponent('Login link expired or invalid. Please try again.')}`
      );
    }

    console.log("plain token verify success, user:", data.user?.email);
    return res;
  }

  // 没有任何参数
  console.log("ERROR: No auth parameters found!");
  console.log("This Magic Link URL format is not recognized.");
  console.log("Params received:", Object.keys(params));
  return NextResponse.redirect(`${requestUrl.origin}/login?error=${encodeURIComponent('Invalid login link. Please request a new one.')}`);
}
