import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import { reconcileAllStaleModels } from "@/lib/model-stale-reconcile";
import { syncAllModelCompletions } from "@/lib/sync-model-completion";
import { recoverAllProcessingModelsFromAstria } from "@/lib/astria-recover-tune";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;
  const auth = req.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

/** Vercel Cron — mark stuck models failed and refund credits. */
export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const supabase = createClient<Database>(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  try {
    const synced = await syncAllModelCompletions(supabase);
    const recovered = await recoverAllProcessingModelsFromAstria(supabase);
    const reconciled = await reconcileAllStaleModels(supabase);
    logger.log(
      `Cron reconcile-stale-models: synced=${synced}, recovered=${recovered}, reconciled=${reconciled}`
    );
    return NextResponse.json({ ok: true, synced, recovered, reconciled });
  } catch (error) {
    logger.error("Cron reconcile-stale-models failed:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
