"use client";
import { Button } from "@/components/ui/button";
import { Database } from "@/types/supabase";
import { modelRowWithSamples } from "@/types/utils";
import { createBrowserClient } from "@supabase/ssr";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FaImages } from "react-icons/fa";
import { Suspense } from "react";
import ModelsTable from "../ModelsTable";
import { CheckoutResumeBanner } from "../CheckoutResumeBanner";
import { logger } from "@/lib/logger";
import { isModelGenerating } from "@/lib/model-status-label";

const packsIsEnabled = false; // ⭐ 不再使用 Pack 选择，直接进入训练

export const revalidate = 0;

type ClientSideModelsListProps = {
  serverModels: modelRowWithSamples[] | [];
  creditsAvailable?: number | null;
};

export default function ClientSideModelsList({
  serverModels,
  creditsAvailable = null,
}: ClientSideModelsListProps) {
  const [models, setModels] = useState<modelRowWithSamples[]>(serverModels);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setModels(serverModels);
  }, [serverModels]);

  useEffect(() => {
    const hasInProgress = models.some((m) => isModelGenerating(m));
    if (!hasInProgress) return;

    const refreshOverview = () => {
      router.refresh();
    };

    const runBackgroundReconcile = async () => {
      try {
        const res = await fetch("/api/models/reconcile-active", {
          method: "POST",
        });
        if (!res.ok) return;
        const data = (await res.json()) as { changed?: boolean };
        if (data.changed) {
          router.refresh();
        }
      } catch {
        // non-blocking
      }
    };

    refreshOverview();
    void runBackgroundReconcile();

    const refreshInterval = setInterval(refreshOverview, 30_000);
    const reconcileInterval = setInterval(runBackgroundReconcile, 45_000);

    return () => {
      clearInterval(refreshInterval);
      clearInterval(reconcileInterval);
    };
  }, [models, router]);

  // ✅ 使用 createBrowserClient（SSR 兼容），useMemo 只创建一次
  const supabase = useMemo(() => {
    try {
      return createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
    } catch (e) {
      logger.error("Failed to create Supabase client:", e);
      setError("Failed to connect to database. Please try again later.");
      return null;
    }
  }, []);

  useEffect(() => {
    if (!supabase) return;

    const channel = supabase
      .channel("realtime-models")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "models" },
        async (payload: any) => {
          try {
            const samples = await supabase
              .from("samples")
              .select("id, uri, modelId, created_at")
              .eq("modelId", payload.new.id)
              .order("id", { ascending: true })
              .limit(3);

            const newModel: modelRowWithSamples = {
              ...payload.new,
              samples: samples.data,
            };

            setModels((prev) => {
              const dedupedModels = prev.filter(
                (m) => m.id !== payload.new.id
              );
              return [newModel, ...dedupedModels];
            });
          } catch (e) {
            logger.error("Realtime update error:", e);
          }
        }
      )
      .subscribe((status, err) => {
        if (err) {
          logger.error("Realtime subscription error:", err);
        }
      });

    return () => {
      try {
        supabase.removeChannel(channel);
      } catch (e) {
        // ignore cleanup errors
      }
    };
  }, [supabase]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16">
        <p className="text-destructive">{error}</p>
        <Link href="/">
          <Button variant="outline">Go Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div id="train-model-container" className="w-full">
      <Suspense fallback={null}>
        <CheckoutResumeBanner />
      </Suspense>
      {creditsAvailable !== null && (
        <div className="mb-6 rounded-lg border bg-muted/40 px-4 py-3 text-sm">
          <span className="text-muted-foreground">Headshot credits: </span>
          <span className="font-semibold">{Math.max(0, creditsAvailable)}</span>
          {creditsAvailable < 1 && (
            <span className="ml-2">
              <Link href="/pricing" className="text-primary underline underline-offset-2">
                Get a plan
              </Link>
            </span>
          )}
        </div>
      )}
      {models && models.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-xl font-semibold sm:text-2xl">Your headshots</h1>
            <Link href="/overview/models/train/corporate-headshots" className="w-full sm:w-fit">
              <Button size="default" className="h-11 w-full sm:h-9 sm:w-auto">
                Create headshots
              </Button>
            </Link>
          </div>
          <ModelsTable models={models} />
        </div>
      )}
      {models && models.length === 0 && (
        <div className="flex flex-col gap-4 items-center px-2 py-8 text-center sm:px-0">
          <FaImages size={56} className="text-muted-foreground" />
          <h1 className="text-xl font-semibold sm:text-2xl">
            Get started — upload photos to create your headshots.
          </h1>
          <Link href="/overview/models/train/corporate-headshots" className="w-full max-w-xs sm:w-auto">
            <Button size="lg" className="h-12 w-full sm:w-auto">
              Create headshots
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
