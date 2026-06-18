import { describe, it, expect } from 'vitest';
import { isPublicMarketingPath } from '@/lib/public-paths';

describe('public-paths', () => {
  it('treats marketing pages as public', () => {
    expect(isPublicMarketingPath('/')).toBe(true);
    expect(isPublicMarketingPath('/pricing')).toBe(true);
    expect(isPublicMarketingPath('/headshots/lawyer')).toBe(true);
    expect(isPublicMarketingPath('/blog/foo')).toBe(true);
  });

  it('treats login subroutes as public', () => {
    expect(isPublicMarketingPath('/login/failed')).toBe(true);
  });

  it('treats dashboard routes as non-public', () => {
    expect(isPublicMarketingPath('/overview')).toBe(false);
    expect(isPublicMarketingPath('/overview/models/1')).toBe(false);
  });
});
