import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import dynamic from "next/dynamic"
import TrustBadges from "@/components/homepage/trust-badges"

const ThreeDBeforeAfterGallery = dynamic(
  () => import("@/components/homepage/3d-before-after-gallery"),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full aspect-[3/2] bg-muted/30 rounded-2xl flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }
)

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden py-10 md:py-16">
      <div className="container px-4 md:px-6 pt-2">
        <div className="mx-auto max-w-3xl text-center mb-8">
          <Badge className="mb-4" variant="outline">
            🚀 Professional AI Headshots in ~30 Minutes
          </Badge>
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mb-6">
            Professional Headshots <span className="text-primary">Without the Studio</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-[800px] mx-auto">
            Turn your selfies into studio-quality headshots in ~30 minutes.
            Choose from <strong>12 professional styles</strong> — corporate, lawyer, speaker, realtor, studio portraits, and more.
            Starting at <strong className="text-primary">$29</strong>.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/templates" className="w-full sm:w-auto">
              <Button size="lg" className="group w-full sm:w-auto">
                Choose Your Style — From $29
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="#how-it-works" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-muted-foreground/30 text-muted-foreground hover:text-foreground">
                How It Works ↓
              </Button>
            </Link>
          </div>
        </div>

        {/* Before/After Gallery — lazy loaded, only when visible */}
        <div className="mt-6">
          <ThreeDBeforeAfterGallery />
        </div>

        {/* Trust Badges */}
        <div className="mt-6">
          <TrustBadges />
        </div>


      </div>
    </section>
  )
}
