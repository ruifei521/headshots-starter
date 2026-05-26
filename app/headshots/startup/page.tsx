import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Startup Headshots",
  description:
    "Professional headshots for startup founders and teams. Look polished and investable with AI-generated portraits. Just $29 — 14-day guarantee.",
  alternates: {
    canonical: "https://snapprohead.com/headshots/startup",
  },
  openGraph: {
    title: "Startup Headshots – Professional AI Portraits for Founders & Teams",
    description:
      "Founder headshots that impress investors, customers, and partners. AI-generated from your photos in ~30 minutes. $29 — 14-day money-back guarantee.",
    url: "https://snapprohead.com/headshots/startup",
    images: [{ url: "https://snapprohead.com/hero.webp", width: 1200, height: 630 }],
  },
};

export default function StartupHeadshotsPage() {
  return (
    <main className="min-h-screen">
      <section className="py-16 md:py-24">
        <div className="max-w-2xl mx-auto px-4">
          <Link href="/headshots" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
            ← Browse All Styles
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Startup Headshots
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            In the startup world, your team page is often the second page investors and customers visit. Make every face count with professional headshots that say "we're serious."
          </p>

          <h2 className="text-xl font-semibold mt-10 mb-3">Why Startup Headshots Matter</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground mb-6">
            <li><strong>Investor confidence</strong> – A polished team page signals professionalism and readiness.</li>
            <li><strong>Customer trust</strong> – Real faces build trust faster than logos or stock photos.</li>
            <li><strong>Crunchbase & LinkedIn presence</strong> – Professional photos improve your startup's credibility on business platforms.</li>
            <li><strong>Team culture showcase</strong> – Show the people behind the product with consistent, high-quality portraits.</li>
          </ul>

          <h2 className="text-xl font-semibold mt-10 mb-3">How It Works</h2>
          <ol className="list-decimal pl-5 space-y-2 text-muted-foreground mb-6">
            <li>Upload 10–12 selfies — casual or business, your choice.</li>
            <li>AI generates 100+ professional startup headshots.</li>
            <li>Download and update your team page, LinkedIn, and pitch deck.</li>
          </ol>

          <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-6 mt-8 mb-10">
            <p className="font-semibold text-lg">From $29 — 14-Day Money-Back Guarantee</p>
            <p className="text-sm text-muted-foreground mt-1">
              Startup-friendly pricing. No minimums. No contracts. Just great headshots.
            </p>
            <Link
              href="/templates"
              className="mt-4 inline-block bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Get Your Startup Headshots
            </Link>
          </div>

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: [
                  {
                    "@type": "Question",
                    name: "Can I get headshots for my entire startup team?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Yes! Each team member can order their own pack. Consistent headshot styles create a unified, professional team page that impresses investors and customers.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Will these look good on my investor pitch deck?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Absolutely. Our AI-generated headshots are high-resolution and professional, perfect for pitch decks, Y Combinator applications, and investor presentations.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "How fast can my team get headshots?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Each pack is ready in ~30 minutes. Your entire team can have professional headshots in a single afternoon — no studio scheduling required.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Can I use these on Crunchbase and LinkedIn?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Yes. Our headshots are optimized for all platforms including LinkedIn, Crunchbase, AngelList, your company website, and social media profiles.",
                    },
                  },
                ],
              }),
            }}
          />
        </div>
      </section>
    </main>
  );
}
