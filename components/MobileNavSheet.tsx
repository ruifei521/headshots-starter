"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Menu, X, Camera } from "lucide-react";
import { Button } from "./ui/button";

interface MobileNavSheetProps {
  isLoggedIn?: boolean;
  ready?: boolean;
}

export default function MobileNavSheet({ isLoggedIn = false, ready = true }: MobileNavSheetProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    { href: "/pricing", label: "Pricing" },
  ];

  const menu = open ? (
    <div className="fixed inset-0 z-[9999] md:hidden" role="dialog" aria-modal="true" aria-label="Site menu">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* Slide-in Panel — solid bg so hero text never shows through */}
      <div className="absolute right-0 top-0 flex h-full w-[min(100vw,20rem)] flex-col border-l border-border bg-white shadow-2xl dark:bg-zinc-950 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-white px-4 dark:bg-zinc-950">
          <Link
            href="/"
            onClick={closeMenu}
            className="flex items-center gap-2 text-xl font-bold text-foreground"
          >
            <Camera className="h-5 w-5 text-primary" />
            <span>SnapProHead</span>
          </Link>
          <button
            onClick={closeMenu}
            className="flex h-10 w-10 items-center justify-center rounded-md hover:bg-accent transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto bg-white px-4 py-6 dark:bg-zinc-950">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className="rounded-md px-3 py-3 text-base font-semibold text-foreground hover:bg-accent hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
          {isLoggedIn && (
            <Link
              href="/overview"
              onClick={closeMenu}
              className="rounded-md px-3 py-3 text-base font-semibold text-primary hover:bg-accent transition-colors"
            >
              My headshots
            </Link>
          )}
        </nav>

        {/* CTA */}
        <div className="shrink-0 space-y-3 border-t border-border bg-white px-4 py-6 dark:bg-zinc-950">
          {!ready ? (
            <div className="h-11 w-full animate-pulse rounded-md bg-muted" aria-hidden />
          ) : isLoggedIn ? (
            <form action="/auth/sign-out" method="post">
              <Button type="submit" variant="outline" className="w-full min-h-11 bg-white dark:bg-zinc-950">
                Sign out
              </Button>
            </form>
          ) : (
            <>
              <Link href="/login" onClick={closeMenu} className="block">
                <Button variant="outline" className="w-full min-h-11 bg-white dark:bg-zinc-950">
                  Sign in
                </Button>
              </Link>
              <Link href="/pricing" onClick={closeMenu} className="block">
                <Button className="w-full min-h-11">Create headshots</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      {/* Hamburger Button - visible on mobile only */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden flex items-center justify-center h-10 w-10 rounded-md hover:bg-accent transition-colors"
        aria-label="Open menu"
        aria-expanded={open}
      >
        <Menu className="h-5 w-5" />
      </button>

      {mounted && menu ? createPortal(menu, document.body) : null}
    </>
  );
}
