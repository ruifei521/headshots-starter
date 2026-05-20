import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';
import { NextRequest, NextResponse } from 'next/server';
import * as crypto from 'crypto';
import { CREDITS_PER_PRODUCT } from '@/lib/pricing';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const webhookSecret = process.env.CREEM_WEBHOOK_SECRET!;
// CREDITS_PER_PRODUCT imported from @/lib/pricing

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
    console.log('CREEM webhook received');

    // Verify signature
    const signature = req.headers.get('creem-signature') || '';
    const isValid = verifySignature(rawBody, signature);
    
    let body: any;
    try {
      body = JSON.parse(rawBody);
    } catch {
      console.error('Invalid JSON body');
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
      console.log(`Skipping non-checkout event: ${eventType}`);
      return NextResponse.json({ received: true });
    }

    if (isValid) {
      console.log('Webhook signature verified ✓');
    } else if (webhookSecret) {
      console.warn('Webhook signature verification failed — payload may not be from CREEM');
    }

    // Extract user ID from request_id
    let referenceId: string | null = null;
    
    // CREEM puts user ID in request_id field
    if (eventObject.request_id) {
      referenceId = eventObject.request_id;
    }

    if (!referenceId) {
      console.warn('No request_id found in webhook payload');
      return NextResponse.json({ received: true });
    }

    // Extract product info from order
    const order = eventObject.order || {};
    const productId = order.product || '';

    const creditsToAdd = CREDITS_PER_PRODUCT[productId];
    
    if (!creditsToAdd) {
      console.warn(`Unknown product: ${productId}, defaulting to 1 credit`);
    }

    const finalCredits = creditsToAdd || 1;
    console.log(`Processing credits for user ${referenceId}: +${finalCredits} credits (product: ${productId})`);

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

    // Check if user already has credits row
    const { data: existingCredits } = await supabase
      .from('credits')
      .select('*')
      .eq('user_id', referenceId)
      .single();

    if (existingCredits) {
      const newCredits = existingCredits.credits + finalCredits;
      const { error } = await supabase
        .from('credits')
        .update({ credits: newCredits })
        .eq('user_id', referenceId);
      
      if (error) {
        console.error('Error updating credits:', error);
        return NextResponse.json({ error: 'Failed to update credits' }, { status: 500 });
      }
      console.log(`Updated credits for ${referenceId}: ${newCredits}`);
    } else {
      const { error } = await supabase
        .from('credits')
        .insert({
          user_id: referenceId,
          credits: finalCredits,
        });
      
      if (error) {
        console.error('Error creating credits:', error);
        return NextResponse.json({ error: 'Failed to create credits' }, { status: 500 });
      }
      console.log(`Created credits for ${referenceId}: ${finalCredits}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
