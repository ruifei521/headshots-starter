import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://snapprohead.com'

  // Static public pages
  const staticPages = [
    { path: '', priority: 1.0, freq: 'weekly' as const },
    { path: '/about', priority: 0.8, freq: 'monthly' as const },
    { path: '/examples', priority: 0.9, freq: 'weekly' as const },
    { path: '/packs', priority: 0.8, freq: 'monthly' as const },
    { path: '/templates', priority: 0.7, freq: 'monthly' as const },
    { path: '/privacy', priority: 0.3, freq: 'monthly' as const },
    { path: '/terms', priority: 0.3, freq: 'monthly' as const },
    { path: '/refund', priority: 0.3, freq: 'monthly' as const },
  ]

  // Headshot style pages
  const headshotPages = [
    '/headshots',
    '/headshots/linkedin',
    '/headshots/lawyer',
    '/headshots/realtor',
    '/headshots/accountant',
    '/headshots/actor',
    '/headshots/business',
    '/headshots/c-suite',
    '/headshots/consultant',
    '/headshots/corporate',
    '/headshots/dentist',
    '/headshots/doctor',
    '/headshots/executive',
    '/headshots/nurse',
    '/headshots/portfolio',
    '/headshots/professional',
    '/headshots/startup',
    '/headshots/teacher',
  ]

  return [
    // Static pages
    ...staticPages.map(({ path, priority, freq }) => ({
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: freq,
      priority,
    })),

    // Headshot style pages
    ...headshotPages.map((path) => ({
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
