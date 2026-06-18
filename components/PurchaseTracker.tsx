"use client"

import { useEffect, useRef } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Database } from "@/types/supabase"
import { TIERS, isTier } from "@/lib/tiers"

const POLL_MS = 2000
const MAX_ATTEMPTS = 45

/**
 * Fires a GA4 purchase event once credits are confirmed (not on forged ?payment=success).
 */
export default function PurchaseTracker({
  tier,
  currency = "USD",
  transactionId,
  requireCredits = false,
}: {
  tier?: string
  currency?: string
  transactionId?: string
  /** When true, wait until credits >= 1 before firing (post-checkout). */
  requireCredits?: boolean
}) {
  const firedRef = useRef(false)

  useEffect(() => {
    if (firedRef.current) return

    const firePurchase = () => {
      if (firedRef.current) return
      if (typeof window === "undefined" || !(window as any).gtag) return

      firedRef.current = true
      const tierInfo = tier && isTier(tier) ? TIERS[tier] : TIERS.starter
      const value = tierInfo.price

      ;(window as any).gtag("event", "purchase", {
        currency,
        value,
        transaction_id: transactionId ?? `snapprohead-${tier ?? "starter"}-${Date.now()}`,
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

    if (!requireCredits) {
      firePurchase()
      return
    }

    const supabase = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    let cancelled = false
    let attempts = 0

    const check = async () => {
      attempts += 1
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user || cancelled) return

      const { data } = await supabase
        .from("credits")
        .select("credits")
        .eq("user_id", user.id)
        .maybeSingle()

      if (cancelled) return
      if (data && data.credits >= 1) {
        firePurchase()
        return
      }
      if (attempts >= MAX_ATTEMPTS) {
        // Do not fire purchase if payment never confirmed
        cancelled = true
      }
    }

    check()
    const interval = window.setInterval(check, POLL_MS)
    return () => {
      cancelled = true
      window.clearInterval(interval)
    }
  }, [currency, requireCredits, tier, transactionId])

  return null
}
