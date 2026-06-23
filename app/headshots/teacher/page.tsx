import { getProfessionMetadata } from "@/lib/profession-metadata";
import { getProfessionPageData } from "@/lib/profession-content";
import ProfessionPageServer from "@/components/headshots/ProfessionPageServer";
import { notFound } from "next/navigation";

export const metadata = getProfessionMetadata("teacher");

export default function HeadshotsPage() {
  const data = getProfessionPageData("teacher");
  if (!data) notFound();
  return <ProfessionPageServer data={data} slug="teacher" />;
}
