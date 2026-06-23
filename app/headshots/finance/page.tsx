// app/headshots/finance/page.tsx
import { getProfessionMetadata } from "@/lib/profession-metadata";
import { getProfessionPageData } from "@/lib/profession-content";
import ProfessionPageServer from "@/components/headshots/ProfessionPageServer";
import { notFound } from "next/navigation";

export const metadata = getProfessionMetadata("finance");

export default function FinanceHeadshotsPage() {
  const data = getProfessionPageData("finance");
  if (!data) notFound();

  return <ProfessionPageServer data={data} slug="finance" />;
}
