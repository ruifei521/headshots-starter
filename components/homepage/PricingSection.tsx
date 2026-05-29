import ModernPricing from "@/components/homepage/modern-pricing"

export default function PricingSection() {
  return (
    <section id="pricing" className="scroll-mt-16 border-t py-12 md:py-16 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center gap-4 text-center md:gap-8">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Traditional studio: <span className="text-primary">$200–$500</span>.
          </h2>
          <p className="max-w-[600px] text-muted-foreground text-lg">
            Get studio-quality AI headshots at a fraction of the cost. Three plans to fit your needs.
          </p>
        </div>
        <div className="mt-8">
          <ModernPricing />
        </div>
      </div>
    </section>
  )
}
