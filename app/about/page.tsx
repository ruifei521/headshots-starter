import type { Metadata } from "next";
import Link from "next/link";
import { Camera } from "lucide-react";
import { PRICING_TRUST_LINE } from "@/lib/refund-policy";
import { HEADSHOT_PROFESSION_STYLES_SHORT } from "@/lib/marketing-copy";
import { TIERS } from "@/lib/tiers";
export const metadata: Metadata = {
  title: "About Us",
  description:
    "We provide AI-generated professional headshots for professionals worldwide.",
  alternates: {
    canonical: "https://snapprohead.com/about",
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <section className="py-16 md:py-24">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex items-center gap-2 mb-6">
            <Camera className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl md:text-4xl font-bold">
              About SnapProHead
            </h1>
          </div>

          <p className="text-lg text-muted-foreground mb-6">
            SnapProHead makes professional headshots accessible to everyone. 
            No studios, no expensive photographers, no scheduling headaches — 
            just upload your selfies and get studio-quality portraits in ~25 minutes.
          </p>

          <h2 className="text-xl font-semibold mt-10 mb-3">Our Mission</h2>
          <p className="text-muted-foreground mb-6">
            We believe that every professional deserves a great headshot. 
            Whether you&apos;re building your LinkedIn profile, updating your company website, 
            or preparing for a speaking engagement — your first impression matters, 
            and it shouldn&apos;t cost a fortune.
          </p>

          <h2 className="text-xl font-semibold mt-10 mb-3">Who We Are</h2>
          <p className="text-muted-foreground mb-6">
            Our team combines expertise in AI technology 
            and e-commerce to deliver a seamless, affordable headshot experience 
            to customers worldwide.
          </p>

          <h2 className="text-xl font-semibold mt-10 mb-3">Our Guarantee</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground mb-6">
            <li><strong>3 plans from $29</strong> — {TIERS.starter.marketingImageCount}+, {TIERS.professional.marketingImageCount}+, or {TIERS.executive.marketingImageCount}+ HD headshots. No subscription, no hidden fees.</li>
            <li><strong>{PRICING_TRUST_LINE}</strong> — Not happy with your results? See our <Link href="/refund" className="text-blue-600 hover:underline">refund policy</Link>.</li>
            <li><strong>~25 minute turnaround</strong> — Fast, no waiting.</li>
            <li><strong>{HEADSHOT_PROFESSION_STYLES_SHORT}</strong> — Corporate, legal, real estate, and more.</li>
          </ul>

          <h2 className="text-xl font-semibold mt-10 mb-3">Explore SnapProHead</h2>
          <p className="text-muted-foreground mb-3">
            Browse styles, read guides, and see sample results before you buy.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground text-sm mb-6">
            <li>
              <Link href="/headshots" className="text-blue-600 hover:underline">
                All headshot styles
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="text-blue-600 hover:underline">
                Pricing &amp; plans
              </Link>
            </li>
            <li>
              <Link href="/examples" className="text-blue-600 hover:underline">
                Examples &amp; sample testimonials
              </Link>
            </li>
            <li>
              <Link href="/blog" className="text-blue-600 hover:underline">
                Blog &amp; industry guides
              </Link>
            </li>
          </ul>

          <h2 className="text-xl font-semibold mt-10 mb-3">Contact Us</h2>
          <p className="text-muted-foreground">
            Email: <a href="mailto:contact@snapprohead.com" className="text-blue-600 hover:underline">contact@snapprohead.com</a>
            <br />
          </p>
        </div>
      </section>
    </main>
  );
}
