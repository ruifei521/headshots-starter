import { getProfessionMetadata } from "@/lib/profession-metadata";
import { getProfessionPageData } from "@/lib/profession-content";
import ProfessionPageServer from "@/components/headshots/ProfessionPageServer";
import { notFound } from "next/navigation";

export const metadata = getProfessionMetadata("realtor");

export default function RealtorHeadshotsPage() {
  const data = getProfessionPageData("realtor");
  if (!data) notFound();

  return <ProfessionPageServer data={data} slug="realtor" />;
}
