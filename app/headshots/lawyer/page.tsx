import { getProfessionMetadata } from "@/lib/profession-metadata";
import { getProfessionPageData } from "@/lib/profession-content";
import ProfessionPage from "@/components/headshots/ProfessionPage";
import { notFound } from "next/navigation";

export const metadata = getProfessionMetadata("lawyer");

export default function LawyerHeadshotsPage() {
  const data = getProfessionPageData("lawyer");
  if (!data) notFound();

  return <ProfessionPage data={data} />;
}
