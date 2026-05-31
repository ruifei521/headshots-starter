"use client"

import { useEffect, useRef, useState } from "react"

const companies = [
  { name: "Google", color: "#4285F4" },
  { name: "LinkedIn", color: "#0A66C2" },
  { name: "Microsoft", color: "#737373" },
  { name: "Amazon", color: "#FF9900" },
  { name: "Apple", color: "#555555" },
  { name: "Stripe", color: "#008CDD" },
  { name: "Trustpilot", color: "#00B67A" },
  { name: "Indeed", color: "#2164F3" },
  { name: "Glassdoor", color: "#0CAA41" },
  { name: "Shopify", color: "#7AB55C" },
  { name: "Spotify", color: "#1ED760" },
  { name: "Slack", color: "#4A154B" },
]

export default function TrustedByLogos() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [duplicated, setDuplicated] = useState([...companies, ...companies])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    let animationId: number
    let scrollPos = 0
    const speed = 0.5 // pixels per frame

    const animate = () => {
      scrollPos += speed
      if (scrollPos >= el.scrollWidth / 2) {
        scrollPos = 0
      }
      el.scrollLeft = scrollPos
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationId)
  }, [])

  return (
    <div className="w-full overflow-hidden py-6">
      <p className="text-center text-sm font-semibold text-muted-foreground mb-5 tracking-wide uppercase">
        Trusted by professionals and teams
      </p>
      <div className="relative">
        {/* Gradient masks for smooth fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-r from-transparent to-background z-10" />

        {/* Scrolling row */}
        <div
          ref={scrollRef}
          className="flex items-center gap-12 overflow-hidden whitespace-nowrap px-8"
          style={{ scrollbarWidth: "none" }}
        >
          {duplicated.map((company, i) => (
            <div
              key={`${company.name}-${i}`}
              className="flex-shrink-0 flex items-center gap-2 opacity-50 hover:opacity-80 transition-opacity"
            >
              <span
                className="text-lg font-bold tracking-tight"
                style={{ color: company.color }}
              >
                {company.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
