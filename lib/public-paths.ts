/** Marketing/legal routes — skip Supabase getUser() in navbar (use getSession only). */
export function isPublicMarketingPath(pathname: string): boolean {
  if (pathname.startsWith("/overview")) return false;
  if (pathname.startsWith("/ops/")) return false;
  if (pathname.startsWith("/api/")) return false;

  const publicExact = new Set([
    "/",
    "/login",
    "/signup",
    "/pricing",
    "/examples",
    "/about",
    "/howto",
    "/privacy",
    "/terms",
    "/refund",
    "/headshots",
  ]);

  if (publicExact.has(pathname)) return true;
  if (pathname.startsWith("/blog/") || pathname === "/blog") return true;
  if (pathname.startsWith("/headshots/")) return true;
  if (pathname.startsWith("/login/")) return true;

  return false;
}
