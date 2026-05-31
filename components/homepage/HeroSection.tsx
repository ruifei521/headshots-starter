import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import dynamic from "next/dynamic"
import TrustedByLogos from "@/components/homepage/trusted-by-logos"

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
          <Badge className="mb-3 text-sm px-4 py-1.5 font-semibold tracking-wide border-blue-200/20 bg-blue-50/30" variant="outline">
            The #1 AI Headshot Generator for Professional Headshots
          </Badge>
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mb-6">
            Turn Your Selfies Into <span className="text-primary">Studio-Quality Headshots</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-[800px] mx-auto">
            Professional enough for LinkedIn. Natural enough to still be you.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/#pricing" className="w-full sm:w-auto">
              <Button size="lg" className="group w-full sm:w-auto">
                Create Your Headshots Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <p className="mt-3 text-sm text-muted-foreground flex items-center justify-center gap-2">
            ★★★★★  6,000+ headshots delivered  ·  🛡️ Privacy first
          </p>
        </div>

        {/* Scrolling Gallery — infinite marquee of example headshots */}
        <div className="mt-8 -mx-4 md:-mx-6">
          <ScrollingGallery />
        </div>

        {/* Trusted By Section — scrolling company logos for social proof */}
        <div className="mt-10">
          <TrustedByLogos />
        </div>

        {/* Before/After Gallery — lazy loaded, only when visible */}
        <div className="mt-12">
          <ThreeDBeforeAfterGallery />
        </div>

      </div>
    </section>
  )
}
