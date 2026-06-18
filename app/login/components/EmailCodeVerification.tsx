"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Database } from "@/types/supabase";
import { createBrowserClient } from "@supabase/ssr";
import { ArrowLeft } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { hardNavigate } from "@/lib/hard-navigate";
import { resolvePostLoginDestination } from "@/lib/auth-redirect";

const RESEND_COOLDOWN_SECONDS = 60;

type EmailCodeVerificationProps = {
  email: string;
  onBack: () => void;
  onResend: () => Promise<boolean>;
  resending: boolean;
};

export function EmailCodeVerification({
  email,
  onBack,
  onResend,
  resending,
}: EmailCodeVerificationProps) {
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(RESEND_COOLDOWN_SECONDS);
  const { toast } = useToast();

  const supabase = useMemo(
    () =>
      createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
  );

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = window.setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [resendCooldown]);

  const verifyCode = async () => {
    const token = otp.replace(/\s/g, "");
    if (token.length < 6) {
      toast({
        title: "Enter the 6-digit code",
        variant: "destructive",
        duration: 4000,
      });
      return;
    }

    setVerifying(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: "email",
      });

      if (error) {
        toast({
          title: "Invalid or expired code",
          description: error.message,
          variant: "destructive",
          duration: 6000,
        });
        setVerifying(false);
        return;
      }

      const redirect = sessionStorage.getItem("postLoginRedirect");
      sessionStorage.removeItem("postLoginRedirect");
      setVerifying(false);
      setTimeout(() => {
        hardNavigate(resolvePostLoginDestination(redirect || "/overview"));
      }, 0);
    } catch {
      setVerifying(false);
      toast({
        title: "Connection problem",
        description: "Check your network and try again.",
        variant: "destructive",
        duration: 6000,
      });
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!verifying) {
      void verifyCode();
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || resending) return;
    const ok = await onResend();
    if (ok) {
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
      toast({
        title: "New code sent",
        description: "Check your inbox for the latest 6-digit code.",
        duration: 5000,
      });
    }
  };

  return (
    <>
      <h1 className="text-xl font-semibold">Enter your sign-in code</h1>
      <p className="text-sm text-muted-foreground">
        We sent a 6-digit code to <strong className="text-foreground">{email}</strong>.
        Stay on this page and type the code below — you won&apos;t need to open a new tab.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <label htmlFor="login-otp" className="text-xs font-medium">
          6-digit code
        </label>
        <Input
          id="login-otp"
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="123456"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
          maxLength={6}
          autoFocus
        />
        <Button type="submit" disabled={verifying} className="w-full">
          {verifying ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1 hover:text-foreground"
        >
          <ArrowLeft size={14} />
          Change email
        </button>
        <button
          type="button"
          onClick={handleResend}
          disabled={resending || resendCooldown > 0}
          className="hover:text-foreground disabled:opacity-50"
        >
          {resending
            ? "Sending…"
            : resendCooldown > 0
              ? `Resend in ${resendCooldown}s`
              : "Resend code"}
        </button>
      </div>
    </>
  );
}
