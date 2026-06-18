import { describe, it, expect } from 'vitest';
import { isInAppBrowser, inAppBrowserHint } from '@/lib/in-app-browser';

describe('in-app-browser', () => {
  it('detects WeChat in-app browser', () => {
    expect(isInAppBrowser('Mozilla/5.0 MicroMessenger/8.0')).toBe(true);
  });

  it('detects Instagram in-app browser', () => {
    expect(isInAppBrowser('Mozilla/5.0 Instagram 123.0')).toBe(true);
  });

  it('does not flag normal mobile Safari', () => {
    expect(
      isInAppBrowser(
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Version/17.0 Mobile/15E148 Safari/604.1'
      )
    ).toBe(false);
  });

  it('returns a helpful hint string', () => {
    expect(inAppBrowserHint()).toContain('Safari');
  });
});
