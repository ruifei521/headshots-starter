import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import { recoverProcessingModelsForUser } from "@/lib/astria-recover-tune";
import { reconcileStaleModelsForUser } from "@/lib/model-stale-reconcile";
import { syncModelCompletionForUser } from "@/lib/sync-model-completion";

/** Sync counters, recover lost Astria callbacks, then mark stale models failed. */
export async function runUserModelReconcile(params: {
  supabase: SupabaseClient<Database>;
  userId: string;
  userEmail?: string | null;
}): Promise<{ synced: number; recovered: number; reconciled: number }> {
  const synced = await syncModelCompletionForUser(
    params.supabase,
    params.userId
  );
  const recovered = await recoverProcessingModelsForUser({
    supabase: params.supabase,
    userId: params.userId,
    userEmail: params.userEmail,
  });
  const reconciled = await reconcileStaleModelsForUser({
    supabase: params.supabase,
    userId: params.userId,
    userEmail: params.userEmail,
  });

  return { synced, recovered, reconciled };
}
