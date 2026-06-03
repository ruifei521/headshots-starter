/**
 * Full-page navigation that must not be preceded by React setState in the same flow.
 * Client-side routing (router.push) or setState + location.assign races React DOM
 * teardown and triggers "removeChild: node is not a child" on production.
 */
export function hardNavigate(url: string): void {
  window.location.assign(url);
}
