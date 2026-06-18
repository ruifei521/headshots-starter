import type { Metadata } from "next"
import HeroSection from "@/components/homepage/HeroSection"
import PricingSection from "@/components/homepage/PricingSection"
import ExamplesSection from "@/components/homepage/ExamplesSection"
import ClosingCtaSection from "@/components/homepage/ClosingCtaSection"
import FAQSection from "@/components/homepage/FAQSection"
import PrivacySection from "@/components/homepage/PrivacySection"
import { getHomepageJsonLd } from "@/lib/json-ld"
import { META_HOME_DESCRIPTION } from "@/lib/refund-policy"

export const metadata: Metadata = {
  title: {
    absolute: "SnapProHead - AI Professional Headshot Generator | Studio-Quality in ~25 Min",
  },
  description: META_HOME_DESCRIPTION,
}

// ISR: regenerate page every hour — no auth needed on landing page
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
        <PricingSection />
        <ExamplesSection />
        <ClosingCtaSection />
        <FAQSection />
        <PrivacySection />
      </div>
    </>
  )
}
