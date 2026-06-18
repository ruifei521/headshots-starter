// ============================================
// __tests__/lib/tiers.test.ts
// 测试 lib/tiers.ts — 三档定价核心逻辑
// ============================================

import { describe, it, expect } from 'vitest';
import {
  type Tier,
  type TierInfo,
  TIERS,
  CREEM_PRODUCT_IDS,
  PRODUCT_ID_TO_TIER,
  getTrainingConfig,
  isTier,
  getTierInfo,
  getCreemProductId,
  tierFromProductId,
  parseCheckoutTier,
  maxTier,
  formatOutfitBackgroundFeature,
} from '@/lib/tiers';

// ============================================
// 1. Tier 类型 + TIERS 常量
// ============================================
describe('TIERS constants', () => {
  it('should have exactly 3 tiers', () => {
    const keys = Object.keys(TIERS);
    expect(keys).toHaveLength(3);
    expect(keys).toContain('starter');
    expect(keys).toContain('professional');
    expect(keys).toContain('executive');
  });

  it('starter should have correct values', () => {
    const s = TIERS.starter;
    expect(s.tier).toBe('starter');
    expect(s.name).toBe('Basic');
    expect(s.price).toBe(29);
    expect(s.originalPrice).toBe(37);
    expect(s.priceLabel).toBe('$29');
    expect(s.imageCount).toBe(45);
    expect(s.marketingImageCount).toBe(40);
    expect(s.outfitStyleCount).toBe(10);
    expect(s.backgroundCount).toBe(10);
    expect(s.modelBranch).toBe('flux1');
    expect(s.resolution).toBe('1024×1024');
    expect(s.estimatedTime).toBe('~25 min');
    expect(s.badge).toBeUndefined();
    expect(s.features.length).toBeGreaterThanOrEqual(4);
  });

  it('professional should have correct values', () => {
    const p = TIERS.professional;
    expect(p.tier).toBe('professional');
    expect(p.name).toBe('Professional');
    expect(p.price).toBe(39);
    expect(p.originalPrice).toBe(49);
    expect(p.priceLabel).toBe('$39');
    expect(p.imageCount).toBe(66);
    expect(p.marketingImageCount).toBe(60);
    expect(p.outfitStyleCount).toBe(20);
    expect(p.backgroundCount).toBe(20);
    expect(p.modelBranch).toBe('flux1');
    expect(p.resolution).toBe('1024×1024');
    expect(p.estimatedTime).toBe('~25 min');
    expect(p.badge).toBe('Most Popular');
    expect(p.features.length).toBeGreaterThanOrEqual(5);
  });

  it('executive should have correct values', () => {
    const e = TIERS.executive;
    expect(e.tier).toBe('executive');
    expect(e.name).toBe('Executive');
    expect(e.price).toBe(59);
    expect(e.originalPrice).toBe(74);
    expect(e.priceLabel).toBe('$59');
    expect(e.imageCount).toBe(108);
    expect(e.marketingImageCount).toBe(100);
    expect(e.outfitStyleCount).toBe(30);
    expect(e.backgroundCount).toBe(30);
    expect(e.modelBranch).toBe('flux1');
    expect(e.resolution).toBe('1024×1024');
    expect(e.estimatedTime).toBe('~25 min');
    expect(e.badge).toBe('Best Value');
    expect(e.features.length).toBeGreaterThanOrEqual(5);
  });

  it('marketing image counts should be in ascending order', () => {
    expect(TIERS.starter.marketingImageCount).toBeLessThan(TIERS.professional.marketingImageCount);
    expect(TIERS.professional.marketingImageCount).toBeLessThan(TIERS.executive.marketingImageCount);
  });

  it('actual image counts should exceed marketing counts (customer surprise)', () => {
    expect(TIERS.starter.imageCount).toBeGreaterThan(TIERS.starter.marketingImageCount);
    expect(TIERS.professional.imageCount).toBeGreaterThan(TIERS.professional.marketingImageCount);
    expect(TIERS.executive.imageCount).toBeGreaterThan(TIERS.executive.marketingImageCount);
  });

  it('image counts should be in ascending order', () => {
    expect(TIERS.starter.imageCount).toBeLessThan(TIERS.professional.imageCount);
    expect(TIERS.professional.imageCount).toBeLessThan(TIERS.executive.imageCount);
  });

  it('prices should be in ascending order', () => {
    expect(TIERS.starter.price).toBeLessThan(TIERS.professional.price);
    expect(TIERS.professional.price).toBeLessThan(TIERS.executive.price);
  });

  it('formatOutfitBackgroundFeature should describe outfit and background sets', () => {
    expect(formatOutfitBackgroundFeature(10, 10)).toBe('10 outfit & background sets');
    expect(formatOutfitBackgroundFeature(30, 30)).toBe('30 outfit & background sets');
    expect(formatOutfitBackgroundFeature(10, 8)).toBe('10 outfit styles & 8 backgrounds');
  });
});

// ============================================
// 2. Creem Product ID 映射
// ============================================
describe('CREEM_PRODUCT_IDS', () => {
  it('should map all 3 tiers to product IDs', () => {
    expect(CREEM_PRODUCT_IDS.starter).toBe('prod_fWHFyTDAhVb1xqwS71esu');
    expect(CREEM_PRODUCT_IDS.professional).toBe('prod_453s1kOCIVZECDNqx9z1o3');
    expect(CREEM_PRODUCT_IDS.executive).toBe('prod_4Bcd1ZArXQXbWl7GWkxzUe');
  });

  it('all product IDs should be non-empty strings', () => {
    for (const [tier, productId] of Object.entries(CREEM_PRODUCT_IDS)) {
      expect(productId).toBeTruthy();
      expect(typeof productId).toBe('string');
      expect(productId).toMatch(/^prod_/);
    }
  });

  it('all product IDs should be unique', () => {
    const ids = Object.values(CREEM_PRODUCT_IDS);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });
});

// ============================================
// 3. PRODUCT_ID_TO_TIER 反向映射
// ============================================
describe('PRODUCT_ID_TO_TIER', () => {
  it('should map new product IDs correctly', () => {
    expect(PRODUCT_ID_TO_TIER['prod_fWHFyTDAhVb1xqwS71esu']).toBe('starter');
    expect(PRODUCT_ID_TO_TIER['prod_453s1kOCIVZECDNqx9z1o3']).toBe('professional');
    expect(PRODUCT_ID_TO_TIER['prod_4Bcd1ZArXQXbWl7GWkxzUe']).toBe('executive');
  });

  it('all entries should be valid Tier values', () => {
    for (const [productId, tier] of Object.entries(PRODUCT_ID_TO_TIER)) {
      expect(['starter', 'professional', 'executive']).toContain(tier);
    }
  });

  it('should map exactly the three current Creem product IDs', () => {
    expect(Object.keys(PRODUCT_ID_TO_TIER)).toHaveLength(3);
  });
});

// ============================================
// 4. getTrainingConfig()
// ============================================
describe('getTrainingConfig', () => {
  it('starter: flux branch', () => {
    const config = getTrainingConfig('starter');
    expect(config.branch).toBe('flux1');
  });

  it('professional: flux branch', () => {
    const config = getTrainingConfig('professional');
    expect(config.branch).toBe('flux1');
  });

  it('executive: flux branch', () => {
    const config = getTrainingConfig('executive');
    expect(config.branch).toBe('flux1');
  });

  it('branch should match TIERS.modelBranch', () => {
    const tiers: Tier[] = ['starter', 'professional', 'executive'];
    for (const tier of tiers) {
      const config = getTrainingConfig(tier);
      expect(config.branch).toBe(TIERS[tier].modelBranch);
    }
  });
});

// ============================================
// 5. isTier() 类型守卫
// ============================================
describe('isTier', () => {
  it('should return true for valid tier strings', () => {
    expect(isTier('starter')).toBe(true);
    expect(isTier('professional')).toBe(true);
    expect(isTier('executive')).toBe(true);
  });

  it('should return false for invalid strings', () => {
    expect(isTier('')).toBe(false);
    expect(isTier('basic')).toBe(false);
    expect(isTier('premium')).toBe(false);
    expect(isTier('STARTER')).toBe(false);
    expect(isTier('Starter')).toBe(false);
    expect(isTier('starter ')).toBe(false);
  });

  it('should return false for non-string values (runtime behavior)', () => {
    // TypeScript would catch these at compile time, but runtime guards matter
    expect(isTier(null as any)).toBe(false);
    expect(isTier(undefined as any)).toBe(false);
    expect(isTier(123 as any)).toBe(false);
    expect(isTier({} as any)).toBe(false);
  });
});

// ============================================
// 6. getTierInfo() 安全获取
// ============================================
describe('getTierInfo', () => {
  it('should return correct TierInfo for valid tiers', () => {
    expect(getTierInfo('starter').tier).toBe('starter');
    expect(getTierInfo('professional').tier).toBe('professional');
    expect(getTierInfo('executive').tier).toBe('executive');
  });

  it('should fallback to starter for unknown tier strings', () => {
    const fallback = getTierInfo('unknown');
    expect(fallback.tier).toBe('starter');
    expect(fallback.price).toBe(29);
  });

  it('should fallback to starter for empty string', () => {
    const fallback = getTierInfo('');
    expect(fallback.tier).toBe('starter');
  });

  it('should return full TierInfo object with all required fields', () => {
    const info = getTierInfo('professional');
    expect(info.tier).toBeDefined();
    expect(info.name).toBeDefined();
    expect(info.price).toBeDefined();
    expect(info.priceLabel).toBeDefined();
    expect(info.imageCount).toBeDefined();
    expect(info.modelBranch).toBeDefined();
    expect(info.resolution).toBeDefined();
    expect(info.estimatedTime).toBeDefined();
    expect(info.features).toBeDefined();
  });
});

// ============================================
// 7. getCreemProductId()
// ============================================
describe('getCreemProductId', () => {
  it('should return correct product ID for each tier', () => {
    expect(getCreemProductId('starter')).toBe('prod_fWHFyTDAhVb1xqwS71esu');
    expect(getCreemProductId('professional')).toBe('prod_453s1kOCIVZECDNqx9z1o3');
    expect(getCreemProductId('executive')).toBe('prod_4Bcd1ZArXQXbWl7GWkxzUe');
  });
});

// ============================================
// 8. tierFromProductId()
// ============================================
describe('tierFromProductId', () => {
  it('should map new product IDs to correct tiers', () => {
    expect(tierFromProductId('prod_fWHFyTDAhVb1xqwS71esu')).toBe('starter');
    expect(tierFromProductId('prod_453s1kOCIVZECDNqx9z1o3')).toBe('professional');
    expect(tierFromProductId('prod_4Bcd1ZArXQXbWl7GWkxzUe')).toBe('executive');
  });

  it('should return null for unknown product IDs', () => {
    expect(tierFromProductId('prod_unknown')).toBeNull();
    expect(tierFromProductId('')).toBeNull();
    expect(tierFromProductId('some_random_id')).toBeNull();
  });
});

describe('parseCheckoutTier', () => {
  it('accepts valid tier strings', () => {
    expect(parseCheckoutTier('starter')).toBe('starter');
    expect(parseCheckoutTier('professional')).toBe('professional');
    expect(parseCheckoutTier('executive')).toBe('executive');
  });

  it('rejects invalid or missing values', () => {
    expect(parseCheckoutTier(null)).toBeNull();
    expect(parseCheckoutTier(undefined)).toBeNull();
    expect(parseCheckoutTier('')).toBeNull();
    expect(parseCheckoutTier('premium')).toBeNull();
    expect(parseCheckoutTier('STARTER')).toBeNull();
  });
});

// ============================================
// 9. maxTier() — 升级不降级
// ============================================
describe('maxTier', () => {
  it('should return the higher tier when a < b', () => {
    expect(maxTier('starter', 'professional')).toBe('professional');
    expect(maxTier('starter', 'executive')).toBe('executive');
    expect(maxTier('professional', 'executive')).toBe('executive');
  });

  it('should return the higher tier when a > b (commutative)', () => {
    expect(maxTier('professional', 'starter')).toBe('professional');
    expect(maxTier('executive', 'starter')).toBe('executive');
    expect(maxTier('executive', 'professional')).toBe('executive');
  });

  it('should return same tier when both equal', () => {
    expect(maxTier('starter', 'starter')).toBe('starter');
    expect(maxTier('professional', 'professional')).toBe('professional');
    expect(maxTier('executive', 'executive')).toBe('executive');
  });

  it('should fallback to valid tier for unknown inputs', () => {
    // Unknown string compared to valid tier → valid tier wins
    expect(maxTier('unknown', 'starter')).toBe('starter');
    expect(maxTier('unknown', 'executive')).toBe('executive');
  });

  it('should fallback to starter when both are unknown', () => {
    expect(maxTier('unknown_a', 'unknown_b')).toBe('starter');
  });

  it('should never downgrade — existing executive stays executive', () => {
    // Simulating: existing user has executive, new purchase is starter
    expect(maxTier('executive', 'starter')).toBe('executive');
    // Simulating: existing user has professional, new purchase is starter
    expect(maxTier('professional', 'starter')).toBe('professional');
  });
});

// ============================================
// 10. 端到端场景：完整购买流程模拟
// ============================================
describe('End-to-end scenario: Purchase → Webhook → Training', () => {
  it('starter purchase flow', () => {
    // Step 1: User selects Starter → checkout gets product ID
    const productId = getCreemProductId('starter');
    expect(productId).toBe('prod_fWHFyTDAhVb1xqwS71esu');

    // Step 2: Webhook receives product_id → maps to tier
    const tier = tierFromProductId(productId);
    expect(tier).toBe('starter');

    // Step 3: Train model uses tier to get config
    const config = getTrainingConfig(tier);
    expect(config.branch).toBe('flux1');
  });

  it('professional purchase flow', () => {
    const productId = getCreemProductId('professional');
    expect(productId).toBe('prod_453s1kOCIVZECDNqx9z1o3');

    const tier = tierFromProductId(productId);
    expect(tier).toBe('professional');

    const config = getTrainingConfig(tier);
    expect(config.branch).toBe('flux1');
  });

  it('executive purchase flow', () => {
    const productId = getCreemProductId('executive');
    expect(productId).toBe('prod_4Bcd1ZArXQXbWl7GWkxzUe');

    const tier = tierFromProductId(productId);
    expect(tier).toBe('executive');

    const config = getTrainingConfig(tier);
    expect(config.branch).toBe('flux1');
  });

  it('upgrade scenario: starter → executive', () => {
    // Existing user has 'starter' tier (e.g., from old purchase)
    const existingTier = 'starter';

    // User buys Executive
    const newProductId = getCreemProductId('executive');
    const newTier = tierFromProductId(newProductId);
    expect(newTier).toBe('executive');

    // Webhook uses maxTier to upgrade without downgrade
    const resolvedTier = maxTier(existingTier, newTier);
    expect(resolvedTier).toBe('executive');

    // Training uses the upgraded tier
    const config = getTrainingConfig(resolvedTier);
    expect(config.branch).toBe('flux1');
  });

  it('no-downgrade scenario: executive user buys starter again', () => {
    // Existing user has 'executive' tier
    const existingTier = 'executive';

    // User accidentally buys Starter
    const newProductId = getCreemProductId('starter');
    const newTier = tierFromProductId(newProductId);
    expect(newTier).toBe('starter');

    // maxTier ensures no downgrade
    const resolvedTier = maxTier(existingTier, newTier);
    expect(resolvedTier).toBe('executive');

    // Training still uses executive config
    const config = getTrainingConfig(resolvedTier);
    expect(config.branch).toBe('flux1');
  });
});
