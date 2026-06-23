// Server Component — generates JSON-LD server-side, renders ProfessionPage
import ProfessionPage from "./ProfessionPage";
import type { ProfessionPageData } from "./ProfessionPage";
import { generateFAQSchema, generateBreadcrumbSchema } from "@/lib/json-ld";

const SITE_URL = "https://snapprohead.com";

export default function ProfessionPageServer({
  data,
  slug,
}: {
  data: ProfessionPageData;
  slug: string;
}) {
  const faqJsonLd = generateFAQSchema(data.faqs);
  const breadcrumbJsonLd = generateBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "AI Headshots for Professionals", url: `${SITE_URL}/headshots` },
    { name: data.heroTitle, url: `${SITE_URL}/headshots/${slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProfessionPage data={data} />
    </>
  );
}
