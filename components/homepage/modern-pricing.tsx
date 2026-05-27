"use client"

import Link from "next/link"
import { Check, Clock, Shield, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ModernPricing() {
  return (
    <div className="mx-auto max-w-5xl px-4">
      <div className="flex flex-col items-center justify-center space-y-8">
        {/* Section Header */}
        <div className="text-center space-y-4">
<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Professional Headshots, <span className="text-primary">Just $29</span>
          </h2>
          <p className="max-w-[600px] text-muted-foreground text-lg mx-auto">
            Pick any style. Pay once. Own your headshots forever.
          </p>
        </div>

        {/* Single Pricing Card */}
        <div className="mt-8 w-full max-w-sm">
          <div className="relative flex flex-col rounded-xl border bg-card p-8 shadow-sm transition-all duration-200 hover:shadow-md ring-2 ring-primary">
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-6xl font-extrabold">$29</span>
              <span className="text-lg text-muted-foreground">/ style</span>
            </div>

            <div className="mt-4 flex items-center justify-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Delivery in ~30 minutes</span>
            </div>

            <ul className="my-6 space-y-3">
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>50+ AI-generated headshots per style</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>12 professional styles to choose from</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>Full commercial license included</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>High-resolution, print-ready images</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>30-day photo auto-delete for privacy</span>
              </li>
            </ul>

            <Link href="/packs" className="mt-auto block w-full">
              <Button className="w-full min-h-[48px] font-semibold text-base bg-primary hover:bg-primary/90">
                Browse Styles
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mt-12 w-full max-w-3xl">
          <h3 className="text-center text-xl font-bold mb-6">Why Choose AI Headshots?</h3>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left font-semibold"></th>
                  <th className="px-4 py-3 text-center font-semibold">Photo Studio</th>
                  <th className="px-4 py-3 text-center font-semibold text-primary">SnapProHead</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-3 font-medium">Average Cost</td>
                  <td className="px-4 py-3 text-center text-muted-foreground">$200 – $500</td>
                  <td className="px-4 py-3 text-center font-medium text-primary">$29 / style</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3 font-medium">Session Time</td>
                  <td className="px-4 py-3 text-center text-muted-foreground">1 – 3 hours</td>
                  <td className="px-4 py-3 text-center font-medium text-primary">6 selfies, 2 mins</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3 font-medium">Turnaround</td>
                  <td className="px-4 py-3 text-center text-muted-foreground">3 – 14 days</td>
                  <td className="px-4 py-3 text-center font-medium text-primary">~30 minutes</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3 font-medium">Style Options</td>
                  <td className="px-4 py-3 text-center text-muted-foreground">1 – 2 per session</td>
                  <td className="px-4 py-3 text-center font-medium text-primary">12 professional styles</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Privacy</td>
                  <td className="px-4 py-3 text-center text-muted-foreground">Photos stored by studio</td>
                  <td className="px-4 py-3 text-center font-medium text-primary">Auto-deleted after 30 days</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          100% satisfaction guaranteed. Prices exclude applicable taxes, collected at checkout.
        </p>
      </div>
    </div>
  )
}
