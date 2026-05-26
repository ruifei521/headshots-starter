import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Accountant Headshots – Professional AI Portraits for Accounting Professionals",
  description:
    "Professional AI headshots for accountants. Build client confidence with a trustworthy, polished image for your firm website, LinkedIn, and business profiles. Just $29 for 40+ HD photos in ~30 minutes.",
  alternates: {
    canonical: "https://snapprohead.com/headshots/accountant",
  },
  openGraph: {
    title: "Accountant Headshots – Professional AI Portraits for Accounting Professionals",
    description:
      "Trustworthy, professional headshots for accountants. From your selfies in ~30 minutes. $29 — 14-day guarantee.",
    url: "https://snapprohead.com/headshots/accountant",
    images: [{ url: "https://snapprohead.com/hero.webp", width: 1200, height: 630 }],
  },
};

export default function AccountantHeadshotsPage() {
  return (
    <main className="min-h-screen">
      <section className="py-16 md:py-24">
        <div className="max-w-2xl mx-auto px-4">
          <Link href="/headshots" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
            ← Browse All Styles
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Accountant Headshots
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Clients trust accountants who look professional and approachable. A polished headshot on your firm&apos;s website and LinkedIn helps you stand out, attract new business, and convey the confidence clients expect from their financial advisor.
          </p>

          <h2 className="text-xl font-semibold mt-10 mb-3">Why a Professional Accountant Headshot Matters</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground mb-6">
            <li><strong>Win client trust</strong> – A professional portrait signals competence and reliability before the first consultation.</li>
            <li><strong>Stand out on LinkedIn</strong> – Accountants with polished headshots get more profile views and connection requests.</li>
            <li><strong>Elevate your firm brand</strong> – Consistent, high-quality team photos make your accounting firm look established and credible.</li>
            <li><strong>Attract better clients</strong> – First impressions matter when clients are choosing a financial partner.</li>
          </ul>

          <h2 className="text-xl font-semibold mt-10 mb-3">How It Works</h2>
          <ol className="list-decimal pl-5 space-y-2 text-muted-foreground mb-6">
            <li>Upload 8–12 selfies — wear your professional business attire.</li>
            <li>Our AI generates 40+ professional accountant headshots in multiple styles.</li>
            <li>Download your favorites and update your profiles instantly.</li>
          </ol>

          <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-6 mt-8 mb-10">
            <p className="font-semibold text-lg">From $29 — 14-Day Money-Back Guarantee</p>
            <p className="text-sm text-muted-foreground mt-1">
              Professional headshots for CPAs and accounting professionals — no studio visit needed.
            </p>
            <Link
              href="/templates"
              className="mt-4 inline-block bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Get Your Accountant Headshots
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
                    name: "What should I wear for my accountant headshot?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Business professional attire works best — suits, blazers, dress shirts, or blouses. Solid colors and classic styles create a timeless, trustworthy image that clients expect from their accountant.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Can I use my accountant headshot on my firm's website?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Yes! Our headshots are perfect for accounting firm websites, team pages, LinkedIn profiles, CPA directories, and any professional networking platform.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "How long does it take to get my accountant headshots?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Most orders are ready within 30 minutes. You'll receive 40+ HD photos to choose from — no need to wait days for a photographer.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Can my entire accounting firm get headshots?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Absolutely! Each partner, CPA, and staff member can order their own pack for a consistent, professional firm-wide look that builds client confidence.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "What if I don't like the results?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "We offer a 14-day money-back guarantee — no questions asked. If you're not satisfied with your accountant headshots, we'll refund your purchase in full.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Are these headshots suitable for Big 4 and top accounting firms?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Yes! Our headshots meet the professional standards expected at top accounting firms. The polished, corporate style fits perfectly into any professional services environment.",
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
