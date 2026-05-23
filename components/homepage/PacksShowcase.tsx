"use client"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import axios from "axios"

interface PackPreview {
  id: string
  title: string
  slug: string
  subtitle: string
  cover_url: string
  tag: string
}

export default function PacksShowcase() {
  const [packs, setPacks] = useState<PackPreview[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get<PackPreview[]>('/astria/packs')
      .then(res => setPacks(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading || packs.length === 0) return null

  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center gap-4 text-center md:gap-8">
          <Badge variant="outline" className="mb-2">
            6 Professional Styles
          </Badge>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Choose Your <span className="text-primary">Style</span>
          </h2>
          <p className="max-w-[700px] text-muted-foreground text-lg">
            Each style contains 10–56 professionally designed headshot styles. Pick the look that fits your industry.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {packs.map((pack) => (
            <Link
              key={pack.id}
              href="/login"
              className="group flex flex-col rounded-xl border bg-card overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <img
                  src={pack.cover_url}
                  alt={pack.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-3 text-center">
                <p className="text-sm font-semibold leading-tight">{pack.title}</p>
                {pack.tag && (
                  <span className="text-xs text-muted-foreground">{pack.tag}</span>
                )}
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-muted-foreground">
            More styles being added regularly. Each style = different backgrounds, outfits, and styles.
          </p>
        </div>
      </div>
    </section>
  )
}
