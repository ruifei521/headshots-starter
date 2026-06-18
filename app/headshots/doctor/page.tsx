import Link from "next/link";
import { getProfessionMetadata } from "@/lib/profession-metadata";
import { PROFESSION_CARD_HEADLINE, DELIVERY_FAQ_READY } from "@/lib/refund-policy";
import { TIERS } from "@/lib/tiers";

export const metadata = getProfessionMetadata("doctor");

export default function DoctorHeadshotsPage() {
  return (
    <main className="min-h-screen">
      <section className="py-16 md:py-24">
        <div className="max-w-2xl mx-auto px-4">
          <Link href="/headshots" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
            ← Browse All Styles
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Doctor Headshots
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Patients choose doctors they trust at a glance. A professional headshot communicates competence, compassion, and credibility before your first consultation.
          </p>

          <h2 className="text-xl font-semibold mt-10 mb-3">Why a Great Doctor Headshot Matters</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground mb-6">
            <li><strong>First impressions matter</strong> – Your profile photo is often the first thing potential patients see.</li>
            <li><strong>Credibility online</strong> – Professional photos on Healthgrades, Zocdoc, and Google boost patient confidence.</li>
            <li><strong>Humanize your practice</strong> – A warm, approachable portrait puts patients at ease.</li>
            <li><strong>Consistent clinic branding</strong> – Align your image with your practice's professional standards.</li>
          </ul>

          <h2 className="text-xl font-semibold mt-10 mb-3">How It Works</h2>
          <ol className="list-decimal pl-5 space-y-2 text-muted-foreground mb-6">
            <li>Upload 10–12 selfies — wear your white coat or business attire.</li>
            <li>AI generates {TIERS.starter.marketingImageCount}+ professional doctor headshots in various styles.</li>
            <li>Download your favorites and update your profiles instantly.</li>
          </ol>

          <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-6 mt-8 mb-10">
            <p className="font-semibold text-lg">{PROFESSION_CARD_HEADLINE}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Professional headshots for physicians — without a studio visit or hefty fee.
            </p>
            <Link
              href="/pricing"
              className="mt-4 inline-block bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Get Your Doctor Headshots
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
                    name: "What should I wear for my doctor headshot?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "A white coat or professional business attire works best. The AI preserves your outfit while giving you a polished, studio-quality background.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Can I use my doctor headshot on medical directories?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Yes! Our headshots are suitable for Healthgrades, Zocdoc, Doximity, Google Business Profile, hospital websites, and any medical professional directory.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "How fast will I receive my headshots?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: `${DELIVERY_FAQ_READY} You don't need to wait days for a photographer to edit and deliver.`,
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Can my entire medical practice get headshots?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Absolutely! Each doctor, nurse, or staff member can order their own pack for a consistent, professional clinic-wide look.",
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
