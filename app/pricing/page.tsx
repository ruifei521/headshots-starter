import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import ModernPricing from "@/components/homepage/modern-pricing";
import ClosingCtaSection from "@/components/homepage/ClosingCtaSection";
import FAQSection from "@/components/homepage/FAQSection";
import PrivacySection from "@/components/homepage/PrivacySection";
import { CheckoutStatusHandlerSlot } from "@/components/CheckoutStatusHandlerSlot";
import { NoCreditsBanner } from "@/components/NoCreditsBanner";
import { META_PRICING_DESCRIPTION, PRICING_SUBHEAD, PRICING_TRUST_LINE } from "@/lib/refund-policy";
import { getPricingPageJsonLd } from "@/lib/json-ld";
import { buildPageOpenGraph, buildPageTwitter, SITE_URL } from "@/lib/site-seo";

const PRICING_TITLE = "Pricing — AI Professional Headshots from $29";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: PRICING_TITLE,
  description: META_PRICING_DESCRIPTION,
  alternates: {
    canonical: `${SITE_URL}/pricing`,
  },
  openGraph: buildPageOpenGraph({
    title: PRICING_TITLE,
    description: META_PRICING_DESCRIPTION,
    path: "/pricing",
  }),
  twitter: buildPageTwitter({
    title: PRICING_TITLE,
    description: META_PRICING_DESCRIPTION,
  }),
};

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getPricingPageJsonLd()) }}
      />
      <div className="bg-background min-h-[70vh]">
        <CheckoutStatusHandlerSlot />
        <Suspense fallback={null}>
          <NoCreditsBanner />
        </Suspense>

        <section className="py-8 md:py-14 border-b">
          <div className="container px-4 md:px-6 max-w-4xl mx-auto text-center space-y-3 sm:space-y-4">
            <p className="text-xs sm:text-sm text-muted-foreground">
              From $29 · ~25 min delivery ·{" "}
              <Link href="/refund" className="hover:underline underline-offset-2">
                {PRICING_TRUST_LINE.toLowerCase()}
              </Link>
            </p>
            <h1 className="text-2xl font-bold tracking-tight sm:text-4xl md:text-[2.5rem] px-2">
              Choose your headshot package
            </h1>
            <p className="text-muted-foreground text-base max-w-lg mx-auto">
              {PRICING_SUBHEAD}{" "}
              <Link href="/refund" className="text-primary hover:underline">
                See our refund policy
              </Link>
              .
            </p>
          </div>
        </section>

        <section id="pricing" className="py-10 md:py-14 bg-muted/20 scroll-mt-16">
          <ModernPricing showHeader={false} showComparison={true} showTrustBadges={true} />
        </section>

        <ClosingCtaSection ctaHref="#pricing" />
        <FAQSection />
        <PrivacySection />
      </div>
    </>
  );
}
