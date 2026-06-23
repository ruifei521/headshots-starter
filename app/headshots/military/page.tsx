// app/headshots/military/page.tsx
import { getProfessionMetadata } from "@/lib/profession-metadata";
import { getProfessionPageData } from "@/lib/profession-content";
import ProfessionPageServer from "@/components/headshots/ProfessionPageServer";
import { notFound } from "next/navigation";

export const metadata = getProfessionMetadata("military");

export default function MilitaryHeadshotsPage() {
  const data = getProfessionPageData("military");
  if (!data) notFound();

  return <ProfessionPageServer data={data} slug="military" />;
}
