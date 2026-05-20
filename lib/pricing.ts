/**
 * Shared pricing constants for SnapProHead.
 * Update prices here — they propagate to all components.
 */
export const PRICING = {
  starter: { price: 29, credits: 1, headshots: 40, styles: 5 },
  pro: { price: 49, credits: 3, headshots: 100, styles: 10 },
  executive: { price: 89, credits: 5, headshots: 200, styles: 20 },
} as const;

export const PRODUCT_IDS = {
  starter: 'prod_31zqeJaVi4nCiCLGPz0F2K',
  pro: 'prod_198ewWuQouDaQfEOT6kTvj',
  executive: 'prod_1pZIlgHsKVk5YOK1QupnPP',
} as const;

/** Map CREEM product IDs to credit counts */
export const CREDITS_PER_PRODUCT: Record<string, number> = {
  [PRODUCT_IDS.starter]: PRICING.starter.credits,
  [PRODUCT_IDS.pro]: PRICING.pro.credits,
  [PRODUCT_IDS.executive]: PRICING.executive.credits,
};
