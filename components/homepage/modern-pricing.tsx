"use client"

import { useState } from "react"
import { Check, Clock, Shield, ArrowRight, Zap, Star, Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TIERS, type Tier, type TierInfo } from "@/lib/tiers"
import TierComparisonTable from "@/components/homepage/tier-comparison-table"
import { createBrowserClient } from "@supabase/ssr"
import { useRouter } from "next/navigation"

// Pack options for the checkout selector
const packOptions = [
  { slug: 'corporate-headshots', title: 'Corporate Headshots', desc: 'Formal Business' },
  { slug: 'partners-headshots', title: "Partner's Headshots", desc: 'Legal Professional' },
  { slug: 'speaker', title: 'Speaker', desc: 'Public Speaking' },
  { slug: 'realtor', title: 'Realtor', desc: 'Real Estate' },
  { slug: 'styled-for-success', title: 'Styled for Success', desc: 'Modern Professional' },
  { slug: 'lawyer-il', title: 'Lawyer Headshots', desc: 'Legal Professional' },
  { slug: 'natural-headshots', title: 'Natural Looks', desc: 'Natural & Approachable' },
  { slug: 'business-profile-studio', title: 'Business Profile - Studio', desc: 'Studio Photography' },
  { slug: 'effortless-professionalism', title: 'Effortless Professionalism', desc: 'Casual Professional' },
  { slug: 'office-outfits', title: 'Office Outfits', desc: 'Office Fashion' },
  { slug: 'stylish-studio-portraits', title: 'Stylish Studio Portraits', desc: 'Studio Portrait Photography' },
  { slug: 'talya-maor', title: 'Image shots - Talya Maor', desc: 'Branding Photography' },
]

function getSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

/** Pack selector modal */
function PackSelectorModal({
  tierInfo,
  onClose,
}: {
  tierInfo: TierInfo
  onClose: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [selectedPack, setSelectedPack] = useState<string | null>(null)
  const router = useRouter()

  const handleCheckout = async (packSlug: string) => {
    setLoading(true)
    setSelectedPack(packSlug)
    try {
      const supabase = getSupabase()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push(`/login?redirect=/#pricing`)
        return
      }

      const res = await fetch('/api/creem/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pack: packSlug,
          gender: 'woman',
          tier: tierInfo.tier,
        }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Failed to create checkout: ' + (data.error || 'Unknown error'))
      }
    } catch {
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
      setSelectedPack(null)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-card rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b">
          <div>
            <h3 className="text-lg font-bold">Select Your Style</h3>
            <p className="text-sm text-muted-foreground">
              Choose a style for your {tierInfo.name} plan ({tierInfo.priceLabel})
            </p>
          </div>
          <button onClick={onClose} className="rounded-full p-1.5 hover:bg-muted transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Pack Grid */}
        <div className="p-5 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {packOptions.map((pack) => (
              <button
                key={pack.slug}
                onClick={() => handleCheckout(pack.slug)}
                disabled={loading}
                className={`flex flex-col items-center rounded-xl border p-3 text-center transition-all hover:shadow-md hover:border-primary/50 disabled:opacity-50 ${
                  selectedPack === pack.slug ? 'ring-2 ring-primary border-primary' : ''
                }`}
              >
                <div className="w-full aspect-[3/4] rounded-lg overflow-hidden bg-muted mb-2">
                  <img
                    src={`/packs/${pack.slug}_1.jpg`}
                    alt={pack.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `/packs/${pack.slug}_1.webp`
                    }}
                  />
                </div>
                <p className="text-xs font-semibold leading-tight">{pack.title}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{pack.desc}</p>
                {selectedPack === pack.slug && loading && (
                  <Loader2 className="h-4 w-4 animate-spin mt-1.5 text-primary" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/** Single pricing card with direct checkout */
function PricingCard({ info, highlight }: { info: TierInfo; highlight?: boolean }) {
  const isPopular = info.badge === "Most Popular";
  const isBest = info.badge === "Best Value";
  const [showPackSelector, setShowPackSelector] = useState(false);

  return (
    <>
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

        {/* CTA Button — opens pack selector modal */}
        <Button
          onClick={() => setShowPackSelector(true)}
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
      </div>

      {/* Pack Selector Modal */}
      {showPackSelector && (
        <PackSelectorModal
          tierInfo={info}
          onClose={() => setShowPackSelector(false)}
        />
      )}
    </>
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
          {/* 25% off banner */}
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-1.5 text-sm font-semibold text-white">
            🔥 25% off all packages — limited time only!
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Choose Your <span className="text-primary">Perfect Plan</span>
          </h2>
          <p className="max-w-[600px] text-muted-foreground text-lg mx-auto">
            Professional photoshoots cost $250+ on average. Save time and money with our AI-powered solution.
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
            30-day auto-delete
          </span>
          <span className="flex items-center gap-1">
            <Check className="h-4 w-4 text-primary" />
            Commercial license
          </span>
        </div>

        <p className="mt-2 text-center text-sm text-muted-foreground">
          100% satisfaction guaranteed. Prices exclude applicable taxes, collected at checkout.
        </p>
      </div>
    </div>
  )
}
