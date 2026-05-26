import { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'

const packPages = [
  'corporate-headshots',
  'partners-headshots',
  'speaker',
  'realtor',
  'amichai-ai',
  'lawyer-il',
  'image-shots',
  'natural-headshots',
  'business-profile-studio',
  'effortless-professionalism',
  'office-outfits',
  'stylish-studio-portraits',
]

function getIndustrySlugs(): string[] {
  const dir = path.join(process.cwd(), 'app', 'headshots')
  try {
    return fs.readdirSync(dir, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name)
  } catch {
    return []
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://snapprohead.com'
  const now = new Date()
  const industrySlugs = getIndustrySlugs()

  const entries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/templates`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/headshots`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/refund`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    ...industrySlugs.map((slug) => ({
      url: `${baseUrl}/headshots/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...packPages.map((slug) => ({
      url: `${baseUrl}/packs/${slug}.html`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]

  return entries
}
