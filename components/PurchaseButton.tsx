"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PurchaseButton({ packSlug }: { packSlug: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handlePurchase() {
    setLoading(true);
    try {
      // First try checkout (requires login)
      const res = await fetch("/api/creem/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pack: packSlug }),
      });

      const data = await res.json();

      if (res.status === 401) {
        // Not logged in — redirect to login first
        router.push(`/login?redirect=/packs/${packSlug}`);
        return;
      }

      if (data?.url) {
        // Redirect to Creem checkout
        window.location.href = data.url;
      } else {
        console.error("No checkout URL returned");
        // Fallback: go directly to train page
        router.push(`/overview/models/train/${packSlug}`);
      }
    } catch (err) {
      console.error("Purchase error:", err);
      router.push(`/overview/models/train/${packSlug}`);
    }
  }

  return (
    <Button
      onClick={handlePurchase}
      disabled={loading}
      size="lg"
      className="w-full text-base font-bold"
    >
      {loading ? (
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
      ) : (
        <CreditCard className="mr-2 h-5 w-5" />
      )}
      {loading ? "Redirecting to payment..." : "Start Now — Upload Your Photos"}
      {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
    </Button>
  );
}
