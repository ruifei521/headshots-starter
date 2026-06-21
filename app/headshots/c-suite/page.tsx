import { getProfessionMetadata } from "@/lib/profession-metadata";
import { getProfessionPageData } from "@/lib/profession-content";
import ProfessionPage from "@/components/headshots/ProfessionPage";
import { notFound } from "next/navigation";

export const metadata = getProfessionMetadata("c-suite");

export default function HeadshotsPage() {
  const data = getProfessionPageData("c-suite");
  if (!data) notFound();
  return <ProfessionPage data={data} />;
}
