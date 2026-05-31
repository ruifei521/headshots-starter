"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useInView } from "motion/react"
import { ArrowRight, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface ComparisonRow {
  dimension: string
  ai: string
  traditional: string
}

const comparisonData: ComparisonRow[] = [
  { dimension: "Price", ai: "$29 per pack", traditional: "$500+" },
  { dimension: "Turnaround Time", ai: "~30 minutes", traditional: "2-3 weeks" },
  { dimension: "Photos per Pack", ai: "40+ headshots", traditional: "5-10 photos" },
  { dimension: "Style Variety", ai: "12 professional styles", traditional: "Single style" },
  { dimension: "Refund Policy", ai: "14-day money-back guarantee", traditional: "Usually no refunds" },
  { dimension: "Privacy", ai: "Auto-delete in 30 days", traditional: "Photographer keeps negatives" },
]

function ComparisonRowItem({ row, index }: { row: ComparisonRow; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
      className="grid grid-cols-[1fr_1.2fr_1fr] items-center gap-4 border-b py-4 last:border-b-0"
    >
      <span className="text-sm font-medium text-foreground">{row.dimension}</span>
      <span className="flex items-center gap-2 text-sm text-green-600 font-medium">
        <Check className="h-4 w-4 flex-shrink-0" />
        {row.ai}
      </span>
      <span className="flex items-center gap-2 text-sm text-muted-foreground">
        <X className="h-4 w-4 flex-shrink-0 text-red-400" />
        {row.traditional}
      </span>
    </motion.div>
  )
}

export default function WhyAIHeadshotsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 })

  return (
    <section ref={sectionRef} className="scroll-mt-16 py-10 md:py-16">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center gap-4 text-center md:gap-6"
        >
          <Badge variant="outline" className="mb-2">
            Why Choose AI Headshots?
          </Badge>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            SnapProHead vs. Traditional Photographer
          </h2>
          <p className="max-w-[700px] text-muted-foreground text-lg">
            Get studio-quality headshots at a fraction of the cost and time — without compromising on quality.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 mx-auto max-w-3xl rounded-2xl border bg-card p-6 shadow-sm md:p-8"
        >
          {/* Table Header - hidden on mobile, visible on md+ */}
          <div className="hidden md:grid grid-cols-[1fr_1.2fr_1fr] items-center gap-4 border-b pb-4 mb-2">
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Dimension</span>
            <span className="flex items-center gap-2 text-sm font-semibold text-green-600 uppercase tracking-wider">
              <Check className="h-4 w-4" /> SnapProHead
            </span>
            <span className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              <X className="h-4 w-4 text-red-400" /> Traditional Photographer
            </span>
          </div>

          {/* Mobile labels */}
          <div className="flex justify-between md:hidden border-b pb-4 mb-2 text-xs font-semibold uppercase tracking-wider">
            <span className="text-green-600">✓ AI Headshots</span>
            <span className="text-muted-foreground">✗ Photographer</span>
          </div>

          {comparisonData.map((row, index) => (
            <ComparisonRowItem key={row.dimension} row={row} index={index} />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 flex justify-center"
        >
          <Link href="/#pricing">
            <Button size="lg" className="group">
              Create Your Headshots Now
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
