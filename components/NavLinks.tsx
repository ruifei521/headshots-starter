"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

interface NavLinksProps {
  packsIsEnabled: boolean;
  stripeIsConfigured: boolean;
}

export default function NavLinks({ packsIsEnabled, stripeIsConfigured }: NavLinksProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    router.push(href);
  };

  return (
    <nav className="hidden md:flex gap-6">
      <Link 
        href="/overview" 
        onClick={(e) => handleClick(e, "/overview")}
        className="flex items-center min-h-[44px] py-1 text-sm font-medium hover:text-primary transition-colors"
      >
        Home
      </Link>
      {packsIsEnabled && (
        <Link 
          href="/overview/packs"
          onClick={(e) => handleClick(e, "/overview/packs")}
          className="flex items-center text-sm font-medium hover:text-primary transition-colors"
        >
          Packs
        </Link>
      )}
      {stripeIsConfigured && (
        <Link 
          href="/get-credits"
          onClick={(e) => handleClick(e, "/get-credits")}
          className="flex items-center text-sm font-medium hover:text-primary transition-colors"
        >
          Get Credits
        </Link>
      )}
    </nav>
  );
}
