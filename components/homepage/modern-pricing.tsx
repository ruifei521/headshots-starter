"use client"

import Link from "next/link"
import type React from "react"
import { Check, Camera, Clock, Shield, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PricingFeature {
  icon: React.ReactNode
  text: string
  tooltip?: string
}

interface PricingTier {
  title: string
  price: string
  originalPrice?: string
  description: string
  features: string[]
  buttonText: string
  popular?: boolean
  bestValue?: boolean
  credits?: string
  headshots?: string
}

export default function ModernPricing() {
  const tiers: PricingTier[] = [
    {
      title: "Starter",
      price: "$29",
      description: "Perfect for individuals looking to enhance their LinkedIn or CV.",
      features: [
        "5 Styles Included",
        "40 AI-Generated Headshots",
        "Commercial License",
        "High-Resolution Download",
        "14-Day Money-Back Guarantee",
      ],
      buttonText: "Get Started",
      credits: "1 Credit",
      headshots: "40 Headshots",
    },
    {
      title: "Pro",
      price: "$49",
      description: "Ideal for professionals who want variety and different styles.",
      features: [
        "10 Styles Included",
        "100 AI-Generated Headshots",
        "Commercial License",
        "High-Resolution Download",
        "Priority Processing",
        "14-Day Money-Back Guarantee",
      ],
      buttonText: "Get Started",
      credits: "3 Credits",
      headshots: "100 Headshots",
    },
    {
      title: "Executive",
      price: "$89",
      description: "The complete package for maximum variety and professional use.",
      features: [
        "20 Styles Included",
        "200 AI-Generated Headshots",
        "All Backgrounds",
        "Commercial License",
        "High-Resolution Download",
        "Priority Processing",
        "14-Day Money-Back Guarantee",
      ],
      buttonText: "Get Started",
      credits: "5 Credits",
      headshots: "200 Headshots",
    },
  ]

  const traditionalComparison = [
    { feature: "Average Cost", traditional: "$200 – $500", ourPrice: "$29 – $89" },
    { feature: "Session Time", traditional: "1 – 3 hours", ourPrice: "6 selfies, 2 mins" },
    { feature: "Turnaround", traditional: "3 – 14 days", ourPrice: "~30 minutes" },
    { feature: "Style Options", traditional: "1 – 2 per session", ourPrice: "5 – 20 styles included" },
    { feature: "Photo Count", traditional: "10 – 20 shots", ourPrice: "40 – 200 headshots" },
  ]

  return (
    <div className="mx-auto max-w-5xl px-4">
      <div className="flex flex-col items-center justify-center space-y-8">
        {/* Pricing Cards */}
        <div className="mt-8 grid gap-6 md:grid-cols-3 lg:gap-8">
          {tiers.map((tier, index) => (
            <div
              key={index}
              className={cn(
                "pricing-card",
                tier.popular && "pricing-card-popular"
              )}
            >
              <h3 className="text-xl font-bold">{tier.title}</h3>

              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-5xl font-extrabold">{tier.price}</span>
              </div>
              {tier.credits && (
                <p className="mt-1 text-sm font-medium text-primary">{tier.credits} · {tier.headshots}</p>
              )}

              <p className="mt-3 text-sm text-muted-foreground">{tier.description}</p>

              <ul className="my-6 space-y-4">
                {tier.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="pricing-feature">
                    <Check className="h-5 w-5 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link href="/login" className="mt-8 block w-full" aria-label={`Select ${tier.title} plan`}>
                <Button
                  className="w-full min-h-[44px] bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                  aria-label={`Select ${tier.title} plan`}
                >
                  {tier.buttonText}
                </Button>
              </Link>
              {/* Money-back guarantee badge */}
              <div className="mt-3 flex items-center justify-center gap-1 text-sm text-green-600">
                <Shield className="h-4 w-4" />
                <span>14-Day Money-Back Guarantee</span>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Table: Traditional Photography vs SnapProHead */}
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
                {traditionalComparison.map((row, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="px-4 py-3 font-medium">{row.feature}</td>
                    <td className="px-4 py-3 text-center text-muted-foreground">{row.traditional}</td>
                    <td className="px-4 py-3 text-center font-medium text-primary">{row.ourPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          All plans include a <strong>14-day money-back guarantee</strong>. Refund applies if AI generation fails or technical errors prevent service delivery.
        </p>
      </div>
    </div>
  )
}



