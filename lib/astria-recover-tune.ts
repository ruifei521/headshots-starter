import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import {
  attachAstriaTuneToModel,
  submitPromptsAfterTraining,
} from "@/lib/complete-tune-prompts";
import {
  isAstriaTuneFailure,
  markTrainingFailedAndNotify,
} from "@/lib/training-failure";
import { logger } from "@/lib/logger";
import {
  buildAstriaTuneTitle,
  findAstriaTuneIdByTitle,
} from "@/lib/astria-create-tune";

type RecoverModelRow = {
  id: number;
  name: string | null;
  status: string | null;
  modelId: string | null;
  tier: string | null;
  type: string | null;
  user_id: string | null;
};

export async function fetchAstriaTune(
  astriaTuneId: string | number
): Promise<Record<string, unknown> | null> {
  const apiKey = process.env.ASTRIA_API_KEY?.trim();
  if (!apiKey) return null;

  try {
    const res = await fetch(`https://api.astria.ai/tunes/${astriaTuneId}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) {
      logger.warn(
        `fetchAstriaTune ${astriaTuneId}: HTTP ${res.status}`
      );
      return null;
    }
    const data = await res.json();
    if (data && typeof data === "object") {
      return data as Record<string, unknown>;
    }
    return null;
  } catch (error) {
    logger.warn(`fetchAstriaTune ${astriaTuneId} failed:`, error);
    return null;
  }
}

export function isAstriaTuneTrainingComplete(
  tune: Record<string, unknown>
): boolean {
  if (isAstriaTuneFailure(tune)) return false;
  const trainedAt = tune.trained_at;
  return typeof trainedAt === "string" && trainedAt.length > 0;
}

export function isAstriaTuneStillTraining(
  tune: Record<string, unknown>
): boolean {
  if (isAstriaTuneFailure(tune)) return false;
  return !isAstriaTuneTrainingComplete(tune);
}

/** Link a pending/processing model to an Astria tune discovered by title. */
export async function linkPendingModelToAstriaTune(params: {
  supabase: SupabaseClient<Database>;
  model: RecoverModelRow;
}): Promise<"linked" | "not_found" | "skipped"> {
  const { model } = params;
  const status = model.status ?? "";

  if (
    (status !== "processing" && status !== "pending") ||
    model.modelId ||
    !model.name
  ) {
    return "skipped";
  }

  const apiKey = process.env.ASTRIA_API_KEY?.trim();
  if (!apiKey) return "skipped";

  const title = buildAstriaTuneTitle(model.name, model.id);
  const tuneId = await findAstriaTuneIdByTitle(apiKey, title);
  if (!tuneId) {
    return "not_found";
  }

  const { error } = await params.supabase
    .from("models")
    .update({ modelId: String(tuneId), status: "processing" })
    .eq("id", model.id)
    .in("status", ["processing", "pending"]);

  if (error) {
    logger.error(`linkPendingModelToAstriaTune failed for model ${model.id}:`, error);
    return "skipped";
  }

  logger.log(`linkPendingModelToAstriaTune: model ${model.id} → tune ${tuneId}`);
  return "linked";
}

/** Poll Astria and replay train-webhook completion when callback was lost. */
export async function recoverProcessingModelFromAstria(params: {
  supabase: SupabaseClient<Database>;
  model: RecoverModelRow;
  userEmail?: string | null;
}): Promise<"recovered" | "still_training" | "failed" | "skipped"> {
  const { model } = params;
  const status = model.status ?? "";

  if (
    (status !== "processing" && status !== "pending") ||
    !model.modelId ||
    !model.user_id
  ) {
    return "skipped";
  }

  const tune = await fetchAstriaTune(model.modelId);
  if (!tune) return "skipped";

  if (isAstriaTuneFailure(tune)) {
    await markTrainingFailedAndNotify({
      supabase: params.supabase,
      userId: model.user_id,
      userEmail: params.userEmail,
      modelId: model.id,
      modelName: model.name,
      reason: "astria_training",
    });
    return "failed";
  }

  if (isAstriaTuneStillTraining(tune)) {
    return "still_training";
  }

  const astriaTuneId = Number(tune.id ?? model.modelId);
  if (!Number.isFinite(astriaTuneId)) {
    return "skipped";
  }

  const attached = await attachAstriaTuneToModel(
    params.supabase,
    model.id,
    astriaTuneId
  );

  if (!attached) {
    logger.error(
      `recoverProcessingModelFromAstria: attach tune failed for model ${model.id}`
    );
    return "skipped";
  }

  const promptResult = await submitPromptsAfterTraining({
    supabase: params.supabase,
    modelId: model.id,
    userId: model.user_id,
    userEmail: params.userEmail,
    modelName: model.name,
    astriaTuneId,
    tier: model.tier || "starter",
    type: model.type || "man",
  });

  if (promptResult.outcome === "submitted") {
    logger.log(
      `recoverProcessingModelFromAstria: model ${model.id} → finished, prompts submitted=${promptResult.submitted}, failed=${promptResult.failed}`
    );
    return "recovered";
  }

  if (promptResult.outcome === "all_failed" || promptResult.outcome === "error") {
    return "failed";
  }

  return "skipped";
}

export async function recoverProcessingModelsForUser(params: {
  supabase: SupabaseClient<Database>;
  userId: string;
  userEmail?: string | null;
}): Promise<number> {
  const { data: models, error } = await params.supabase
    .from("models")
    .select("id, name, status, modelId, tier, type, user_id")
    .eq("user_id", params.userId)
    .in("status", ["processing", "pending"])
    .not("modelId", "is", null);

  if (error || !models?.length) return 0;

  let recovered = 0;
  for (const model of models) {
    const result = await recoverProcessingModelFromAstria({
      supabase: params.supabase,
      model,
      userEmail: params.userEmail,
    });
    if (result === "recovered" || result === "failed") {
      recovered += 1;
    }
  }

  return recovered;
}

/** Cron: poll Astria for all processing/pending models with a tune id. */
export async function recoverAllProcessingModelsFromAstria(
  supabase: SupabaseClient<Database>
): Promise<number> {
  const { data: models, error } = await supabase
    .from("models")
    .select("id, name, status, modelId, tier, type, user_id")
    .in("status", ["processing", "pending"])
    .not("modelId", "is", null)
    .order("created_at", { ascending: true })
    .limit(100);

  if (error || !models?.length) return 0;

  let handled = 0;
  for (const model of models) {
    if (!model.user_id) continue;
    const { data: userData } = await supabase.auth.admin.getUserById(
      model.user_id
    );
    const result = await recoverProcessingModelFromAstria({
      supabase,
      model,
      userEmail: userData.user?.email,
    });
    if (result === "recovered" || result === "failed") {
      handled += 1;
    }
  }

  return handled;
}
