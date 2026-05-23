import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import TrustBadges from "@/components/homepage/trust-badges"
import ThreeDBeforeAfterGallery from "@/components/homepage/3d-before-after-gallery"
import { PRICING } from "@/lib/pricing"

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      {/* Social Proof Banner */}
      <div className="absolute top-0 left-0 right-0 bg-primary/5 border-b border-primary/10">
        <div className="container px-4 md:px-6 py-2">
          <p className="text-center text-sm text-muted-foreground">
            <span className="font-semibold text-primary">⭐ Trusted by professionals worldwide</span> 
            {" — "}5 professional styles to choose from
          </p>
        </div>
      </div>

      <div className="container px-4 md:px-6 pt-8">
        <div className="mx-auto max-w-3xl text-center mb-8">
          <Badge className="mb-4" variant="outline">
            🚀 Professional AI Headshots in ~30 Minutes
          </Badge>
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mb-6">
            Professional Headshots <span className="text-primary">Without the Studio</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-[800px] mx-auto">
            Turn your selfies into studio-quality headshots in ~30 minutes. 
            Choose from <strong>5 professional styles</strong> — corporate, formal, natural, and more.
            Starting at <strong className="text-primary">${PRICING.starter.price}</strong>.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/login" className="w-full sm:w-auto">
              <Button size="lg" className="group w-full sm:w-auto">
                Create Your Headshots — From ${PRICING.starter.price}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="#pricing" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>

        {/* Before/After Gallery — 바로 CTA 아래에 위치 */}
        <div className="mt-10">
          <ThreeDBeforeAfterGallery />
        </div>

        {/* Trust Badges */}
        <div className="mt-10">
          <TrustBadges />
        </div>

      </div>
    </section>
  )
}
