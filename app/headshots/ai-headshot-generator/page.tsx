import { getProfessionMetadata } from "@/lib/profession-metadata";
import { getProfessionPageData } from "@/lib/profession-content";
import ProfessionPageServer from "@/components/headshots/ProfessionPageServer";
import { notFound } from "next/navigation";

export const metadata = getProfessionMetadata("ai-headshot-generator");

export default function HeadshotsPage() {
  const data = getProfessionPageData("ai-headshot-generator");
  if (!data) notFound();
  return <ProfessionPageServer data={data} slug="ai-headshot-generator" />;
}
