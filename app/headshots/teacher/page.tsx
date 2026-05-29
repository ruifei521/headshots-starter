import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Teacher Headshots – Professional AI Portraits for Educators",
  description:
    "Professional AI headshots for teachers. Build trust with students and parents on school websites, staff directories, and social media. Starting at $29 for 40+ HD photos in ~30 minutes.",
  alternates: {
    canonical: "https://snapprohead.com/headshots/teacher",
  },
  openGraph: {
    title: "Teacher Headshots – Professional AI Portraits for Educators",
    description:
      "Warm, professional headshots for teachers. From your selfies in ~30 minutes. $29 — 14-day guarantee.",
    url: "https://snapprohead.com/headshots/teacher",
    images: [{ url: "https://snapprohead.com/hero.webp", width: 1200, height: 630 }],
  },
};

export default function TeacherHeadshotsPage() {
  return (
    <main className="min-h-screen">
      <section className="py-16 md:py-24">
        <div className="max-w-2xl mx-auto px-4">
          <Link href="/headshots" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
            ← Browse All Styles
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Teacher Headshots
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            A great teacher headshot builds trust with students and parents before you even speak. Whether you teach kindergarten, high school, or college, a polished portrait makes you approachable and professional.
          </p>

          <h2 className="text-xl font-semibold mt-10 mb-3">Why a Professional Teacher Headshot Matters</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground mb-6">
            <li><strong>Build trust with parents</strong> – A warm, professional photo helps parents feel confident in their child&apos;s education.</li>
            <li><strong>Stand out on school websites</strong> – Your staff directory photo is often the first impression families get of you.</li>
            <li><strong>Show your personality</strong> – Approachable portraits reflect the caring educator you are.</li>
            <li><strong>Consistent school branding</strong> – Match your school&apos;s professional standards with a polished headshot.</li>
          </ul>

          <h2 className="text-xl font-semibold mt-10 mb-3">How It Works</h2>
          <ol className="list-decimal pl-5 space-y-2 text-muted-foreground mb-6">
            <li>Upload 8–12 selfies — dress as you would for the classroom.</li>
            <li>Our AI generates 40+ professional teacher headshots in various styles.</li>
            <li>Download your favorites and update your profiles instantly.</li>
          </ol>

          <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-6 mt-8 mb-10">
            <p className="font-semibold text-lg">From $29 — 14-Day Money-Back Guarantee</p>
            <p className="text-sm text-muted-foreground mt-1">
              Professional headshots for educators — no studio visit needed.
            </p>
            <Link
              href="/templates"
              className="mt-4 inline-block bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Get Your Teacher Headshots
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
                    name: "What should I wear for my teacher headshot?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Wear what you would normally teach in — business casual, a blazer, or a comfortable but professional outfit. The AI works best with solid colors and minimal patterns.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Can I use my teacher headshot on the school website?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Yes! Our headshots are perfect for school staff directories, faculty pages, classroom websites, parent-teacher communication platforms, and your professional social media profiles.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "How long does it take to get my teacher headshots?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Most orders are ready within 30 minutes. You'll receive 40+ HD photos to choose from.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Can my entire school faculty get headshots?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Absolutely! Each teacher or staff member can order their own pack. The consistent professional quality creates a unified look across your entire school website.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "What if I don't like the results?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "We offer a 14-day money-back guarantee — no questions asked. If you're not satisfied with your teacher headshots, we'll refund your purchase in full.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Are these headshots suitable for online teaching profiles?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Yes! Whether you teach on Outschool, VIPKid, or any online platform, a professional headshot helps you stand out to parents and students browsing for classes.",
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
