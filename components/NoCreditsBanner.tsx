"use client";

import { useSearchParams } from "next/navigation";

/** Client-only so /pricing can stay ISR (revalidate) without server searchParams. */
export function NoCreditsBanner() {
  const searchParams = useSearchParams();
  if (searchParams.get("reason") !== "no_credits") return null;

  return (
    <div className="border-b bg-amber-50 dark:bg-amber-950/30">
      <div className="container max-w-4xl mx-auto px-4 py-3 text-sm text-amber-900 dark:text-amber-100">
        Choose a plan below to upload photos and create your headshots.
      </div>
    </div>
  );
}
