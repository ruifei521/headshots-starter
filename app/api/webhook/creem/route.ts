import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';
import { NextRequest, NextResponse } from 'next/server';
import * as crypto from 'crypto';
import { tierFromProductId, maxTier, isTier } from '@/lib/tiers';
import { logger } from "@/lib/logger";

// 向后兼容：旧 product_id 的 credit 映射
const CREDITS_PER_PRODUCT: Record<string, number> = {
  'prod_6F4zKTNhL3V7vWPUhnjZDZ': 1,  // 旧产品
};

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

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    logger.log('CREEM webhook received');

    // Verify signature
    const signature = req.headers.get('creem-signature') || '';
    const isValid = verifySignature(rawBody, signature);
    
    let body: any;
    try {
      body = JSON.parse(rawBody);
    } catch {
      logger.error('Invalid JSON body');
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    // CREEM webhook format:
    // {
    //   "id": "evt_...",
    //   "eventType": "checkout.completed",
    //   "created_at": 1728734325927,
    //   "object": {
    //     "id": "ch_...",
    //     "object": "checkout",
    //     "request_id": "userId",      // ← This is our user ID
    //     "order": {
    //       "id": "ord_...",
    //       "product": "prod_...",
    //       "customer": "cust_...",
    //       "amount": 1000,
    //       "currency": "EUR",
    //       "status": "paid"
    //     }
    //   }
    // }

    const eventType = body.eventType;
    const eventObject = body.object || {};

    // Only process checkout.completed events
    if (eventType !== 'checkout.completed') {
      logger.log(`Skipping non-checkout event: ${eventType}`);
      return NextResponse.json({ received: true });
    }

    if (!isValid) {
      logger.error('CREEM webhook signature verification failed — rejecting request');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
    logger.log('Webhook signature verified ✓');

    // Extract user ID from request_id
    let referenceId: string | null = null;
    
    // CREEM puts user ID in request_id field
    if (eventObject.request_id) {
      referenceId = eventObject.request_id;
    }

    if (!referenceId) {
      logger.warn('No request_id found in webhook payload');
      return NextResponse.json({ received: true });
    }

    // Extract product info from order
    const order = eventObject.order || {};
    const productId: string = order.product || '';
    const checkoutId: string = eventObject.id || '';
    const amountCents: number = order.amount || 0;
    const currency: string = order.currency || 'USD';

    // ⭐ product_id → tier 映射（利用 lib/tiers.ts 统一映射）
    const tier = tierFromProductId(productId);
    logger.log(`Product ${productId} → tier: ${tier}`);

    // 向后兼容：旧 product_id 仍使用 CREDITS_PER_PRODUCT
    const creditsToAdd = CREDITS_PER_PRODUCT[productId] || 1;

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

    // ⭐ 1. 处理 credits 表：更新 credits + tier（使用 upgrade 逻辑，不降级）
    const { data: existingCredits } = await supabase
      .from('credits')
      .select('*')
      .eq('user_id', referenceId)
      .single();

    if (existingCredits) {
      // 决定最终 tier：不降级（tier 升级规则：starter < professional < executive）
      const resolvedTier = maxTier(existingCredits.tier || 'starter', tier);
      const newCredits = existingCredits.credits + creditsToAdd;

      const { error } = await supabase
        .from('credits')
        .update({
          credits: newCredits,
          tier: resolvedTier,
        })
        .eq('user_id', referenceId);
      
      if (error) {
        logger.error('Error updating credits:', error);
        return NextResponse.json({ error: 'Failed to update credits' }, { status: 500 });
      }
      logger.log(`Updated credits for ${referenceId}: ${newCredits} credits, tier=${resolvedTier}`);
    } else {
      const { error } = await supabase
        .from('credits')
        .insert({
          user_id: referenceId,
          credits: creditsToAdd,
          tier: tier,
        });
      
      if (error) {
        logger.error('Error creating credits:', error);
        return NextResponse.json({ error: 'Failed to create credits' }, { status: 500 });
      }
      logger.log(`Created credits for ${referenceId}: ${creditsToAdd} credits, tier=${tier}`);
    }

    // ⭐ 2. 写入 orders 表（审计记录）
    // 注意：使用 INSERT 而非 UPSERT，避免覆盖已有记录
    // 如果同一 checkout_id 重复回调，会静默忽略（依赖唯一约束或检查）
    const { error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: referenceId,
        creem_checkout_id: checkoutId || null,
        creem_product_id: productId,
        tier: tier,
        amount_cents: amountCents,
        currency: currency,
        status: 'paid',
        raw_payload: body,
      });

    if (orderError) {
      // 如果是因为重复 creem_checkout_id 导致的错误，不视为失败
      if (orderError.code === '23505') {
        logger.log(`Duplicate checkout_id ${checkoutId}, skipping orders insert`);
      } else {
        logger.error('Error inserting order:', orderError);
        // 不阻塞主流程：credits 已成功更新
      }
    } else {
      logger.log(`Order recorded: checkout=${checkoutId}, tier=${tier}, amount=${amountCents} ${currency}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    logger.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
