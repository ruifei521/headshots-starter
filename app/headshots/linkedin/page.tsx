import { getProfessionMetadata } from "@/lib/profession-metadata";
import { getProfessionPageData } from "@/lib/profession-content";
import ProfessionPage from "@/components/headshots/ProfessionPage";
import { notFound } from "next/navigation";

export const metadata = getProfessionMetadata("linkedin");

export default function LinkedInHeadshotsPage() {
  const data = getProfessionPageData("linkedin");
  if (!data) notFound();

  return <ProfessionPage data={data} />;
}
