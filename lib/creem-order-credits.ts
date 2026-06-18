import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import { maxTier, type Tier } from "@/lib/tiers";
import { logger } from "@/lib/logger";

export const PURCHASE_CREDITS_PER_ORDER = 1;

type ServiceClient = SupabaseClient<Database>;

export type OrderRow = Pick<
  Database["public"]["Tables"]["orders"]["Row"],
  "id" | "user_id" | "tier" | "credits_granted" | "creem_checkout_id"
>;

/** Add one training credit and merge tier for a paid Creem order. */
export async function grantPurchaseCredits(
  supabase: ServiceClient,
  userId: string,
  tier: Tier,
  creditsToAdd = PURCHASE_CREDITS_PER_ORDER
): Promise<boolean> {
  const { data: existingCredits } = await supabase
    .from("credits")
    .select("id, credits, tier")
    .eq("user_id", userId)
    .order("id", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existingCredits) {
    const resolvedTier = maxTier(existingCredits.tier || "starter", tier);
    const { error } = await supabase
      .from("credits")
      .update({
        credits: existingCredits.credits + creditsToAdd,
        tier: resolvedTier,
      })
      .eq("id", existingCredits.id);

    if (error) {
      logger.error("grantPurchaseCredits update failed:", error);
      return false;
    }
    logger.log(
      `Granted ${creditsToAdd} credit(s) for ${userId}: tier=${resolvedTier}`
    );
    return true;
  }

  const { error } = await supabase.from("credits").insert({
    user_id: userId,
    credits: creditsToAdd,
    tier,
  });

  if (error) {
    logger.error("grantPurchaseCredits insert failed:", error);
    return false;
  }
  logger.log(`Created credits for ${userId}: ${creditsToAdd}, tier=${tier}`);
  return true;
}

/**
 * Ensure credits are granted for a paid order. Safe to call on webhook retries.
 * Returns whether credits are now marked as granted for this order.
 */
export async function fulfillOrderCredits(
  supabase: ServiceClient,
  order: OrderRow
): Promise<{ fulfilled: boolean; alreadyGranted: boolean }> {
  if (order.credits_granted) {
    return { fulfilled: true, alreadyGranted: true };
  }

  const granted = await grantPurchaseCredits(
    supabase,
    order.user_id,
    order.tier as Tier
  );
  if (!granted) {
    return { fulfilled: false, alreadyGranted: false };
  }

  const { data: updated, error } = await supabase
    .from("orders")
    .update({ credits_granted: true })
    .eq("id", order.id)
    .eq("credits_granted", false)
    .select("id")
    .maybeSingle();

  if (error) {
    logger.error("fulfillOrderCredits flag update failed:", error);
    return { fulfilled: false, alreadyGranted: false };
  }

  if (!updated) {
    // Another retry won the race; credits may have been granted twice — rare for Creem retries.
    logger.log(
      `Order ${order.id} credits_granted already set by concurrent webhook`
    );
    return { fulfilled: true, alreadyGranted: true };
  }

  return { fulfilled: true, alreadyGranted: false };
}
