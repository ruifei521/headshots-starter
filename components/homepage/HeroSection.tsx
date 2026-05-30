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

const ScrollingGallery = dynamic(
  () => import("@/components/homepage/scrolling-gallery"),
  { ssr: false }
)

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden py-10 md:py-16">
      <div className="container px-4 md:px-6 pt-2">
        <div className="mx-auto max-w-3xl text-center mb-8">
          <Badge className="mb-3 text-sm px-4 py-1.5 font-semibold tracking-wide border-primary/15 bg-primary/[0.03]" variant="outline">
            🚀 Professional AI Headshots in ~25 Minutes
          </Badge>
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mb-6">
            Turn Your Selfies Into <span className="text-primary">Studio-Quality Headshots</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-[800px] mx-auto">
            Upload 4-6 selfies, and our AI will generate 40-100 professional headshots.
            Powered by <strong>Flux AI</strong> for the best quality — corporate, LinkedIn, resume, and more.
            Starting at <strong className="text-primary">$29</strong>.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/#pricing" className="w-full sm:w-auto">
              <Button size="lg" className="group w-full sm:w-auto">
                Create Your Headshots Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="#how-it-works" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-muted-foreground/30 text-muted-foreground hover:text-foreground">
                How It Works ↓
              </Button>
            </Link>
          </div>
          <p className="mt-3 text-sm text-muted-foreground flex items-center justify-center gap-1">
            <svg className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            Your photos stay private · 14-day money-back guarantee
          </p>
        </div>

        {/* Scrolling Gallery — infinite marquee of example headshots */}
        <div className="mt-8 -mx-4 md:-mx-6">
          <ScrollingGallery />
        </div>

        {/* Trust Badges — moved here from bottom */}
        <div className="mt-6">
          <TrustBadges />
        </div>

        {/* Before/After Gallery — lazy loaded, only when visible */}
        <div className="mt-12">
          <ThreeDBeforeAfterGallery />
        </div>

      </div>
    </section>
  )
}
