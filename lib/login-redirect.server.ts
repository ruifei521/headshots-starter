import { headers } from 'next/headers';
import { normalizePostLoginRedirect } from './checkout-url';

/** Build /login?redirect=… preserving the page the user came from. Server-only. */
export function loginRedirectPath(explicitReturnPath?: string): string {
  if (explicitReturnPath) {
    const safe = normalizePostLoginRedirect(explicitReturnPath);
    return `/login?redirect=${encodeURIComponent(safe)}`;
  }

  const h = headers();
  const pathname = h.get('x-pathname') || '/overview';
  const search = h.get('x-search') || '';
  const returnPath = normalizePostLoginRedirect(`${pathname}${search}`);
  return `/login?redirect=${encodeURIComponent(returnPath)}`;
}
