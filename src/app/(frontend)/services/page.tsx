import type { Metadata } from 'next'
import { CtaPanel } from '@/components/ui/CtaPanel'
import { DisciplineCard } from '@/components/ui/DisciplineCard'
import { PageHero } from '@/components/ui/PageHero'
import { ServiceExplorer } from '@/components/ui/ServiceExplorer'
import { getSiteChrome, itemsFrom } from '@/lib/content'
import { imageProps } from '@/lib/media'
import { getPayloadClient } from '@/lib/payload'

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayloadClient()
  const page = await payload.findGlobal({ slug: 'services-page', depth: 0 })
  return {
    title: page.seo?.title || 'Services',
    description: page.seo?.description || undefined,
  }
}

export default async function ServicesPage() {
  const payload = await getPayloadClient()
  const { settings, navigation } = await getSiteChrome()

  const [page, disciplines, services] = await Promise.all([
    payload.findGlobal({ slug: 'services-page', depth: 2 }),
    payload.find({ collection: 'disciplines', sort: 'order', limit: 10 }),
    payload.find({ collection: 'services', sort: 'order', limit: 100, depth: 1 }),
  ])

  return (
    <>
      <PageHero
        nav={itemsFrom(navigation, 'header')}
        businessName={settings.businessName || 'Full Circle Event Production'}
        current="/services"
        breadcrumb="Services"
        headline1={page.hero.headline1}
        headline2={page.hero.headline2}
        script={page.hero.script}
        intro={page.hero.intro}
        image={imageProps(page.hero.image, 'Full Circle services')}
        imagePosition="50% 45%"
        facts={page.hero.facts?.map((fact) => fact.text) || []}
      />

      <div className="fc-container">
        <section className="pt-[clamp(72px,9vw,120px)]">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="fc-eyebrow">{page.disciplines.eyebrow}</div>
              <h2 className="mt-3">{page.disciplines.heading}</h2>
            </div>
            <p className="m-0 max-w-[440px] text-lg font-light leading-relaxed text-white/75">
              {page.disciplines.intro}
            </p>
          </div>

          <div className="mt-12 grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
            {disciplines.docs.map((discipline, index) => (
              <DisciplineCard key={discipline.id} discipline={discipline} index={index} />
            ))}
          </div>
        </section>

        <section id="events" className="pt-[clamp(72px,9vw,120px)]">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="fc-eyebrow">{page.events.eyebrow}</div>
              <h2 className="mt-3">{page.events.heading}</h2>
            </div>
          </div>

          <div className="mt-4">
            <ServiceExplorer
              services={services.docs.map((service) => ({
                id: service.id,
                title: service.title,
                group: service.group,
                summary: service.summary,
                image: imageProps(service.image, service.title),
                href: `/services/${service.slug}`,
              }))}
            />
          </div>
        </section>

        <CtaPanel data={page.cta} image={imageProps(page.cta.image, page.cta.heading)} />
      </div>
    </>
  )
}
