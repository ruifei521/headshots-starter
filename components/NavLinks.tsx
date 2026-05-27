"use client";

import Link from "next/link";

export default function NavLinks() {
  return (
    <nav className="flex gap-4 sm:gap-6 items-center text-sm sm:text-base">
      <Link 
        href="/templates"
        className="px-3 py-2 inline-flex items-center text-base font-semibold hover:text-primary transition-colors cursor-pointer"
      >
        Templates
      </Link>
      <Link 
        href="/#pricing"
        className="px-3 py-2 inline-flex items-center text-base font-semibold hover:text-primary transition-colors cursor-pointer"
      >
        Pricing
      </Link>
    </nav>
  );
}
