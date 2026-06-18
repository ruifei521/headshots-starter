import { describe, it, expect } from 'vitest';
import {
  REFUND_WINDOW_DAYS,
  REFUND_GUARANTEE_LABEL,
  PRICING_TRUST_LINE,
  TRUST_HERO_BADGE,
  META_SITE_DESCRIPTION,
  STARTER_PRICE_LINE,
  TIER_COUNTS_LINE,
  DELIVERY_FAQ_ANSWER,
  PROFESSION_PAGE_CTA,
} from '@/lib/refund-policy';
import { TIERS, ESTIMATED_DELIVERY_MINUTES } from '@/lib/tiers';

describe('refund-policy', () => {
  it('keeps 14-day guarantee on legal layer only', () => {
    expect(REFUND_WINDOW_DAYS).toBe(14);
    expect(REFUND_GUARANTEE_LABEL).toContain('14-day');
  });

  it('marketing layer does not mention refund or 14-day', () => {
    expect(TRUST_HERO_BADGE.toLowerCase()).not.toContain('refund');
    expect(TRUST_HERO_BADGE.toLowerCase()).not.toContain('14-day');
    expect(META_SITE_DESCRIPTION.toLowerCase()).not.toContain('refund');
    expect(META_SITE_DESCRIPTION.toLowerCase()).not.toContain('14-day');
  });

  it('pricing trust line is short without day count', () => {
    expect(PRICING_TRUST_LINE).toBe('Satisfaction guarantee');
    expect(PRICING_TRUST_LINE).not.toContain('14');
  });

  it('starter line matches Basic marketing count', () => {
    expect(STARTER_PRICE_LINE).toContain(String(TIERS.starter.price));
    expect(STARTER_PRICE_LINE).toContain(String(TIERS.starter.marketingImageCount));
    expect(STARTER_PRICE_LINE).not.toContain('100+');
  });

  it('tier counts line separates Basic from Executive', () => {
    expect(TIER_COUNTS_LINE).toContain(String(TIERS.starter.marketingImageCount));
    expect(TIER_COUNTS_LINE).toContain(String(TIERS.executive.marketingImageCount));
  });

  it('delivery time is unified at 25 minutes site-wide', () => {
    expect(ESTIMATED_DELIVERY_MINUTES).toBe(25);
    expect(PROFESSION_PAGE_CTA).toContain('25');
    expect(DELIVERY_FAQ_ANSWER).toContain('25 minutes');
    expect(TIERS.starter.estimatedTime).toBe('~25 min');
    expect(TIERS.professional.estimatedTime).toBe('~25 min');
    expect(TIERS.executive.estimatedTime).toBe('~25 min');
  });
});
