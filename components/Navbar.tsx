"use client";

import { Camera } from "lucide-react"
import Link from "next/link";
import { Button } from "./ui/button";
import React from "react";
import ClientSideCredits from "./realtime/ClientSideCredits";
import { ThemeToggle } from "./homepage/theme-toggle";
import UserDropdown from "./UserDropdown";
import { createBrowserClient } from "@supabase/ssr";

export const dynamic = "force-dynamic";

const stripeIsConfigured = process.env.NEXT_PUBLIC_STRIPE_IS_ENABLED === "true";
const packsIsEnabled = process.env.NEXT_PUBLIC_TUNE_TYPE === "packs";

export default function Navbar() {
  const [user, setUser] = React.useState<any>(null);
  const [credits, setCredits] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);

      if (user) {
        supabase
          .from("credits")
          .select("*")
          .eq("user_id", user.id)
          .single()
          .then(({ data }) => {
            setCredits(data);
          });
      }
    });
  }, []);

  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    window.location.href = href;
  };

  if (loading) {
    return (
      <header className="sticky top-0 z-[100] w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Camera className="h-5 w-5 text-primary" />
            <span>Headshots AI</span>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-[100] w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <a 
          href="/" 
          className="flex items-center gap-2 font-bold text-xl cursor-pointer hover:text-primary transition-colors"
          onClick={(e) => handleNavigation(e, "/")}
        >
          <Camera className="h-5 w-5 text-primary" />
          <span>Headshots AI</span>
        </a>
        
        {user && (
          <nav className="hidden md:flex gap-6 items-center">
            <a 
              href="/overview" 
              className="text-sm font-medium hover:text-primary transition-colors cursor-pointer"
              onClick={(e) => handleNavigation(e, "/overview")}
            >
              Home
            </a>
            {packsIsEnabled && (
              <a 
                href="/overview/packs" 
                className="text-sm font-medium hover:text-primary transition-colors cursor-pointer"
                onClick={(e) => handleNavigation(e, "/overview/packs")}
              >
                Packs
              </a>
            )}
            {stripeIsConfigured && (
              <a 
                href="/get-credits" 
                className="text-sm font-medium hover:text-primary transition-colors cursor-pointer"
                onClick={(e) => handleNavigation(e, "/get-credits")}
              >
                Get Credits
              </a>
            )}
          </nav>
        )}
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          {!user && (
            <>
              <Link href="/login" className="hidden sm:block text-sm font-medium hover:text-primary transition-colors py-2">
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
