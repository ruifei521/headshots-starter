"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { HeadshotProfessionSlug } from "@/lib/profession-metadata";
import {
  getGuidesForProfession,
  getRelatedProfessions,
  PROFESSION_LABELS,
} from "@/lib/internal-links";

function parseProfessionSlug(pathname: string): HeadshotProfessionSlug | null {
  if (pathname === "/headshots") return null;
  if (!pathname.startsWith("/headshots/")) return null;
  const slug = pathname.replace("/headshots/", "").split("/")[0];
  if (slug && slug in PROFESSION_LABELS) {
    return slug as HeadshotProfessionSlug;
  }
  return null;
}

export default function ProfessionHubLinks() {
  const pathname = usePathname() ?? "";
  if (!pathname.startsWith("/headshots")) return null;

  const slug = parseProfessionSlug(pathname);
  const related = getRelatedProfessions(slug);
  const guides = getGuidesForProfession(slug);
  const heading = slug
    ? `More resources for ${PROFESSION_LABELS[slug].toLowerCase()}s`
    : "Explore headshots by industry";

  return (
    <section
      className="border-t bg-muted/20"
      aria-label="Related pages and guides"
    >
      <div className="container px-4 md:px-6 py-12 md:py-14">
        <div className="mx-auto max-w-4xl space-y-10">
          <div>
            <h2 className="text-lg font-semibold tracking-tight mb-4">
              {heading}
            </h2>
            <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
              {related.map((rel) => (
                <Link
                  key={rel}
                  href={`/headshots/${rel}`}
                  className="text-sm text-primary font-medium hover:underline"
                >
                  {PROFESSION_LABELS[rel]} headshots →
                </Link>
              ))}
              <Link
                href="/headshots"
                className="text-sm text-primary font-medium hover:underline"
              >
                All 21 styles →
              </Link>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold tracking-tight mb-4">
              Guides & comparisons
            </h2>
            <ul className="space-y-2">
              {guides.map((guide) => (
                <li key={guide.slug}>
                  <Link
                    href={`/blog/${guide.slug}`}
                    className="text-sm text-primary font-medium hover:underline"
                  >
                    {guide.title} →
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                >
                  All blog articles
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-wrap gap-4 text-sm pt-2 border-t border-border/60">
            <Link href="/" className="text-muted-foreground hover:text-foreground hover:underline">
              Home
            </Link>
            <Link href="/pricing" className="text-muted-foreground hover:text-foreground hover:underline">
              Pricing
            </Link>
            <Link href="/examples" className="text-muted-foreground hover:text-foreground hover:underline">
              Examples
            </Link>
            <Link href="/pricing" className="text-primary font-medium hover:underline">
              Get started →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
