import { getProfessionMetadata } from "@/lib/profession-metadata";
import { getProfessionPageData } from "@/lib/profession-content";
import ProfessionPageServer from "@/components/headshots/ProfessionPageServer";
import { notFound } from "next/navigation";

export const metadata = getProfessionMetadata("lawyer");

export default function LawyerHeadshotsPage() {
  const data = getProfessionPageData("lawyer");
  if (!data) notFound();

  return <ProfessionPageServer data={data} slug="lawyer" />;
}
