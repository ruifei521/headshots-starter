"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ClosingCtaSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-primary/5 border-t">
      <div className="container px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Ready for Your <span className="text-primary">Professional Headshots</span>?
          </h2>
          <p className="text-muted-foreground text-lg max-w-[600px] mx-auto">
            Join thousands of professionals who upgraded their online presence with AI-powered headshots.
            Studio quality at a fraction of the cost — results in ~25 minutes.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
            <Link href="/#pricing">
              <Button size="lg" className="group">
                Create Your Headshots Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Mini trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              ★★★★★ 6,000+ headshots delivered · 🛡️ Privacy first
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
