"use client";
import { Button } from "@/components/ui/button";
import { Database } from "@/types/supabase";
import { modelRowWithSamples } from "@/types/utils";
import { createBrowserClient } from "@supabase/ssr";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FaImages } from "react-icons/fa";
import ModelsTable from "../ModelsTable";
import { logger } from "@/lib/logger";

const packsIsEnabled = false; // ⭐ 不再使用 Pack 选择，直接进入训练

export const revalidate = 0;

type ClientSideModelsListProps = {
  serverModels: modelRowWithSamples[] | [];
};

export default function ClientSideModelsList({
  serverModels,
}: ClientSideModelsListProps) {
  const [models, setModels] = useState<modelRowWithSamples[]>(serverModels);
  const [error, setError] = useState<string | null>(null);

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
              .select("*")
              .eq("modelId", payload.new.id);

            const newModel: modelRowWithSamples = {
              ...payload.new,
              samples: samples.data,
            };

            setModels((prev) => {
              const dedupedModels = prev.filter(
                (model) => model.id !== payload.old?.id
              );
              return [...dedupedModels, newModel];
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
      {models && models.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-row gap-4 w-full justify-between items-center text-center">
            <h1>Your models</h1>
            <Link href="/overview/models/train/headshots" className="w-fit">
              <Button size={"sm"}>
                Train model
              </Button>
            </Link>
          </div>
          <ModelsTable models={models} />
        </div>
      )}
      {models && models.length === 0 && (
        <div className="flex flex-col gap-4 items-center">
          <FaImages size={64} className="text-gray-500" />
          <h1 className="text-2xl">
            Get started by training your first model.
          </h1>
          <div>
            <Link href="/overview/models/train/headshots">
              <Button size={"lg"}>Train model</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
