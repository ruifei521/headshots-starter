import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Consultant Headshots – Professional AI Portraits for Consultants",
  description:
    "Professional AI headshots for consultants. Command authority and build client confidence with a polished profile photo for your consulting website, LinkedIn, and proposals. Starting at $29 for 40+ HD photos in ~30 minutes.",
  alternates: {
    canonical: "https://snapprohead.com/headshots/consultant",
  },
  openGraph: {
    title: "Consultant Headshots – Professional AI Portraits for Consultants",
    description:
      "Authoritative, professional headshots for consultants. From your selfies in ~30 minutes. $29 — 14-day guarantee.",
    url: "https://snapprohead.com/headshots/consultant",
    images: [{ url: "https://snapprohead.com/hero.webp", width: 1200, height: 630 }],
  },
};

export default function ConsultantHeadshotsPage() {
  return (
    <main className="min-h-screen">
      <section className="py-16 md:py-24">
        <div className="max-w-2xl mx-auto px-4">
          <Link href="/headshots" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
            ← Browse All Styles
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Consultant Headshots
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            In consulting, your personal brand is everything. A polished, confident headshot helps you command authority before you walk into the boardroom. Whether you&apos;re an independent consultant or part of a top firm, your photo is often your first handshake.
          </p>

          <h2 className="text-xl font-semibold mt-10 mb-3">Why a Professional Consultant Headshot Matters</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground mb-6">
            <li><strong>Command authority</strong> – A confident, polished portrait signals expertise and credibility to potential clients.</li>
            <li><strong>Build your personal brand</strong> – Your headshot is the face of your consulting practice across every touchpoint.</li>
            <li><strong>Win more proposals</strong> – Consulting proposals with professional team photos have higher close rates.</li>
            <li><strong>Stand out on LinkedIn</strong> – A great photo helps you get noticed by decision-makers and recruiters.</li>
          </ul>

          <h2 className="text-xl font-semibold mt-10 mb-3">How It Works</h2>
          <ol className="list-decimal pl-5 space-y-2 text-muted-foreground mb-6">
            <li>Upload 8–12 selfies — dress in your consulting business attire.</li>
            <li>Our AI generates 40+ professional consultant headshots in multiple styles.</li>
            <li>Download your favorites and update your profiles instantly.</li>
          </ol>

          <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-6 mt-8 mb-10">
            <p className="font-semibold text-lg">From $29 — 14-Day Money-Back Guarantee</p>
            <p className="text-sm text-muted-foreground mt-1">
              Professional headshots for consultants — without a studio visit or expensive photographer.
            </p>
            <Link
              href="/templates"
              className="mt-4 inline-block bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Get Your Consultant Headshots
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
                    name: "What should I wear for my consultant headshot?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Wear what you would wear to a client meeting — business suits, blazers, dress shirts, or professional dresses. Solid colors and classic styles create the authoritative, trustworthy image consulting clients expect.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Can I use my consultant headshot on my firm's website?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Yes! Our headshots are perfect for consulting firm websites, team pages, speaker profiles, LinkedIn, and consulting directories like Clutch or Gartner.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "How long does it take to get my consultant headshots?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Most orders are ready within 30 minutes. You'll receive 40+ HD photos to choose from — no more waiting days for a photographer to deliver.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Can my entire consulting team get headshots?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Absolutely! Each consultant and partner can order their own pack. Consistent, professional team photos elevate your firm's brand and build trust with prospective clients.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "What if I don't like the results?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "We offer a 14-day money-back guarantee — no questions asked. If you're not satisfied with your consultant headshots, we'll refund your purchase in full.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Are these headshots suitable for McKinsey, BCG, and Bain-style firms?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Yes! Our headshots meet the high professional standards expected at top-tier consulting firms. The polished, executive style fits perfectly into any management consulting environment.",
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
