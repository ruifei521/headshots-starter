"use client"

import { Badge } from "@/components/ui/badge"
import { Check, X, Camera, Clock, DollarSign, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { COMPARISON_REFUND_OURS, RETAKES_COMPARISON_LINE } from "@/lib/refund-policy"
import { STUDIO_PHOTOGRAPH_SESSION_LABEL } from "@/lib/marketing-copy"

const comparisons = [
  {
    feature: "Cost",
    traditional: STUDIO_PHOTOGRAPH_SESSION_LABEL,
    ours: `$29`,
    icon: <DollarSign className="h-4 w-4" />,
  },
  {
    feature: "Time Investment",
    traditional: "1 – 3 hours (travel + shoot)",
    ours: "2 minutes to upload selfies",
    icon: <Clock className="h-4 w-4" />,
  },
  {
    feature: "Turnaround Time",
    traditional: "3 – 7 business days",
    ours: "~25 minutes",
    icon: <ArrowRight className="h-4 w-4" />,
  },
  {
    feature: "Photo Selection",
    traditional: "Pick from 20 – 50 raw shots",
    ours: "Choose your preferred styles upfront",
    icon: <Camera className="h-4 w-4" />,
  },
  {
    feature: "Retakes / Edits",
    traditional: "$50 – $150 extra per round",
    ours: RETAKES_COMPARISON_LINE,
    icon: <Check className="h-4 w-4" />,
  },
  {
    feature: "Multiple Styles",
    traditional: "Change outfit, pay again",
    ours: "Corporate, Casual, Creative & more",
    icon: <Camera className="h-4 w-4" />,
  },
  {
    feature: "Privacy & Security",
    traditional: "Photos stored by studio",
    ours: "Auto-deleted after use",
    icon: <Check className="h-4 w-4" />,
  },
  {
    feature: "Satisfaction Guaranteed",
    traditional: "Rarely offered",
    ours: COMPARISON_REFUND_OURS,
    icon: <Check className="h-4 w-4" />,
  },
]

export default function ComparisonSection() {
  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center gap-4 text-center md:gap-8">
          <Badge variant="outline" className="mb-2">
            Why SnapProHead
          </Badge>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Photo Studio vs AI Headshots
          </h2>
          <p className="max-w-[700px] text-muted-foreground text-lg">
            Professional quality at a fraction of the cost and time.
          </p>
        </div>

        <div className="mt-12 mx-auto max-w-3xl">
          <div className="rounded-lg border overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-3 bg-muted/80 border-b font-semibold text-sm">
              <div className="p-4"></div>
              <div className="p-4 text-center">Photo Studio</div>
              <div className="p-4 text-center text-primary">SnapProHead</div>
            </div>
            {/* Rows */}
            {comparisons.map((row, i) => (
              <div
                key={i}
                className="grid grid-cols-3 border-b last:border-0 text-sm hover:bg-muted/30 transition-colors"
              >
                <div className="p-4 font-medium flex items-center gap-2">
                  {row.icon}
                  {row.feature}
                </div>
                <div className="p-4 text-center text-muted-foreground flex items-center justify-center">
                  {row.traditional}
                </div>
                <div className="p-4 text-center font-medium text-primary flex items-center justify-center">
                  {row.ours}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link href="#pricing">
            <Button size="lg" className="mt-2">
              See Pricing Plans
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
