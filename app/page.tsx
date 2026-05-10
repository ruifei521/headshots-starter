import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import HeroSection from "@/components/homepage/HeroSection"
import BrandsSection from "@/components/homepage/BrandsSection"
import ProcessSection from "@/components/homepage/ProcessSection"
import ComparisonSection from "@/components/homepage/ComparisonSection"
import FeaturesSection from "@/components/homepage/FeaturesSection"
import ExamplesSection from "@/components/homepage/ExamplesSection"
import TestimonialsSection from "@/components/homepage/TestimonialsSection"
import PricingSection from "@/components/homepage/PricingSection"
import FAQSection from "@/components/homepage/FAQSection"
import PrivacySection from "@/components/homepage/PrivacySection"
import CTASection from "@/components/homepage/CTASection"

export const dynamic = "force-dynamic"

export default async function Index() {
    const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookies().getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            try {
              cookies().set(name, value, options);
            } catch {
              // The `set` method was called from a Server Component.
            }
          });
        },
      },
    }
  );

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
        <BrandsSection />
        <ProcessSection />
        <ComparisonSection />
        <FeaturesSection />
        <ExamplesSection />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
        <PrivacySection />
        <CTASection />
      </div>
    </div>
  )
}
