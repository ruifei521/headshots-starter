// app/headshots/marketing/page.tsx
import { getProfessionMetadata } from "@/lib/profession-metadata";
import { getProfessionPageData } from "@/lib/profession-content";
import ProfessionPageServer from "@/components/headshots/ProfessionPageServer";
import { notFound } from "next/navigation";

export const metadata = getProfessionMetadata("marketing");

export default function MarketingHeadshotsPage() {
  const data = getProfessionPageData("marketing");
  if (!data) notFound();

  return <ProfessionPageServer data={data} slug="marketing" />;
}
