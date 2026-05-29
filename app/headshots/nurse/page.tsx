import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Nurse Headshots – Professional AI Portraits for Nursing Professionals",
  description:
    "Professional AI headshots for nurses. Present a caring, competent image on hospital websites, LinkedIn, and healthcare directories. Starting at $29 for 40+ HD photos in ~30 minutes.",
  alternates: {
    canonical: "https://snapprohead.com/headshots/nurse",
  },
  openGraph: {
    title: "Nurse Headshots – Professional AI Portraits for Nursing Professionals",
    description:
      "Caring, professional headshots for nurses. From your selfies in ~30 minutes. $29 — 14-day guarantee.",
    url: "https://snapprohead.com/headshots/nurse",
    images: [{ url: "https://snapprohead.com/hero.webp", width: 1200, height: 630 }],
  },
};

export default function NurseHeadshotsPage() {
  return (
    <main className="min-h-screen">
      <section className="py-16 md:py-24">
        <div className="max-w-2xl mx-auto px-4">
          <Link href="/headshots" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
            ← Browse All Styles
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Nurse Headshots
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Patients and employers look for compassion and competence in a nurse&apos;s photo. A professional headshot helps you stand out on hospital staff pages, healthcare directories, and your professional network.
          </p>

          <h2 className="text-xl font-semibold mt-10 mb-3">Why a Great Nurse Headshot Matters</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground mb-6">
            <li><strong>Build patient trust</strong> – A warm, professional photo helps patients feel comfortable before they meet you.</li>
            <li><strong>Advance your career</strong> – A polished headshot on LinkedIn and nursing networks opens doors to new opportunities.</li>
            <li><strong>Show your professionalism</strong> – Represent your hospital or clinic with a consistent, caring image.</li>
            <li><strong>Humanize healthcare</strong> – Approachable portraits remind patients there&apos;s a caring person behind the scrubs.</li>
          </ul>

          <h2 className="text-xl font-semibold mt-10 mb-3">How It Works</h2>
          <ol className="list-decimal pl-5 space-y-2 text-muted-foreground mb-6">
            <li>Upload 8–12 selfies — wear your scrubs, lab coat, or business attire.</li>
            <li>Our AI generates 40+ professional nurse headshots in multiple styles.</li>
            <li>Download your favorites and update your profiles instantly.</li>
          </ol>

          <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-6 mt-8 mb-10">
            <p className="font-semibold text-lg">From $29 — 14-Day Money-Back Guarantee</p>
            <p className="text-sm text-muted-foreground mt-1">
              Professional headshots for nurses — without the studio visit.
            </p>
            <Link
              href="/templates"
              className="mt-4 inline-block bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Get Your Nurse Headshots
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
                    name: "What should I wear for my nurse headshot?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Scrubs, a lab coat, or professional business attire all work well. Wear what you typically wear at work for the most authentic results.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Can I use my nurse headshot on hospital staff directories?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Yes! Our headshots are perfect for hospital websites, clinic staff pages, healthcare directories like Healthgrades and Zocdoc, and your professional social media profiles.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "How long does it take to get my nurse headshots?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Most orders are ready within 30 minutes. You'll receive 40+ HD photos to choose from.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Can my entire nursing team get headshots?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Absolutely! Each nurse or staff member can order their own pack. A consistent, professional look across your entire team reinforces trust with patients.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "What if I don't like the results?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "We offer a 14-day money-back guarantee. If you're not satisfied with your nurse headshots, we'll refund your purchase — no questions asked.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Are these headshots suitable for travel nursing profiles?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Yes! Many travel nursing agencies and platforms value professional photos. A polished headshot helps you stand out to recruiters and healthcare facilities.",
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
