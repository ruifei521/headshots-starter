"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

interface NavLinksProps {
  packsIsEnabled: boolean;
  stripeIsConfigured: boolean;
}

export default function NavLinks({ packsIsEnabled, stripeIsConfigured }: NavLinksProps) {
  const router = useRouter();
  const linksRef = useRef<HTMLAnchorElement>(null);

  // Simple click handler using window.location as fallback
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    // Use window.location for reliable navigation
    window.location.href = href;
  };

  return (
    <nav className="hidden md:flex gap-6 items-center">
      <Link 
        href="/overview" 
        onClick={(e) => handleClick(e, "/overview")}
        className="px-3 py-2 inline-flex items-center text-sm font-medium hover:text-primary transition-colors cursor-pointer"
      >
        Home
      </Link>
      {packsIsEnabled && (
        <Link 
          href="/overview/packs"
          onClick={(e) => handleClick(e, "/overview/packs")}
          className="px-3 py-2 inline-flex items-center text-sm font-medium hover:text-primary transition-colors cursor-pointer"
        >
          Packs
        </Link>
      )}
      {stripeIsConfigured && (
        <Link 
          href="/get-credits"
          onClick={(e) => handleClick(e, "/get-credits")}
          className="px-3 py-2 inline-flex items-center text-sm font-medium hover:text-primary transition-colors cursor-pointer"
        >
          Get Credits
        </Link>
      )}
    </nav>
  );
}
