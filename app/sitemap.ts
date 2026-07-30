import type { MetadataRoute } from 'next'
import { getBlogPosts } from '@/lib/blog'

const SITE_URL = 'https://www.sssion.studio'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/features`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/founding`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/discover`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/blog`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/privacy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/terms`, changeFrequency: 'yearly', priority: 0.3 },
  ]

  const blogPages: MetadataRoute.Sitemap = getBlogPosts().map((post) => {
    const date = new Date(post.date + 'T00:00:00Z')
    return {
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: isNaN(date.getTime()) ? new Date() : date,
      changeFrequency: 'monthly',
      priority: 0.6,
    }
  })

  return [...staticPages, ...blogPages]
}
