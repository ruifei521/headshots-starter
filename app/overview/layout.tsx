import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

  let user = null;
  try {
    const {
      data: { user: userData },
    } = await supabase.auth.getUser();
    user = userData;
  } catch {
    // Supabase 临时不可用 → 重定向到登录页让用户重试
    redirect('/login');
  }

  if (!user) {
    redirect('/login');
  }

  // Updated to ensure compatibility with new layout
  return (
    <div className="flex w-full flex-col px-4 lg:px-40 py-6">
      {children}
    </div>
  );
}
