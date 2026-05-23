"use client"

import { Badge } from "@/components/ui/badge"
import Image from "next/image"

const testimonials = [
  {
    quote:
      "The quality of these AI headshots is incredible. I've updated all my professional profiles and received so many compliments.",
    author: "Sarah Johnson",
    role: "Marketing Director",
    avatar: "/homepage/example0001.jpg",
  },
  {
    quote:
      "As a freelancer, having professional headshots was a game-changer for my personal brand. The process was so quick and easy!",
    author: "Michael Chen",
    role: "UX Designer",
    avatar: "/homepage/example0002.jpg",
  },
  {
    quote:
      "I was skeptical at first, but the results blew me away. These look better than the professional photos I paid hundreds for.",
    author: "Mark Williams",
    role: "Software Engineer",
    avatar: "/homepage/example0003.jpg",
  },
]

export default function TestimonialsSection() {
  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center gap-4 text-center md:gap-8">
          <Badge variant="outline" className="mb-2">Testimonials</Badge>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            What Our Users Say
          </h2>
          <p className="max-w-[700px] text-muted-foreground text-lg">
            Thousands of professionals have transformed their online presence with our AI headshots.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="flex flex-col rounded-xl border bg-card p-6 shadow-sm"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <svg
                    key={j}
                    className="h-5 w-5 fill-yellow-400 text-yellow-400"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <blockquote className="flex-1 text-muted-foreground text-sm leading-relaxed mb-6">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t">
                <div className="relative h-10 w-10 rounded-full overflow-hidden">
                  <Image
                    src={t.avatar}
                    alt={t.author}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.author}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
