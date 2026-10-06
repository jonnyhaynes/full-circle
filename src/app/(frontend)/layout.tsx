import type { Metadata, Viewport } from 'next'

import { PrototypeNotice } from '@/components/PrototypeNotice'
import { Footer } from '@/components/ui/Footer'
import { getSiteChrome, itemsFrom } from '@/lib/content'
import { socialImage } from '@/lib/media'

import './globals.css'

const FALLBACK_NAME = 'Full Circle Event Production'
const FALLBACK_DESCRIPTION =
  'Sheffield’s AV hire and event production team. Lighting, sound, staging and technical support for corporate events, festivals, live music, sport and award ceremonies.'

/* Tints the browser UI to the site's dark canvas. */
export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#050505',
}

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSiteChrome()
  const name = settings.businessName || FALLBACK_NAME
  const description = settings.tagline || FALLBACK_DESCRIPTION
  const ogImage = socialImage(settings.ogImage, name)

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'),
    title: { default: name, template: `%s — ${name}` },
    description,
    applicationName: name,
    // Title and description are left off the social blocks on purpose: Next
    // then derives og:/twitter: from each page's own title and description,
    // instead of every page sharing the site's.
    openGraph: {
      type: 'website',
      siteName: name,
      locale: 'en_GB',
      images: ogImage ? [{ url: ogImage.src, alt: ogImage.alt }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      images: ogImage ? [ogImage.src] : undefined,
    },
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
      },
    },
  }
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const { settings, navigation } = await getSiteChrome()
  const footerItems = itemsFrom(navigation, 'footer')

  return (
    <div className="min-h-screen">
      <noscript>
        <style
          dangerouslySetInnerHTML={{
            __html: '[data-reveal]{opacity:1 !important;transform:none !important;}',
          }}
        />
      </noscript>

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-ink"
      >
        Skip to content
      </a>

      <main id="main">{children}</main>

      <div className="fc-container">
        <Footer settings={settings} items={footerItems} />
      </div>

      <PrototypeNotice />
    </div>
  )
}
