import dynamic from "next/dynamic"
import type { Metadata } from "next"
import HeroSection from "@/components/homepage/HeroSection"
import { getHomepageJsonLd } from "@/lib/json-ld"

export const metadata: Metadata = {
  title: {
    absolute: "SnapProHead - AI Professional Headshot Generator | Studio-Quality in 30 Min",
  },
  description:
    "Turn selfies into studio-quality professional headshots with AI. 50,000+ headshots delivered. Starting at $29. 14-day money-back guarantee.",
}

const WhyAIHeadshotsSection = dynamic(
  () => import("@/components/homepage/WhyAIHeadshotsSection"),
  { ssr: false }
)
const PricingSection = dynamic(
  () => import("@/components/homepage/PricingSection"),
  { ssr: false }
)
const ClosingCtaSection = dynamic(
  () => import("@/components/homepage/ClosingCtaSection"),
  { ssr: false }
)
const FAQSection = dynamic(
  () => import("@/components/homepage/FAQSection"),
  { ssr: false }
)
const PrivacySection = dynamic(
  () => import("@/components/homepage/PrivacySection"),
  { ssr: false }
)
const ExamplesSection = dynamic(
  () => import("@/components/homepage/ExamplesSection"),
  { ssr: false }
)
const TestimonialsSection = dynamic(
  () => import("@/components/homepage/TestimonialsSection"),
  { ssr: false }
)

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
        <div id="pricing" className="scroll-mt-16">
          <PricingSection />
        </div>
        <ExamplesSection />
        <TestimonialsSection />
        <ClosingCtaSection />
        <FAQSection />
        <PrivacySection />
      </div>
    </>
  )
}
