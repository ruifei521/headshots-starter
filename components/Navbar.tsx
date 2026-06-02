import { Camera } from "lucide-react"
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Link from "next/link";
import { Button } from "./ui/button";

import { ThemeToggle } from "./homepage/theme-toggle";
import UserDropdown from "./UserDropdown";
import NavLinks from "./NavLinks";
import MobileNavSheet from "./MobileNavSheet";

export const dynamic = "force-dynamic";

export default async function Navbar() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const isSupabaseConfigured = supabaseUrl && supabaseUrl !== 'your-project-url' && supabaseAnonKey && supabaseAnonKey !== 'your-anon-key'

  let user = null
  if (isSupabaseConfigured) {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return cookies().getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              try {
                cookies().set(name, value, options);
              } catch {
                // The `set` method was called from a Server Component.
              }
            });
          },
        },
      }
    );

    try {
      const { data } = await supabase.auth.getUser();
      user = data.user;
    } catch {
      user = null;
    }
  }



  return (
    <header className="sticky top-0 z-[100] w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Camera className="h-5 w-5 text-primary" />
          <span>SnapProHead</span>
        </Link>

        {/* Desktop NavLinks — hidden on mobile */}
        <div className="hidden md:flex">
          <NavLinks isLoggedIn={!!user} />
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />

          {/* Desktop Login/CTA — hidden on mobile */}
          {!user && (
            <div className="hidden sm:flex items-center gap-4">
              <Link href="/login" className="text-base font-semibold hover:text-primary transition-colors py-2">
                Login
              </Link>
              <Link href="/#pricing">
                <Button>Create headshots</Button>
              </Link>
            </div>
          )}

          {user && (
            <div className="hidden sm:flex items-center gap-4">
              <UserDropdown user={user} />
            </div>
          )}

          {/* Mobile hamburger menu */}
          <MobileNavSheet isLoggedIn={!!user} />
        </div>
      </div>
    </header>
  );
}
