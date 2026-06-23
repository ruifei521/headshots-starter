import { getProfessionMetadata } from "@/lib/profession-metadata";
import { getProfessionPageData } from "@/lib/profession-content";
import ProfessionPageServer from "@/components/headshots/ProfessionPageServer";
import { notFound } from "next/navigation";

export const metadata = getProfessionMetadata("executive");

export default function ExecutiveHeadshotsPage() {
  const data = getProfessionPageData("executive");
  if (!data) notFound();

  return <ProfessionPageServer data={data} slug="executive" />;
}
