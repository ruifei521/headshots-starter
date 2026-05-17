"use client"

import { Shield, Lock, Trash2, Eye } from "lucide-react"

const privacyItems = [
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Secure Infrastructure",
    description: "Your data is processed on secure, enterprise-grade cloud infrastructure with access controls.",
  },
  {
    icon: <Lock className="h-6 w-6" />,
    title: "Encrypted Transfer",
    description: "Your photos are encrypted during upload and delivery via HTTPS/TLS. No one else can access them.",
  },
  {
    icon: <Trash2 className="h-6 w-6" />,
    title: "Auto-Delete After 30 Days",
    description: "We don't hoard your data. Uploaded photos are automatically purged after 30 days.",
  },
  {
    icon: <Eye className="h-6 w-6" />,
    title: "Your Data, Your Control",
    description: "Your photos are processed only to generate your headshots and are never shared with third parties for marketing or other purposes.",
  },
]

export default function PrivacySection() {
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center gap-4 text-center md:gap-8">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Your Privacy, Guaranteed
          </h2>
          <p className="max-w-[700px] text-muted-foreground text-lg">
            Professional headshots without compromising your personal data.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {privacyItems.map((item, i) => (
            <div
              key={i}
              className="flex flex-col gap-3 rounded-lg border p-6 hover:bg-muted/30 transition-colors"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {item.icon}
              </div>
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
