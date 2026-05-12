"use client";

import Link from "next/link";

interface NavLinksProps {
  packsIsEnabled: boolean;
  stripeIsConfigured: boolean;
}

export default function NavLinks({ packsIsEnabled, stripeIsConfigured }: NavLinksProps) {
  return (
    <nav className="hidden md:flex gap-6">
      <Link 
        href="/overview" 
        className="flex items-center min-h-[44px] py-1 text-sm font-medium hover:text-primary transition-colors"
      >
        Home
      </Link>
      {packsIsEnabled && (
        <Link 
          href="/overview/packs"
          className="flex items-center text-sm font-medium hover:text-primary transition-colors"
        >
          Packs
        </Link>
      )}
      {stripeIsConfigured && (
        <Link 
          href="/get-credits"
          className="flex items-center text-sm font-medium hover:text-primary transition-colors"
        >
          Get Credits
        </Link>
      )}
    </nav>
  );
}
