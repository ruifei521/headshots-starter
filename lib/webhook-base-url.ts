import { logger } from '@/lib/logger';

/**
 * Canonical HTTPS origin for Astria webhook callbacks.
 * Prefer DEPLOYMENT_URL (e.g. snapprohead.com) over VERCEL_URL preview hostnames.
 */
export function getWebhookBaseUrl(): string {
  const raw =
    process.env.DEPLOYMENT_URL?.trim() ||
    process.env.VERCEL_URL?.trim() ||
    '';

  if (!raw) {
    if (process.env.NODE_ENV === 'production') {
      logger.error(
        'DEPLOYMENT_URL is not set — Astria webhooks may fail. Set DEPLOYMENT_URL=https://snapprohead.com in Vercel.'
      );
    }
    return 'https://snapprohead.com';
  }

  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  return withProtocol.replace(/\/$/, '');
}
