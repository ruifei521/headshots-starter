/** Shared polling config for post-checkout credit confirmation. */
export const PAYMENT_CONFIRM_POLL_MS = 2000;
/** 3 minutes — enough for slow mobile networks / webhook lag. */
export const PAYMENT_CONFIRM_MAX_ATTEMPTS = 90;

export const CHECKOUT_ERROR_MESSAGES: Record<string, string> = {
  invalid_tier: 'That plan link is invalid. Please choose a plan again on the pricing page.',
  invalid_product:
    'We could not match your payment to a plan. Contact support if you were charged.',
  missing_request_id:
    'Payment received but could not be linked to your account. Contact support.',
  Payment_is_not_configured: 'Checkout is temporarily unavailable. Please try again later.',
  'CREEM API error': 'Payment provider error. Please try again in a moment.',
};

export function checkoutErrorMessage(reason: string | null | undefined): string {
  if (!reason) {
    return 'We could not start payment. Please try again or email contact@snapprohead.com.';
  }
  return CHECKOUT_ERROR_MESSAGES[reason] ?? reason;
}
