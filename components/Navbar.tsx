import { Camera } from "lucide-react"
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Link from "next/link";
import { Button } from "./ui/button";
import ClientSideCredits from "./realtime/ClientSideCredits";
import { ThemeToggle } from "./homepage/theme-toggle";
import UserDropdown from "./UserDropdown";
import NavLinks from "./NavLinks";

export const dynamic = "force-dynamic";

const stripeIsConfigured = process.env.NEXT_PUBLIC_STRIPE_IS_ENABLED === "true";
const packsIsEnabled = process.env.NEXT_PUBLIC_TUNE_TYPE === "packs";

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

  const { data: credits } = await supabase
    .from("credits")
    .select("*")
    .eq("user_id", user?.id ?? "")
    .single();

  return (
    <header className="sticky top-0 z-[100] w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href={user ? "/overview" : "/"} className="flex items-center gap-2 font-bold text-xl">
          <Camera className="h-5 w-5 text-primary" />
          <span>Headshots AI</span>
        </Link>
        
        {user && (
          <NavLinks 
            packsIsEnabled={packsIsEnabled} 
            stripeIsConfigured={stripeIsConfigured} 
          />
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
