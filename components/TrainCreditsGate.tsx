"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import {
  PAYMENT_CONFIRM_MAX_ATTEMPTS,
  PAYMENT_CONFIRM_POLL_MS,
} from "@/lib/payment-confirmation";

type Props = {
  children: ReactNode;
  /** Server already confirmed credits — skip gate */
  initialHasCredits: boolean;
  /** Post-payment: webhook may lag before credits appear */
  awaitingCredits: boolean;
};

/**
 * After Creem checkout, credits can take a few seconds to land via webhook.
 * Avoid kicking the user back to pricing while payment is still confirming.
 */
export default function TrainCreditsGate({
  children,
  initialHasCredits,
  awaitingCredits,
}: Props) {
  const [ready, setReady] = useState(initialHasCredits || !awaitingCredits);
  const [timedOut, setTimedOut] = useState(false);
  const [pollGeneration, setPollGeneration] = useState(0);

  useEffect(() => {
    if (ready || !awaitingCredits) return;

    setTimedOut(false);

    const supabase = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    let cancelled = false;
    let attempts = 0;

    const check = async () => {
      attempts += 1;
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || cancelled) return;

      const { data } = await supabase
        .from("credits")
        .select("credits")
        .eq("user_id", user.id)
        .order("id", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (cancelled) return;

      if (data && data.credits >= 1) {
        setReady(true);
        return;
      }

      if (attempts >= PAYMENT_CONFIRM_MAX_ATTEMPTS) {
        setTimedOut(true);
      }
    };

    check();
    const interval = window.setInterval(check, PAYMENT_CONFIRM_POLL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [awaitingCredits, ready, pollGeneration]);

  if (ready) {
    return <>{children}</>;
  }

  if (timedOut) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center px-4">
        <p className="font-medium">Still confirming your payment</p>
        <p className="text-sm text-muted-foreground max-w-md">
          Your payment was received. Credits usually appear within a few minutes.
          Tap &quot;Check again&quot; if you just finished paying — especially on
          slower mobile networks.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Button
            size="sm"
            onClick={() => {
              setTimedOut(false);
              setPollGeneration((g) => g + 1);
            }}
          >
            Check again
          </Button>
          <Button size="sm" variant="outline" onClick={() => window.location.reload()}>
            Refresh page
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href="/pricing">Back to pricing</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center px-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="font-medium">Confirming your payment…</p>
      <p className="text-sm text-muted-foreground max-w-sm">
        This usually takes a few seconds. Please don&apos;t close this page — you
        can switch apps and come back.
      </p>
    </div>
  );
}
