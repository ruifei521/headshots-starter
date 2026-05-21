"use client";

import { Icons } from "@/components/icons";
import { Database } from "@/types/supabase";
import { imageRow, modelRow, sampleRow } from "@/types/utils";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { AspectRatio } from "../ui/aspect-ratio";
import { Badge } from "../ui/badge";

export const revalidate = 0;

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
