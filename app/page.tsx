import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"
import dynamic from "next/dynamic"
import type { Metadata } from "next"
import HeroSection from "@/components/homepage/HeroSection"
import ExamplesSection from "@/components/homepage/ExamplesSection"
import TestimonialsSection from "@/components/homepage/TestimonialsSection"
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
const ProcessSection = dynamic(
  () => import("@/components/homepage/ProcessSection"),
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

export const revalidate = 3600

export default async function Index() {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookies().getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookies().set(name, value, options)
            })
          } catch {
            // The `set` method was called from a Server Component.
          }
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    // Logged-in users can still view the landing page
  }

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
        <ProcessSection />
        <ExamplesSection />
        <TestimonialsSection />
        <ClosingCtaSection />
        <FAQSection />
        <PrivacySection />
      </div>
    </>
  )
}
