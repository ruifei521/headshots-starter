import ClientSideModelsList from "@/components/realtime/ClientSideModelsList";
import { Database } from "@/types/supabase";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from 'next'
import { logger } from "@/lib/logger";

export const metadata: Metadata = {
  title: 'Your AI Headshots Dashboard',
  description: 'Manage your AI headshot models, view generated results, and create new professional headshots.',
}

export const dynamic = "force-dynamic";

export default async function Index() {
    const supabase = createServerClient(
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
              // The `set` method was called from a Server Component.
            }
          });
        },
      },
    }
  );

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return redirect("/login");
    }

    const { data: models } = await supabase
      .from("models")
      .select(
        `id, name, type, status, tier, created_at, user_id, modelId, samples (*)`
      )
      .eq("user_id", user.id);

    // ⭐ 自动检测卡住的训练：training/processing 超过 60 分钟 + modelId 为空 → 标记为 failed
    const STALE_TIMEOUT_MIN = 60;
    const now = new Date();
    for (const m of models ?? []) {
      if (
        (m.status === "training" || m.status === "processing") &&
        !m.modelId &&
        m.created_at &&
        (now.getTime() - new Date(m.created_at).getTime()) / 60000 > STALE_TIMEOUT_MIN
      ) {
        await supabase.from("models").update({ status: "failed" }).eq("id", m.id);
        m.status = "failed";
      }
    }

    return <ClientSideModelsList serverModels={models ?? []} />;
  } catch (e) {
    // Supabase 临时不可用时优雅降级，防止触发 error.tsx 错误边界
    logger.error("Overview page: Supabase query failed, showing empty state:", e);
    return <ClientSideModelsList serverModels={[]} />;
  }
}
