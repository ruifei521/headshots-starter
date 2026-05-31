"use client"

import { useEffect } from "react"
import { TIERS, isTier } from "@/lib/tiers"

/**
 * Fires a GA4 purchase event once on client mount.
 * Placed on the post-checkout success page (/overview/models/train/[pack]).
 * Uses window.gtag (injected by @next/third-parties/google).
 *
 * Tier-based pricing lookup (from lib/tiers.ts):
 *   starter      → $29 (40 images)
 *   professional → $39 (60 images)
 *   executive    → $59 (100 images)
 */
export default function PurchaseTracker({
  tier,
  currency = "USD",
  transactionId,
}: {
  /** Tier slug from checkout success_url query param */
  tier?: string
  currency?: string
  transactionId?: string
}) {
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      // Look up price from tiers.ts; fallback to $29 (starter)
      const tierInfo = tier && isTier(tier) ? TIERS[tier] : TIERS["starter"]
      const value = tierInfo.price

      ;(window as any).gtag("event", "purchase", {
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
      })
    }
  }, []) // fire once

  return null
}
