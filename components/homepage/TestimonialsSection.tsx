"use client"

import { Check, X, Clock, DollarSign, Camera, Users, Palette } from "lucide-react"

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
