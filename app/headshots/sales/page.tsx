// app/headshots/sales/page.tsx
import { getProfessionMetadata } from "@/lib/profession-metadata";
import { getProfessionPageData } from "@/lib/profession-content";
import ProfessionPageServer from "@/components/headshots/ProfessionPageServer";
import { notFound } from "next/navigation";

export const metadata = getProfessionMetadata("sales");

export default function SalesHeadshotsPage() {
  const data = getProfessionPageData("sales");
  if (!data) notFound();

  return <ProfessionPageServer data={data} slug="sales" />;
}
