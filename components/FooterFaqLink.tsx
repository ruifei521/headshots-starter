"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function FooterFaqLink() {
  const pathname = usePathname();
  const href =
    pathname === "/" || pathname === "/pricing" ? "#faq" : "/pricing#faq";

  return (
    <Link
      href={href}
      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      FAQ
    </Link>
  );
}
