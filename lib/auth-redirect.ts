/** Only allow same-site relative paths (open-redirect safe). */
export function safeAuthRedirectPath(
  value: string | null | undefined,
  fallback = '/overview'
): string {
  if (!value) return fallback;
  if (value.startsWith('/') && !value.startsWith('//')) return value;
  return fallback;
}

export {
  normalizePostLoginRedirect,
  normalizePostLoginRedirect as resolvePostLoginDestination,
} from './checkout-url';

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  missing_token:
    'This sign-in link is invalid or incomplete. Enter your email to get a new code.',
  verification_failed:
    'This link has expired. Enter your email again to get a new code.',
  server_error: 'Something went wrong on our side. Please try again in a moment.',
};

const GENERIC_SIGN_IN_FAILED = 'Sign-in failed. Please try again.';

function isSafePassThroughMessage(message: string): boolean {
  if (message.length > 280) return false;
  if (/[<>\n\r]/.test(message)) return false;
  if (/javascript:/i.test(message)) return false;
  return true;
}

/** Map legacy magic-link / confirm error codes to user-friendly copy. */
export function authErrorMessage(code: string | null | undefined): string {
  if (!code) return GENERIC_SIGN_IN_FAILED;

  const normalized = code.trim();
  if (AUTH_ERROR_MESSAGES[normalized]) {
    return AUTH_ERROR_MESSAGES[normalized];
  }

  // OAuth / callback routes already redirect with full user-facing copy.
  if (
    (normalized.includes(' ') || normalized.includes('.')) &&
    isSafePassThroughMessage(normalized)
  ) {
    return normalized;
  }

  return GENERIC_SIGN_IN_FAILED;
}

/** Short toast title for login error banners. */
export function authErrorTitle(code: string | null | undefined): string {
  const message = authErrorMessage(code);
  if (message === GENERIC_SIGN_IN_FAILED) return 'Sign-in failed';
  if (/cancel/i.test(message)) return 'Sign-in cancelled';
  if (/expired/i.test(message)) return 'Link expired';
  if (/invalid/i.test(message)) return 'Invalid sign-in link';
  return "Couldn't sign in";
}
