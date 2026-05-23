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
            {" — "}6 professional style packs to choose from
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
            Choose from <strong>6 professional style packs</strong> — corporate, formal, natural, and more.
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

        {/* Unconditional Refund Guarantee — inspired by HeadshotPro */}
        <div className="mt-12 rounded-2xl border bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-8 text-center">
          <div className="mx-auto max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 mb-4">
              <ShieldIcon className="h-4 w-4" />
              No-Risk Guarantee
            </div>
            <h3 className="text-2xl font-bold tracking-tight mb-3">
              Love Your Headshots, or Get a Full Refund
            </h3>
            <p className="text-muted-foreground text-lg mb-6">
              If you don&apos;t get a single headshot you&apos;re happy with, we&apos;ll refund your entire purchase. 
              <strong className="text-foreground"> No questions asked.</strong>
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> 
                14-day guarantee
              </span>
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> 
                Full refund
              </span>
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> 
                No conditions
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}
