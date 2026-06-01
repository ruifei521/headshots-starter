import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/overview/'],
    },
    sitemap: 'https://snapprohead.com/sitemap.xml',
  }
}
