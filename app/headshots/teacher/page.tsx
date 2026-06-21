import { getProfessionMetadata } from "@/lib/profession-metadata";
import { getProfessionPageData } from "@/lib/profession-content";
import ProfessionPage from "@/components/headshots/ProfessionPage";
import { notFound } from "next/navigation";

export const metadata = getProfessionMetadata("teacher");

export default function HeadshotsPage() {
  const data = getProfessionPageData("teacher");
  if (!data) notFound();
  return <ProfessionPage data={data} />;
}
