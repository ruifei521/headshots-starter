"use client";

import { Database } from "@/types/supabase";
import { creditsRow } from "@/types/utils";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export const revalidate = 0;

type ClientSideCreditsProps = {
  creditsRow: creditsRow | null;
};

export default function ClientSideCredits({
  creditsRow,
}: ClientSideCreditsProps) {
  // Hooks must be called unconditionally at the top level
  const [credits, setCredits] = useState<creditsRow | null>(creditsRow);
  
  // Create Supabase client only once
  const [supabase] = useState(() =>
    createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  );

  useEffect(() => {
    if (!creditsRow) return;
    
    const channel = supabase
      .channel("realtime credits")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "credits" },
        (payload: { new: creditsRow }) => {
          setCredits(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, creditsRow]);

  if (!credits) return <p>Credits: 0</p>;

  return <p>Credits: {credits.credits}</p>;
}
