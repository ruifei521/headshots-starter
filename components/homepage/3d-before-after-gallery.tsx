"use client"

import { useState, useRef, useEffect, lazy } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "motion/react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface GalleryItem {
  before: string
  after: string
  label: string
}

export default function ThreeDBeforeAfterGallery() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isFlipping, setIsFlipping] = useState(false)
  const [direction, setDirection] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const autoplayRef = useRef<NodeJS.Timeout | null>(null)

  // ✅ 用 ref 存最新值，避免 setInterval 闭包捕获旧值
  const activeIndexRef = useRef(activeIndex)
  activeIndexRef.current = activeIndex
  const isFlippingRef = useRef(isFlipping)
  isFlippingRef.current = isFlipping

  // 8 pairs matching getheadshots.ai image set
  const galleryItems: GalleryItem[] = [
    { before: "/homepage/before0001.jpg", after: "/homepage/example0001.jpg", label: "① Corporate" },
    { before: "/homepage/before0002.jpg", after: "/homepage/example0002.jpg", label: "② Executive" },
    { before: "/homepage/before0001.jpg", after: "/homepage/example0004.jpg", label: "③ Natural" },
    { before: "/homepage/before0002.jpg", after: "/homepage/example0006.jpg", label: "④ Contemporary" },
    { before: "/homepage/before0001.jpg", after: "/homepage/example0005.jpg", label: "⑤ Professional" },
    { before: "/homepage/before0002.jpg", after: "/homepage/example0007.jpg", label: "⑥ Modern" },
  ]

  const goToSlide = (index: number) => {
    if (isFlippingRef.current) return
    setDirection(index > activeIndexRef.current ? 1 : -1)
    setIsFlipping(true)
    setTimeout(() => {
      setActiveIndex(index)
      setIsFlipping(false)
    }, 400)
  }

  const nextSlide = () => goToSlide((activeIndexRef.current + 1) % galleryItems.length)
  const prevSlide = () => goToSlide((activeIndexRef.current - 1 + galleryItems.length) % galleryItems.length)

  // Gentle parallax
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const handleMouseMove = (e: MouseEvent) => {
      if (isFlipping || !isHovered) return
      const { left, top, width, height } = container.getBoundingClientRect()
      const x = ((e.clientX - left) / width - 0.5) * 3
      const y = ((e.clientY - top) / height - 0.5) * 3
      container.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${-y}deg)`
    }
    const handleMouseLeave = () => {
      container.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg)"
    }
    container.addEventListener("mousemove", handleMouseMove)
    container.addEventListener("mouseleave", handleMouseLeave)
    return () => {
      container.removeEventListener("mousemove", handleMouseMove)
      container.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [isFlipping, isHovered])

  // Autoplay — 只挂载一次，通过 ref 读取最新状态
  useEffect(() => {
    autoplayRef.current = setInterval(() => {
      if (!isFlippingRef.current) nextSlide()
    }, 4000)
    return () => { if (autoplayRef.current) clearInterval(autoplayRef.current) }
  }, [])

  const current = galleryItems[activeIndex]

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <div className="mb-6 mx-auto max-w-3xl">
          <Image
            src="/steps-hero.png"
            alt="Steps"
            width={768}
            height={343}
            className="w-full h-auto"
            priority
            unoptimized
          />
        </div>
        <Badge variant="outline" className="mb-3">See the Transformation</Badge>
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          From Selfie to <span className="text-primary">Studio Quality</span>
        </h2>
      </div>

      <div className="relative mx-auto max-w-2xl">
        <div
          ref={containerRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative w-full transition-transform duration-200 ease-out"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="relative overflow-hidden rounded-2xl bg-card shadow-xl border">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                className="flex flex-col md:flex-row"
                initial={{ opacity: 0, x: direction * 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -60 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
              >
                {/* BEFORE */}
                <div className="relative w-full md:w-1/2 aspect-[4/5]">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10" />
                  <Image
                    src={current.before}
                    alt="Before"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                    quality={70}
                  />
                  <div className="absolute top-4 left-4 z-20">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold text-white">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                      BEFORE
                    </span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: "spring" }}
                      className="hidden md:flex h-14 w-14 items-center justify-center rounded-full bg-primary/90 shadow-lg"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                        <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                      </svg>
                    </motion.div>
                  </div>
                </div>

                {/* AFTER */}
                <div className="relative w-full md:w-1/2 aspect-[4/5] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10" />
                  <motion.div
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="h-full w-full"
                  >
                    <Image
                      src={current.after}
                      alt="After"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                      quality={70}
                    />
                  </motion.div>
                  <div className="absolute top-4 right-4 z-20">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/80 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
                      <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                      AFTER
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 z-20">
                    <div className="rounded-xl bg-black/50 backdrop-blur-sm px-4 py-3 text-white">
                      <p className="text-sm font-semibold">{current.label}</p>
                      <p className="text-xs text-white/70">Same person, different style</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <button onClick={prevSlide} className="flex h-10 w-10 items-center justify-center rounded-full border bg-background shadow-sm hover:bg-accent transition-all hover:scale-105" aria-label="Previous">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            {galleryItems.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  index === activeIndex ? "w-8 bg-primary" : "w-2 bg-gray-300 hover:bg-gray-400"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          <button onClick={nextSlide} className="flex h-10 w-10 items-center justify-center rounded-full border bg-background shadow-sm hover:bg-accent transition-all hover:scale-105" aria-label="Next">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
