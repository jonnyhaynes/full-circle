/**
 * Media URLs come back absolute (`http://localhost:3000/api/media/file/...`).
 * In development the media is served by this same app, and Next's image
 * optimiser refuses to fetch local IPs (SSRF protection). Returning a
 * root-relative path for same-origin media makes next/image treat it as a
 * local asset instead. Remote media (e.g. R2 in production) is left alone.
 */
function normaliseUrl(url: string): string {
  const server = process.env.NEXT_PUBLIC_SERVER_URL
  if (server && url.startsWith(server)) {
    return url.slice(server.length) || '/'
  }

  try {
    const parsed = new URL(url)
    if (parsed.pathname.startsWith('/api/media/')) {
      return parsed.pathname
    }
  } catch {
    // Not an absolute URL — assume it is already relative.
  }

  return url
}

export function mediaUrl(media: unknown): string | undefined {
  if (!media || typeof media !== 'object') return undefined

  const url = (media as { url?: string }).url
  if (!url) return undefined

  return normaliseUrl(url)
}

/** Resolve a CMS upload field into props for `next/image`, or null when empty. */
export function imageProps(
  media: unknown,
  fallbackAlt = ''
): { src: string; alt: string } | null {
  if (!media || typeof media !== 'object') return null
  const src = mediaUrl(media)
  if (!src) return null
  const alt = (media as { alt?: string }).alt
  return { src, alt: alt || fallbackAlt }
}

/**
 * A social card image: the 1200×630 `og` crop rather than the full-size file,
 * which is far heavier than a share card needs. Falls back to the original if
 * the size was not generated.
 */
export function socialImage(
  media: unknown,
  fallbackAlt = ''
): { src: string; alt: string } | null {
  if (!media || typeof media !== 'object') return null

  const sizes = (media as { sizes?: Record<string, { url?: string } | undefined> }).sizes
  const url = sizes?.og?.url ?? (media as { url?: string }).url
  if (!url) return null

  const alt = (media as { alt?: string }).alt
  return { src: normaliseUrl(url), alt: alt || fallbackAlt }
}
