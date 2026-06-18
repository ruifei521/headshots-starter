import type { Metadata } from "next"
import HeroSection from "@/components/homepage/HeroSection"
import PricingSection from "@/components/homepage/PricingSection"
import ExamplesSection from "@/components/homepage/ExamplesSection"
import ClosingCtaSection from "@/components/homepage/ClosingCtaSection"
import FAQSection from "@/components/homepage/FAQSection"
import PrivacySection from "@/components/homepage/PrivacySection"
import { getHomepageJsonLd } from "@/lib/json-ld"
import { META_HOME_DESCRIPTION } from "@/lib/refund-policy"
import { buildPageOpenGraph, buildPageTwitter, SITE_URL } from "@/lib/site-seo"

const HOME_TITLE =
  "SnapProHead - AI Professional Headshot Generator | Studio-Quality in ~25 Min"

export const metadata: Metadata = {
  title: {
    absolute: HOME_TITLE,
  },
  description: META_HOME_DESCRIPTION,
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: buildPageOpenGraph({
    title: HOME_TITLE,
    description: META_HOME_DESCRIPTION,
  }),
  twitter: buildPageTwitter({
    title: HOME_TITLE,
    description: META_HOME_DESCRIPTION,
  }),
}

export const revalidate = 3600

export default function Index() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getHomepageJsonLd()) }}
      />
      <div>
        <HeroSection />
        <ExamplesSection />
        <ClosingCtaSection ctaHref="#pricing" />
        <PricingSection />
        <FAQSection />
        <PrivacySection />
      </div>
    </>
  )
}
