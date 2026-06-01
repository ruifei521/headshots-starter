"use client";

import { Database } from "@/types/supabase";
import { creditsRow } from "@/types/utils";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useRef, useState } from "react";
import { logger } from "@/lib/logger";

export const revalidate = 0;

type ClientSideCreditsProps = {
  creditsRow: creditsRow | null;
};

export default function ClientSideCredits({
  creditsRow,
}: ClientSideCreditsProps) {
  const [credits, setCredits] = useState<creditsRow | null>(creditsRow);
  const supabaseRef = useRef<ReturnType<typeof createClient<Database>> | null>(null);

  useEffect(() => {
    if (!creditsRow) return;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey) return;

    let supabase: ReturnType<typeof createClient<Database>>;
    try {
      supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
      supabaseRef.current = supabase;
    } catch (e) {
      logger.error("Failed to create Supabase client for credits:", e);
      return;
    }

    const channel = supabase
      .channel("realtime credits")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "credits" },
        (payload: { new: creditsRow }) => {
          setCredits(payload.new);
        }
      )
      .subscribe((status, err) => {
        if (err) {
          logger.error("Credits subscription error:", err);
        }
      });

    return () => {
      try {
        supabase.removeChannel(channel);
      } catch (e) {
        // ignore cleanup errors
      }
    };
  }, [creditsRow]);

  if (!credits) return <p>Credits: 0</p>;

  return <p>Credits: {credits.credits}</p>;
}
