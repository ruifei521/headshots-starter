import { cache } from "react";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/supabase";
import type { modelRowWithSamples, sampleRow } from "@/types/utils";
import { runUserModelReconcile } from "@/lib/run-user-model-reconcile";
type SamplePreview = Pick<sampleRow, "id" | "uri" | "modelId" | "created_at">;

const MAX_MODELS_WITH_SAMPLE_PREVIEWS = 40;
const SAMPLE_PREVIEWS_PER_MODEL = 3;

export const getOverviewSupabase = cache(() =>
  createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookies().getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            try {
              cookies().set(name, value, options);
            } catch {
              // Server Component — cookies may be read-only
            }
          });
        },
      },
    }
  )
);

export const getOverviewUser = cache(async () => {
  const supabase = getOverviewSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

function attachSamplePreviews(
  models: Omit<modelRowWithSamples, "samples">[],
  sampleRows: SamplePreview[] | null
): modelRowWithSamples[] {
  const byModel = new Map<number, SamplePreview[]>();

  for (const row of sampleRows ?? []) {
    const list = byModel.get(row.modelId) ?? [];
    if (list.length < SAMPLE_PREVIEWS_PER_MODEL) {
      list.push(row);
      byModel.set(row.modelId, list);
    }
  }

  return models.map((model) => ({
    ...model,
    samples: byModel.get(model.id) ?? [],
  }));
}

function getOverviewServiceSupabase() {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookies().getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            try {
              cookies().set(name, value, options);
            } catch {
              // Server Component — cookies may be read-only
            }
          });
        },
      },
    }
  );
}

/** List view: models + at most 3 sample thumbnails per model (not full galleries). */
export async function fetchOverviewModels(
  userId: string,
  userEmail?: string | null
): Promise<modelRowWithSamples[]> {
  const supabase = getOverviewSupabase();

  const serviceSupabase = getOverviewServiceSupabase();

  await runUserModelReconcile({
    supabase: serviceSupabase,
    userId,
    userEmail,
  });
  const { data: models, error } = await supabase
    .from("models")
    .select(
      "id, name, type, status, tier, created_at, user_id, modelId, images_generated, total_images"
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !models?.length) {
    return [];
  }

  const modelIds = models.map((m) => m.id);
  let sampleRows: SamplePreview[] | null = null;

  if (modelIds.length <= MAX_MODELS_WITH_SAMPLE_PREVIEWS) {
    const { data } = await supabase
      .from("samples")
      .select("id, uri, modelId, created_at")
      .in("modelId", modelIds)
      .order("id", { ascending: true });

    sampleRows = data;
  }

  return attachSamplePreviews(models, sampleRows);
}

export async function fetchOverviewCredits(
  userId: string
): Promise<number> {
  const supabase = getOverviewSupabase();
  const { data, error } = await supabase
    .from("credits")
    .select("credits")
    .eq("user_id", userId)
    .order("id", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error || !data) return 0;
  return data.credits ?? 0;
}
