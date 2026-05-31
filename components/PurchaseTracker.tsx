"use client";

import { useEffect } from "react";
import { TIERS, isTier } from "@/lib/tiers";

interface PurchaseTrackerProps {
  tier?: string;
  currency?: string;
  transactionId?: string;
}

export default function PurchaseTracker({
  tier,
  currency = "USD",
  transactionId,
}: PurchaseTrackerProps) {
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      const tierInfo = tier && isTier(tier) ? TIERS[tier] : TIERS["starter"];
      const value = tierInfo.price;

      (window as any).gtag("event", "purchase", {
        currency,
        value,
        transaction_id: transactionId ?? `unknown-${Date.now()}`,
        items: [
          {
            item_id: tier || "starter",
            item_name: tierInfo.name,
            price: value,
            quantity: 1,
          },
        ],
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
