import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check, ArrowRight, Shield } from "lucide-react"
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Executive Headshots - Professional AI Photos for Executives',
  description: 'Get boardroom-quality AI executive headshots. Professional portraits for C-suite leaders, executives, and business professionals. Starting at $29 — 40+ HD headshots in ~30 minutes.',
  openGraph: {
    title: 'AI Executive Headshots - Boardroom Quality Portraits',
    description: 'Executive headshots that command respect. Starting at $29 for 40+ HD portraits.',
  },
}

export default function ExecutiveHeadshotsPage() {
  return (
    <div className="container px-4 md:px-6 py-16 md:py-24">
      <div className="mx-auto max-w-3xl text-center mb-16">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4">
          Executive Portraits
        </span>
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mb-6">
          AI Headshots for <span className="text-primary">Executives & Leaders</span>
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl max-w-[800px] mx-auto mb-8">
          Your photo speaks before you do. Get C-suite quality headshots that project 
          confidence, authority, and approachability — delivered in ~30 minutes.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/login">
            <Button size="lg" className="group w-full sm:w-auto">
              Create Your Executive Headshots
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/templates">
            <Button size="lg" variant="outline">Browse Styles</Button>
          </Link>
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><Check className="h-4 w-4 text-green-500" /> Boardroom Quality</span>
          <span className="flex items-center gap-1"><Check className="h-4 w-4 text-green-500" /> Executive Presence</span>
          <span className="flex items-center gap-1"><Check className="h-4 w-4 text-green-500" /> Corporate Styles</span>
        </div>
      </div>
      <div className="mx-auto max-w-2xl mb-16 p-8 rounded-xl border bg-card">
        <h2 className="text-2xl font-bold mb-4">Executive-Grade Portraits</h2>
        <p className="text-muted-foreground mb-4">
          Our Corporate Headshots and Styled for Success packs are designed for executives. 
          Formal backgrounds, professional lighting, and authoritative framing.
        </p>
        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
          <div className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5" /> 40+ HD portraits</div>
          <div className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5" /> Dark suit & tie styles</div>
          <div className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5" /> Corporate backgrounds</div>
          <div className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5" /> LinkedIn-optimized</div>
        </div>
        <Link href="/login"><Button className="w-full">Get Started — $29</Button></Link>
        <p className="text-center mt-4">
          <Link href="/templates" className="text-sm text-primary hover:underline">Browse all 12 styles →</Link>
        </p>
      </div>
      <div className="mx-auto max-w-2xl text-center">
        <Shield className="h-12 w-12 mx-auto text-green-500 mb-4" />
        <h2 className="text-2xl font-bold mb-4">Command the Room</h2>
        <p className="text-muted-foreground mb-6">$29. 14-day guarantee. Delivered in ~30 minutes.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/login"><Button size="lg">Create Now</Button></Link>
          <Link href="/templates"><Button size="lg" variant="outline">Browse All Styles</Button></Link>
        </div>
      </div>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify({
          '@context': 'https://schema.org','@type': 'FAQPage',
          mainEntity: [
            {'@type':'Question', name:'How much do executive headshots cost?',
             acceptedAnswer:{'@type':'Answer', text:'Starting at $29 for 40+ HD professional headshots.'}},
          ]}
        )}}
      />
    </div>
  )
}
