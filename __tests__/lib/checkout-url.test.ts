import { describe, it, expect } from 'vitest';
import {
  checkoutGoPath,
  loginForCheckoutPath,
  parseCheckoutGoHref,
  postLoginPathFromSearchParams,
  normalizePostLoginRedirect,
} from '@/lib/checkout-url';

describe('checkout-url', () => {
  it('builds checkout and login paths', () => {
    expect(checkoutGoPath('professional')).toBe(
      '/api/creem/go?tier=professional&pack=corporate-headshots'
    );
    expect(loginForCheckoutPath('starter')).toBe(
      '/login?intent=checkout&tier=starter&pack=corporate-headshots'
    );
  });

  it('post-login goes straight to Creem checkout', () => {
    expect(
      postLoginPathFromSearchParams({
        intent: 'checkout',
        tier: 'professional',
      })
    ).toBe('/api/creem/go?tier=professional&pack=corporate-headshots');
  });

  it('keeps creem redirect as-is when normalizing', () => {
    expect(normalizePostLoginRedirect('/api/creem/go?tier=executive&pack=foo')).toBe(
      '/api/creem/go?tier=executive&pack=foo'
    );
  });

  it('parses checkout href', () => {
    expect(parseCheckoutGoHref('/api/creem/go?tier=executive&pack=foo')).toEqual({
      tier: 'executive',
      pack: 'foo',
    });
  });
});
