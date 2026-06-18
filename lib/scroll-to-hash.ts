/** Smooth-scroll to an in-page anchor; retries while dynamic sections mount. */
export function scrollToHash(hash?: string): void {
  if (typeof window === 'undefined') return;

  const id = (hash ?? window.location.hash).replace(/^#/, '');
  if (!id) return;

  const tryScroll = (attempt: number) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    if (attempt < 12) {
      window.setTimeout(() => tryScroll(attempt + 1), 150);
    }
  };

  tryScroll(0);
}
