// app/headshots/student/page.tsx
import { getProfessionMetadata } from "@/lib/profession-metadata";
import { getProfessionPageData } from "@/lib/profession-content";
import ProfessionPageServer from "@/components/headshots/ProfessionPageServer";
import { notFound } from "next/navigation";

export const metadata = getProfessionMetadata("student");

export default function StudentHeadshotsPage() {
  const data = getProfessionPageData("student");
  if (!data) notFound();

  return <ProfessionPageServer data={data} slug="student" />;
}
