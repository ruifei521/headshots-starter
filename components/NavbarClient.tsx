"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/types/supabase";
import { Button } from "./ui/button";
import ClientSideCredits from "./realtime/ClientSideCredits";
import { ThemeToggle } from "./homepage/theme-toggle";
import UserDropdown from "./UserDropdown";

export default function NavbarClient() {
  const [user, setUser] = useState<any>(null);
  const [credits, setCredits] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const stripeIsConfigured = process.env.NEXT_PUBLIC_STRIPE_IS_ENABLED === "true";
  const packsIsEnabled = process.env.NEXT_PUBLIC_TUNE_TYPE === "packs";

  useEffect(() => {
    const supabase = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Get user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      
      if (user) {
        // Get credits
        supabase
          .from("credits")
          .select("*")
          .eq("user_id", user.id)
          .single()
          .then(({ data }) => {
            setCredits(data);
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
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
          <nav className="hidden md:flex gap-6 items-center">
            <Link href="/overview" className="px-3 py-2 text-sm font-medium hover:text-primary transition-colors cursor-pointer">
              Home
            </Link>
            {packsIsEnabled && (
              <Link href="/overview/packs" className="px-3 py-2 text-sm font-medium hover:text-primary transition-colors cursor-pointer">
                Packs
              </Link>
            )}
            {stripeIsConfigured && (
              <Link href="/get-credits" className="px-3 py-2 text-sm font-medium hover:text-primary transition-colors cursor-pointer">
                Get Credits
              </Link>
            )}
          </nav>
        )}
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          {!user && (
            <>
              <Link href="/login" className="hidden sm:block text-sm font-medium hover:text-primary transition-colors py-2 cursor-pointer">
                Login
              </Link>
              <Link href="/login">
                <Button>Create headshots</Button>
              </Link>
            </>
          )}

          {user && (
            <div className="flex items-center gap-4">
              {stripeIsConfigured && (
                <ClientSideCredits creditsRow={credits ? credits : null} />
              )}
              <UserDropdown user={user} />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
