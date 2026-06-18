import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check, ArrowRight, Shield } from "lucide-react"
import { getProfessionMetadata } from "@/lib/profession-metadata";
import { PROFESSION_PAGE_CTA, PROFESSION_HERO_SUFFIX } from "@/lib/refund-policy";

export const metadata = getProfessionMetadata("actor");
export default function ActorHeadshotsPage() {
  return (
    <div className="container px-4 md:px-6 py-16 md:py-24">
      <div className="mx-auto max-w-3xl text-center mb-16">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4">
          Headshots That Book Roles
        </span>
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mb-6">
          AI Headshots for <span className="text-primary">Actors & Performers</span>
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl max-w-[800px] mx-auto mb-8">
          Your headshot is your first audition. Get professional actor headshots that 
          showcase your range — corporate, commercial, theatrical — all in one session.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/pricing">
            <Button size="lg" className="group w-full sm:w-auto">
              Create Your Actor Headshots
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/headshots">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Browse Styles
            </Button>
          </Link>
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><Check className="h-4 w-4 text-green-500" /> Multiple Character Looks</span>
          <span className="flex items-center gap-1"><Check className="h-4 w-4 text-green-500" /> Commercial & Theatrical</span>
          <span className="flex items-center gap-1"><Check className="h-4 w-4 text-green-500" /> 21 styles to choose</span>
        </div>
      </div>

      <div className="mx-auto max-w-2xl mb-16 p-8 rounded-xl border bg-card">
        <h2 className="text-2xl font-bold mb-4">More Looks, More Auditions</h2>
        <p className="text-muted-foreground mb-4">
          Casting directors want to see your range. With SnapProHead you get 40+ headshots 
          in multiple styles — corporate, natural, commercial, and more — from a single session.
        </p>
        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
          <div className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5" /> 40+ HD headshots</div>
          <div className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5" /> Multiple backgrounds</div>
          <div className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5" /> 21 professional styles</div>
          <div className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5" /> Commercial license included</div>
        </div>
        <Link href="/pricing">
          <Button className="w-full">Get Started — $29</Button>
        </Link>
        <p className="text-center mt-4">
          <Link href="/headshots" className="text-sm text-primary hover:underline">Browse all 21 styles →</Link>
        </p>
      </div>

      <div className="mx-auto max-w-2xl text-center">
        <Shield className="h-12 w-12 mx-auto text-green-500 mb-4" />
        <h2 className="text-2xl font-bold mb-4">Ready for Your Close-Up?</h2>
        <p className="text-muted-foreground mb-6">
          {PROFESSION_PAGE_CTA}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/pricing">
            <Button size="lg">Create Your Actor Headshots Now</Button>
          </Link>
          <Link href="/headshots">
            <Button size="lg" variant="outline">Browse All Styles</Button>
          </Link>
        </div>
      </div>

      <script type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify({
          '@context': 'https://schema.org','@type': 'FAQPage',
          mainEntity: [
            {'@type':'Question', name:'How much do actor headshots cost?',
             acceptedAnswer:{'@type':'Answer', text: PROFESSION_HERO_SUFFIX}},
            {'@type':'Question', name:'How many looks can I get?',
             acceptedAnswer:{'@type':'Answer', text:'21 professional styles including corporate, natural, commercial, and theatrical looks.'}},
          ]}
        )}}
      />
    </div>
  )
}
