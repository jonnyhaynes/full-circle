import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { CtaPanel } from '@/components/ui/CtaPanel'
import { ArrowRightIcon } from '@/components/ui/Icons'
import { PageHero } from '@/components/ui/PageHero'
import { getSiteChrome, itemsFrom } from '@/lib/content'
import { lexicalToHtml } from '@/lib/lexical'
import { imageProps } from '@/lib/media'
import { getPayloadClient } from '@/lib/payload'
import type { Service } from '@/payload-types'

async function getService(slug: string): Promise<Service | null> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'services',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })
  return (result.docs[0] as Service) ?? null
}

export async function generateStaticParams() {
  const payload = await getPayloadClient()
  const services = await payload.find({ collection: 'services', limit: 100, depth: 0 })
  return services.docs.map((service) => ({ slug: service.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const service = await getService(slug)
  if (!service) return {}
  // The layout's title template adds the site name.
  return {
    title: service.seo?.title || service.title,
    description: service.seo?.description || service.summary,
  }
}

/** Split a title across the hero's two display lines, as the design expects. */
function splitTitle(title: string): [string, string] {
  const words = title.split(' ')
  if (words.length < 2) return [title, '']
  const half = Math.ceil(words.length / 2)
  return [words.slice(0, half).join(' '), words.slice(half).join(' ')]
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const service = await getService(slug)
  if (!service) notFound()

  const payload = await getPayloadClient()
  const { settings, navigation } = await getSiteChrome()
  const page = await payload.findGlobal({ slug: 'services-page', depth: 2 })

  const [headline1, headline2] = splitTitle(service.title)
  const body = lexicalToHtml(service.body)

  return (
    <>
      <PageHero
        nav={itemsFrom(navigation, 'header')}
        businessName={settings.businessName || 'Full Circle Event Production'}
        current="/services"
        breadcrumb="Services"
        headline1={headline1}
        headline2={headline2}
        script="Part of the full circle"
        intro={service.summary}
        image={imageProps(service.image, service.title)}
        facts={[`${service.group.charAt(0).toUpperCase()}${service.group.slice(1)}`]}
        actions={
          <>
            <Link href="/contact-us" className="fc-btn">
              Enquire here
              <ArrowRightIcon />
            </Link>
            <Link href="/gallery" className="fc-link">
              Come backstage
            </Link>
          </>
        }
      />

      <div className="fc-container">
        {body ? (
          <section className="pt-[clamp(72px,9vw,120px)]">
            <div
              className="max-w-[820px] space-y-5 text-lg font-light leading-relaxed text-white/80 [&_a]:text-accent [&_a]:underline [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-4xl [&_h2]:text-white [&_h3]:mt-8 [&_h3]:font-display [&_h3]:text-3xl [&_h3]:text-white"
              dangerouslySetInnerHTML={{ __html: body }}
            />
          </section>
        ) : null}

        <CtaPanel data={page.cta} image={imageProps(page.cta.image, page.cta.heading)} />
      </div>
    </>
  )
}
