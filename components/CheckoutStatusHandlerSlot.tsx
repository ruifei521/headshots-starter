"use client";

import { Suspense } from "react";
import { CheckoutStatusHandler } from "@/components/CheckoutStatusHandler";

/** Mount on pricing/login only — handles ?checkout=error toast. */
export function CheckoutStatusHandlerSlot() {
  return (
    <Suspense fallback={null}>
      <CheckoutStatusHandler />
    </Suspense>
  );
}
