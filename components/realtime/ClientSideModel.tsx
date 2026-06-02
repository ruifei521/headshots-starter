"use client";

import { Icons } from "@/components/icons";
import { Database } from "@/types/supabase";
import { imageRow, modelRow, sampleRow } from "@/types/utils";
import { createBrowserClient } from "@supabase/ssr";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { getTierInfo } from "@/lib/tiers";
import { logger } from "@/lib/logger";

export const revalidate = 0;

function TrainingProgressBanner({ model }: { model: Omit<modelRow, 'images_generated' | 'total_images'> & { images_generated?: number | null; total_images?: number | null } }) {
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const ESTIMATED = 30; // minutes

  // ⭐ 优先使用真实进度（images_generated / total_images）
  const generated = model.images_generated ?? 0;
  const total = model.total_images ?? 0;
  const hasRealProgress = total > 0;

  useEffect(() => {
    if (hasRealProgress) {
      // 真实进度：基于已生成图片数
      const pct = Math.round((generated / total) * 100);
      setProgress(pct);
      return; // 不需要 interval，由 realtime 订阅驱动
    }

    // Fallback: 基于时间的估算
    const update = () => {
      if (!model.created_at) return;
      const start = new Date(model.created_at).getTime();
      const elapsedMs = Date.now() - start;
      const mins = Math.floor(elapsedMs / 60000);
      const pct = Math.min(Math.round((mins / ESTIMATED) * 100), 95);
      setProgress(pct);
      setElapsed(mins);
    };
    update();
    const interval = setInterval(update, 5000);
    return () => clearInterval(interval);
  }, [model.created_at, hasRealProgress, generated, total]);

  const remaining = hasRealProgress 
    ? total - generated 
    : Math.max(ESTIMATED - elapsed, 0);

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {progress < 100 ? (
            <Icons.spinner className="h-4 w-4 animate-spin text-primary" />
          ) : (
            <span className="text-green-500">&#10003;</span>
          )}
          <span className="font-medium text-sm">
            {hasRealProgress 
              ? `Generating Images (${generated}/${total})`
              : "Training in Progress"}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          {hasRealProgress
            ? `${remaining} images remaining`
            : `~${remaining} min remaining`}
        </span>
      </div>
      <Progress value={progress} className="h-3" />
      <p className="text-xs text-muted-foreground mt-2">
        {hasRealProgress
          ? `AI is generating your headshots. ${generated} of ${total} images ready — you can close this page.`
          : "AI is learning your facial features. You can close this page — we'll email you when it's done."}
      </p>
    </div>
  );
}

/** ⭐ Tier badge component for model detail page */
function TierBadge({ tier }: { tier?: string }) {
  const tierInfo = getTierInfo(tier || 'starter');
  return (
    <div className="flex items-center gap-2 mb-3">
      <Badge variant="secondary" className="text-xs font-medium">
        {tierInfo.name} Plan
      </Badge>
      <span className="text-xs text-muted-foreground">
        {tierInfo.imageCount} HD headshots · {tierInfo.estimatedTime}
      </span>
    </div>
  );
}

type ClientSideModelProps = {
  serverModel: Omit<modelRow, 'images_generated' | 'total_images'>;
  serverImages: imageRow[];
  samples: sampleRow[];
};

export default function ClientSideModel({
  serverModel,
  serverImages,
  samples,
}: ClientSideModelProps) {
  const [model, setModel] = useState<Omit<modelRow, 'images_generated' | 'total_images'>>(serverModel);

  // ✅ 使用 createBrowserClient（SSR 兼容），而非 createClient + process.env
  const supabase = useMemo(() => {
    try {
      return createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
    } catch (e) {
      logger.error("ClientSideModel: Failed to create Supabase client:", e);
      return null;
    }
  }, []);

  if (!supabase) {
    return <div className="p-4 text-destructive">Missing Supabase configuration.</div>;
  }

  // ✅ 用 ref 存储 model，避免 useEffect 因 model 变化重复订阅
  const modelRef = useRef(model);
  modelRef.current = model;

  useEffect(() => {
    const channel = supabase
      .channel("realtime-model")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "models" },
        (payload: { new: modelRow }) => {
          setModel(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  // ⭐ Derive tier info for display
  const modelTier: string = (model as any).tier || 'starter';

  return (
    <div id="train-model-container" className="w-full h-full">
      <div className="flex flex-col w-full mt-4 gap-8">
        {(model.status === "processing" || model.status === "pending") && (
          <TrainingProgressBanner model={model} />
        )}
        {/* ⭐ Display tier info */}
        <TierBadge tier={modelTier} />
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-0">
          {samples && (
            <div className="flex w-full lg:w-1/2 flex-col gap-2">
              <h2 className="text-xl">Training Data</h2>
              <div className="flex flex-row gap-4 flex-wrap">
                {samples.map((sample) => (
                  <Image
                    key={sample.id}
                    src={sample.uri}
                    className="rounded-md w-60 h-60 object-cover"
                    alt="Training sample"
                    width={240}
                    height={240}
                    unoptimized
                  />
                ))}
              </div>
            </div>
          )}
          <div className="flex flex-col w-full lg:w-1/2 rounded-md">
            {model.status === "finished" && (
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h1 className="text-xl">Results</h1>
                  <button
                    onClick={async () => {
                      for (const img of serverImages) {
                        try {
                          const a = document.createElement('a');
                          a.href = img.uri;
                          a.download = img.uri.split('/').pop() || 'headshot.jpg';
                          a.click();
                          await new Promise(r => setTimeout(r, 500));
                        } catch {}
                      }
                    }}
                    className="text-xs text-primary hover:underline"
                  >
                    Download All ({serverImages?.length || 0})
                  </button>
                </div>
                <div className="flex flex-row flex-wrap gap-4">
                  {serverImages?.map((image) => (
                    <div key={image.id}>
                      <Image
                        src={image.uri}
                        className="rounded-md w-60 object-cover"
                        alt="Generated headshot"
                        width={240}
                        height={240}
                        unoptimized
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
