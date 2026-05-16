import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"

const comparisons = [
  {
    before: "/homepage/example0001.jpg",
    after: "/homepage/example0002.jpg",
    style: "Corporate Executive",
    description: "Selfie to LinkedIn-ready headshot",
  },
  {
    before: "/homepage/example0003.jpg",
    after: "/homepage/example0004.jpg",
    style: "Creative Professional",
    description: "Casual photo to editorial portrait",
  },
  {
    before: "/homepage/example0005.jpg",
    after: "/homepage/example0006.jpg",
    style: "Real Estate Agent",
    description: "Phone selfie to trust-building portrait",
  },
  {
    before: "/homepage/example0007.jpg",
    after: "/homepage/example0008.jpg",
    style: "Tech Startup Founder",
    description: "Candid shot to modern professional",
  },
]

export default function ExamplesSection() {
  return (
    <section id="examples" className="border-t py-20 md:py-32 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center gap-4 text-center md:gap-8">
          <Badge variant="outline" className="mb-2">
            See the Results
          </Badge>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Stunning Transformations</h2>
          <p className="max-w-[700px] text-muted-foreground text-lg">
            See how our AI transforms regular selfies into professional headshots that make you stand out.
          </p>
        </div>

        {/* Before / After Grid */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 max-w-4xl mx-auto">
          {comparisons.map((item, i) => (
            <div key={i} className="rounded-lg border bg-background overflow-hidden">
              <div className="px-4 pt-4 pb-2">
                <p className="font-semibold">{item.style}</p>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
              <div className="grid grid-cols-2">
                <div className="relative">
                  <div className="absolute inset-0 flex items-start p-2 z-10">
                    <span className="rounded bg-black/60 px-1.5 py-0.5 text-[11px] font-medium text-white">
                      Before
                    </span>
                  </div>
                  <div className="h-56 overflow-hidden">
                    <Image
                      src={item.before || "/placeholder.svg"}
                      alt={`${item.style} - Before`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 flex items-start p-2 z-10">
                    <span className="rounded bg-primary/90 px-1.5 py-0.5 text-[11px] font-medium text-white">
                      After
                    </span>
                  </div>
                  <div className="h-56 overflow-hidden">
                    <Image
                      src={item.after || "/placeholder.svg"}
                      alt={`${item.style} - After`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/login">
            <Button size="lg" className="gap-2">
              Try It Yourself <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="#pricing">
            <Button variant="outline" size="lg">
              View Pricing
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
