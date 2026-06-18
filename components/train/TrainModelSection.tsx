"use client";

import { useEffect, useState } from "react";
import TrainCreditsGate from "@/components/TrainCreditsGate";
import TrainModelZone from "@/components/TrainModelZone";
import { TrainModelZoneErrorBoundary } from "@/components/TrainModelZoneErrorBoundary";

type Props = {
  packSlug: string;
  initialHasCredits: boolean;
  awaitingCredits: boolean;
};

function TrainFormLoader() {
  return (
    <div className="flex justify-center items-center py-20" aria-busy="true">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
    </div>
  );
}

/**
 * Client-only train form shell — wait for mount before rendering the upload form
 * to avoid React DOM errors from SSR/client tree mismatches.
 */
export function TrainModelSection({
  packSlug,
  initialHasCredits,
  awaitingCredits,
}: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <TrainFormLoader />;
  }

  return (
    <TrainCreditsGate
      initialHasCredits={initialHasCredits}
      awaitingCredits={awaitingCredits}
    >
      <TrainModelZoneErrorBoundary>
        <TrainModelZone packSlug={packSlug} />
      </TrainModelZoneErrorBoundary>
    </TrainCreditsGate>
  );
}
