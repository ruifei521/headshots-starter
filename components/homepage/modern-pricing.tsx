"use client"

import { Check, Clock, Shield, ArrowRight, Zap, Star, X, DollarSign, Camera, Users, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TIERS, type TierInfo } from "@/lib/tiers"

// Default pack used when user clicks directly from pricing card
const DEFAULT_PACK = 'corporate-headshots'

function checkoutHref(tier: string) {
  const params = new URLSearchParams({ tier, pack: DEFAULT_PACK })
  return `/api/creem/go?${params.toString()}`
}

function trackBeginCheckout(info: TierInfo) {
  try {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      const priceNum = parseFloat(info.priceLabel.replace(/[^0-9.]/g, '')) || 0;
      (window as any).gtag('event', 'begin_checkout', {
        currency: 'USD',
        value: priceNum,
        items: [{ item_id: info.tier, item_name: info.name, price: priceNum }],
      });
    }
  } catch {
    // GA4 failure should never block checkout
  }
}

/** Single pricing card — checkout via server redirect (no client fetch/setState) */
function PricingCard({ info, highlight }: { info: TierInfo; highlight?: boolean }) {
  const isPopular = info.badge === "Most Popular";
  const isBest = info.badge === "Best Value";

  return (
    <div
      className={`relative flex flex-col rounded-xl border bg-card p-8 shadow-sm transition-all duration-200 hover:shadow-md ${
        highlight ? "ring-2 ring-primary scale-[1.02]" : ""
      }`}
    >
      {/* Badge */}
      {info.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
            isPopular
              ? "bg-primary text-primary-foreground"
              : "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
          }`}>
            {isBest && <Zap className="h-3 w-3" />}
            {isPopular && <Star className="h-3 w-3" />}
            {info.badge}
          </span>
        </div>
      )}

      {/* Price */}
      <div className="flex items-baseline justify-center gap-2">
        <span className="text-lg text-muted-foreground line-through">${info.originalPrice}</span>
        <span className="text-5xl font-extrabold">{info.priceLabel}</span>
        <span className="text-sm text-muted-foreground">/pack</span>
      </div>

      {/* Image count */}
      <p className="mt-1 text-center text-sm text-muted-foreground">
        {info.imageCount} HD headshots
      </p>

      {/* Delivery time */}
      <div className="mt-3 flex items-center justify-center gap-1 text-xs text-muted-foreground">
        <Clock className="h-3 w-3" />
        <span>{info.estimatedTime} · {info.resolution}</span>
      </div>

      {/* Features */}
      <ul className="my-6 space-y-2.5 flex-1">
        {info.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA — native navigation to /api/creem/go (server 302 → Creem) */}
      <Button
        asChild
        className={`w-full min-h-[48px] font-semibold text-base ${
          highlight
            ? "bg-primary hover:bg-primary/90"
            : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
        }`}
        variant={highlight ? "default" : "secondary"}
      >
        <a
          href={checkoutHref(info.tier)}
          onClick={() => trackBeginCheckout(info)}
        >
          {highlight ? `Get ${info.name}` : `Choose ${info.name}`}
          <ArrowRight className="h-4 w-4 ml-2" />
        </a>
      </Button>
    </div>
  )
}

export default function ModernPricing() {
  const tierList: TierInfo[] = [
    TIERS.starter,
    TIERS.professional,
    TIERS.executive,
  ];

  return (
    <div className="mx-auto max-w-5xl px-4">
      <div className="flex flex-col items-center justify-center space-y-8">
        {/* Section Header */}
        <div className="text-center space-y-4">
          {/* 20% off banner */}
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-1.5 text-sm font-semibold text-white">
            🔥 20% off all plans — Limited time!
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Professional headshots for{" "}
            <span className="text-primary">8x less</span>
            <br />
            than a physical photo shoot
          </h2>
          <p className="max-w-[700px] text-muted-foreground text-lg mx-auto">
            The average cost of professional headshots in the United States is
            $232. Our packages start from $29.
          </p>
        </div>

        {/* Three Pricing Cards */}
        <div className="mt-8 grid w-full grid-cols-1 gap-6 md:grid-cols-3">
          {tierList.map((tierInfo) => (
            <PricingCard
              key={tierInfo.tier}
              info={tierInfo}
              highlight={tierInfo.tier === "professional"}
            />
          ))}
        </div>

        {/* Trust Badges */}
        <p className="flex items-center justify-center gap-3 text-sm text-muted-foreground flex-wrap">
          <span className="flex items-center gap-1">
            <Shield className="h-4 w-4 text-primary" />
            30-day auto-delete
          </span>
          <span className="text-muted-foreground/40">·</span>
          <span className="flex items-center gap-1">
            <Check className="h-4 w-4 text-primary" />
            Commercial license
          </span>
          <span className="text-muted-foreground/40">·</span>
          <span className="flex items-center gap-1">
            <Check className="h-4 w-4 text-primary" />
            100% satisfaction guaranteed
          </span>
        </p>

        {/* Comparison Table: SnapProHead vs Traditional Photographer */}
        <div className="mt-16 max-w-3xl mx-auto w-full">
          <h3 className="text-center text-2xl font-bold mb-2">
            SnapProHead vs Hiring a Photographer
          </h3>
          <p className="text-center text-muted-foreground text-sm mb-8">
            See why thousands choose AI headshots over traditional photoshoots.
          </p>

          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left font-semibold min-w-[140px]"></th>
                  <th className="px-4 py-3 text-center font-semibold text-primary">SnapProHead</th>
                  <th className="px-4 py-3 text-center font-semibold">Traditional Photographer</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b bg-muted/20">
                  <td className="px-4 py-3 font-medium flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Cost
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="flex items-center justify-center gap-1.5">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="font-medium">From $29</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-muted-foreground">
                    <span className="flex items-center justify-center gap-1.5">
                      <X className="h-4 w-4 text-red-400" />
                      <span>$250+ per session</span>
                    </span>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3 font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Time
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="flex items-center justify-center gap-1.5">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="font-medium">As quick as 25 min</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-muted-foreground">
                    <span className="flex items-center justify-center gap-1.5">
                      <X className="h-4 w-4 text-red-400" />
                      <span>2–3 work days</span>
                    </span>
                  </td>
                </tr>
                <tr className="border-b bg-muted/20">
                  <td className="px-4 py-3 font-medium flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    Headshots
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="flex items-center justify-center gap-1.5">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="font-medium">Up to 100 per pack</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-muted-foreground">
                    <span className="flex items-center justify-center gap-1.5">
                      <X className="h-4 w-4 text-red-400" />
                      <span>5–10 per person</span>
                    </span>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3 font-medium flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Outfits
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="flex items-center justify-center gap-1.5">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="font-medium">80+ outfits & backgrounds</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-muted-foreground">
                    <span className="flex items-center justify-center gap-1.5">
                      <X className="h-4 w-4 text-red-400" />
                      <span>1–2 outfits</span>
                    </span>
                  </td>
                </tr>
                <tr className="border-b bg-muted/20">
                  <td className="px-4 py-3 font-medium flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Consistency
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="flex items-center justify-center gap-1.5">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="font-medium">Consistent style presets</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-muted-foreground">
                    <span className="flex items-center justify-center gap-1.5">
                      <X className="h-4 w-4 text-red-400" />
                      <span>Manual edits needed</span>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
