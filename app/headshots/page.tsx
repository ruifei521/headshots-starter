import { Metadata } from "next";
import Link from "next/link";

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

const CATEGORIES: Category[] = [
  { slug: "linkedin", name: "LinkedIn" },
  { slug: "lawyer", name: "Lawyer" },
  { slug: "realtor", name: "Realtor" },
  { slug: "executive", name: "Executive" },
  { slug: "corporate", name: "Corporate" },
  { slug: "business", name: "Business" },
  { slug: "professional", name: "Professional" },
  { slug: "portfolio", name: "Portfolio" },
  { slug: "teacher", name: "Teacher" },
  { slug: "nurse", name: "Nurse" },
  { slug: "consultant", name: "Consultant" },
  { slug: "accountant", name: "Accountant" },
  { slug: "dentist", name: "Dentist" },
  { slug: "doctor", name: "Doctor" },
  { slug: "c-suite", name: "C-Suite" },
  { slug: "startup", name: "Startup" },
  { slug: "actor", name: "Actor" },
];

export default function HeadshotsIndexPage() {
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
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/headshots/${cat.slug}`}
                className="block p-4 rounded-lg border hover:border-primary hover:shadow-sm transition-all"
              >
                <h2 className="font-semibold text-lg">{cat.name} Headshots</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Professional AI headshots for {cat.name.toLowerCase()}s
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
