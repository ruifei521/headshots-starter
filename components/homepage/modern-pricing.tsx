"use client"

import Link from "next/link"
import { Check, Clock, Shield, ArrowRight, Zap, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TIERS, type Tier, type TierInfo } from "@/lib/tiers"
import TierComparisonTable from "@/components/homepage/tier-comparison-table"

/** 单个定价卡片 */
function PricingCard({ info, highlight }: { info: TierInfo; highlight?: boolean }) {
  const isPopular = info.badge === "Most Popular";
  const isBest = info.badge === "Best Value";

  // CTA action: checkout via Creem with tier parameter
  const checkoutHref = `/overview/models/train/headshots`;

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
      <div className="flex items-baseline justify-center gap-1">
        <span className="text-5xl font-extrabold">{info.priceLabel}</span>
        <span className="text-sm text-muted-foreground">/ 次</span>
      </div>

      {/* Image count */}
      <p className="mt-1 text-center text-sm text-muted-foreground">
        {info.imageCount} 张专业头像
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

      {/* CTA Button */}
      <Link href={checkoutHref} className="mt-auto block w-full">
        <Button
          className={`w-full min-h-[48px] font-semibold text-base ${
            highlight
              ? "bg-primary hover:bg-primary/90"
              : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
          }`}
          variant={highlight ? "default" : "secondary"}
        >
          {highlight ? `Get ${info.name}` : `Choose ${info.name}`}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </Link>
    </div>
  );
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
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Choose Your <span className="text-primary">Perfect Plan</span>
          </h2>
          <p className="max-w-[600px] text-muted-foreground text-lg mx-auto">
            Professional AI headshots, one price. No subscriptions, no hidden fees.
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

        {/* Tier Comparison Table */}
        <TierComparisonTable />

        {/* Trust Badges */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Shield className="h-4 w-4 text-primary" />
            30天自动删除
          </span>
          <span className="flex items-center gap-1">
            <Check className="h-4 w-4 text-primary" />
            商业授权
          </span>
        </div>

        <p className="mt-2 text-center text-sm text-muted-foreground">
          100% satisfaction guaranteed. Prices exclude applicable taxes, collected at checkout.
        </p>
      </div>
    </div>
  )
}
