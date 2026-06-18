import { describe, it, expect } from 'vitest';
import {
  checkoutErrorMessage,
  PAYMENT_CONFIRM_MAX_ATTEMPTS,
  PAYMENT_CONFIRM_POLL_MS,
} from '@/lib/payment-confirmation';

describe('payment-confirmation', () => {
  it('polls for up to 3 minutes by default', () => {
    expect(PAYMENT_CONFIRM_POLL_MS).toBe(2000);
    expect(PAYMENT_CONFIRM_MAX_ATTEMPTS * PAYMENT_CONFIRM_POLL_MS).toBe(180_000);
  });

  it('maps invalid_tier to friendly copy', () => {
    expect(checkoutErrorMessage('invalid_tier')).toContain('invalid');
  });

  it('falls back for unknown reasons', () => {
    expect(checkoutErrorMessage('custom_error')).toBe('custom_error');
    expect(checkoutErrorMessage(null)).toContain('could not start payment');
  });
});
