"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { checkoutErrorMessage } from "@/lib/payment-confirmation";

/** Shows checkout error toast from ?checkout=error and cleans the URL. */
export function CheckoutStatusHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const status = searchParams.get("checkout");
    if (status !== "error") return;

    const reason = searchParams.get("reason");

    toast({
      title: "Checkout unavailable",
      description: checkoutErrorMessage(reason),
      variant: "destructive",
      duration: 10000,
    });

    const url = new URL(window.location.href);
    url.searchParams.delete("checkout");
    url.searchParams.delete("reason");
    router.replace(url.pathname + url.search + url.hash, { scroll: false });
  }, [searchParams, router, toast]);

  return null;
}
