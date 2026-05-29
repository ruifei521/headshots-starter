import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"
import dynamic from "next/dynamic"
import HeroSection from "@/components/homepage/HeroSection"

const ProcessSection = dynamic(
  () => import("@/components/homepage/ProcessSection"),
  { ssr: false }
)
const PacksShowcase = dynamic(
  () => import("@/components/homepage/PacksShowcase"),
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
const PricingSection = dynamic(
  () => import("@/components/homepage/PricingSection"),
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

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Product",
      "name": "SnapProHead - AI Professional Headshot Generator",
      "description": `Generate professional AI headshots for LinkedIn, resumes, and social media in ~30 minutes. Starting at $29 with a 14-day money-back guarantee.`,
      "url": "https://snapprohead.com",
      "image": "https://snapprohead.com/hero.png",
      "brand": {
        "@type": "Brand",
        "name": "SnapProHead"
      },
      "offers": {
        "@type": "AggregateOffer",
        "priceCurrency": "USD",
        "lowPrice": `29`,
        "highPrice": `59`,
        "offerCount": "3",
        "availability": "https://schema.org/InStock"
      }
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How does the AI headshot generation work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Upload 4-10 selfies, choose a professional style (Corporate, Natural, Formal, etc.), then our AI trains on your face and generates studio-quality headshots in ~30 minutes. You get 40+ photos with different backgrounds and outfits."
          }
        },
        {
          "@type": "Question",
          "name": "How much does it cost?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `Just $29 for 40+ AI headshots in a professional style. All plans include a no-questions-asked refund guarantee within 14 days.`
          }
        },
        {
          "@type": "Question",
          "name": "What kind of photos should I upload?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Upload 5-10 clear selfies with different angles, expressions, and lighting. Avoid group photos, sunglasses, and heavily filtered images."
          }
        },
        {
          "@type": "Question",
          "name": "How long does it take to get my headshots?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The AI model training takes about 30 minutes. Once trained, your headshots are ready to download."
          }
        },
        {
          "@type": "Question",
          "name": "Do I own the rights to my AI headshots?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, all plans include a commercial license. You can use your headshots anywhere, including LinkedIn, resumes, websites, and other commercial purposes."
          }
        },
        {
          "@type": "Question",
          "name": "What if I don't like the results?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We stand behind our AI headshots. If you're not satisfied, we'll refund your entire purchase — no questions asked, within 14 days."
          }
        }
      ]
    }
  ]
}

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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div>
        <HeroSection />
        <ProcessSection />
        <PacksShowcase />
        <ExamplesSection />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
        <PrivacySection />
      </div>
    </>
  )
}
