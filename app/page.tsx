import type { Metadata } from "next"
import dynamic from "next/dynamic"
import HeroSection from "@/components/homepage/HeroSection"
import ExamplesSection from "@/components/homepage/ExamplesSection"
import ClosingCtaSection from "@/components/homepage/ClosingCtaSection"

const PricingSection = dynamic(() => import("@/components/homepage/PricingSection"))
const FAQSection = dynamic(() => import("@/components/homepage/FAQSection"))
const PrivacySection = dynamic(() => import("@/components/homepage/PrivacySection"))
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
