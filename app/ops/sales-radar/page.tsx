import { SalesRadar } from "@/components/ops/SalesRadar";

export const metadata = {
  title: "Sales Radar · SnapProHead",
  robots: { index: false, follow: false },
};

export default function SalesRadarPage({
  searchParams,
}: {
  searchParams?: { token?: string };
}) {
  const token = searchParams?.token?.trim() ?? "";

  if (!token) {
    return (
      <main className="flex min-h-[100dvh] items-center justify-center bg-zinc-950 p-6 text-center text-zinc-300">
        <div className="max-w-md space-y-3">
          <h1 className="text-xl font-semibold text-white">Sales Radar</h1>
          <p>
            Add your secret token to the URL:
            <br />
            <code className="mt-2 inline-block rounded bg-zinc-900 px-2 py-1 text-sm text-emerald-400">
              /ops/sales-radar?token=YOUR_OPS_RADAR_TOKEN
            </code>
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[100dvh] bg-zinc-950">
      <SalesRadar token={token} />
    </main>
  );
}
