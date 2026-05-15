import Link from "next/link"
import { ArrowRight, Shield, Clock, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import TrustBadges from "@/components/homepage/trust-badges"
import ThreeDBeforeAfterGallery from "@/components/homepage/3d-before-after-gallery"

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center mb-8">
          <Badge className="mb-4" variant="outline">
            Professional AI Headshots in Minutes
          </Badge>
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mb-6">
            Studio-Quality Headshots <span className="text-primary">Without the Studio</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-[800px] mx-auto">
            Turn your selfies into professional headshots in ~30 minutes. Save <strong>$200-$500</strong> compared to traditional photography.
          </p>
          <div className="mt-4 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/login" className="w-full sm:w-auto">
              <Button size="lg" className="group w-full sm:w-auto">
                Get Professional Headshots — From $19.99
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="#pricing" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                View Pricing
              </Button>
            </Link>
          </div>

          {/* Trust Metrics */}
          <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Shield className="h-4 w-4 text-green-500" />
              <strong className="text-foreground">14-Day Money-Back</strong> Guarantee
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-blue-500" />
              <strong className="text-foreground">~30-Minute</strong> Delivery
            </span>
            <span className="flex items-center gap-1">
              <Lock className="h-4 w-4 text-primary" />
              <strong className="text-foreground">Privacy-First</strong> — Auto-Delete After 30 Days
            </span>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-8">
          <TrustBadges />
        </div>

        <div className="mt-12">
          <ThreeDBeforeAfterGallery />
        </div>
      </div>
    </section>
  )
}