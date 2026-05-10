import { Camera } from "lucide-react"
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import Link from "next/link";
import { Button } from "./ui/button";
import React from "react";
import { Database } from "@/types/supabase";
import ClientSideCredits from "./realtime/ClientSideCredits";
import { ThemeToggle } from "./homepage/theme-toggle";
import UserDropdown from "./UserDropdown";

export const dynamic = "force-dynamic";

const stripeIsConfigured = process.env.NEXT_PUBLIC_STRIPE_IS_ENABLED === "true";
const packsIsEnabled = process.env.NEXT_PUBLIC_TUNE_TYPE === "packs";
export const revalidate = 0;

export default async function Navbar() {
  const cookieStore = cookies();
  const supabase = createServerClient<
    Database
  >(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: credits } = await supabase
    .from("credits")
    .select("*")
    .eq("user_id", user?.id ?? "")
    .single();

  return (
    <header className="sticky top-0 z-[100] w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl min-h-[44px]">
          <Camera className="h-5 w-5 text-primary" />
          <span>Headshots AI</span>
        </Link>
        
        {user && (
          <nav className="hidden md:flex gap-6">
            <Link href="/overview" className="min-h-[44px] py-1 text-sm font-medium hover:text-primary transition-colors">
              Home
            </Link>
            {packsIsEnabled && (
              <Link href="/overview/packs" className="text-sm font-medium hover:text-primary transition-colors">
                Packs
              </Link>
            )}
            {stripeIsConfigured && (
              <Link href="/get-credits" className="text-sm font-medium hover:text-primary transition-colors">
                Get Credits
              </Link>
            )}
          </nav>
        )}

        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          {!user && (
            <>
              <Link href="/login" className="hidden sm:block text-sm font-medium hover:text-primary transition-colors py-2 min-h-[44px]">
                Login
              </Link>
              <Link href="/login">
                <Button className="min-h-[44px]">Create headshots</Button>
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
