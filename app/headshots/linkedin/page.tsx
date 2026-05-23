import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check, ArrowRight, Shield } from "lucide-react"
import { PRICING } from "@/lib/pricing"

export default function LinkedInHeadshotsPage() {
  return (
    <div className="container px-4 md:px-6 py-16 md:py-24">
      <div className="mx-auto max-w-3xl text-center mb-16">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4">
          Stand Out on LinkedIn
        </span>
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mb-6">
          AI Headshots for <span className="text-primary">LinkedIn Profile</span>
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl max-w-[800px] mx-auto mb-8">
          Recruiters judge your profile in seconds. Get a professional LinkedIn photo 
          that gets you noticed, trusted, and hired — in just 30 minutes.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/login">
            <Button size="lg" className="group w-full sm:w-auto">
              Create Your LinkedIn Headshots
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
          <span className="flex items-center gap-1"><Check className="h-4 w-4 text-green-500" /> Recruiter-Approved</span>
          <span className="flex items-center gap-1"><Check className="h-4 w-4 text-green-500" /> Professional & Polished</span>
          <span className="flex items-center gap-1"><Check className="h-4 w-4 text-green-500" /> 6 Styles to Choose</span>
        </div>
      </div>

      <div className="mx-auto max-w-2xl mb-16 p-8 rounded-xl border bg-card">
        <h2 className="text-2xl font-bold mb-4">Perfect for Your LinkedIn Profile</h2>
        <p className="text-muted-foreground mb-4">
          LinkedIn profiles with professional photos get 14x more profile views. 
          Our AI headshots are optimized for LinkedIn's format and professional standards.
        </p>
        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
          <div className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5" /> LinkedIn-optimized sizing</div>
          <div className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5" /> Corporate & casual styles</div>
          <div className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5" /> 40-200+ HD headshots</div>
          <div className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5" /> Multiple backgrounds</div>
        </div>
        <Link href="/login">
          <Button className="w-full">Get Started — From ${PRICING.starter.price}</Button>
        </Link>
      </div>

      <div className="mx-auto max-w-3xl mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">Why Your LinkedIn Photo Matters</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: "14x More Views", desc: "Profiles with professional photos get 14x more views on LinkedIn." },
            { title: "36x More Messages", desc: "A professional headshot leads to 36x more LinkedIn messages." },
            { title: "First Impressions", desc: "Recruiters decide about you in just 7 seconds." },
          ].map((stat, i) => (
            <div key={i} className="p-6 rounded-xl border bg-card text-center">
              <h3 className="text-2xl font-bold text-primary mb-2">{stat.title}</h3>
              <p className="text-sm text-muted-foreground">{stat.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-2xl text-center">
        <Shield className="h-12 w-12 mx-auto text-green-500 mb-4" />
        <h2 className="text-2xl font-bold mb-4">Upgrade Your LinkedIn Today</h2>
        <p className="text-muted-foreground mb-6">
          From ${PRICING.starter.price}. 14-day money-back guarantee. Delivered in ~30 minutes.
        </p>
        <Link href="/login">
          <Button size="lg">Create Your LinkedIn Headshots Now</Button>
        </Link>
      </div>
    </div>
  )
}
