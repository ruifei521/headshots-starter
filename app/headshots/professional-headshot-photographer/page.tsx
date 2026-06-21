import { getProfessionMetadata } from "@/lib/profession-metadata";
import { getProfessionPageData } from "@/lib/profession-content";
import ProfessionPage from "@/components/headshots/ProfessionPage";
import { notFound } from "next/navigation";

export const metadata = getProfessionMetadata("professional-headshot-photographer");

export default function HeadshotsPage() {
  const data = getProfessionPageData("professional-headshot-photographer");
  if (!data) notFound();
  return <ProfessionPage data={data} />;
}
