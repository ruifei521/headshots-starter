import { getProfessionMetadata } from "@/lib/profession-metadata";
import { getProfessionPageData } from "@/lib/profession-content";
import ProfessionPage from "@/components/headshots/ProfessionPage";
import { notFound } from "next/navigation";

export const metadata = getProfessionMetadata("ai-professional-portrait");

export default function HeadshotsPage() {
  const data = getProfessionPageData("ai-professional-portrait");
  if (!data) notFound();
  return <ProfessionPage data={data} />;
}
