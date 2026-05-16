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

export const dynamic = "force-dynamic"

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
    <div className="flex min-h-screen flex-col">
      <div className="flex-1">
        <HeroSection />
        <ProcessSection />
        <ComparisonSection />
        <FeaturesSection />
        <ExamplesSection />
        <PricingSection />
        <FAQSection />
        <CTASection />
      </div>
    </div>
  )
}
