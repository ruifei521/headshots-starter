"use client"

import Image from "next/image"

// 32 AI-generated headshot examples from Astria.ai
// Displayed in the hero section marquee gallery
const galleryImages = Array.from({ length: 32 }, (_, i) => {
  const num = String(i + 1).padStart(2, "0")
  return `/gallery-images/${num}.jpg`
})

function MarqueeRow({ images, direction = "left", speed = 40 }: { images: string[]; direction?: "left" | "right"; speed?: number }) {
  // Double the images for seamless infinite loop
  const doubled = [...images, ...images]

  return (
    <div className="relative overflow-hidden">
      {/* Fade edges */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-background to-transparent" />

      <div
        className="flex gap-3"
        style={{
          animation: `marquee-${direction} ${speed}s linear infinite`,
          width: "max-content",
        }}
      >
        {doubled.map((src, i) => (
          <div
            key={`${src}-${i}`}
            className="relative flex-shrink-0 w-28 h-36 sm:w-32 sm:h-40 md:w-36 md:h-48 rounded-xl overflow-hidden border bg-muted/20 shadow-sm hover:shadow-md transition-shadow duration-300 group"
          >
            <Image
              src={src}
              alt={`AI headshot example`}
              fill
              sizes="144px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              quality={55}
              loading="lazy"
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
    <div className="w-full space-y-3">
      <style>{`
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>

      <MarqueeRow images={galleryImages} direction="left" speed={90} />
    </div>
  )
}
