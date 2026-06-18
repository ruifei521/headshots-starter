"use client";

import { useEffect, useRef } from "react";
import { CheckCircle2 } from "lucide-react";
import { TIERS, isTier, type Tier } from "@/lib/tiers";
import { useToast } from "@/components/ui/use-toast";

type Props = {
  tier?: string;
};

/** Compact post-payment confirmation on the upload page. */
export default function PaymentSuccessBanner({ tier }: Props) {
  const resolvedTier: Tier = tier && isTier(tier) ? tier : "starter";
  const tierInfo = TIERS[resolvedTier];
  const { toast } = useToast();
  const toasted = useRef(false);

  useEffect(() => {
    if (toasted.current) return;
    toasted.current = true;
    toast({
      title: "Payment successful",
      description: `Your ${tierInfo.name} plan is ready. Upload 4+ photos below.`,
      duration: 6000,
    });
  }, [tierInfo.name, toast]);

  return (
    <div
      role="status"
      className="mb-4 rounded-lg border border-green-200 bg-green-50 dark:bg-green-950/30 dark:border-green-900 px-4 py-3 text-sm text-green-900 dark:text-green-100"
    >
      <div className="flex items-start gap-2">
        <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600 dark:text-green-400 mt-0.5" />
        <p className="font-semibold">
          {tierInfo.name} plan active — upload your photos below to start (~
          {tierInfo.estimatedTime}).
        </p>
      </div>
    </div>
  );
}
