"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";
import { Button } from "./ui/button";
import UserDropdown from "./UserDropdown";
import MobileNavSheet from "./MobileNavSheet";
import NavLinks from "./NavLinks";
import { ThemeToggle } from "./homepage/theme-toggle";
import { isPublicMarketingPath } from "@/lib/public-paths";

/**
 * Client nav shell — public pages use getSession() (local) instead of getUser() (network).
 */
export default function NavbarClient() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const publicPage = isPublicMarketingPath(pathname);

    const loadAuth = async () => {
      if (publicPage) {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } else {
        const { data } = await supabase.auth.getUser();
        setUser(data.user ?? null);
      }
      setReady(true);
    };

    void loadAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [pathname]);

  return (
    <>
      <div className="hidden md:flex flex-1 justify-center min-w-0">
        <NavLinks isLoggedIn={!!user} ready={ready} />
      </div>

      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <ThemeToggle />

        {!ready ? (
          <div className="hidden sm:block h-9 w-24 rounded-md bg-muted/50 animate-pulse" aria-hidden />
        ) : !user ? (
          <div className="hidden sm:flex items-center gap-4">
            <Link
              href="/login"
              className="text-base font-semibold hover:text-primary transition-colors py-2 min-h-[44px] flex items-center"
            >
              Sign in
            </Link>
            <Link href="/pricing">
              <Button className="min-h-[44px]">Create headshots</Button>
            </Link>
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-4">
            <UserDropdown user={user} />
          </div>
        )}

        <MobileNavSheet isLoggedIn={!!user} ready={ready} />
      </div>
    </>
  );
}
