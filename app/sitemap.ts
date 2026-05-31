import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://snapprohead.com'

  const staticPages: { url: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
    { url: '', priority: 1.0, changeFrequency: 'daily' },
    { url: '/examples', priority: 0.8, changeFrequency: 'weekly' },
    { url: '/about', priority: 0.7, changeFrequency: 'monthly' },
    { url: '/privacy', priority: 0.3, changeFrequency: 'monthly' },
    { url: '/terms', priority: 0.3, changeFrequency: 'monthly' },
    { url: '/refund', priority: 0.5, changeFrequency: 'monthly' },
    { url: '/packs', priority: 0.9, changeFrequency: 'weekly' },
    { url: '/login', priority: 0.4, changeFrequency: 'monthly' },
    { url: '/templates', priority: 0.7, changeFrequency: 'monthly' },
    { url: '/headshots', priority: 0.8, changeFrequency: 'weekly' },
  ]

  const headshotCareers = [
    'lawyer', 'doctor', 'realtor', 'corporate', 'linkedin', 'professional',
    'executive', 'business', 'actor', 'accountant', 'consultant', 'dentist',
    'nurse', 'portfolio', 'startup', 'teacher', 'c-suite', 'speaker'
  ]

  const staticEntries: MetadataRoute.Sitemap = staticPages.map((page) => ({
    url: `${baseUrl}${page.url}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }))

  const careerEntries: MetadataRoute.Sitemap = headshotCareers.map((career) => ({
    url: `${baseUrl}/headshots/${career}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticEntries, ...careerEntries]
}
