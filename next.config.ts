import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const remotePatterns: NonNullable<NextConfig['images']>['remotePatterns'] = [
  ...(process.env.NEXT_PUBLIC_SERVER_URL ? [process.env.NEXT_PUBLIC_SERVER_URL] : []),
  process.env.R2_PUBLIC_URL,
]
  .filter((value): value is string => Boolean(value))
  .map((host) => {
    const url = new URL(host)

    return {
      hostname: url.hostname,
      pathname: '/**',
      port: url.port || undefined,
      protocol: url.protocol.replace(':', '') as 'http' | 'https',
    }
  })

const isProduction = process.env.NODE_ENV === 'production'

const mediaOrigins = [process.env.R2_PUBLIC_URL, process.env.NEXT_PUBLIC_SERVER_URL]
  .filter((value): value is string => Boolean(value))
  .map((value) => {
    try {
      return new URL(value).origin
    } catch {
      return null
    }
  })
  .filter((value): value is string => Boolean(value))

const contentSecurityPolicy = [
  "default-src 'self'",
  `img-src 'self' data: blob: ${mediaOrigins.join(' ')}`.trim(),
  `media-src 'self' ${mediaOrigins.join(' ')}`.trim(),
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  `script-src 'self' 'unsafe-inline'${isProduction ? '' : " 'unsafe-eval'"}`,
  `connect-src 'self' ${mediaOrigins.join(' ')}${isProduction ? '' : ' ws: http: https:'}`.trim(),
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join('; ')

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
      {
        pathname: '/brand/**',
      },
    ],
    remotePatterns,
  },
  async headers() {
    const common = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      ...(isProduction
        ? [
            {
              key: 'Strict-Transport-Security',
              value: 'max-age=63072000; includeSubDomains; preload',
            },
          ]
        : []),
    ]

    return [
      {
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow, noarchive, nosnippet, noimageindex',
          },
        ],
        source: '/:path*',
      },
      {
        headers: [
          ...common,
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Content-Security-Policy', value: contentSecurityPolicy },
        ],
        source: '/((?!admin|api).*)',
      },
      {
        headers: [...common, { key: 'X-Frame-Options', value: 'DENY' }],
        source: '/(admin|api)/:path*',
      },
    ]
  },
  async redirects() {
    // Service detail pages live under /services. The live site serves them at
    // the root, so keep those URLs working with permanent redirects.
    const serviceSlugs = [
      'award-ceremonies',
      'conference-and-seminars',
      'exhibition-and-product-launches',
      'celebrity-meet-and-greets',
      'live-music',
      'festivals',
      'sporting-events',
      'christmas',
      'bonfire',
      'remembrance',
      'charity',
      'architectural-illuminations',
      'power-distribution',
    ]

    return [
      { destination: '/about-us', permanent: true, source: '/about' },
      { destination: '/about-us', permanent: true, source: '/about/' },
      { destination: '/contact-us', permanent: true, source: '/contact' },
      { destination: '/contact-us', permanent: true, source: '/contact/' },
      ...serviceSlugs.flatMap((slug) => [
        { destination: `/services/${slug}`, permanent: true, source: `/${slug}` },
        { destination: `/services/${slug}`, permanent: true, source: `/${slug}/` },
      ]),
      // The live site spells it “rememberance”; ours is “remembrance”.
      { destination: '/services/remembrance', permanent: true, source: '/rememberance' },
      { destination: '/services/remembrance', permanent: true, source: '/rememberance/' },
      { destination: '/#testimonials', permanent: true, source: '/testimonials' },
      { destination: '/#testimonials', permanent: true, source: '/testimonials/' },
    ]
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
