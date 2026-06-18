import { Metadata } from "next";
import Link from "next/link";
import {
  HEADSHOT_PROFESSION_SLUGS,
} from "@/lib/profession-metadata";
import { BLOG_GUIDES, PROFESSION_LABELS } from "@/lib/internal-links";

export const metadata: Metadata = {
  title: "All Headshot Styles – Professional AI Portraits by Industry",
  description:
    "Browse all professional AI headshot styles. LinkedIn, lawyer, realtor, executive, doctor, teacher, nurse, startup, and more. $29 for 40+ HD photos.",
  alternates: {
    canonical: "https://snapprohead.com/headshots",
  },
};

export default function HeadshotsIndexPage() {
  return (
    <main className="min-h-screen">
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <Link
            href="/"
            className="text-sm text-primary hover:underline mb-4 inline-block"
          >
            ← Back to home
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            All Headshot Styles
          </h1>
          <p className="text-muted-foreground mb-4">
            Professional AI headshots for every industry. Choose your style below
            or read our{" "}
            <Link href="/blog" className="text-primary hover:underline">
              industry guides
            </Link>
            .
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            Compare tools:{" "}
            <Link
              href="/blog/best-ai-headshot-generators-2026"
              className="text-primary hover:underline"
            >
              Best AI headshot generators (2026)
            </Link>
          </p>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {HEADSHOT_PROFESSION_SLUGS.map((slug) => (
              <Link
                key={slug}
                href={`/headshots/${slug}`}
                className="block p-4 rounded-lg border hover:border-primary hover:shadow-sm transition-all"
              >
                <h2 className="font-semibold text-lg">
                  {PROFESSION_LABELS[slug]} Headshots
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  AI headshots for {PROFESSION_LABELS[slug].toLowerCase()}s
                </p>
              </Link>
            ))}
          </div>

          <div className="mt-14 pt-10 border-t">
            <h2 className="text-xl font-semibold mb-4">Headshot guides</h2>
            <ul className="space-y-2">
              {BLOG_GUIDES.map((guide) => (
                <li key={guide.slug}>
                  <Link
                    href={`/blog/${guide.slug}`}
                    className="text-primary font-medium hover:underline"
                  >
                    {guide.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
