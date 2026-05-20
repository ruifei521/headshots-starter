import { Webhook } from '@creem_io/nextjs';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Map product IDs to credits count
const CREDITS_PER_PRODUCT: Record<string, number> = {
  'prod_31zqeJaVi4nCiCLGPz0F2K': 1,  // Starter - 1 Credit
  'prod_198ewWuQouDaQfEOT6kTvj': 3,  // Pro - 3 Credits
  'prod_1pZIlgHsKVk5YOK1QupnPP': 5,  // Executive - 5 Credits
};

export const POST = Webhook({
  webhookSecret: process.env.CREEM_WEBHOOK_SECRET!,
  
  onCheckoutCompleted: async ({ customer, product, metadata }) => {
    console.log('Checkout completed:', { customer, product, metadata });
    
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
    
    // Get user ID from referenceId (set in checkout)
    const userId = metadata?.referenceId as string;
    if (!userId) {
      console.error('Missing referenceId in checkout metadata');
      return;
    }
    
    // Figure out how many credits from product ID
    const productId = product.id;
    const creditsToAdd = CREDITS_PER_PRODUCT[productId] || 1;
    
    // Check if user already has credits row
    const { data: existingCredits } = await supabase
      .from('credits')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (existingCredits) {
      // Add to existing credits
      const newCredits = existingCredits.credits + creditsToAdd;
      const { error } = await supabase
        .from('credits')
        .update({ credits: newCredits })
        .eq('user_id', userId);
      
      if (error) {
        console.error('Error updating credits:', error);
      } else {
        console.log(`Updated credits for ${userId}: ${newCredits}`);
      }
    } else {
      // Create new credits row
      const { error } = await supabase
        .from('credits')
        .insert({
          user_id: userId,
          credits: creditsToAdd,
        });
      
      if (error) {
        console.error('Error creating credits:', error);
      } else {
        console.log(`Created credits for ${userId}: ${creditsToAdd}`);
      }
    }
  },
});
