import type { Metadata } from 'next'
import Link from 'next/link'

import { CtaPanel } from '@/components/ui/CtaPanel'
import { HomeDisciplineCard } from '@/components/ui/DisciplineCard'
import { HowWeWork } from '@/components/ui/HowWeWork'
import { ArrowRightIcon, PlayIcon } from '@/components/ui/Icons'
import { MarqueeEventTypes } from '@/components/ui/MarqueeEventTypes'
import { PageHero } from '@/components/ui/PageHero'
import { ParallaxImage } from '@/components/ui/ParallaxImage'
import { RingMark } from '@/components/ui/Ring'
import { ScrollIn } from '@/components/ui/ScrollIn'
import { StickyTicket } from '@/components/ui/StickyTicket'
import { TestimonialsPanel } from '@/components/ui/TestimonialsPanel'
import { getSiteChrome, itemsFrom } from '@/lib/content'
import { imageProps } from '@/lib/media'
import { getPayloadClient } from '@/lib/payload'

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayloadClient()
  const page = await payload.findGlobal({ slug: 'home-page', depth: 0 })
  // No title here: the home page's title is the site name itself.
  return { description: page.seo?.description || undefined }
}

export default async function HomePage() {
  const payload = await getPayloadClient()
  const { settings, navigation } = await getSiteChrome()
  const headerItems = itemsFrom(navigation, 'header')

  const [home, disciplines, steps, eventTypes, testimonials, clients] = await Promise.all([
    payload.findGlobal({ slug: 'home-page', depth: 2 }),
    payload.find({ collection: 'disciplines', sort: 'order', limit: 10, depth: 2 }),
    payload.find({ collection: 'process-steps', sort: 'order', limit: 10 }),
    payload.find({ collection: 'event-types', sort: 'order', limit: 50 }),
    payload.find({ collection: 'testimonials', sort: 'order', limit: 10 }),
    payload.find({ collection: 'clients', sort: 'order', limit: 20, depth: 1 }),
  ])

  const aboutImage = imageProps(home.aboutTeaser.image, home.aboutTeaser.heading)

  return (
    <>
      <PageHero
        nav={headerItems}
        businessName={settings.businessName || 'Full Circle Event Production'}
        current="/"
        variant="home"
        headline1={home.hero.headline1}
        headline2={home.hero.headline2}
        script={home.hero.script}
        intro={home.hero.intro}
        image={imageProps(home.hero.image, 'Full Circle event production')}
        imagePosition="60% 45%"
        actions={
          <>
            <Link href={home.hero.primary?.href || '/contact-us'} className="fc-btn">
              {home.hero.primary?.label || 'Enquire here'}
              <ArrowRightIcon />
            </Link>
            <Link href={home.hero.secondary?.href || '/gallery'} className="fc-play">
              <span className="fc-play-circle">
                <PlayIcon />
              </span>
              {home.hero.secondary?.label || 'Come backstage'}
            </Link>
          </>
        }
      />

      <StickyTicket data={home.stickyTicket} />

      <div className="mt-7">
        <MarqueeEventTypes items={eventTypes.docs.map((entry) => entry.label)} />
      </div>

      <div className="fc-container">
        <HowWeWork
          steps={steps.docs}
          eyebrow={home.howWeWork.eyebrow}
          heading={home.howWeWork.heading}
          intro={home.howWeWork.intro}
        />

        <section className="pt-[clamp(72px,9vw,120px)]">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="fc-eyebrow">{home.services.eyebrow}</div>
              <h2 className="mt-3">{home.services.heading}</h2>
            </div>
            <p className="m-0 max-w-[460px] text-lg font-light leading-relaxed text-white/75">
              {home.services.intro}
            </p>
          </div>

          <div className="mt-12 grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
            {disciplines.docs.map((discipline, index) => (
              <ScrollIn key={discipline.id} variant="bounce" delay={index * 90} className="h-full">
                <HomeDisciplineCard
                  discipline={discipline}
                  image={imageProps(discipline.image, discipline.title)}
                  index={index}
                />
              </ScrollIn>
            ))}
          </div>
        </section>

        <section className="pt-[clamp(72px,9vw,120px)]">
          <div className="flex flex-wrap items-center gap-[clamp(32px,5vw,64px)]">
            <div className="relative min-w-0 flex-1 basis-[460px]">
              <ParallaxImage
                image={aboutImage}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="relative aspect-[4/3] overflow-hidden rounded-card bg-[#141414]"
              />
              <span className="absolute -bottom-7 -right-7">
                <RingMark size={120} stroke={8} />
              </span>
            </div>

            <div className="min-w-0 flex-1 basis-[420px]">
              <div className="fc-eyebrow">{home.aboutTeaser.eyebrow}</div>
              <h2 className="mt-3">{home.aboutTeaser.heading}</h2>
              <p className="mt-5 text-lg font-light leading-relaxed text-white/80">
                {home.aboutTeaser.body}
              </p>

              <div className="mt-8 grid grid-cols-2 gap-6 border-t border-white/12 pt-7">
                {(settings.stats || []).map((stat, index) => (
                  <div key={stat.label}>
                    <div
                      className={`font-display text-[64px] leading-[0.9] ${
                        index === 0 ? 'text-accent' : 'text-white'
                      }`}
                    >
                      {stat.value}
                    </div>
                    <div className="mt-1.5 text-[15px] text-white/70">{stat.label}</div>
                  </div>
                ))}
              </div>

              <Link href="/about-us" className="fc-link mt-[30px]">
                {home.aboutTeaser.linkLabel}
              </Link>
            </div>
          </div>
        </section>

        <section id="testimonials" className="pt-[clamp(72px,9vw,120px)]">
          <TestimonialsPanel
            eyebrow={home.testimonials.eyebrow}
            heading={home.testimonials.heading}
            testimonials={testimonials.docs.map((entry) => ({
              quote: entry.quote,
              name: entry.name,
            }))}
            clientsEyebrow={home.clients.eyebrow}
            clientsIntro={home.clients.intro}
            clients={clients.docs.map((client) => ({
              name: client.name,
              logo: imageProps(client.logo, client.name),
            }))}
          />
        </section>
      </div>

      <div className="fc-container">
        <CtaPanel data={home.cta} image={imageProps(home.cta.image, home.cta.heading)} />
      </div>
    </>
  )
}
