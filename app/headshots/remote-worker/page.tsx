// app/headshots/remote-worker/page.tsx
import { getProfessionMetadata } from "@/lib/profession-metadata";
import { getProfessionPageData } from "@/lib/profession-content";
import ProfessionPageServer from "@/components/headshots/ProfessionPageServer";
import { notFound } from "next/navigation";

export const metadata = getProfessionMetadata("remote-worker");

export default function RemoteWorkerHeadshotsPage() {
  const data = getProfessionPageData("remote-worker");
  if (!data) notFound();

  return <ProfessionPageServer data={data} slug="remote-worker" />;
}
