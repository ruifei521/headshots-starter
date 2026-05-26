import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check, ArrowRight, Shield } from "lucide-react"
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lawyer Headshots - Professional AI Photos for Attorneys',
  description: 'Get partner-quality AI headshots for lawyers and attorneys. Professional, trustworthy photos for law firm websites, LinkedIn, and court directories. Just $29 with 14-day guarantee.',
  openGraph: {
    title: 'Professional AI Headshots for Lawyers & Attorneys',
    description: 'Partner-quality headshots for legal professionals. Just $29 — delivered in ~30 minutes.',
  },
}

export default function LawyerHeadshotsPage() {
  return (
    <div className="container px-4 md:px-6 py-16 md:py-24">
      {/* Hero */}
      <div className="mx-auto max-w-3xl text-center mb-16">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4">
          Professional Headshots for Legal Professionals
        </span>
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mb-6">
          AI Headshots for <span className="text-primary">Lawyers & Attorneys</span>
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl max-w-[800px] mx-auto mb-8">
          Make a powerful first impression. Get partner-quality headshots that convey trust, 
          authority, and professionalism — tailored for law firms and legal professionals.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/login">
            <Button size="lg" className="group w-full sm:w-auto">
              Create Your Lawyer Headshots
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/pricing">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              View Pricing
            </Button>
          </Link>
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><Check className="h-4 w-4 text-green-500" /> Partner-Quality</span>
          <span className="flex items-center gap-1"><Check className="h-4 w-4 text-green-500" /> Formal & Trustworthy</span>
          <span className="flex items-center gap-1"><Check className="h-4 w-4 text-green-500" /> Courtroom Ready</span>
        </div>
      </div>

      {/* Partner's Headshots Pack Highlight */}
      <div className="mx-auto max-w-2xl mb-16 p-8 rounded-xl border bg-card">
        <h2 className="text-2xl font-bold mb-4">Recommended: Partner's Headshots Pack</h2>
        <p className="text-muted-foreground mb-4">
          Specifically designed for legal professionals. Includes formal portraits with traditional 
          courtroom-appropriate backgrounds and professional attire.
        </p>
        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
          <div className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5" /> Classic dark suits</div>
          <div className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5" /> Formal backgrounds</div>
          <div className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5" /> Professional framing</div>
          <div className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5" /> 40-44 HD images</div>
        </div>
        <Link href="/login">
          <Button className="w-full">Get Started — $29</Button>
        </Link>
        <p className="text-center mt-4">
          <Link href="/templates" className="text-sm text-primary hover:underline">Browse all professional styles →</Link>
        </p>
      </div>

      {/* Comparison */}
      <div className="mx-auto max-w-3xl mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">Law Firm Headshots: Studio vs AI</h2>
        <div className="rounded-lg border overflow-hidden">
          <div className="grid grid-cols-3 bg-muted/80 border-b font-semibold text-sm">
            <div className="p-4"></div>
            <div className="p-4 text-center">Photo Studio</div>
            <div className="p-4 text-center text-primary">SnapProHead</div>
          </div>
          {[
            { f: "Cost", t: "$200 – $500/session", o: `$29` },
            { f: "Scheduling", t: "Must coordinate with photographer", o: "Upload selfies anytime" },
            { f: "Turnaround", t: "3 – 14 days", o: "~30 minutes" },
            { f: "Outfits & Backgrounds", t: "Limited by studio setup", o: "6 professional styles" },
            { f: "Retakes", t: "$50 – $150 extra", o: "Free regenerations" },
          ].map((row, i) => (
            <div key={i} className="grid grid-cols-3 border-b last:border-0 text-sm">
              <div className="p-4 font-medium">{row.f}</div>
              <div className="p-4 text-center text-muted-foreground">{row.t}</div>
              <div className="p-4 text-center font-medium text-primary">{row.o}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mx-auto max-w-2xl text-center">
        <Shield className="h-12 w-12 mx-auto text-green-500 mb-4" />
        <h2 className="text-2xl font-bold mb-4">Professional Headshots for Legal Professionals</h2>
        <p className="text-muted-foreground mb-6">
          14-day money-back guarantee.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/login">
            <Button size="lg">Create Your Headshots Now</Button>
          </Link>
          <Link href="/templates">
            <Button size="lg" variant="outline">Browse All Styles</Button>
          </Link>
        </div>
      </div>

      {/* FAQ Schema */}
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify({
          '@context': 'https://schema.org','@type': 'FAQPage',
          mainEntity: [
            {'@type':'Question', name:'How much do lawyer headshots cost?',
             acceptedAnswer:{'@type':'Answer', text:'Just $29 for 40+ HD professional headshots. No hidden fees.'}},
            {'@type':'Question', name:'What style is best for attorney headshots?',
             acceptedAnswer:{'@type':'Answer', text:'Our Partner\'s Headshots and Corporate styles are most popular for legal professionals. Both feature formal backgrounds and professional attire.'}},
            {'@type':'Question', name:'How long does AI headshot generation take?',
             acceptedAnswer:{'@type':'Answer', text:'About 30 minutes. Upload 4-10 selfies and our AI generates your professional headshots.'}},
          ]}
        )}}
      />
    </div>
  )
}
