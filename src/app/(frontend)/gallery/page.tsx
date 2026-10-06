import type { Metadata } from 'next'
import { CtaPanel } from '@/components/ui/CtaPanel'
import { GalleryGrid } from '@/components/ui/GalleryGrid'
import { PageHero } from '@/components/ui/PageHero'
import { getSiteChrome, itemsFrom } from '@/lib/content'
import { imageProps } from '@/lib/media'
import { getPayloadClient } from '@/lib/payload'

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayloadClient()
  const page = await payload.findGlobal({ slug: 'backstage-page', depth: 0 })
  return {
    title: page.seo?.title || 'Backstage',
    description: page.seo?.description || undefined,
  }
}

export default async function BackstagePage() {
  const payload = await getPayloadClient()
  const { settings, navigation } = await getSiteChrome()

  const [page, items] = await Promise.all([
    payload.findGlobal({ slug: 'backstage-page', depth: 2 }),
    payload.find({ collection: 'galleryItems', sort: 'order', limit: 200, depth: 1 }),
  ])

  const entries = items.docs.flatMap((item) => {
    const image = imageProps(item.image, item.caption)
    if (!image) return []
    return [
      {
        id: item.id,
        src: image.src,
        alt: image.alt,
        caption: item.caption,
        category: item.category,
        aspectRatio: item.aspectRatio,
      },
    ]
  })

  return (
    <>
      <PageHero
        nav={itemsFrom(navigation, 'header')}
        businessName={settings.businessName || 'Full Circle Event Production'}
        current="/gallery"
        breadcrumb="Backstage"
        headline1={page.hero.headline1}
        headline2={page.hero.headline2}
        script={page.hero.script}
        intro={page.hero.intro}
        image={imageProps(page.hero.image, 'Backstage at a Full Circle event')}
        imagePosition="50% 40%"
        facts={page.hero.facts?.map((fact) => fact.text) || []}
      />

      <div className="fc-container">
        <section id="gallery" className="pt-[clamp(72px,9vw,120px)]">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="fc-eyebrow">{page.gallery.eyebrow}</div>
              <h2 className="mt-3">{page.gallery.heading}</h2>
            </div>
          </div>

          <div className="mt-4">
            <GalleryGrid items={entries} />
          </div>
        </section>

        <CtaPanel data={page.cta} image={imageProps(page.cta.image, page.cta.heading)} />
      </div>
    </>
  )
}
