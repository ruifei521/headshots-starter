import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import {
  markTrainingFailedAndNotify,
  type TrainingFailureReason,
} from "@/lib/training-failure";
import { recoverProcessingModelFromAstria, linkPendingModelToAstriaTune } from "@/lib/astria-recover-tune";
import { recoverFinishedModelWithoutImages } from "@/lib/complete-tune-prompts";
import { ESTIMATED_DELIVERY_MINUTES } from "@/lib/tiers";
import { logger } from "@/lib/logger";

/** Minutes before processing/pending without Astria tune is considered stale. */
export const STALE_PROCESSING_MIN = 25;
/** Minutes before pending-with-tune is considered stale. */
export const STALE_PENDING_MIN = 180;
/** Minutes before processing-with-tune is considered stale (train-webhook lost). */
export const STALE_PROCESSING_WITH_TUNE_MIN = ESTIMATED_DELIVERY_MINUTES + 20;
/** Minutes after creation before finished-but-incomplete models are reconciled. */
export const STALE_FINISHED_PARTIAL_MIN = ESTIMATED_DELIVERY_MINUTES + 15;
/** Minutes before finished-with-zero-images triggers prompt resubmit. */
export const STALE_FINISHED_ZERO_MIN = 12;

type ModelRow = {
  id: number;
  name: string | null;
  status: string | null;
  created_at: string | null;
  modelId: string | null;
  total_images: number | null;
  user_id: string | null;
  tier?: string | null;
  type?: string | null;
};

export function modelAgeMinutes(createdAt: string | null | undefined): number {
  if (!createdAt) return 0;
  return (Date.now() - new Date(createdAt).getTime()) / 60000;
}

/** Returns failure reason when a model should be marked failed + refunded. */
export function getStaleModelFailureReason(
  model: Pick<
    ModelRow,
    "status" | "created_at" | "modelId" | "total_images"
  >,
  imageCount: number
): TrainingFailureReason | null {
  const ageMin = modelAgeMinutes(model.created_at);
  const status = model.status ?? "";

  const stuckWithoutTune =
    (status === "processing" || status === "pending") &&
    !model.modelId &&
    ageMin > STALE_PROCESSING_MIN;

  const stuckPendingWithTune =
    status === "pending" && !!model.modelId && ageMin > STALE_PENDING_MIN;

  const stuckProcessingWithTune =
    status === "processing" &&
    !!model.modelId &&
    ageMin > STALE_PROCESSING_WITH_TUNE_MIN;

  if (stuckWithoutTune || stuckPendingWithTune || stuckProcessingWithTune) {
    return "stale_timeout";
  }

  const totalExpected = model.total_images ?? 0;

  const stuckFinishedZeroFailed =
    status === "finished" &&
    !!model.modelId &&
    totalExpected > 0 &&
    imageCount === 0 &&
    ageMin > ESTIMATED_DELIVERY_MINUTES + 20;

  if (stuckFinishedZeroFailed) {
    return "stale_timeout";
  }

  const stuckFinishedPartial =
    status === "finished" &&
    totalExpected > 0 &&
    imageCount < totalExpected &&
    ageMin > STALE_FINISHED_PARTIAL_MIN;

  if (stuckFinishedPartial) {
    return "partial_generation";
  }

  return null;
}

export async function reconcileStaleModel(params: {
  supabase: SupabaseClient<Database>;
  model: ModelRow;
  userEmail?: string | null;
  imageCount?: number;
}): Promise<boolean> {
  const status = params.model.status ?? "";
  if (
    (status === "processing" || status === "pending") &&
    !params.model.modelId
  ) {
    const linked = await linkPendingModelToAstriaTune({
      supabase: params.supabase,
      model: {
        id: params.model.id,
        name: params.model.name,
        status: params.model.status,
        modelId: params.model.modelId,
        tier: params.model.tier ?? null,
        type: params.model.type ?? null,
        user_id: params.model.user_id,
      },
    });
    if (linked === "linked" && params.model.user_id) {
      const { data: refreshed } = await params.supabase
        .from("models")
        .select("id, name, status, modelId, tier, type, user_id")
        .eq("id", params.model.id)
        .maybeSingle();

      if (refreshed?.modelId) {
        const recovery = await recoverProcessingModelFromAstria({
          supabase: params.supabase,
          model: refreshed,
          userEmail: params.userEmail,
        });
        if (recovery === "recovered" || recovery === "failed") {
          return recovery === "failed";
        }
        return false;
      }
    }
  }

  if (
    (status === "processing" || status === "pending") &&
    params.model.modelId &&
    params.model.user_id
  ) {
    const recovery = await recoverProcessingModelFromAstria({
      supabase: params.supabase,
      model: {
        id: params.model.id,
        name: params.model.name,
        status: params.model.status,
        modelId: params.model.modelId,
        tier: params.model.tier ?? null,
        type: params.model.type ?? null,
        user_id: params.model.user_id,
      },
      userEmail: params.userEmail,
    });
    if (recovery === "recovered" || recovery === "failed") {
      return recovery === "failed";
    }
  }

  let imageCount = params.imageCount;
  if (imageCount === undefined) {
    const { count } = await params.supabase
      .from("images")
      .select("*", { count: "exact", head: true })
      .eq("modelId", params.model.id);
    imageCount = count ?? 0;
  }

  if (
    status === "finished" &&
    params.model.modelId &&
    params.model.user_id &&
    imageCount === 0 &&
    modelAgeMinutes(params.model.created_at) > STALE_FINISHED_ZERO_MIN
  ) {
    const recovered = await recoverFinishedModelWithoutImages({
      supabase: params.supabase,
      model: {
        id: params.model.id,
        name: params.model.name,
        modelId: params.model.modelId,
        tier: params.model.tier ?? null,
        type: params.model.type ?? null,
        user_id: params.model.user_id,
      },
      userEmail: params.userEmail,
    });
    if (recovered === "recovered" || recovered === "failed") {
      return recovered === "failed";
    }
  }

  const reason = getStaleModelFailureReason(params.model, imageCount);
  if (!reason) return false;

  if (!params.model.user_id) {
    logger.error(`Reconcile skipped model ${params.model.id}: missing user_id`);
    return false;
  }

  const { marked } = await markTrainingFailedAndNotify({
    supabase: params.supabase,
    userId: params.model.user_id,
    userEmail: params.userEmail,
    modelId: params.model.id,
    modelName: params.model.name,
    reason,
  });

  if (marked) {
    logger.log(
      `Reconciled stale model ${params.model.id} (${reason}, images=${imageCount}/${params.model.total_images ?? "?"})`
    );
  }

  return marked;
}

export async function reconcileStaleModelsForUser(params: {
  supabase: SupabaseClient<Database>;
  userId: string;
  userEmail?: string | null;
}): Promise<number> {
  const { data: models, error } = await params.supabase
    .from("models")
    .select(
      "id, name, status, created_at, user_id, modelId, total_images, tier, type"
    )
    .eq("user_id", params.userId)
    .in("status", ["processing", "pending", "finished"]);

  if (error || !models?.length) return 0;

  let reconciled = 0;
  for (const model of models) {
    const marked = await reconcileStaleModel({
      supabase: params.supabase,
      model,
      userEmail: params.userEmail,
    });
    if (marked) reconciled += 1;
  }

  return reconciled;
}

/** Cron: reconcile stale models across all users (service role). */
export async function reconcileAllStaleModels(
  supabase: SupabaseClient<Database>
): Promise<number> {
  const { data: models, error } = await supabase
    .from("models")
    .select(
      "id, name, status, created_at, user_id, modelId, total_images, tier, type"
    )
    .in("status", ["processing", "pending", "finished"])
    .order("created_at", { ascending: true })
    .limit(200);

  if (error || !models?.length) return 0;

  let reconciled = 0;
  for (const model of models) {
    if (!model.user_id) continue;
    const { data: userData } = await supabase.auth.admin.getUserById(
      model.user_id
    );
    const marked = await reconcileStaleModel({
      supabase,
      model,
      userEmail: userData.user?.email,
    });
    if (marked) reconciled += 1;
  }

  return reconciled;
}
