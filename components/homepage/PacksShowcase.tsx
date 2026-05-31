"use client"
import { useState } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface PackPreview {
  slug: string
  title: string
  subtitle: string
  cover_url: string
  tag: string
  isPremium?: boolean
}

const allPacks: PackPreview[] = [
  // Core Professional Styles
  { slug: 'corporate-headshots', title: 'Corporate Headshots', subtitle: 'Formal Business', cover_url: '', tag: 'Professional', isPremium: false },
  { slug: 'partners-headshots', title: "Partner's Headshots", subtitle: 'Legal Professional', cover_url: '', tag: 'Professional', isPremium: false },
  { slug: 'speaker', title: 'Speaker', subtitle: 'Public Speaking', cover_url: '', tag: 'Professional', isPremium: false },
  { slug: 'realtor', title: 'Realtor', subtitle: 'Real Estate', cover_url: '', tag: 'Professional', isPremium: false },
  { slug: 'styled-for-success', title: 'Styled for Success', subtitle: 'Modern Professional', cover_url: '', tag: 'Professional', isPremium: false },
  { slug: 'lawyer-il', title: 'Lawyer Headshots', subtitle: 'Legal Professional', cover_url: '', tag: 'Professional', isPremium: false },
  // More Styles
  { slug: 'talya-maor', title: 'Image shots - Talya Maor', subtitle: 'Branding Photography', cover_url: '', tag: 'Premium', isPremium: true },
  { slug: 'natural-headshots', title: 'Natural Looks', subtitle: 'Natural & Approachable', cover_url: '', tag: 'Premium', isPremium: true },
  { slug: 'business-profile-studio', title: 'Business Profile - Studio', subtitle: 'Studio Photography', cover_url: '', tag: 'Premium', isPremium: true },
  { slug: 'effortless-professionalism', title: 'Effortless Professionalism', subtitle: 'Casual Professional', cover_url: '', tag: 'Premium', isPremium: true },
  { slug: 'office-outfits', title: 'Office Outfits', subtitle: 'Office Fashion', cover_url: '', tag: 'Premium', isPremium: true },
  { slug: 'stylish-studio-portraits', title: 'Stylish Studio Portraits', subtitle: 'Studio Portrait Photography', cover_url: '', tag: 'Premium', isPremium: true },
];

export default function PacksShowcase() {
  return (
    <section className="py-10 md:py-16 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center gap-4 text-center md:gap-8">
          <Badge variant="outline" className="mb-2">
            12 Professional Styles
          </Badge>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Choose Your <span className="text-primary">Style</span>
          </h2>
          <p className="max-w-[700px] text-muted-foreground text-lg">
            12 curated styles — from classic corporate to modern studio portraits. 
            Each with 20–81 expertly designed headshot variations.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {allPacks.map((pack) => (
            <Link
              key={pack.slug}
              href={`/packs/${pack.slug}.html`}
              className="group flex flex-col rounded-xl border bg-card overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                <Image
                  src={`/packs/${pack.slug}_cover.jpg`}
                  alt={pack.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `/packs/${pack.slug}_1.jpg`;
                  }}
                />
              </div>
              <div className="p-3 text-center">
                <p className="text-sm font-semibold leading-tight">{pack.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{pack.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-muted-foreground">
            All styles <strong>starting at $29 per pack</strong> — pick the ones you need, pay once.
          </p>
        </div>
      </div>
    </section>
  )
}
