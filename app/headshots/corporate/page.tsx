import { getProfessionMetadata } from "@/lib/profession-metadata";
import { getProfessionPageData } from "@/lib/profession-content";
import ProfessionPage from "@/components/headshots/ProfessionPage";
import { notFound } from "next/navigation";

export const metadata = getProfessionMetadata("corporate");

export default function HeadshotsPage() {
  const data = getProfessionPageData("corporate");
  if (!data) notFound();
  return <ProfessionPage data={data} />;
}
