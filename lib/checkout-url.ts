const DEFAULT_PACK = "corporate-headshots";

/** Server checkout entry — explicit user action only (signed-in). */
export function checkoutGoPath(tier: string, pack = DEFAULT_PACK): string {
  const params = new URLSearchParams({ tier, pack });
  return `/api/creem/go?${params.toString()}`;
}

/** Login first, then resume checkout on overview (not straight to payment). */
export function loginForCheckoutPath(tier: string, pack = DEFAULT_PACK): string {
  const params = new URLSearchParams({
    intent: "checkout",
    tier,
    pack,
  });
  return `/login?${params.toString()}`;
}

/** Optional overview resume banner (manual / legacy links). */
export function overviewCheckoutResumePath(tier: string, pack = DEFAULT_PACK): string {
  const params = new URLSearchParams({ checkout: tier, pack });
  return `/overview?${params.toString()}`;
}

export function parseCheckoutGoHref(href: string): { tier: string; pack: string } | null {
  try {
    const url = new URL(href, "https://snapprohead.com");
    const tier = url.searchParams.get("tier");
    if (!tier) return null;
    return {
      tier,
      pack: url.searchParams.get("pack") || DEFAULT_PACK,
    };
  } catch {
    return null;
  }
}

export function isCheckoutIntent(
  params: Record<string, string | string[] | undefined> | undefined
): boolean {
  return params?.intent === "checkout" && typeof params?.tier === "string";
}

/** Post-login: go straight to Creem checkout (one tap after sign-in). */
export function postLoginPathFromSearchParams(
  params: Record<string, string | string[] | undefined> | undefined
): string | null {
  if (!isCheckoutIntent(params)) return null;
  const tier = params!.tier as string;
  const pack =
    typeof params!.pack === "string" ? params!.pack : DEFAULT_PACK;
  return checkoutGoPath(tier, pack);
}

/** Normalize post-login paths; keep Creem checkout URLs as-is. */
export function normalizePostLoginRedirect(path: string | null | undefined): string {
  if (!path) return "/overview";
  if (parseCheckoutGoHref(path)) return path;
  if (path.startsWith("/") && !path.startsWith("//")) return path;
  return "/overview";
}

/** @deprecated use postLoginPathFromSearchParams */
export function checkoutPathFromSearchParams(
  params: Record<string, string | string[] | undefined> | undefined
): string | null {
  return postLoginPathFromSearchParams(params);
}

export { DEFAULT_PACK };
