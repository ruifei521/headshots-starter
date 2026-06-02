"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Camera } from "lucide-react";
import { Button } from "./ui/button";

interface MobileNavSheetProps {
  isLoggedIn?: boolean;
}

export default function MobileNavSheet({ isLoggedIn = false }: MobileNavSheetProps) {
  const [open, setOpen] = useState(false);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const closeMenu = () => setOpen(false);

  const links = [
    { href: "/examples", label: "Examples" },
    { href: "/#pricing", label: "Pricing" },
  ];

  return (
    <>
      {/* Hamburger Button - visible on mobile only */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden flex items-center justify-center h-10 w-10 rounded-md hover:bg-accent transition-colors"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Overlay + Slide-in Menu */}
      {open && (
        <div className="fixed inset-0 z-[200] md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeMenu}
          />

          {/* Slide-in Panel */}
          <div className="absolute right-0 top-0 h-full w-72 bg-background shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between px-4 h-16 border-b">
                <Link
                  href="/"
                  onClick={closeMenu}
                  className="flex items-center gap-2 font-bold text-xl"
                >
                  <Camera className="h-5 w-5 text-primary" />
                  <span>SnapProHead</span>
                </Link>
                <button
                  onClick={closeMenu}
                  className="flex items-center justify-center h-10 w-10 rounded-md hover:bg-accent transition-colors"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Nav Links */}
              <nav className="flex flex-col px-4 py-6 gap-1">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className="px-3 py-3 text-base font-semibold hover:text-primary hover:bg-accent rounded-md transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                {isLoggedIn && (
                  <Link
                    href="/overview"
                    onClick={closeMenu}
                    className="px-3 py-3 text-base font-semibold text-primary hover:bg-accent rounded-md transition-colors"
                  >
                    My Models
                  </Link>
                )}
              </nav>

              {/* CTA */}
              <div className="mt-auto px-4 py-6 border-t space-y-3">
                {!isLoggedIn && (
                  <>
                    <Link href="/login" onClick={closeMenu} className="block">
                      <Button variant="outline" className="w-full">
                        Login
                      </Button>
                    </Link>
                    <Link href="/#pricing" onClick={closeMenu} className="block">
                      <Button className="w-full">Create headshots</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
