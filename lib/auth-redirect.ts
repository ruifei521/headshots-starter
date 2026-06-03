/** Only allow same-site relative paths after login (open-redirect safe). */
export function safeAuthRedirectPath(
  value: string | null | undefined,
  fallback = '/overview'
): string {
  if (!value) return fallback;
  if (value.startsWith('/') && !value.startsWith('//')) return value;
  return fallback;
}
