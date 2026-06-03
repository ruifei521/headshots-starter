/**
 * Full-page navigation that must not be preceded by React setState in the same flow.
 * Uses replace() so the error page is not kept in history after auth/checkout redirects.
 */
export function hardNavigate(url: string): void {
  window.location.replace(url);
}
