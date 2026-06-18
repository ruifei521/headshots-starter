import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';
import { NextRequest, NextResponse } from 'next/server';
import * as crypto from 'crypto';
import { tierFromProductId } from '@/lib/tiers';
import { fulfillOrderCredits, type OrderRow } from '@/lib/creem-order-credits';
import { notifyPaymentReceived } from '@/lib/ops-notify';
import { logger } from "@/lib/logger";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const webhookSecret = process.env.CREEM_WEBHOOK_SECRET!;

function verifySignature(payload: string, signature: string): boolean {
  if (!webhookSecret || !signature) return false;
  const computed = crypto
    .createHmac('sha256', webhookSecret)
    .update(payload)
    .digest('hex');
  return computed === signature;
}

const ORDER_SELECT =
  'id, user_id, tier, credits_granted, creem_checkout_id';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    logger.log('CREEM webhook received');

    const signature = req.headers.get('creem-signature') || '';
    const isValid = verifySignature(rawBody, signature);

    let body: any;
    try {
      body = JSON.parse(rawBody);
    } catch {
      logger.error('Invalid JSON body');
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const eventType = body.eventType;
    const eventObject = body.object || {};

    if (eventType !== 'checkout.completed') {
      logger.log(`Skipping non-checkout event: ${eventType}`);
      return NextResponse.json({ received: true });
    }

    if (!isValid) {
      logger.error('CREEM webhook signature verification failed — rejecting request');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
    logger.log('Webhook signature verified ✓');

    const referenceId: string | null = eventObject.request_id ?? null;
    if (!referenceId) {
      logger.error('No request_id in webhook payload — cannot grant credits');
      return NextResponse.json({ error: 'Missing request_id' }, { status: 400 });
    }

    const order = eventObject.order || {};
    const productId: string = order.product || '';
    const checkoutId: string = eventObject.id || '';
    const amountCents: number = order.amount || 0;
    const currency: string = order.currency || 'USD';

    if (!checkoutId) {
      logger.error('No checkout id in webhook payload — cannot ensure idempotency');
      return NextResponse.json({ error: 'Missing checkout id' }, { status: 400 });
    }

    if (!productId) {
      logger.error('No product id in webhook payload — cannot map tier');
      return NextResponse.json({ error: 'Missing product id' }, { status: 400 });
    }

    const tier = tierFromProductId(productId);
    if (!tier) {
      logger.error(`Unknown Creem product_id: ${productId}`);
      return NextResponse.json({ error: 'Unknown product id' }, { status: 500 });
    }
    logger.log(`Product ${productId} → tier: ${tier}`);

    const supabase = createClient<Database>(
      supabaseUrl,
      supabaseServiceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false,
        },
      }
    );

    let orderRow: OrderRow | null = null;

    const { data: existingOrder } = await supabase
      .from('orders')
      .select(ORDER_SELECT)
      .eq('creem_checkout_id', checkoutId)
      .maybeSingle();

    if (existingOrder) {
      orderRow = existingOrder as OrderRow;
      logger.log(`Duplicate checkout_id ${checkoutId}, checking credit fulfillment`);
    } else {
      const { data: insertedOrder, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: referenceId,
          creem_checkout_id: checkoutId,
          creem_product_id: productId,
          tier,
          amount_cents: amountCents,
          currency,
          status: 'paid',
          raw_payload: body,
          credits_granted: false,
        })
        .select(ORDER_SELECT)
        .maybeSingle();

      if (orderError) {
        if (orderError.code === '23505') {
          const { data: racedOrder } = await supabase
            .from('orders')
            .select(ORDER_SELECT)
            .eq('creem_checkout_id', checkoutId)
            .maybeSingle();
          if (!racedOrder) {
            logger.error('Duplicate checkout but order row missing after race');
            return NextResponse.json({ error: 'Order lookup failed' }, { status: 500 });
          }
          orderRow = racedOrder as OrderRow;
          logger.log(`Duplicate checkout_id ${checkoutId}, checking credit fulfillment`);
        } else {
          logger.error('Error inserting order:', orderError);
          return NextResponse.json({ error: 'Failed to record order' }, { status: 500 });
        }
      } else if (insertedOrder) {
        orderRow = insertedOrder as OrderRow;
        logger.log(
          `Order recorded: checkout=${checkoutId}, tier=${tier}, amount=${amountCents} ${currency}`
        );
      }
    }

    if (!orderRow) {
      logger.error('Order row missing after insert/lookup');
      return NextResponse.json({ error: 'Order lookup failed' }, { status: 500 });
    }

    const { fulfilled, alreadyGranted } = await fulfillOrderCredits(supabase, orderRow);
    if (!fulfilled) {
      return NextResponse.json({ error: 'Failed to grant credits' }, { status: 500 });
    }

    if (!alreadyGranted) {
      void notifyPaymentReceived({
        tier,
        amountCents,
        currency,
        checkoutId,
        userId: referenceId,
      });
    }

    return NextResponse.json({
      received: true,
      duplicate: alreadyGranted,
      creditsGranted: !alreadyGranted,
    });
  } catch (error) {
    logger.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
