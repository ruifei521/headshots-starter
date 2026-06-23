// app/headshots/author/page.tsx
import { getProfessionMetadata } from "@/lib/profession-metadata";
import { getProfessionPageData } from "@/lib/profession-content";
import ProfessionPageServer from "@/components/headshots/ProfessionPageServer";
import { notFound } from "next/navigation";

export const metadata = getProfessionMetadata("author");

export default function AuthorHeadshotsPage() {
  const data = getProfessionPageData("author");
  if (!data) notFound();

  return <ProfessionPageServer data={data} slug="author" />;
}
