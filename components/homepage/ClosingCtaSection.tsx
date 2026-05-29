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
            Studio quality at a fraction of the cost — results in ~30 minutes.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
            <Link href="/templates">
              <Button size="lg" className="group">
                Create Your Headshots Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Mini trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              14-day money-back guarantee
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              Commercial license included
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              Your photos stay private
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
