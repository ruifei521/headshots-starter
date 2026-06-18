import { redirect } from "next/navigation";
import { getOverviewUser } from "@/lib/overview-data";
import { loginRedirectPath } from "@/lib/login-redirect.server";

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user = null;
  try {
    user = await getOverviewUser();
  } catch {
    redirect(loginRedirectPath());
  }

  if (!user) {
    redirect(loginRedirectPath());
  }

  // Updated to ensure compatibility with new layout
  return (
    <div className="flex w-full flex-col px-3 py-4 sm:px-6 md:px-8 lg:px-40 sm:py-6">
      {children}
    </div>
  );
}
