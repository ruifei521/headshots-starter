import Link from "next/link";
import { getProfessionMetadata } from "@/lib/profession-metadata";
import { PROFESSION_CARD_HEADLINE } from "@/lib/refund-policy";
import { TIERS } from "@/lib/tiers";

export const metadata = getProfessionMetadata("c-suite");

export default function CSuiteHeadshotsPage() {
  return (
    <main className="min-h-screen">
      <section className="py-16 md:py-24">
        <div className="max-w-2xl mx-auto px-4">
          <Link href="/headshots" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
            ← Browse All Styles
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            C-Suite Headshots
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Your headshot is your first handshake. For C-suite executives, it needs to convey authority, vision, and approachability — all at once.
          </p>

          <h2 className="text-xl font-semibold mt-10 mb-3">Why C-Suite Headshots Matter</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground mb-6">
            <li><strong>Leadership presence</strong> – Your photo should reflect the confidence of a business leader.</li>
            <li><strong>Investor & board credibility</strong> – A polished executive headshot builds trust with stakeholders.</li>
            <li><strong>Media & speaking engagements</strong> – Conference programs, press releases, and keynote bios need a standout photo.</li>
            <li><strong>Company culture ambassador</strong> – Show your team and customers the face behind the vision.</li>
          </ul>

          <h2 className="text-xl font-semibold mt-10 mb-3">How It Works</h2>
          <ol className="list-decimal pl-5 space-y-2 text-muted-foreground mb-6">
            <li>Upload 10–12 selfies in business attire.</li>
            <li>AI generates {TIERS.starter.marketingImageCount}+ professional executive headshots.</li>
            <li>Download and use across LinkedIn, company website, and press materials.</li>
          </ol>

          <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-6 mt-8 mb-10">
            <p className="font-semibold text-lg">{PROFESSION_CARD_HEADLINE}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Executive-quality headshots without the executive price tag.
            </p>
            <Link
              href="/pricing"
              className="mt-4 inline-block bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Get Your C-Suite Headshots
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
                    name: "What is the difference between executive and c-suite headshots?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "C-suite headshots are tailored for senior leadership — CEOs, CFOs, CTOs, and founders. The style emphasizes authority and confidence while remaining approachable.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Can I use my headshot on my company's investor page?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Absolutely. Our headshots are high-resolution and suitable for investor decks, board of directors pages, press releases, and conference speaker bios.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "How is the AI quality compared to a professional photographer?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Our AI produces studio-quality results that are often indistinguishable from traditional photography, at a fraction of the cost and time.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Can I get headshots for my entire executive team?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Yes! Each executive can order their own pack. The consistent style creates a unified leadership brand across your company's online presence.",
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
