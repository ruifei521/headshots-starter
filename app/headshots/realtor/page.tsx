import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check, ArrowRight, Shield } from "lucide-react"
import { PRICING } from "@/lib/pricing"

export default function RealtorHeadshotsPage() {
  return (
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
          <Button className="w-full">Get Started — From ${PRICING.starter.price}</Button>
        </Link>
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
  )
}
