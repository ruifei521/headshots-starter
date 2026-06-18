/** True when paid training should require credits (flags or API keys present). */
export function isPaymentEnabled(): boolean {
  return (
    process.env.NEXT_PUBLIC_STRIPE_IS_ENABLED === 'true' ||
    process.env.NEXT_PUBLIC_CREEM_IS_ENABLED === 'true' ||
    !!process.env.CREEM_API_KEY?.trim() ||
    !!process.env.STRIPE_SECRET_KEY?.trim()
  );
}
