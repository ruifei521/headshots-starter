import { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/blog'
import { HEADSHOT_PROFESSION_SLUGS } from '@/lib/profession-metadata'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://snapprohead.com'
  const blogPosts = getAllPosts()

  // Static public pages
  const staticPages = [
    { path: '', priority: 1.0, freq: 'weekly' as const },
    { path: '/blog', priority: 0.85, freq: 'weekly' as const },
    { path: '/about', priority: 0.8, freq: 'monthly' as const },
    { path: '/examples', priority: 0.9, freq: 'weekly' as const },
    { path: '/pricing', priority: 0.9, freq: 'weekly' as const },
    { path: '/howto', priority: 0.6, freq: 'monthly' as const },
    { path: '/privacy', priority: 0.3, freq: 'monthly' as const },
    { path: '/terms', priority: 0.3, freq: 'monthly' as const },
    { path: '/refund', priority: 0.3, freq: 'monthly' as const },
  ]

  const headshotPages = [
    '/headshots',
    ...HEADSHOT_PROFESSION_SLUGS.map((slug) => `/headshots/${slug}`),
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

    // Blog posts
    ...blogPosts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updated ?? post.date),
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    })),
  ]
}
