"use client"

import Image from "next/image"

const GALLERY_COUNT = 8
const galleryImages = Array.from({ length: GALLERY_COUNT }, (_, i) => {
  const num = String(i + 1).padStart(2, "0")
  return `/gallery-images/${num}.jpg`
})

function MarqueeRow({
  images,
  speed = 35,
}: {
  images: string[]
  speed?: number
}) {
  const doubled = [...images, ...images]

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-8 sm:w-16 md:w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-8 sm:w-16 md:w-24 bg-gradient-to-l from-background to-transparent" />

      <div
        className="flex w-max gap-3 snap-marquee-fallback"
        aria-hidden
        style={{ animationDuration: `${speed}s` }}
      >
        {doubled.map((src, i) => (
          <div
            key={`${src}-${i}`}
            className="relative flex-shrink-0 w-24 h-32 sm:w-28 sm:h-36 md:w-32 md:h-40 lg:w-36 lg:h-48 rounded-lg sm:rounded-xl overflow-hidden border bg-muted/20 shadow-sm"
          >
            <Image
              src={src}
              alt={`AI professional headshot sample ${(i % GALLERY_COUNT) + 1}`}
              fill
              sizes="144px"
              className="object-cover !max-w-none !h-full"
              quality={50}
              priority={i < 2}
              loading={i < 2 ? "eager" : "lazy"}
            />
            <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-1.5 left-1.5 right-1.5">
              <span className="inline-flex items-center gap-1 rounded-full bg-black/50 backdrop-blur-sm px-1.5 py-0.5 text-[10px] font-medium text-white">
                <span className="h-1 w-1 rounded-full bg-green-400" />
                AI Generated
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ScrollingGallery() {
  return (
    <div className="w-full" aria-label="AI headshot examples scrolling gallery">
      <MarqueeRow images={galleryImages} speed={35} />
    </div>
  )
}
