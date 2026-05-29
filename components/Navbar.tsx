import { Camera } from "lucide-react"
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Link from "next/link";
import { Button } from "./ui/button";

import { ThemeToggle } from "./homepage/theme-toggle";
import UserDropdown from "./UserDropdown";
import NavLinks from "./NavLinks";

export const dynamic = "force-dynamic";

export default async function Navbar() {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

  const {
    data: { user },
  } = await supabase.auth.getUser();



  return (
    <header className="sticky top-0 z-[100] w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Camera className="h-5 w-5 text-primary" />
          <span>SnapProHead</span>
        </Link>

        <NavLinks />

        <div className="flex items-center gap-4">
          <ThemeToggle />

          {!user && (
            <>
              <Link href="/login" className="hidden sm:block text-base font-semibold hover:text-primary transition-colors py-2">
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
