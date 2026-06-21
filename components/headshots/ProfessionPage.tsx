"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Shield } from "lucide-react";
import { generateFAQSchema } from "@/lib/json-ld";
import type { FAQItem } from "@/lib/json-ld";

export type ProfessionPageData = {
  slug: string;
  heroBadge: string;
  heroTitle: string;
  heroHighlight: string;
  heroDescription: string;
  featureList: string[];
  specsSection?: { title: string; items: { label: string; value: string }[] };
  whySection: { title: string; cards: { title: string; desc: string }[] };
  useCases?: string[];
  ctaHeadline: string;
  ctaSubtext: string;
  faqs: FAQItem[];
  relatedPages: { label: string; href: string }[];
};

export default function ProfessionPage({ data }: { data: ProfessionPageData }) {
  const jsonLd = generateFAQSchema(data.faqs);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container px-4 md:px-6 py-16 md:py-24">
        {/* ======== Hero ======== */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4">
            {data.heroBadge}
          </span>
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mb-6">
            AI Headshots for{" "}
            <span className="text-primary">{data.heroHighlight}</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-[800px] mx-auto mb-8">
            {data.heroDescription}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/pricing">
              <Button size="lg" className="group w-full sm:w-auto">
                Create Your {data.slug} Headshots
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                View Pricing
              </Button>
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            {data.featureList.map((f, i) => (
              <span key={i} className="flex items-center gap-1">
                <Check className="h-4 w-4 text-green-500" /> {f}
              </span>
            ))}
          </div>
        </div>

        {/* ======== Recommended Card ======== */}
        <div className="mx-auto max-w-2xl mb-16 p-8 rounded-xl border bg-card">
          <h2 className="text-2xl font-bold mb-4">Perfect for {data.slug} Professionals</h2>
          <p className="text-muted-foreground mb-4">
            Get studio-quality headshots designed for {data.slug} professionals —
            without the scheduling, studio visit, or $300+ photographer bill.
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm mb-6">
            <div className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5" /> 40+ HD headshots</div>
            <div className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5" /> Multiple backgrounds</div>
            <div className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5" /> ~25 min delivery</div>
            <div className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5" /> Natural, realistic</div>
          </div>
          <Link href="/pricing">
            <Button className="w-full">Get Started — $29</Button>
          </Link>
          <p className="text-center mt-4">
            <Link href="/headshots" className="text-sm text-primary hover:underline">
              Not sure which style? Browse all 21 styles →
            </Link>
          </p>
        </div>

        {/* ======== Why Section ======== */}
        <div className="mx-auto max-w-3xl mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">{data.whySection.title}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {data.whySection.cards.map((card, i) => (
              <div key={i} className="p-6 rounded-xl border bg-card text-center">
                <h3 className="text-2xl font-bold text-primary mb-2">{card.title}</h3>
                <p className="text-sm text-muted-foreground">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ======== CTA mid-page ======== */}
        <div className="mx-auto max-w-2xl mb-16 text-center p-8 rounded-xl bg-muted/30">
          <p className="text-lg font-semibold mb-2">
            Ready to upgrade your {data.slug} headshots?
          </p>
          <Link href="/pricing">
            <Button size="lg">Choose Your Plan — Starting at $29</Button>
          </Link>
          <p className="mt-3 text-sm text-muted-foreground">
            <Link href="/examples" className="text-primary hover:underline">
              See real examples
            </Link>{" "}
            before you decide.
          </p>
        </div>

        {/* ======== Specs Section (optional) ======== */}
        {data.specsSection && (
          <div className="mx-auto max-w-3xl mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">{data.specsSection.title}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {data.specsSection.items.map((item, i) => (
                <div key={i} className="p-4 rounded-lg border bg-card">
                  <span className="text-sm font-semibold text-muted-foreground">{item.label}</span>
                  <p className="font-medium">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======== Use Cases ======== */}
        {data.useCases && data.useCases.length > 0 && (
          <div className="mx-auto max-w-3xl mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">Where to Use Your {data.slug} Headshots</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {data.useCases.map((uc, i) => (
                <div key={i} className="p-4 rounded-lg border bg-card flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500 shrink-0" />
                  <span className="text-sm">{uc}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======== FAQ ======== */}
        <div className="mx-auto max-w-3xl mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {data.faqs.map((faq, i) => (
              <details key={i} className="p-5 rounded-xl border bg-card group">
                <summary className="font-semibold cursor-pointer list-none flex items-center justify-between">
                  {faq.question}
                  <span className="text-muted-foreground text-lg group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>

        {/* ======== Bottom CTA ======== */}
        <div className="mx-auto max-w-2xl text-center">
          <Shield className="h-12 w-12 mx-auto text-green-500 mb-4" />
          <h2 className="text-2xl font-bold mb-4">{data.ctaHeadline}</h2>
          <p className="text-muted-foreground mb-6">{data.ctaSubtext}</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/pricing">
              <Button size="lg">Create Your {data.slug} Headshots Now</Button>
            </Link>
            <Link href="/headshots">
              <Button size="lg" variant="outline">Browse All Styles</Button>
            </Link>
          </div>
        </div>

        {/* ======== Related Pages ======== */}
        <div className="mx-auto max-w-3xl mt-20 pt-10 border-t">
          <p className="text-sm font-semibold text-muted-foreground text-center mb-4">Related Pages</p>
          <div className="flex flex-wrap justify-center gap-3">
            {data.relatedPages.map((rp, i) => (
              <Link
                key={i}
                href={rp.href}
                className="text-sm px-3 py-1.5 rounded-full bg-muted hover:bg-primary/10 hover:text-primary transition-colors"
              >
                {rp.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
