"use client";

import { useState, type ReactNode } from "react";
import { Loader2 } from "lucide-react";

type Props = {
  href: string;
  className?: string;
  onNavigate?: () => void;
  children: ReactNode;
};

/**
 * Checkout CTA — native navigation to /api/creem/go.
 * Server redirects guests to /login?intent=checkout and signed-in users to Creem.
 * Avoids client-side getSession() which can hang indefinitely on mobile Safari.
 */
export function CheckoutLink({ href, className, onNavigate, children }: Props) {
  const [loading, setLoading] = useState(false);

  return (
    <a
      href={href}
      className={className}
      aria-busy={loading}
      onClick={(event) => {
        if (loading) {
          event.preventDefault();
          return;
        }
        setLoading(true);
        onNavigate?.();
      }}
    >
      {loading ? (
        <span className="inline-flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          Redirecting…
        </span>
      ) : (
        children
      )}
    </a>
  );
}
