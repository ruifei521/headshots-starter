import { getProfessionMetadata } from "@/lib/profession-metadata";
import { getProfessionPageData } from "@/lib/profession-content";
import ProfessionPageServer from "@/components/headshots/ProfessionPageServer";
import { notFound } from "next/navigation";

export const metadata = getProfessionMetadata("actor");

export default function HeadshotsPage() {
  const data = getProfessionPageData("actor");
  if (!data) notFound();
  return <ProfessionPageServer data={data} slug="actor" />;
}
