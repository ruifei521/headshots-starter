"use client"

import { Shield, Star, Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    icon: Star,
    title: "AI Headshots You Can Actually Use",
    description: (
      <>
        If you don&apos;t get a single profile-worthy headshot that you&apos;re happy with,
        we&apos;ll refund your entire purchase. <strong>No questions asked.</strong>
      </>
    ),
  },
  {
    icon: Shield,
    title: "You Own Your Headshots",
    description:
      "We are an independently owned company that takes privacy seriously. We never sell your photos. You have full commercial rights and ownership of your photos — use them however you want.",
  },
  {
    icon: Trash2,
    title: "Your Details Are Deleted in 30 Days",
    description:
      "All input photos are deleted after 7 days. All AI headshots are deleted after 30 days. Delete your data faster, anytime you want, with the click of a button in your account settings.",
  },
]

export default function PrivacySection() {
  return (
    <section className="py-10 md:py-16 bg-muted/30 border-t">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center gap-3 text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Professional AI That Respects Your Privacy
          </h2>
          <p className="max-w-[700px] text-muted-foreground text-lg">
            Your headshots, your data, your peace of mind.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="flex flex-col items-center text-center p-6 shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                <Icon className="h-6 w-6" />
              </div>
              <CardContent className="p-0 space-y-2">
                <h3 className="text-lg font-bold">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
