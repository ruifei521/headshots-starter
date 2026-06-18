import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import { reviews } from "@/components/homepage/reviews-data"
import { getExamplesJsonLd } from "@/lib/json-ld"

export const metadata: Metadata = {
  title: "Sample Reviews & Examples | SnapProHead",
  description:
    "Illustrative customer-style feedback and AI headshot examples from SnapProHead. See what professional results look like before you buy.",
  alternates: {
    canonical: "https://snapprohead.com/examples",
  },
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"}`}
        />
      ))}
    </div>
  )
}

export default function ExamplesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getExamplesJsonLd()),
        }}
      />
      <div className="min-h-screen">
      {/* Header */}
      <section className="border-b bg-muted/30 py-8 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 text-center">
            <Badge variant="outline" className="mb-2">
              Sample Testimonials
            </Badge>
            <h1 className="text-2xl font-bold tracking-tighter sm:text-4xl md:text-5xl px-2">
              What Professionals Say About AI Headshots
            </h1>
            <p className="max-w-[700px] text-muted-foreground text-lg">
              Illustrative feedback representing typical experiences with AI
              headshot tools. Photos on this site are AI-generated examples.
            </p>

            <div className="mt-4 flex flex-col items-center gap-2">
              <div className="flex gap-1" aria-hidden>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-7 w-7 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Sample testimonials for illustration — not verified third-party reviews
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="py-12 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review, i) => (
              <div
                key={i}
                className="group flex flex-col rounded-2xl border bg-card p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary/30"
              >
                {/* Stars */}
                <div className="mb-4">
                  <StarRating rating={review.rating} />
                </div>

                {/* Review Text */}
                <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                  &ldquo;{review.text}&rdquo;
                </p>

                {/* Author */}
                <div className="mt-5 flex items-center gap-3 border-t pt-4">
                  {review.avatar ? (
                    <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-muted ring-2 ring-background">
                      <Image
                        src={review.avatar}
                        alt={review.name}
                        fill
                        sizes="40px"
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm ring-2 ring-background">
                      {review.name.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{review.name}</p>
                    {review.role && <p className="text-xs text-muted-foreground truncate">{review.role}</p>}
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{review.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t py-12 md:py-20 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">
              Ready to get yours?
            </h2>
            <p className="max-w-[600px] text-muted-foreground text-lg">
              Studio-quality AI headshots from $29 — delivered in about 25 minutes.
            </p>
            <Link href="/pricing">
              <Button size="lg" className="mt-2">
                Create Your Headshots Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
    </>
  )
}
