import ModernPricing from "@/components/homepage/modern-pricing"

export default function PricingSection() {
  return (
    <section id="pricing" className="scroll-mt-16 border-t py-12 md:py-16 bg-muted/30">
      <div className="container px-4 md:px-6">
          <ModernPricing />
      </div>
    </section>
  )
}
