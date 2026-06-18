import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/supabase";
import { runUserModelReconcile } from "@/lib/run-user-model-reconcile";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

/** Authenticated background reconcile while user keeps overview open. */
export async function POST() {
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

  try {
    const result = await runUserModelReconcile({
      supabase,
      userId: user.id,
      userEmail: user.email,
    });

    return NextResponse.json({
      ok: true,
      ...result,
      changed:
        result.synced > 0 || result.recovered > 0 || result.reconciled > 0,
    });
  } catch (error) {
    logger.error("reconcile-active failed:", error);
    return NextResponse.json({ error: "Reconcile failed" }, { status: 500 });
  }
}
