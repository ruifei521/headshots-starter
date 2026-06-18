import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import dynamic from "next/dynamic"
import TrustedByLogos from "@/components/homepage/trusted-by-logos"
import { TRUST_HERO_BADGE } from "@/lib/refund-policy"
import { HERO_CHEAPER_THAN_STUDIO_LINE } from "@/lib/marketing-copy"
import { TIERS } from "@/lib/tiers"

const ScrollingGallery = dynamic(
  () => import("@/components/homepage/scrolling-gallery"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-32 sm:h-40 md:h-48 bg-muted/20 rounded-lg animate-pulse" aria-hidden />
    ),
  }
)

const ThreeDBeforeAfterGallery = dynamic(
  () => import("@/components/homepage/3d-before-after-gallery"),
  {
    ssr: false,
    loading: () => (
      <div
        className="w-full max-w-xl mx-auto aspect-[4/5] bg-muted/20 rounded-2xl animate-pulse"
        aria-hidden
      />
    ),
  }
)

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden py-10 md:py-16">
      <div className="container px-4 md:px-6 pt-2 overflow-x-hidden">
        <div className="mx-auto max-w-3xl text-center mb-8">
          <Badge className="mb-3 text-xs sm:text-sm px-3 py-1.5 font-semibold tracking-wide border-blue-200/20 bg-blue-50/30 max-w-[95vw] whitespace-normal leading-snug" variant="outline">
            Studio-Quality AI Headshots for Professionals
          </Badge>
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-6xl mb-4 sm:mb-6 px-1">
            Turn Your Selfies Into <span className="text-primary">Studio-Quality Headshots</span>
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg md:text-xl max-w-[800px] mx-auto px-1">
            Professional enough for LinkedIn. Natural enough to still be you. {HERO_CHEAPER_THAN_STUDIO_LINE}.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Link href="#examples" className="w-full sm:w-auto">
              <Button size="lg" className="group w-full sm:w-auto">
                See Results
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="#pricing" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                View pricing from ${TIERS.starter.price}
              </Button>
            </Link>
          </div>
          <p className="mt-3 text-xs sm:text-sm text-muted-foreground flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2">
            <span className="inline-flex items-center gap-1">
              <svg className="h-4 w-4 text-green-500 shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              From $29 · ~25 min delivery
            </span>
            <span className="hidden sm:inline text-muted-foreground/40">·</span>
            <span>{TRUST_HERO_BADGE}</span>
          </p>
        </div>

        <div className="mt-8 -mx-4 md:-mx-6">
          <ScrollingGallery />
        </div>

        <div className="mt-10">
          <TrustedByLogos />
        </div>

        <div className="mt-12">
          <ThreeDBeforeAfterGallery />
        </div>
      </div>
    </section>
  )
}
