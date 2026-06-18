import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import { logger } from "@/lib/logger";

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient<Database>(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/** Atomically deduct one training credit (service role). */
export async function deductTrainingCredit(userId: string): Promise<boolean> {
  const supabase = getServiceClient();
  if (!supabase) return false;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.rpc as any)("deduct_credits", {
    p_amount: 1,
    p_user_id: userId,
  });

  if (error) {
    logger.error("deductTrainingCredit RPC failed:", error);
    return false;
  }
  return !!data;
}

/** Refund credits after a failed or stale training attempt. */
export async function refundTrainingCredit(
  userId: string,
  amount = 1
): Promise<boolean> {
  const supabase = getServiceClient();
  if (!supabase) return false;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.rpc as any)("add_credits", {
    p_amount: amount,
    p_user_id: userId,
  });

  if (error) {
    logger.error("refundTrainingCredit RPC failed:", error);
    return false;
  }
  return !!data;
}
