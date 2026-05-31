"use client"

import { Shield, Star, Trash2 } from "lucide-react"

export default function PrivacySection() {
  return (
    <section className="py-10 md:py-16 bg-background border-t">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center gap-4 text-center md:gap-8 mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Professional AI That Respects Your Privacy
          </h2>
          <p className="max-w-[700px] text-muted-foreground text-lg">
            Your headshots, your data, your peace of mind.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Refund Guarantee */}
          <div className="flex gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0">
              <Star className="h-5 w-5" />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-bold">AI Headshots You Can Actually Use</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                If you don't get a single profile-worthy headshot that you're happy with, 
                we'll refund your entire purchase. <strong>No questions asked.</strong>
              </p>
            </div>
          </div>

          {/* You Own Your Headshots */}
          <div className="flex gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0">
              <Shield className="h-5 w-5" />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-bold">You Own Your Headshots</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We are an independently owned company that takes privacy seriously. We never sell your photos. 
                You have full commercial rights and ownership of your photos — use them however you want.
              </p>
            </div>
          </div>

          {/* Auto Data Deletion */}
          <div className="flex gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0">
              <Trash2 className="h-5 w-5" />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-bold">Your Details Are Deleted in 30 Days</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                All input photos are deleted after 7 days. All AI headshots are deleted after 30 days. 
                Delete your data faster, anytime you want, with the click of a button in your account settings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
