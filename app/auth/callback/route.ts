import { createServerClient, parseCookieHeader } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const requestUrl = new URL(req.url);
  const params = Object.fromEntries(requestUrl.searchParams.entries());
  
  // 详细日志
  console.log("========== AUTH CALLBACK ==========");
  console.log("Full URL:", req.url);
  console.log("All params:", JSON.stringify(params, null, 2));
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
      `${requestUrl.origin}/login?error=${encodeURIComponent(errorDescription || error)}`
    );
  }

  // 创建 Supabase 客户端的辅助函数
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
          setAll(cookiesToSet, headers) {
            cookiesToSet.forEach(({ name, value, options }) =>
              res.cookies.set(name, value, options ?? {})
            );
            if (headers) {
              Object.entries(headers).forEach(([key, value]) =>
                res.headers.set(key, value)
              );
            }
          },
        },
      }
    );
    return { supabase, res };
  };

  // 方法 1: PKCE 流程 - 使用 code 交换 session (新版 Supabase)
  if (code) {
    console.log("Flow: PKCE (code exchange)");
    const { supabase, res } = createSupabaseClient();
    
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    
    if (exchangeError) {
      console.error("PKCE exchange failed:", exchangeError.message);
      return NextResponse.redirect(
        `${requestUrl.origin}/login?error=${encodeURIComponent(exchangeError.message)}`
      );
    }
    
    console.log("PKCE success, user:", data.user?.email);
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
      console.error("verifyOtp failed:", verifyError.message);
      return NextResponse.redirect(
        `${requestUrl.origin}/login?error=${encodeURIComponent(verifyError.message)}`
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
        `${requestUrl.origin}/login?error=${encodeURIComponent(verifyError.message)}`
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
        `${requestUrl.origin}/login?error=${encodeURIComponent(verifyError.message)}`
      );
    }
    
    console.log("plain token verify success, user:", data.user?.email);
    return res;
  }

  // 没有任何参数
  console.log("ERROR: No auth parameters found!");
  console.log("This Magic Link URL format is not recognized.");
  console.log("Params received:", Object.keys(params));
  return NextResponse.redirect(`${requestUrl.origin}/login?error=Invalid+auth+link+format`);
}
