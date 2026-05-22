"use client"

import Link from "next/link"
import type React from "react"
import { Check, Shield, Clock, Star, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { PRICING } from "@/lib/pricing"

interface PricingTier {
  title: string
  price: string
  description: string
  features: string[]
  buttonText: string
  popular?: boolean
  bestValue?: boolean
  credits?: string
  headshots?: string
  perPhoto?: string
  deliveryTime?: string
}

export default function ModernPricing() {
  const tiers: PricingTier[] = [
    {
      title: "Starter",
      price: `$${PRICING.starter.price}`,
      description: "Perfect for individuals looking to enhance their LinkedIn or CV.",
      features: [
        `${PRICING.starter.styles} Professional Style Packs`,
        `${PRICING.starter.headshots} AI-Generated Headshots`,
        "1 Pack: Corporate / Natural / Business",
        "Commercial License Included",
        "High-Resolution Download",
        "14-Day Money-Back Guarantee",
      ],
      buttonText: "Get Started",
      credits: `${PRICING.starter.credits} Credit`,
      headshots: `${PRICING.starter.headshots} Headshots`,
      perPhoto: `$${PRICING.starter.price / PRICING.starter.headshots}`,
      deliveryTime: "~30 min",
    },
    {
      title: "Pro",
      price: `$${PRICING.pro.price}`,
      description: "Ideal for professionals who want variety across styles.",
      features: [
        `${PRICING.pro.styles} Professional Style Packs`,
        `${PRICING.pro.headshots} AI-Generated Headshots`,
        "3 Packs: Mix Corporate, Natural, Formal",
        "Commercial License Included",
        "High-Resolution Download",
        "Priority Processing",
        "14-Day Money-Back Guarantee",
      ],
      buttonText: "Get Started",
      credits: `${PRICING.pro.credits} Credits`,
      headshots: `${PRICING.pro.headshots} Headshots`,
      perPhoto: `$${Math.round(PRICING.pro.price / PRICING.pro.headshots * 100) / 100}`,
      deliveryTime: "~30 min",
      popular: true,
    },
    {
      title: "Executive",
      price: `$${PRICING.executive.price}`,
      description: "The complete package for maximum variety.",
      features: [
        `${PRICING.executive.styles} Professional Style Packs`,
        `${PRICING.executive.headshots} AI-Generated Headshots`,
        "5 Packs: All Styles Available",
        "Commercial License Included",
        "High-Resolution Download",
        "Priority Processing",
        "14-Day Money-Back Guarantee",
      ],
      buttonText: "Get Started",
      credits: `${PRICING.executive.credits} Credits`,
      headshots: `${PRICING.executive.headshots} Headshots`,
      perPhoto: `$${Math.round(PRICING.executive.price / PRICING.executive.headshots * 100) / 100}`,
      deliveryTime: "~30 min",
      bestValue: true,
    },
  ]

  return (
    <div className="mx-auto max-w-5xl px-4">
      <div className="flex flex-col items-center justify-center space-y-8">
        {/* Section Header */}
        <div className="text-center space-y-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
            Simple Pricing
          </span>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Professional Headshots, <span className="text-primary">Affordable Price</span>
          </h2>
          <p className="max-w-[600px] text-muted-foreground text-lg mx-auto">
            Choose from 6 professional style packs. Pay once, own your photos forever.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="mt-8 grid gap-6 md:grid-cols-3 lg:gap-8">
          {tiers.map((tier, index) => (
            <div
              key={index}
              className={cn(
                "relative flex flex-col rounded-xl border bg-card p-6 shadow-sm transition-all duration-200 hover:shadow-md",
                tier.popular && "ring-2 ring-primary shadow-lg scale-[1.02]",
                tier.bestValue && "ring-2 ring-amber-500 shadow-lg"
              )}
            >
              {/* Popular / Best Value badges */}
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-primary text-primary-foreground shadow-sm">
                    <Star className="h-3 w-3" />
                    Most Popular — 84% Choose This
                  </span>
                </div>
              )}
              {tier.bestValue && !tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500 text-white shadow-sm">
                    <Sparkles className="h-3 w-3" />
                    Best Value
                  </span>
                </div>
              )}

              <h3 className="text-xl font-bold mt-2">{tier.title}</h3>

              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-5xl font-extrabold">{tier.price}</span>
              </div>
              <div className="flex items-center gap-3 mt-1">
                {tier.credits && (
                  <p className="text-sm font-medium text-primary">{tier.credits} · {tier.headshots}</p>
                )}
                {tier.perPhoto && (
                  <span className="text-xs text-muted-foreground">
                    (≈{tier.perPhoto}/photo)
                  </span>
                )}
              </div>

              {/* Delivery time badge */}
              <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>Delivery in ~30 minutes</span>
              </div>

              <p className="mt-3 text-sm text-muted-foreground">{tier.description}</p>

              <ul className="my-6 space-y-3 flex-1">
                {tier.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link href="/get-credits" className="mt-auto block w-full" aria-label={`Select ${tier.title} plan`}>
                <Button
                  className={cn(
                    "w-full min-h-[44px] font-semibold",
                    tier.popular ? "bg-primary hover:bg-primary/90 text-primary-foreground" : "",
                    tier.bestValue && !tier.popular ? "bg-amber-600 hover:bg-amber-700 text-white" : ""
                  )}
                  aria-label={`Select ${tier.title} plan`}
                  variant={tier.popular || tier.bestValue ? "default" : "outline"}
                >
                  {tier.buttonText}
                </Button>
              </Link>

              {/* Money-back guarantee badge */}
              <div className="mt-3 flex items-center justify-center gap-1 text-sm text-green-600">
                <Shield className="h-4 w-4" />
                <span>14-Day Money-Back Guarantee</span>
              </div>

              {/* Additional pack upsell note */}
              <div className="mt-2 text-center">
                <span className="text-xs text-muted-foreground">
                  🎯 Need more styles? <strong>Additional packs from $9.99</strong>
                </span>
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
                <tr className="border-b">
                  <td className="px-4 py-3 font-medium">Average Cost</td>
                  <td className="px-4 py-3 text-center text-muted-foreground">$200 – $500</td>
                  <td className="px-4 py-3 text-center font-medium text-primary">${PRICING.starter.price} – ${PRICING.executive.price}</td>
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
                  <td className="px-4 py-3 text-center font-medium text-primary">6 professional packs</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3 font-medium">Photo Count</td>
                  <td className="px-4 py-3 text-center text-muted-foreground">10 – 20 shots</td>
                  <td className="px-4 py-3 text-center font-medium text-primary">40 – 200+ headshots</td>
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

        {/* Upsell Section */}
        <div className="mt-8 w-full max-w-3xl p-6 rounded-xl border bg-muted/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-semibold text-lg">Need more styles?</h4>
              <p className="text-sm text-muted-foreground">Add additional professional packs to any plan for just <strong>$9.99 each</strong>.</p>
            </div>
            <Link href="/login">
              <Button variant="outline">Browse All 6 Packs →</Button>
            </Link>
          </div>
        </div>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          All plans include a <strong>14-day money-back guarantee</strong>. Prices exclude applicable taxes, which are calculated and collected at checkout by Creem, our Merchant of Record.
        </p>
      </div>
    </div>
  )
}
