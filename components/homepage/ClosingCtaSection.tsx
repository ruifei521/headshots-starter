import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TRUST_CLOSING_BADGE } from "@/lib/refund-policy"

type ClosingCtaSectionProps = {
  /** Scroll target on pricing page; default homepage pricing anchor */
  ctaHref?: string
}

export default function ClosingCtaSection({
  ctaHref = "/pricing",
}: ClosingCtaSectionProps) {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-primary/5 border-t">
      <div className="container px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
            Your headshot is often your{" "}
            <span className="text-primary">first impression</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-[700px] mx-auto leading-relaxed">
            Recruiters, clients, and colleagues will see your headshot before
            they ever meet you. A distracting background, a low-resolution crop,
            or a DIY selfie signals you didn&apos;t care enough to get it right.
            The right background makes you look polished, credible, and ready.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2 w-full max-w-md sm:max-w-none mx-auto">
            <Link href={ctaHref} className="w-full sm:w-auto">
              <Button size="lg" className="group w-full sm:w-auto">
                Get your headshots
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Mini trust badges */}
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2 sm:gap-6 pt-4 text-xs sm:text-sm text-muted-foreground px-2">
            <span>✓ {TRUST_CLOSING_BADGE}</span>
            <span className="hidden sm:inline text-muted-foreground/40">·</span>
            <span>✓ Commercial license included</span>
            <span className="hidden sm:inline text-muted-foreground/40">·</span>
            <span>✓ Your photos stay private</span>
          </div>
        </div>
      </div>
    </section>
  )
}
