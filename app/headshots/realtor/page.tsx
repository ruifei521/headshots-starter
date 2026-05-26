import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check, ArrowRight, Shield } from "lucide-react"
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Realtor Headshots - Professional AI Photos for Real Estate Agents',
  description: 'Get professional AI headshots for real estate agents. Stand out on Zillow, Realtor.com, and MLS with polished, approachable photos. Just $29 — 40+ HD headshots in ~30 minutes.',
  openGraph: {
    title: 'AI Headshots for Realtors & Real Estate Agents',
    description: 'Professional real estate headshots that help you close more deals. Just $29.',
  },
}

export default function RealtorHeadshotsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What kind of headshot works best for a real estate agent?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The best real estate headshots are warm, approachable, and professional. You want to convey trustworthiness to potential buyers and sellers. Our AI creates polished portraits with friendly expressions and professional backgrounds perfect for Zillow, Realtor.com, and MLS.",
        },
      },
      {
        "@type": "Question",
        name: "How much do professional realtor headshots cost?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Just $29 for 40+ HD headshots in your chosen professional style. All plans include a 14-day money-back guarantee — no questions asked.",
        },
      },
      {
        "@type": "Question",
        name: "How long does it take to get my realtor headshots?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The AI training takes about 30 minutes. Once complete, you'll have 40+ professional headshots ready to download.",
        },
      },
      {
        "@type": "Question",
        name: "Can I use my AI headshot for my real estate license and business cards?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! All our headshots come with a commercial license. You can use them on your real estate license, business cards, Zillow profile, Realtor.com, MLS listings, social media, and any other professional platform.",
        },
      },
      {
        "@type": "Question",
        name: "What should I wear for my real estate agent headshot?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Wear professional business attire that you would normally wear to show a home. Blazers, blouses, suits, and professional dresses all work well. Avoid busy patterns and bright logos.",
        },
      },
      {
        "@type": "Question",
        name: "Do real estate agents with professional headshots get more listings?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! Studies show that listings with agent headshots receive significantly more inquiries. A professional appearance builds trust with potential clients before they even meet you.",
        },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container px-4 md:px-6 py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4">
            Professional Headshots for Real Estate Agents
          </span>
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mb-6">
            AI Headshots for <span className="text-primary">Realtors & Agents</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-[800px] mx-auto mb-8">
            Stand out on Zillow, Realtor.com, and your MLS listings. Get polished, 
            approachable headshots that help you close more deals.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/login">
              <Button size="lg" className="group w-full sm:w-auto">
                Create Your Realtor Headshots
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
            <span className="flex items-center gap-1"><Check className="h-4 w-4 text-green-500" /> Approachable & Trustworthy</span>
            <span className="flex items-center gap-1"><Check className="h-4 w-4 text-green-500" /> Listing-Ready Quality</span>
            <span className="flex items-center gap-1"><Check className="h-4 w-4 text-green-500" /> Multiple Backgrounds</span>
          </div>
        </div>

        <div className="mx-auto max-w-2xl mb-16 p-8 rounded-xl border bg-card">
          <h2 className="text-2xl font-bold mb-4">Recommended: Realtor Pack</h2>
          <p className="text-muted-foreground mb-4">
            Professionally designed for real estate agents. Includes polished portraits with 
            modern, approachable styles perfect for your real estate profiles.
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm mb-6">
            <div className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5" /> Modern professional looks</div>
            <div className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5" /> Warm, approachable style</div>
            <div className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5" /> 19-20 HD images</div>
            <div className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5" /> Commercial license included</div>
          </div>
          <Link href="/login">
            <Button className="w-full">Get Started — $29</Button>
          </Link>
          <p className="text-center mt-4">
            <Link href="/templates" className="text-sm text-primary hover:underline">Browse all professional styles →</Link>
          </p>
        </div>

        <div className="mx-auto max-w-3xl text-center">
          <Shield className="h-12 w-12 mx-auto text-green-500 mb-4" />
          <h2 className="text-2xl font-bold mb-4">Get More Listings with Professional Headshots</h2>
          <p className="text-muted-foreground mb-6">
            Properties listing with agent headshots get more inquiries. 14-day money-back guarantee.
          </p>
          <Link href="/login">
            <Button size="lg">Create Your Realtor Headshots Now</Button>
          </Link>
        </div>
      </div>
    </>
  )
}
