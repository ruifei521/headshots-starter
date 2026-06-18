import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import { buildPromptWebhookUrl } from "@/lib/astria-webhook";
import { submitTierPromptsForTune } from "@/lib/astria-submit-prompts";
import { markTrainingFailedAndNotify } from "@/lib/training-failure";
import { logger } from "@/lib/logger";

type ServiceClient = SupabaseClient<Database>;

export type TunePromptSubmitResult =
  | { outcome: "submitted"; submitted: number; failed: number }
  | { outcome: "all_failed" }
  | { outcome: "error" };

/** Persist Astria tune id while generation prompts are queued (stay processing). */
export async function attachAstriaTuneToModel(
  supabase: ServiceClient,
  modelId: number,
  astriaTuneId: number | string
): Promise<boolean> {
  const { error } = await supabase
    .from("models")
    .update({
      modelId: String(astriaTuneId),
      status: "processing",
    })
    .eq("id", modelId)
    .in("status", ["processing", "pending", "finished"]);

  if (error) {
    logger.error(`attachAstriaTuneToModel failed for model ${modelId}:`, error);
    return false;
  }
  return true;
}

/** Submit tier prompts, then mark model finished when at least one prompt was queued. */
export async function submitPromptsAfterTraining(params: {
  supabase: ServiceClient;
  modelId: number;
  userId: string;
  userEmail?: string | null;
  modelName: string | null;
  astriaTuneId: number;
  tier: string;
  type: string;
}): Promise<TunePromptSubmitResult> {
  const promptCallbackUrl = buildPromptWebhookUrl(params.userId, params.modelId);

  try {
    const { submitted, failed } = await submitTierPromptsForTune({
      astriaTuneId: params.astriaTuneId,
      modelId: params.modelId,
      userId: params.userId,
      tier: params.tier,
      type: params.type,
      promptCallbackUrl,
    });

    if (submitted === 0 && failed > 0) {
      await markTrainingFailedAndNotify({
        supabase: params.supabase,
        userId: params.userId,
        userEmail: params.userEmail,
        modelId: params.modelId,
        modelName: params.modelName,
        reason: "prompt_submit",
      });
      return { outcome: "all_failed" };
    }

    if (submitted > 0) {
      const { error } = await params.supabase
        .from("models")
        .update({ status: "finished" })
        .eq("id", params.modelId);

      if (error) {
        logger.error(
          `submitPromptsAfterTraining: failed to mark model ${params.modelId} finished:`,
          error
        );
        return { outcome: "error" };
      }
    }

    if (failed > 0) {
      logger.warn(
        `submitPromptsAfterTraining: model ${params.modelId} — ${failed} prompt(s) failed, ${submitted} submitted`
      );
    }

    return { outcome: "submitted", submitted, failed };
  } catch (error) {
    logger.error(
      `submitPromptsAfterTraining: prompt submit failed for model ${params.modelId}:`,
      error
    );
    await markTrainingFailedAndNotify({
      supabase: params.supabase,
      userId: params.userId,
      userEmail: params.userEmail,
      modelId: params.modelId,
      modelName: params.modelName,
      reason: "prompt_submit",
    });
    return { outcome: "error" };
  }
}

/** True when train-webhook should no-op (fully handled already). */
export async function shouldSkipTrainWebhook(params: {
  supabase: ServiceClient;
  modelId: number;
  status: string | null;
}): Promise<boolean> {
  const status = params.status ?? "";
  if (status === "completed" || status === "failed") {
    return true;
  }

  if (status === "finished") {
    const { count } = await params.supabase
      .from("images")
      .select("*", { count: "exact", head: true })
      .eq("modelId", params.modelId);

    // Allow retry when finished was set before prompts/images landed.
    return (count ?? 0) > 0;
  }

  return false;
}

/** Re-submit prompts for finished models stuck at 0 images. */
export async function recoverFinishedModelWithoutImages(params: {
  supabase: ServiceClient;
  model: {
    id: number;
    name: string | null;
    modelId: string | null;
    tier: string | null;
    type: string | null;
    user_id: string | null;
  };
  userEmail?: string | null;
}): Promise<"recovered" | "skipped" | "failed"> {
  if (!params.model.modelId || !params.model.user_id) {
    return "skipped";
  }

  const astriaTuneId = Number(params.model.modelId);
  if (!Number.isFinite(astriaTuneId)) {
    return "skipped";
  }

  const result = await submitPromptsAfterTraining({
    supabase: params.supabase,
    modelId: params.model.id,
    userId: params.model.user_id,
    userEmail: params.userEmail,
    modelName: params.model.name,
    astriaTuneId,
    tier: params.model.tier || "starter",
    type: params.model.type || "man",
  });

  if (result.outcome === "submitted") return "recovered";
  if (result.outcome === "all_failed" || result.outcome === "error") {
    return "failed";
  }
  return "skipped";
}
