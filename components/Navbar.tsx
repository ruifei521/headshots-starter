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

const creemIsConfigured = process.env.NEXT_PUBLIC_CREEM_IS_ENABLED === "true";
const stripeIsConfigured = process.env.NEXT_PUBLIC_STRIPE_IS_ENABLED === "true";
const paymentIsConfigured = creemIsConfigured || stripeIsConfigured;
const packsIsEnabled = true;

export default async function Navbar() {
  // 构建时环境变量可能不存在，此时跳过 Supabase 查询
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  let user = null;
  let credits = null;

  if (supabaseUrl && supabaseAnonKey) {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
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
    });

    const { data: userData } = await supabase.auth.getUser();
    user = userData.user;

    if (user) {
      const { data: creditsData } = await supabase
        .from("credits")
        .select("*")
        .eq("user_id", user.id)
        .single();
      credits = creditsData;
    }
  }

  return (
    <header className="sticky top-0 z-[100] w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Camera className="h-5 w-5 text-primary" />
          <span>SnapProHead</span>
        </Link>
        
        {user && (
          <NavLinks 
            packsIsEnabled={packsIsEnabled} 
            paymentIsConfigured={paymentIsConfigured} 
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
              {paymentIsConfigured && (
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
