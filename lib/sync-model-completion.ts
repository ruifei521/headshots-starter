import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import { modelAgeMinutes } from "@/lib/model-stale-reconcile";
import { ESTIMATED_DELIVERY_MINUTES } from "@/lib/tiers";
import { logger } from "@/lib/logger";

/** After estimated delivery + buffer, partial models are marked ready. */
// 30 分钟可能太短，调整为 60 分钟（1 小时）以确保足够时间
export const PARTIAL_COMPLETE_IDLE_MIN = 60;

type ModelRow = {
  id: number;
  status: string | null;
  total_images: number | null;
  created_at: string | null;
  images_generated: number | null;
};

export type SyncCompletionResult =
  | { action: "none" }
  | { action: "counter"; imageCount: number }
  | { action: "completed"; imageCount: number; partial: boolean };

/** Sync one model from actual `images` rows → counter and/or completed status. */
export async function syncModelCompletion(params: {
  supabase: SupabaseClient<Database>;
  model: ModelRow;
}): Promise<SyncCompletionResult> {
  const status = params.model.status ?? "";
  if (status === "completed" || status === "failed") {
    return { action: "none" };
  }

  const { count } = await params.supabase
    .from("images")
    .select("*", { count: "exact", head: true })
    .eq("modelId", params.model.id);

  const imageCount = count ?? 0;
  const totalExpected = params.model.total_images ?? 0;
  const ageMin = modelAgeMinutes(params.model.created_at);

  const fullComplete =
    totalExpected > 0 && imageCount >= totalExpected && status !== "completed";

  const partialIdle =
    status === "finished" &&
    imageCount > 0 &&
    totalExpected > 0 &&
    imageCount < totalExpected &&
    ageMin >= PARTIAL_COMPLETE_IDLE_MIN;

  if (fullComplete || partialIdle) {
    const { error } = await params.supabase
      .from("models")
      .update({
        status: "completed",
        images_generated: imageCount,
      })
      .eq("id", params.model.id);

    if (error) {
      logger.error(
        `syncModelCompletion: failed to mark model ${params.model.id} completed:`,
        error
      );
      return { action: "none" };
    }

    logger.log(
      `syncModelCompletion: model ${params.model.id} → completed (${imageCount}/${totalExpected}${partialIdle ? ", partial idle" : ""})`
    );
    return { action: "completed", imageCount, partial: partialIdle };
  }

  if (
    imageCount > 0 &&
    imageCount !== (params.model.images_generated ?? 0)
  ) {
    const { error } = await params.supabase
      .from("models")
      .update({ images_generated: imageCount })
      .eq("id", params.model.id);

    if (error) {
      logger.error(
        `syncModelCompletion: failed to sync counter for model ${params.model.id}:`,
        error
      );
      return { action: "none" };
    }

    return { action: "counter", imageCount };
  }

  return { action: "none" };
}

/** Sync all in-progress models for a user (overview / cron). */
export async function syncModelCompletionForUser(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<number> {
  const { data: models, error } = await supabase
    .from("models")
    .select("id, status, total_images, created_at, images_generated")
    .eq("user_id", userId)
    .in("status", ["processing", "pending", "finished"]);

  if (error || !models?.length) return 0;

  let updated = 0;
  for (const model of models) {
    const result = await syncModelCompletion({ supabase, model });
    if (result.action !== "none") updated += 1;
  }

  return updated;
}

/** Cron: sync completion for all in-progress models (all users). */
export async function syncAllModelCompletions(
  supabase: SupabaseClient<Database>
): Promise<number> {
  const { data: models, error } = await supabase
    .from("models")
    .select("id, status, total_images, created_at, images_generated")
    .in("status", ["processing", "pending", "finished"])
    .order("created_at", { ascending: true })
    .limit(200);

  if (error || !models?.length) return 0;

  let updated = 0;
  for (const model of models) {
    const result = await syncModelCompletion({ supabase, model });
    if (result.action !== "none") updated += 1;
  }

  return updated;
}
