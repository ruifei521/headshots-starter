"use client"

import { Shield, Star, Trash2 } from "lucide-react"

export default function PrivacySection() {
  return (
    <section className="py-10 md:py-16 bg-background border-t">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center gap-4 text-center md:gap-8">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Professional AI That Respects Your Privacy
          </h2>
          <p className="max-w-[700px] text-muted-foreground text-lg">
            Your headshots, your data, your peace of mind.
          </p>
        </div>

        <div className="mt-8 grid gap-8 max-w-3xl mx-auto">
          {/* Refund Guarantee */}
          <div className="flex flex-col gap-3 rounded-xl border p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Star className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold">AI Headshots You Can Actually Use</h3>
            </div>
            <p className="text-muted-foreground text-base leading-relaxed pl-[3.25rem]">
              If you don&apos;t get a single profile-worthy headshot that you&apos;re happy with, 
              we&apos;ll refund your entire purchase. <strong>No questions asked.</strong>
            </p>
          </div>

          {/* You Own Your Headshots */}
          <div className="flex flex-col gap-3 rounded-xl border p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold">You Own Your Headshots</h3>
            </div>
            <p className="text-muted-foreground text-base leading-relaxed pl-[3.25rem]">
              We never sell your photos. You have full commercial rights and ownership of your headshots — 
              use them however you want, wherever you want.
            </p>
          </div>

          {/* Auto Data Deletion */}
          <div className="flex flex-col gap-3 rounded-xl border p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Trash2 className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold">Your Details Are Deleted in 30 Days</h3>
            </div>
            <p className="text-muted-foreground text-base leading-relaxed pl-[3.25rem]">
              All input photos are deleted after 7 days. All generated headshots are deleted after 30 days. 
              Delete your data anytime with the click of a button in your account settings.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
