"use client";

import Link from "next/link";

export default function NavLinks() {
  const links = [
    { href: "/#how-it-works", label: "How It Works" },
    { href: "/examples", label: "Examples" },
    { href: "/#pricing", label: "Pricing" },
  ];

  return (
    <nav className="flex gap-4 sm:gap-6 items-center text-sm sm:text-base">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="px-3 py-2 inline-flex items-center text-base font-semibold hover:text-primary transition-colors cursor-pointer"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
