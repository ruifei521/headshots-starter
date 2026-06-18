"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { checkoutGoPath, DEFAULT_PACK } from "@/lib/checkout-url";
import { getTierInfo } from "@/lib/tiers";

/**
 * Shown on /overview after sign-in from pricing — user chooses when to open Creem.
 */
export function CheckoutResumeBanner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tier = searchParams.get("checkout");
  const pack = searchParams.get("pack") || DEFAULT_PACK;

  useEffect(() => {
    if (!tier) return;
    const url = new URL(window.location.href);
    if (url.searchParams.has("intent")) {
      url.searchParams.delete("intent");
      router.replace(url.pathname + url.search, { scroll: false });
    }
  }, [tier, router]);

  if (!tier) return null;

  const tierInfo = getTierInfo(tier);
  const checkoutHref = checkoutGoPath(tier, pack);

  const dismiss = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("checkout");
    url.searchParams.delete("pack");
    router.replace(url.pathname + url.search, { scroll: false });
  };

  return (
    <div className="mb-6 rounded-lg border border-primary/30 bg-primary/5 p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-foreground">
            Complete your {tierInfo.name} purchase
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            You&apos;re signed in. Continue to secure checkout when you&apos;re
            ready.
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
            <Button asChild className="h-11 w-full sm:w-auto">
              <Link href={checkoutHref}>
                Continue to checkout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={dismiss}
            >
              Not now
            </Button>
          </div>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
