"use client"

import { Check, Clock, Shield, ArrowRight, Zap, Star, X, DollarSign, Camera, Users, Palette } from "lucide-react"
import { PRICING_RETENTION_TRUST_LINE } from "@/lib/data-retention-policy";
import { PRICING_TRUST_LINE } from "@/lib/refund-policy";
import { STUDIO_PHOTOGRAPH_AVERAGE_USD, STUDIO_PHOTOGRAPH_SESSION_LABEL } from "@/lib/marketing-copy";
import Link from "next/link"
import { TIERS, type TierInfo, MAX_OUTFIT_BACKGROUND_SETS_LABEL } from "@/lib/tiers"
import { CheckoutLink } from "@/components/CheckoutLink"
import { checkoutGoPath, DEFAULT_PACK } from "@/lib/checkout-url"

function checkoutHref(tier: string) {
  return checkoutGoPath(tier, DEFAULT_PACK)
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
      className={`relative flex flex-col rounded-xl border bg-card p-5 sm:p-8 shadow-sm transition-all duration-200 hover:shadow-md ${
        highlight ? "md:ring-2 md:ring-primary md:scale-[1.02]" : ""
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

      <h3 className="text-center text-lg font-semibold text-foreground mb-4">
        {info.name}
      </h3>

      {/* Price */}
      <div className="flex items-baseline justify-center gap-2">
        <span className="text-lg text-muted-foreground line-through">${info.originalPrice}</span>
        <span className="text-4xl sm:text-5xl font-extrabold">{info.priceLabel}</span>
        <span className="text-sm text-muted-foreground">/pack</span>
      </div>

      {/* Image count */}
      <p className="mt-1 text-center text-sm text-muted-foreground">
        {info.marketingImageCount} HD headshots
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
      <CheckoutLink
        href={checkoutHref(info.tier)}
        className={`inline-flex items-center justify-center w-full min-h-[48px] font-semibold text-base rounded-md px-4 py-2 transition-colors ${
          highlight
            ? "bg-primary hover:bg-primary/90 text-primary-foreground"
            : "border border-primary/35 bg-primary/20 hover:bg-primary/30 text-primary"
        }`}
        onNavigate={() => trackBeginCheckout(info)}
      >
        {highlight ? `Get ${info.name}` : `Choose ${info.name}`}
        <ArrowRight className="h-4 w-4 ml-2" />
      </CheckoutLink>
    </div>
  )
}

type ModernPricingProps = {
  /** Homepage marketing block above cards; off on /pricing */
  showHeader?: boolean
  /** Comparison table below cards */
  showComparison?: boolean
  /** Trust badges row under cards */
  showTrustBadges?: boolean
}

export default function ModernPricing({
  showHeader = true,
  showComparison = true,
  showTrustBadges = true,
}: ModernPricingProps) {
  const tierList: TierInfo[] = [
    TIERS.starter,
    TIERS.professional,
    TIERS.executive,
  ];

  return (
    <div className="mx-auto max-w-5xl px-4">
      <div className="flex flex-col items-center justify-center space-y-8">
        {showHeader && (
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-1.5 text-sm font-semibold text-foreground border">
              Launch pricing from $29 · Studio-quality results
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Professional headshots for{" "}
              <span className="text-primary">8x less</span>
              <br />
              than a physical photo shoot
            </h2>
            <p className="max-w-[700px] text-muted-foreground text-lg mx-auto">
              The average cost of professional headshots in the United States is
              ${STUDIO_PHOTOGRAPH_AVERAGE_USD}. Our packages start from $29.
            </p>
          </div>
        )}

        <div className={`grid w-full grid-cols-1 gap-6 md:grid-cols-3 ${showHeader ? "mt-8" : ""}`}>
          {tierList.map((tierInfo) => (
            <PricingCard
              key={tierInfo.tier}
              info={tierInfo}
              highlight={tierInfo.tier === "professional"}
            />
          ))}
        </div>

        {showTrustBadges && (
          <p className="flex items-center justify-center gap-3 text-sm text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1">
              <Shield className="h-4 w-4 text-primary" />
              {PRICING_RETENTION_TRUST_LINE}
            </span>
            <span className="text-muted-foreground/40">·</span>
            <span className="flex items-center gap-1">
              <Check className="h-4 w-4 text-primary" />
              Commercial license
            </span>
            <span className="text-muted-foreground/40">·</span>
            <span className="flex items-center gap-1">
              <Check className="h-4 w-4 text-primary" />
              <Link href="/refund" className="hover:underline underline-offset-2">
                {PRICING_TRUST_LINE}
              </Link>
            </span>
          </p>
        )}

        {showComparison && (
        <div className="mt-12 md:mt-16 max-w-3xl mx-auto w-full">
          <h3 className="text-center text-xl sm:text-2xl font-bold mb-2">
            SnapProHead vs Hiring a Photographer
          </h3>
          <p className="text-center text-muted-foreground text-sm mb-6 sm:mb-8 px-2">
            See why professionals choose AI headshots over traditional photoshoots.
          </p>

          {/* Mobile: stacked rows */}
          <div className="md:hidden space-y-3">
            {[
              { label: "Cost", ours: "From $29", theirs: STUDIO_PHOTOGRAPH_SESSION_LABEL },
              { label: "Time", ours: "As quick as 25 min", theirs: "2–3 work days" },
              { label: "Headshots", ours: "Up to 100 per pack", theirs: "5–10 per person" },
              { label: "Outfits", ours: `Up to ${MAX_OUTFIT_BACKGROUND_SETS_LABEL}`, theirs: "1–2 outfits" },
            ].map((row) => (
              <div key={row.label} className="rounded-lg border p-3 text-sm">
                <p className="font-medium mb-2">{row.label}</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-md bg-primary/5 px-2 py-1.5 text-center">
                    <p className="text-[10px] text-primary font-semibold uppercase">SnapProHead</p>
                    <p className="text-xs font-medium mt-0.5">{row.ours}</p>
                  </div>
                  <div className="rounded-md bg-muted/50 px-2 py-1.5 text-center text-muted-foreground">
                    <p className="text-[10px] font-semibold uppercase">Studio</p>
                    <p className="text-xs mt-0.5">{row.theirs}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: table */}
          <div className="hidden md:block overflow-x-auto rounded-lg border">
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
                      <span>{STUDIO_PHOTOGRAPH_SESSION_LABEL}</span>
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
                      <span className="font-medium">Up to {MAX_OUTFIT_BACKGROUND_SETS_LABEL}</span>
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
        )}
      </div>
    </div>
  )
}
