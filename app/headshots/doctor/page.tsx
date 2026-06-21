import { getProfessionMetadata } from "@/lib/profession-metadata";
import { getProfessionPageData } from "@/lib/profession-content";
import ProfessionPage from "@/components/headshots/ProfessionPage";
import { notFound } from "next/navigation";

export const metadata = getProfessionMetadata("doctor");

export default function DoctorHeadshotsPage() {
  const data = getProfessionPageData("doctor");
  if (!data) notFound();

  return <ProfessionPage data={data} />;
}
