import type { MetadataRoute } from 'next'

import { getPayloadClient } from '@/lib/payload'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  const now = new Date()

  const staticRoutes = ['/', '/about-us', '/services', '/gallery', '/contact-us', '/privacy-policy']

  const payload = await getPayloadClient()
  const services = await payload.find({ collection: 'services', limit: 100, depth: 0 })

  return [
    ...staticRoutes.map((route) => ({ url: `${base}${route}`, lastModified: now })),
    ...services.docs.map((service) => ({
      url: `${base}/services/${service.slug}`,
      lastModified: service.updatedAt ? new Date(service.updatedAt) : now,
    })),
  ]
}
