import Link from "next/link";
import { getProfessionMetadata } from "@/lib/profession-metadata";
import { PROFESSION_CARD_HEADLINE, DELIVERY_FAQ_READY } from "@/lib/refund-policy";
import { TIERS } from "@/lib/tiers";

export const metadata = getProfessionMetadata("dentist");

export default function DentistHeadshotsPage() {
  return (
    <main className="min-h-screen">
      <section className="py-16 md:py-24">
        <div className="max-w-2xl mx-auto px-4">
          <Link href="/headshots" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
            ← Browse All Styles
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Dentist Headshots
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Your smile says it all — make sure the rest of your portrait inspires confidence too.
            A professional dentist headshot helps patients feel comfortable before they even step through your door.
          </p>

          <h2 className="text-xl font-semibold mt-10 mb-3">Why a Great Dentist Headshot Matters</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground mb-6">
            <li><strong>Build trust instantly</strong> – Patients choose a face they feel comfortable with.</li>
            <li><strong>Stand out on Google Business Profile</strong> – High-quality photos get more clicks.</li>
            <li><strong>Consistent branding</strong> – Use the same polished look across your website, social media, and directories.</li>
            <li><strong>Show your personality</strong> – Warm, professional portraits reflect the care you provide.</li>
          </ul>

          <h2 className="text-xl font-semibold mt-10 mb-3">How It Works</h2>
          <ol className="list-decimal pl-5 space-y-2 text-muted-foreground mb-6">
            <li>Upload 10–12 selfies (any outfit, any background).</li>
            <li>AI generates {TIERS.starter.marketingImageCount}+ professional dentist headshots for you.</li>
            <li>Pick your favorites and download them in minutes.</li>
          </ol>

          <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-6 mt-8 mb-10">
            <p className="font-semibold text-lg">{PROFESSION_CARD_HEADLINE}</p>
            <p className="text-sm text-muted-foreground mt-1">
              No subscription. No surprises. Just pro-quality headshots for your dental practice.
            </p>
            <Link
              href="/pricing"
              className="mt-4 inline-block bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Get Your Dentist Headshots
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
                    name: "Can I use my dentist headshot on my Google Business Profile?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Yes! Our AI-generated headshots are optimized for Google Business Profile, LinkedIn, and other professional platforms.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "What should I wear for my dentist headshot photo session?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Wear your clinical attire (scrubs, lab coat, or business casual) for authentic, practice-ready results. The AI works best when you dress as you would at work.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "How long does it take to get my dentist headshots?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: `${DELIVERY_FAQ_READY} Our AI processes your photos quickly so you can get back to caring for patients.`,
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Can I get headshots for my entire dental team?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Absolutely! Each team member orders their own pack. The consistent style across your whole staff creates a unified, professional brand image.",
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
