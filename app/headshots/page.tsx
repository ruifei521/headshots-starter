import { Metadata } from "next";
import Link from "next/link";
import fs from "fs";
import path from "path";

export const metadata: Metadata = {
  title: "All Headshot Styles – Professional AI Portraits by Industry",
  description:
    "Browse all professional AI headshot styles. LinkedIn, lawyer, realtor, executive, doctor, teacher, nurse, startup, and more. $29 for 40+ HD photos.",
  alternates: {
    canonical: "https://snapprohead.com/headshots",
  },
};

interface Category {
  slug: string;
  name: string;
}

function getCategories(): Category[] {
  const dir = path.join(process.cwd(), "app", "headshots");
  try {
    const slugs = fs.readdirSync(dir, { withFileTypes: true })
      .filter((d) => d.isDirectory() && d.name !== "page")
      .map((d) => d.name);
    return slugs.map((slug) => ({
      slug,
      name: slug
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase()),
    }));
  } catch {
    return [];
  }
}

export default function HeadshotsIndexPage() {
  const categories = getCategories();

  return (
    <main className="min-h-screen">
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            All Headshot Styles
          </h1>
          <p className="text-muted-foreground mb-8">
            Professional AI headshots for every industry. Choose your style below.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/headshots/${cat.slug}`}
                className="block p-4 rounded-lg border hover:border-primary hover:shadow-sm transition-all"
              >
                <h2 className="font-semibold text-lg">{cat.name} Headshots</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Professional AI headshots for {cat.name}s
                </p>
              </Link>
            ))}
          </div>
          {categories.length === 0 && (
            <p className="text-muted-foreground">No styles available yet. Check back soon.</p>
          )}
        </div>
      </section>
    </main>
  );
}
