/**
 * Shared pricing constants for SnapProHead.
 * Simplified: single $29 per-pack purchase, no credits.
 */
export const PRICING = {
  single: { price: 29 },
  // Legacy pricing (used by creem webhook/checkout — keep for compatibility)
  starter: { price: 29, credits: 1, headshots: 40, styles: 6 },
  pro: { price: 29, credits: 1, headshots: 40, styles: 6 },
  executive: { price: 29, credits: 1, headshots: 40, styles: 6 },
} as const;

export const PRODUCT_IDS = {
  single: 'prod_6F4zKTNhL3V7vWPUhnjZDZ',
  starter: 'prod_6F4zKTNhL3V7vWPUhnjZDZ',
  pro: 'prod_6F4zKTNhL3V7vWPUhnjZDZ',
  executive: 'prod_6F4zKTNhL3V7vWPUhnjZDZ',
} as const;

/** Map CREEM product IDs to credit counts (kept for webhook compatibility) */
export const CREDITS_PER_PRODUCT: Record<string, number> = {
  [PRODUCT_IDS.starter]: 1,
  [PRODUCT_IDS.pro]: 1,
  [PRODUCT_IDS.executive]: 1,
};
