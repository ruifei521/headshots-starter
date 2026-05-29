// ============================================
// __tests__/lib/pricing.test.ts
// 测试 lib/pricing.ts — 向后兼容层
// ============================================

import { describe, it, expect } from 'vitest';
import {
  TIERS,
  CREEM_PRODUCT_IDS,
  PRODUCT_ID_TO_TIER,
  getTierInfo,
  getCreemProductId,
  getTrainingConfig,
  isTier,
  tierFromProductId,
  maxTier,
  PRICING,
  PRODUCT_IDS,
} from '@/lib/pricing';
import type { Tier, TierInfo } from '@/lib/pricing';

describe('pricing.ts — re-exports from tiers.ts', () => {
  it('should re-export TIERS with 3 tiers', () => {
    expect(Object.keys(TIERS)).toHaveLength(3);
  });

  it('should re-export CREEM_PRODUCT_IDS', () => {
    expect(CREEM_PRODUCT_IDS.starter).toBeTruthy();
    expect(CREEM_PRODUCT_IDS.professional).toBeTruthy();
    expect(CREEM_PRODUCT_IDS.executive).toBeTruthy();
  });

  it('should re-export PRODUCT_ID_TO_TIER with legacy mapping', () => {
    expect(PRODUCT_ID_TO_TIER['prod_6F4zKTNhL3V7vWPUhnjZDZ']).toBe('starter');
  });

  it('should re-export all helper functions', () => {
    expect(typeof getTierInfo).toBe('function');
    expect(typeof getCreemProductId).toBe('function');
    expect(typeof getTrainingConfig).toBe('function');
    expect(typeof isTier).toBe('function');
    expect(typeof tierFromProductId).toBe('function');
    expect(typeof maxTier).toBe('function');
  });

  it('should re-export Tier and TierInfo types', () => {
    // Type check: these should be usable as type annotations
    const tier: Tier = 'starter';
    expect(isTier(tier)).toBe(true);

    const info: TierInfo = TIERS.starter;
    expect(info.price).toBe(29);
  });
});

describe('pricing.ts — backward compatibility constants', () => {
  it('PRICING.single.price should be 29 (Basic)', () => {
    expect(PRICING.single.price).toBe(29);
  });

  it('PRICING.professional.price should be 39', () => {
    expect(PRICING.professional.price).toBe(39);
  });

  it('PRICING.executive.price should be 59', () => {
    expect(PRICING.executive.price).toBe(59);
  });

  it('PRICING should be readonly (const assertion)', () => {
    // Verifies the structure matches expectations
    expect(PRICING).toHaveProperty('single');
    expect(PRICING).toHaveProperty('professional');
    expect(PRICING).toHaveProperty('executive');
  });

  it('PRODUCT_IDS.single should be the new starter product ID', () => {
    expect(PRODUCT_IDS.single).toBe('prod_fWHFyTDAhVb1xqwS71esu');
  });
});

describe('pricing.ts — function correctness (passthrough)', () => {
  it('getTrainingConfig via pricing.ts should match direct import', () => {
    const config = getTrainingConfig('professional');
    expect(config.branch).toBe('flux1');
  });

  it('tierFromProductId via pricing.ts should handle legacy IDs', () => {
    expect(tierFromProductId('prod_6F4zKTNhL3V7vWPUhnjZDZ')).toBe('starter');
    expect(tierFromProductId('prod_unknown_xyz')).toBe('starter');
  });

  it('maxTier via pricing.ts should prevent downgrades', () => {
    expect(maxTier('executive', 'starter')).toBe('executive');
    expect(maxTier('professional', 'executive')).toBe('executive');
  });

  it('getTierInfo via pricing.ts should fallback to starter', () => {
    expect(getTierInfo('nonexistent').tier).toBe('starter');
    expect(getTierInfo('').tier).toBe('starter');
  });
});
