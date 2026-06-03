import { getCreemProductId, isTier, type Tier } from '@/lib/tiers';
import { logger } from '@/lib/logger';

const CREEM_API_BASE = 'https://api.creem.io/v1';
const DEFAULT_TIER: Tier = 'starter';
const DEFAULT_PACK = 'corporate-headshots';

export type CreateCreemCheckoutInput = {
  userId: string;
  email?: string | null;
  tier?: string | null;
  pack?: string | null;
  baseUrl: string;
};

export async function createCreemCheckoutUrl(
  input: CreateCreemCheckoutInput
): Promise<{ url: string } | { error: string }> {
  const apiKey = process.env.CREEM_API_KEY;
  if (!apiKey) {
    logger.error('CREEM_API_KEY is not configured');
    return { error: 'Payment is not configured' };
  }

  const effectiveTier: Tier =
    input.tier && isTier(input.tier) ? input.tier : DEFAULT_TIER;
  const productId = getCreemProductId(effectiveTier);
  const packParam = input.pack || DEFAULT_PACK;

  if (!productId) {
    return { error: `Unknown tier: ${effectiveTier}` };
  }

  const successUrl = `${input.baseUrl}/overview/models/train/${packParam}?tier=${effectiveTier}`;

  const response = await fetch(`${CREEM_API_BASE}/checkouts`, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      product_id: productId,
      success_url: successUrl,
      request_id: input.userId,
      customer: input.email ? { email: input.email } : undefined,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    logger.error('CREEM checkout API error:', response.status, errorBody);
    return { error: 'CREEM API error' };
  }

  const data = await response.json();
  const checkoutUrl = data.checkout_url || data.url;

  if (!checkoutUrl) {
    logger.error('CREEM checkout response missing URL:', JSON.stringify(data));
    return { error: 'CREEM did not return a checkout URL' };
  }

  return { url: checkoutUrl };
}
