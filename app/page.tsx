import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import HeroSection from "@/components/homepage/HeroSection"
import ProcessSection from "@/components/homepage/ProcessSection"
import ComparisonSection from "@/components/homepage/ComparisonSection"
import FeaturesSection from "@/components/homepage/FeaturesSection"
import ExamplesSection from "@/components/homepage/ExamplesSection"
import PricingSection from "@/components/homepage/PricingSection"
import FAQSection from "@/components/homepage/FAQSection"
import CTASection from "@/components/homepage/CTASection"
import { PRICING } from "@/lib/pricing"

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Product",
      "name": "SnapProHead - AI Professional Headshot Generator",
      "description": `Generate professional AI headshots for LinkedIn, resumes, and social media in ~30 minutes. Starting at $${PRICING.starter.price} with a 14-day money-back guarantee.`,
      "url": "https://snapprohead.com",
      "image": "https://snapprohead.com/hero.png",
      "brand": {
        "@type": "Brand",
        "name": "SnapProHead"
      },
      "offers": {
        "@type": "AggregateOffer",
        "priceCurrency": "USD",
        "lowPrice": `${PRICING.starter.price}`,
        "highPrice": `${PRICING.executive.price}`,
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
            "text": "Upload 4-10 selfies, our AI trains a model on your face, then generates professional headshots in various styles. The whole process takes about 30 minutes."
          }
        },
        {
          "@type": "Question",
          "name": "How much does it cost?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `Plans start at $${PRICING.starter.price} for ${PRICING.starter.headshots} headshots up to $${PRICING.executive.price} for ${PRICING.executive.headshots} headshots with ${PRICING.executive.styles} styles. All plans include a 14-day money-back guarantee.`
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
            "text": "The AI model training takes about 30 minutes. Once trained, generating headshots is nearly instant."
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
            "text": "We offer a 14-day money-back guarantee. If you're not satisfied, we'll refund your purchase in full."
          }
        },
        {
          "@type": "Question",
          "name": "Is my data private?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, your privacy is our priority. All uploaded photos are automatically deleted after 30 days."
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
    return redirect("/overview")
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
        <ComparisonSection />
        <FeaturesSection />
        <ExamplesSection />
        <PricingSection />
        <FAQSection />
        <CTASection />
      </div>
    </>
  )
}
