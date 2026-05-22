"use client";

import Link from "next/link";

interface NavLinksProps {
  packsIsEnabled: boolean;
  paymentIsConfigured: boolean;
}

export default function NavLinks({ packsIsEnabled, paymentIsConfigured }: NavLinksProps) {
  return (
    <nav className="hidden md:flex gap-6 items-center">
      <Link 
        href="/" 
        className="px-3 py-2 inline-flex items-center text-sm font-medium hover:text-primary transition-colors cursor-pointer"
      >
        Home
      </Link>
      {packsIsEnabled && (
        <Link 
          href="/overview/packs"
          className="px-3 py-2 inline-flex items-center text-sm font-medium hover:text-primary transition-colors cursor-pointer"
        >
          Packs
        </Link>
      )}
      {paymentIsConfigured && (
        <Link 
          href="/get-credits"
          className="px-3 py-2 inline-flex items-center text-sm font-medium hover:text-primary transition-colors cursor-pointer"
        >
          Get Credits
        </Link>
      )}
    </nav>
  );
}
