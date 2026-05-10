import { headers } from "next/headers";
import { Login } from "./components/Login";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  // Server-side auth check removed - let client component handle it
  // This prevents timeouts during server-side rendering

  const headersList = headers();
  const host = headersList.get("host");

  return (
    <div className="flex flex-col flex-1 w-full h-[calc(100vh-73px)]">
      <Login host={host} searchParams={searchParams} />
    </div>
  );
}
