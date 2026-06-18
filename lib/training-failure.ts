import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import { refundTrainingCredit } from "@/lib/credits-admin";
import { sendTrainingFailedEmail } from "@/lib/email-notifications";
import { isPaymentEnabled } from "@/lib/payment-config";
import { logger } from "@/lib/logger";

export type TrainingFailureReason =
  | "astria_training"
  | "prompt_submit"
  | "stale_timeout"
  | "partial_generation";

const FAILABLE_STATUSES = ["processing", "pending", "finished"] as const;

/** Mark model failed (idempotent), optionally refund credit, and email the user once. */
export async function markTrainingFailedAndNotify(params: {
  supabase: SupabaseClient<Database>;
  userId: string;
  userEmail?: string | null;
  modelId: number;
  modelName?: string | null;
  refundCredit?: boolean;
  reason?: TrainingFailureReason;
}): Promise<{ marked: boolean; emailed: boolean }> {
  const { data: updated, error } = await params.supabase
    .from("models")
    .update({ status: "failed" })
    .eq("id", params.modelId)
    .eq("user_id", params.userId)
    .in("status", [...FAILABLE_STATUSES])
    .select("id, name")
    .maybeSingle();

  if (error) {
    logger.error(
      `markTrainingFailedAndNotify: update failed for model ${params.modelId}:`,
      error
    );
    return { marked: false, emailed: false };
  }

  if (!updated) {
    return { marked: false, emailed: false };
  }

  if (params.refundCredit !== false && isPaymentEnabled()) {
    await refundTrainingCredit(params.userId, 1);
  }

  const email = params.userEmail?.trim();
  if (!email) {
    return { marked: true, emailed: false };
  }

  const sent = await sendTrainingFailedEmail({
    to: email,
    modelId: params.modelId,
    modelName: params.modelName ?? updated.name,
    reason: params.reason,
  });

  if (!sent) {
    logger.error(
      `markTrainingFailedAndNotify: failure email not sent for model ${params.modelId}`
    );
  }

  return { marked: true, emailed: sent };
}

/** Detect Astria tune callback payloads that indicate training did not succeed. */
export function isAstriaTuneFailure(tune: Record<string, unknown>): boolean {
  if (typeof tune.error === "string" && tune.error.trim()) return true;
  const status = tune.status;
  if (status === "failed" || status === "error") return true;
  return false;
}
