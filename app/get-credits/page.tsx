import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import CreemPricingTable from "@/components/creem/CreemPricingTable";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function Index() {
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

  // Allow unauthenticated users to view pricing, show login prompt at top
  return (
    <>
      {!user && (
        <div className="bg-muted/50 border-b py-3 px-4 text-center">
          <p className="text-sm text-muted-foreground">
            You are viewing pricing as a guest.{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Log in
            </Link>{" "}
            or{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              create an account
            </Link>{" "}
            to purchase.
          </p>
        </div>
      )}
      <CreemPricingTable user={user} />
    </>
  );
}
