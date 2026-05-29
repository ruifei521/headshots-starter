"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Button } from "./ui/button";
import { ThemeToggle } from "./homepage/theme-toggle";
import UserDropdown from "./UserDropdown";

export default function NavbarClient() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <header className="sticky top-0 z-[100] w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <span>Loading...</span>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-[100] w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl cursor-pointer">
          <span>SnapProHead</span>
        </Link>

        {user && (
          <nav className="flex gap-4 sm:gap-6 items-center text-sm sm:text-base">
            <Link href="/overview" className="px-3 py-2 text-sm font-medium hover:text-primary transition-colors cursor-pointer">
              Home
            </Link>
          </nav>
        )}

        <div className="flex items-center gap-4">
          <ThemeToggle />

          {!user && (
            <>
              <Link href="/login" className="hidden sm:block text-sm font-medium hover:text-primary transition-colors py-2 cursor-pointer">
                Login
              </Link>
              <Link href="/#pricing">
                <Button>Create headshots</Button>
              </Link>
            </>
          )}

          {user && (
            <div className="flex items-center gap-4">
              <UserDropdown user={user} />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
