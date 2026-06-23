import { NextRequest } from "next/server";

/**
 * 根据请求头解析基础 URL，用于构建回调 URL。
 * 优先使用 origin 头，其次使用 host 头，最后使用默认值。
 * 对于 localhost 环境使用 http，否则使用 https。
 */
export function resolveBaseUrl(req: NextRequest): string {
  const origin = req.headers.get("origin");
  if (origin?.startsWith("http")) return origin;

  const host = req.headers.get("host");
  if (host) {
    const proto = host.includes("localhost") ? "http" : "https";
    return `${proto}://${host}`;
  }

  return "https://snapprohead.com";
}
import { NextRequest } from "next/server";

/**
 * 根据请求头解析基础 URL，用于构建回调 URL。
 * 优先使用 origin 头，其次使用 host 头，最后使用默认值。
 * 对于 localhost 环境使用 http，否则使用 https。
 */
export function resolveBaseUrl(req: NextRequest): string {
  const origin = req.headers.get("origin");
  if (origin?.startsWith("http")) return origin;

  const host = req.headers.get("host");
  if (host) {
    const proto = host.includes("localhost") ? "http" : "https";
    return `${proto}://${host}`;
  }

  return "https://snapprohead.com";
}
