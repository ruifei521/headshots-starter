/** Detect embedded in-app browsers that often break Google OAuth. */
export function isInAppBrowser(userAgent?: string): boolean {
  const ua = userAgent ?? (typeof navigator !== 'undefined' ? navigator.userAgent : '');
  if (!ua) return false;
  return /MicroMessenger|WeChat|Instagram|FBAN|FBAV|FB_IAB|Line\/|Twitter|LinkedInApp|Snapchat/i.test(
    ua
  );
}

export function inAppBrowserHint(): string {
  return 'Google sign-in does not work inside WeChat, Instagram, or similar apps. Use the ··· menu and choose “Open in Safari” or “Open in Chrome”, then try again.';
}
