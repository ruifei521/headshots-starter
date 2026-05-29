import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check, ArrowRight, Shield } from "lucide-react"
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Corporate Headshots - Professional AI Photos for corporate professionals',
  description: 'Get professional AI corporate in ~30 minutes. Corporate Headshots for corporate professionals. 40+ HD photos, starting at $29. 14-day money-back guarantee.',
  openGraph: {
    title: 'AI Corporate Headshots - corporate professionals',
    description: 'Professional corporate for corporate professionals. Starting at $29 for 40+ HD headshots.',
  },
}

export default function CorporateHeadshotsPage() {
  return (
    <div className="container px-4 md:px-6 py-16 md:py-24">
      <div className="mx-auto max-w-3xl text-center mb-16">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4">
          Corporate Headshots
        </span>
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mb-6">
          AI Headshots for <span className="text-primary">corporate professionals</span>
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl max-w-[800px] mx-auto mb-8">
          Professional corporate that help you make the right impression. 
          Upload selfies and get studio-quality photos in ~30 minutes.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/login">
            <Button size="lg" className="group w-full sm:w-auto">
              Create Your Corporate Headshots
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/templates">
            <Button size="lg" variant="outline">Browse Styles</Button>
          </Link>
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><Check className="h-4 w-4 text-green-500" /> 40+ HD Photos</span>
          <span className="flex items-center gap-1"><Check className="h-4 w-4 text-green-500" /> Multiple Styles</span>
          <span className="flex items-center gap-1"><Check className="h-4 w-4 text-green-500" /> Starting at $29</span>
        </div>
      </div>

      <div className="mx-auto max-w-2xl mb-16 p-8 rounded-xl border bg-card">
        <h2 className="text-2xl font-bold mb-4">Professional Corporate Headshots</h2>
        <p className="text-muted-foreground mb-4">
          Choose from 12 professional styles including corporate looks, 
          formal business, and modern casual — all in one session.
        </p>
        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
          <div className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5" /> 40+ HD headshots</div>
          <div className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5" /> 12 professional styles</div>
          <div className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5" /> Multiple backgrounds</div>
          <div className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5" /> Commercial license</div>
        </div>
        <Link href="/login"><Button className="w-full">Get Started — $29</Button></Link>
        <p className="text-center mt-4">
          <Link href="/templates" className="text-sm text-primary hover:underline">Browse all 12 styles →</Link>
        </p>
      </div>

      <div className="mx-auto max-w-2xl text-center">
        <Shield className="h-12 w-12 mx-auto text-green-500 mb-4" />
        <h2 className="text-2xl font-bold mb-4">Ready to Upgrade Your Image?</h2>
        <p className="text-muted-foreground mb-6">$29. 14-day guarantee. Delivered in ~30 minutes.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/login"><Button size="lg">Create Your Corporate Headshots Now</Button></Link>
          <Link href="/templates"><Button size="lg" variant="outline">Browse All Styles</Button></Link>
        </div>
      </div>

      <script type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify({
          '@context': 'https://schema.org','@type': 'FAQPage',
          mainEntity: [
            {'@type':'Question', name: 'How much do corporate cost?',
             acceptedAnswer:{'@type':'Answer', text: 'Starting at $29 for 40+ HD professional headshots.'}},
            {'@type':'Question', name: 'How long does it take?',
             acceptedAnswer:{'@type':'Answer', text: 'About 30 minutes. Upload 4-10 selfies and our AI generates your photos.'}},
          ]}
        )}}
      />
    </div>
  )
}
