import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/supabase";
import { reconcileStaleModel } from "@/lib/model-stale-reconcile";
import { syncModelCompletion } from "@/lib/sync-model-completion";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

/** Authenticated reconcile for a single model (detail page polling). */
export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const modelId = Number(params.id);
  if (!Number.isFinite(modelId)) {
    return NextResponse.json({ error: "Invalid model id" }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  const authClient = createServerClient<Database>(supabaseUrl, anonKey, {
    cookies: {
      getAll() {
        return cookies().getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          try {
            cookies().set(name, value, options);
          } catch {
            // read-only in Server Component context
          }
        });
      },
    },
  });

  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServerClient<Database>(supabaseUrl, serviceKey, {
    cookies: {
      getAll() {
        return [];
      },
      setAll() {},
    },
  });

  const { data: model, error } = await supabase
    .from("models")
    .select("id, name, status, created_at, user_id, modelId, total_images, images_generated, tier, type")
    .eq("id", modelId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !model) {
    return NextResponse.json({ error: "Model not found" }, { status: 404 });
  }

  try {
    const syncResult = await syncModelCompletion({
      supabase,
      model,
    });

    const reconciled = await reconcileStaleModel({
      supabase,
      model: { ...model, user_id: user.id },
      userEmail: user.email,
    });

    return NextResponse.json({
      reconciled,
      synced: syncResult.action !== "none",
      completed: syncResult.action === "completed",
    });
  } catch (e) {
    logger.error(`Model reconcile failed for ${modelId}:`, e);
    return NextResponse.json({ error: "Reconcile failed" }, { status: 500 });
  }
}
