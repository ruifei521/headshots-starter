import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import { reviews } from "@/components/homepage/reviews-data"

// 从滚动画廊中精选 8 张 Astria AI 生成的样片
const exampleImages = ["01", "17", "08", "12", "16", "05", "24", "28"].map(
  (n) => `/gallery-images/${n}.jpg`
)

// 从 reviews 中选 8 条简短真实的评论（不展示头像）
const featuredReviews = reviews
  .filter((r) => r.text.length < 200 && r.rating >= 4)
  .slice(0, 8)

export default function ExamplesSection() {
  return (
    <section id="examples" className="scroll-mt-16 border-t py-12 md:py-16 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center gap-4 text-center md:gap-8">
          <Badge variant="outline" className="mb-2">
            See the Results
          </Badge>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Stunning Transformations</h2>
          <p className="max-w-[700px] text-muted-foreground text-lg">
            These photos are not real. They were all created using AI.
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
                    alt="AI Generated Headshot"
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover"
                    loading={i < 2 ? "eager" : "lazy"}
                    unoptimized
                  />
                  <div className="absolute bottom-2 right-2 rounded-full bg-primary/80 px-2 py-1 text-xs text-white">
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

        {/* 8 条评论，每行 4 条，不展示头像 */}
        <div className="mt-10 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
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
                "{review.text}"
              </p>
              <p className="mt-2 text-xs font-medium">
                {review.name}
                {review.role && <span className="text-muted-foreground font-normal"> · {review.role}</span>}
              </p>
            </div>
          ))}
        </div>

        {/* 查看更多示例和评论 */}
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