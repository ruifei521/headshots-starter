"use client"

import { Badge } from "@/components/ui/badge"
import { Check, X, Clock, DollarSign, Camera, Users, Palette } from "lucide-react"

const mediaQuotes = [
  {
    quote: "AI headshots are now indistinguishable from real photographs. The technology has arrived.",
    source: "Business Insider",
  },
  {
    quote: "Three-quarters of recruiters prefer AI headshots to real photos, according to recent studies.",
    source: "PetaPixel",
  },
  {
    quote: "It just makes traditional photography accessible to everyone.",
    source: "Washington Post",
  },
]

const comparisons = [
  {
    feature: "Cost",
    icon: <DollarSign className="h-4 w-4" />,
    us: "From $29",
    them: "$250+ per session",
  },
  {
    feature: "Time",
    icon: <Clock className="h-4 w-4" />,
    us: "As quick as 25 min",
    them: "2–3 work days",
  },
  {
    feature: "Headshots",
    icon: <Camera className="h-4 w-4" />,
    us: "Up to 100 per pack",
    them: "5–10 per person",
  },
  {
    feature: "Outfits",
    icon: <Palette className="h-4 w-4" />,
    us: "25+ style scenes",
    them: "1–2 outfits",
  },
  {
    feature: "Consistency",
    icon: <Users className="h-4 w-4" />,
    us: "Consistent style presets",
    them: "Manual edits needed",
  },
]

export default function TestimonialsSection() {
  return (
    <section className="py-10 md:py-16 bg-muted/30">
      <div className="container px-4 md:px-6">
        {/* Media Quotes */}
        <div className="flex flex-col items-center justify-center gap-4 text-center md:gap-8">
          <Badge variant="outline" className="mb-2">As Seen In</Badge>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Trusted by <span className="text-primary">Professionals</span>
          </h2>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
          {mediaQuotes.map((quote, i) => (
            <div
              key={i}
              className="flex flex-col rounded-xl border bg-card p-6 shadow-sm"
            >
              <blockquote className="flex-1 text-muted-foreground text-sm leading-relaxed mb-4 italic">
                &ldquo;{quote.quote}&rdquo;
              </blockquote>
              <div className="pt-3 border-t">
                <p className="text-sm font-semibold">{quote.source}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Table: SnapProHead vs Traditional Photographer */}
        <div className="mt-16 max-w-3xl mx-auto">
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
                {comparisons.map((row, i) => (
                  <tr key={i} className={`border-b ${i % 2 === 0 ? "bg-muted/20" : ""}`}>
                    <td className="px-4 py-3 font-medium flex items-center gap-2">
                      {row.icon}
                      {row.feature}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="flex items-center justify-center gap-1.5">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="font-medium">{row.us}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-muted-foreground">
                      <span className="flex items-center justify-center gap-1.5">
                        <X className="h-4 w-4 text-red-400" />
                        <span>{row.them}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
