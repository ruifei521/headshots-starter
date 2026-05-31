import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import { reviews } from "@/components/homepage/reviews-data"

export const metadata: Metadata = {
  title: "Customer Reviews & Examples | SnapProHead",
  description: "See what our customers say about SnapProHead AI headshots. 4.9/5 stars from 6,000+ reviews.",
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
    <div className="min-h-screen">
      {/* Header */}
      <section className="border-b bg-muted/30 py-12 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <Badge variant="outline" className="mb-2">
              Customer Reviews
            </Badge>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              What Our Customers Say
            </h1>
            <p className="max-w-[700px] text-muted-foreground text-lg">
              Real feedback from real people who transformed their selfies into professional headshots.
            </p>

            {/* Rating Summary */}
            <div className="mt-4 flex flex-col items-center gap-2">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-7 w-7 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <div className="flex items-center gap-2 text-lg">
                <span className="font-bold text-2xl">4.9</span>
                <span className="text-muted-foreground">/ 5</span>
                <span className="mx-2 text-muted-foreground">·</span>
                <span className="text-muted-foreground">based on 50,000+ professionals</span>
              </div>
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
              Join thousands of professionals who trust SnapProHead for studio-quality AI headshots.
            </p>
            <Link href="/#pricing">
              <Button size="lg" className="mt-2">
                Create Your Headshots Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
