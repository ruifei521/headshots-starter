import { getProfessionMetadata } from "@/lib/profession-metadata";
import { getProfessionPageData } from "@/lib/profession-content";
import ProfessionPageServer from "@/components/headshots/ProfessionPageServer";
import { notFound } from "next/navigation";

export const metadata = getProfessionMetadata("linkedin");

export default function LinkedInHeadshotsPage() {
  const data = getProfessionPageData("linkedin");
  if (!data) notFound();

  return <ProfessionPageServer data={data} slug="linkedin" />;
}
