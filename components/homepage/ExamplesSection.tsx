import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import { getFeaturedReviews } from "@/components/homepage/reviews-data"
import {
  EXAMPLES_PHOTOS_LEDE,
  EXAMPLES_TESTIMONIALS_HEADING,
  EXAMPLES_TESTIMONIALS_LEDE,
} from "@/lib/examples-marketing-copy"

const exampleImages = ["01", "17", "08", "12", "16", "05", "24", "28"].map(
  (n) => `/gallery-images/${n}.jpg`
)

const featuredReviews = getFeaturedReviews()

export default function ExamplesSection() {
  return (
    <section id="examples" className="scroll-mt-16 border-t py-12 md:py-16 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center gap-4 text-center md:gap-8">
          <Badge variant="outline" className="mb-2">
            See the Results
          </Badge>
          <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-5xl">Examples</h2>
          <p className="max-w-[700px] text-muted-foreground text-base sm:text-lg px-2">
            {EXAMPLES_PHOTOS_LEDE}
          </p>
        </div>
        <div className="mt-8 grid gap-4 sm:gap-6 md:gap-8 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {exampleImages.map((src, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-lg border bg-background transition-all hover:shadow-lg"
            >
              <div className="aspect-[3/4] overflow-hidden">
                <div className="relative h-full w-full transition-all group-hover:scale-105">
                  <Image
                    src={src || "/placeholder.svg"}
                    alt={`Professional AI headshot example ${i + 1}`}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover"
                    loading={i < 2 ? "eager" : "lazy"}
                    unoptimized
                  />
                  <div className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 rounded-full bg-primary/80 px-1.5 py-0.5 sm:px-2 sm:py-1 text-[10px] sm:text-xs text-white">
                    <span className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-white"></span>
                      AI Generated
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <h3 className="text-lg font-semibold sm:text-xl">{EXAMPLES_TESTIMONIALS_HEADING}</h3>
          <p className="mt-2 max-w-[600px] mx-auto text-sm text-muted-foreground px-2">
            {EXAMPLES_TESTIMONIALS_LEDE}
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {featuredReviews.map((review, i) => (
            <div
              key={i}
              className="rounded-lg border bg-background p-4 transition-all hover:shadow-sm"
            >
              <div className="mb-2 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={j}
                    className={`h-3.5 w-3.5 ${j < review.rating ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"}`}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                &ldquo;{review.text}&rdquo;
              </p>
              <p className="mt-2 text-xs font-medium">
                {review.name}
                {review.role && (
                  <span className="text-muted-foreground font-normal"> · {review.role}</span>
                )}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/examples"
            prefetch={true}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline underline-offset-4 transition-colors"
          >
            See more examples &amp; reviews
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
