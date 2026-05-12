"use client";

import Link from "next/link";

interface NavLinksProps {
  packsIsEnabled: boolean;
  stripeIsConfigured: boolean;
}

export default function NavLinks({ packsIsEnabled, stripeIsConfigured }: NavLinksProps) {
  return (
    <nav className="hidden md:flex gap-6 items-center">
      <Link 
        href="/overview" 
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
      {stripeIsConfigured && (
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
