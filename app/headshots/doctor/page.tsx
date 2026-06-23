import { getProfessionMetadata } from "@/lib/profession-metadata";
import { getProfessionPageData } from "@/lib/profession-content";
import ProfessionPageServer from "@/components/headshots/ProfessionPageServer";
import { notFound } from "next/navigation";

export const metadata = getProfessionMetadata("doctor");

export default function DoctorHeadshotsPage() {
  const data = getProfessionPageData("doctor");
  if (!data) notFound();

  return <ProfessionPageServer data={data} slug="doctor" />;
}
