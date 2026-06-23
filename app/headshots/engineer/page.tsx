// app/headshots/engineer/page.tsx
import { getProfessionMetadata } from "@/lib/profession-metadata";
import { getProfessionPageData } from "@/lib/profession-content";
import ProfessionPageServer from "@/components/headshots/ProfessionPageServer";
import { notFound } from "next/navigation";

export const metadata = getProfessionMetadata("engineer");

export default function EngineerHeadshotsPage() {
  const data = getProfessionPageData("engineer");
  if (!data) notFound();

  return <ProfessionPageServer data={data} slug="engineer" />;
}
