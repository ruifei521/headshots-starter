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
      title: "Basic",
      price: "$19.99",
      description: "Perfect for individuals looking to enhance their LinkedIn or CV.",
      features: [
        "4 Professional AI Headshots",
        "Multiple Styles Included",
        "Commercial License",
        "High-Resolution Download",
        "14-Day Money-Back Guarantee",
      ],
      buttonText: "Get Basic Headshots",
      credits: "1 Credit",
      headshots: "4 Headshots",
    },
    {
      title: "Professional",
      price: "$39.99",
      originalPrice: "$59",
      description: "Ideal for professionals who want variety and different styles.",
      features: [
        "12 Professional AI Headshots",
        "Multiple Styles Included",
        "Commercial License",
        "High-Resolution Download",
        "Priority Processing",
        "14-Day Money-Back Guarantee",
      ],
      buttonText: "Get Professional Headshots",
      popular: true,
      credits: "3 Credits",
      headshots: "12 Headshots",
    },
    {
      title: "Executive",
      price: "$59.99",
      originalPrice: "$89",
      description: "The complete package for maximum variety and professional use.",
      features: [
        "20 Professional AI Headshots",
        "All Styles & Backgrounds",
        "Commercial License",
        "High-Resolution Download",
        "Priority Processing",
        "14-Day Money-Back Guarantee",
      ],
      buttonText: "Get Executive Headshots",
      bestValue: true,
      credits: "5 Credits",
      headshots: "20 Headshots",
    },
  ]

  const traditionalComparison = [
    { feature: "Average Cost", traditional: "$200 – $500", ourPrice: "$19.99 – $59.99" },
    { feature: "Session Time", traditional: "1 – 3 hours", ourPrice: "6 selfies, 2 mins" },
    { feature: "Turnaround", traditional: "3 – 14 days", ourPrice: "~30 minutes" },
    { feature: "Editing Rounds", traditional: "1 – 2 included", ourPrice: "Unlimited AI generations" },
    { feature: "Photo Count", traditional: "10 – 20 shots", ourPrice: "4 – 20 headshots" },
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
              {tier.popular && (
                <div className="pricing-badge">
                  Most Popular
                </div>
              )}

              {tier.bestValue && (
                <div className="absolute -top-3 right-6 rounded-full bg-blue-600 px-3 py-1 text-xs font-medium text-white dark:bg-blue-500">
                  <span className="flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    Best Value
                  </span>
                </div>
              )}

              <h3 className="text-xl font-bold">{tier.title}</h3>

              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-5xl font-extrabold">{tier.price}</span>
                {tier.originalPrice && (
                  <>
                    <span className="text-lg text-muted-foreground line-through">${tier.originalPrice.replace('$', '')}</span>
                    <span className="text-xs text-green-600 font-medium ml-1">Save ${parseInt(tier.originalPrice.replace('$', '')) - parseInt(tier.price.replace('$', ''))}</span>
                  </>
                )}
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
                  className={cn(
                    "w-full min-h-[44px]",
                    tier.popular
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                      : "bg-secondary hover:bg-secondary/80"
                  )}
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
          All plans include a <strong>14-day money-back guarantee</strong>. Not satisfied? Full refund, no questions asked.
        </p>
      </div>
    </div>
  )
}



