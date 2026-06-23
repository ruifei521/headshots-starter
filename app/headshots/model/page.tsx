// app/headshots/model/page.tsx
import { getProfessionMetadata } from "@/lib/profession-metadata";
import { getProfessionPageData } from "@/lib/profession-content";
import ProfessionPageServer from "@/components/headshots/ProfessionPageServer";
import { notFound } from "next/navigation";

export const metadata = getProfessionMetadata("model");

export default function ModelHeadshotsPage() {
  const data = getProfessionPageData("model");
  if (!data) notFound();

  return <ProfessionPageServer data={data} slug="model" />;
}
