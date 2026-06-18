"use client";

import Link from "next/link";

interface NavLinksProps {
  isLoggedIn?: boolean;
  ready?: boolean;
}

export default function NavLinks({ isLoggedIn = false, ready = true }: NavLinksProps) {
  const links = [
    { href: "/examples", label: "Examples" },
    { href: "/pricing", label: "Pricing" },
  ];

  return (
    <nav className="hidden md:flex gap-4 sm:gap-6 items-center text-sm sm:text-base">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="px-3 py-2 inline-flex items-center text-base font-semibold hover:text-primary transition-colors cursor-pointer"
        >
          {link.label}
        </Link>
      ))}
      {isLoggedIn && (
        <Link
          href="/overview"
          className="px-3 py-2 inline-flex items-center text-base font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer"
        >
          My headshots
        </Link>
      )}
    </nav>
  );
}
