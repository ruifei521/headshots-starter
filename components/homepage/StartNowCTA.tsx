import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TRUST_CTA_LINE } from "@/lib/refund-policy"

export default function StartNowCTA() {
  return (
    <section className="border-t py-14 md:py-20">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-4">
            Ready for Your <span className="text-primary">Professional Headshot</span>?
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            No studio, no appointment, no hassle. Just upload 4-10 selfies and get 40+ studio-quality headshots in ~25 minutes.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/pricing">
              <Button size="lg" className="group text-base font-bold">
                Start Now — $29
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            {TRUST_CTA_LINE}
          </p>
        </div>
      </div>
    </section>
  )
}
