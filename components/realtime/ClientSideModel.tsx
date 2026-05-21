"use client";

import { Icons } from "@/components/icons";
import { Database } from "@/types/supabase";
import { imageRow, modelRow, sampleRow } from "@/types/utils";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState, useMemo } from "react";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";

export const revalidate = 0;

function TrainingProgressBanner({ model }: { model: modelRow }) {
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const ESTIMATED = 30; // minutes

  useEffect(() => {
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
  }, [model.created_at]);

  const remaining = Math.max(ESTIMATED - elapsed, 0);

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icons.spinner className="h-4 w-4 animate-spin text-primary" />
          <span className="font-medium text-sm">Training in Progress</span>
        </div>
        <span className="text-xs text-muted-foreground">
          ~{remaining} min remaining
        </span>
      </div>
      <Progress value={progress} className="h-3" />
      <p className="text-xs text-muted-foreground mt-2">
        AI is learning your facial features. You can close this page — we'll email you when it's done.
      </p>
    </div>
  );
}

type ClientSideModelProps = {
  serverModel: modelRow;
  serverImages: imageRow[];
  samples: sampleRow[];
};

export default function ClientSideModel({
  serverModel,
  serverImages,
  samples,
}: ClientSideModelProps) {
  const [model, setModel] = useState<modelRow>(serverModel);
  const [initError, setInitError] = useState<string | null>(null);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    return <div className="p-4 text-destructive">Missing Supabase configuration.</div>;
  }

  let supabase: ReturnType<typeof createClient<Database>>;
  try {
    supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
  } catch (e) {
    console.error("ClientSideModel: Failed to create Supabase client:", e);
    return <div className="p-4 text-destructive">Failed to connect.</div>;
  }

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
  }, [supabase, model, setModel]);

  return (
    <div id="train-model-container" className="w-full h-full">
      <div className="flex flex-col w-full mt-4 gap-8">
        {model.status === "processing" && (
          <TrainingProgressBanner model={model} />
        )}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-0">
          {samples && (
            <div className="flex w-full lg:w-1/2 flex-col gap-2">
              <h2 className="text-xl">Training Data</h2>
              <div className="flex flex-row gap-4 flex-wrap">
                {samples.map((sample) => (
                  <img
                    key={sample.id}
                    src={sample.uri}
                    className="rounded-md w-60 h-60 object-cover"
                    alt="Training sample"
                    loading="lazy"
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
                      <img
                        src={image.uri}
                        className="rounded-md w-60 object-cover"
                        alt="Generated headshot"
                        loading="lazy"
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
