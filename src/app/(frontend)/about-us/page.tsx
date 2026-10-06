import type { Metadata } from 'next'
import { CtaPanel } from '@/components/ui/CtaPanel'
import { PinIcon } from '@/components/ui/Icons'
import { PageHero } from '@/components/ui/PageHero'
import { ParallaxImage } from '@/components/ui/ParallaxImage'
import { RadarMap } from '@/components/ui/RadarMap'
import { RingBullet, RingMark, RingMerge } from '@/components/ui/Ring'
import { ScrollIn } from '@/components/ui/ScrollIn'
import { getSiteChrome, itemsFrom } from '@/lib/content'
import { imageProps } from '@/lib/media'
import { getPayloadClient } from '@/lib/payload'

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayloadClient()
  const page = await payload.findGlobal({ slug: 'about-page', depth: 0 })
  return {
    title: page.seo?.title || 'About Us',
    description: page.seo?.description || undefined,
  }
}

export default async function AboutPage() {
  const payload = await getPayloadClient()
  const { settings, navigation } = await getSiteChrome()
  const about = await payload.findGlobal({ slug: 'about-page', depth: 2 })

  const historyImage = imageProps(about.history.image, about.history.heading)
  const commitmentImage = imageProps(about.commitment.image, about.commitment.heading)

  return (
    <>
      <PageHero
        nav={itemsFrom(navigation, 'header')}
        businessName={settings.businessName || 'Full Circle Event Production'}
        current="/about-us"
        breadcrumb="About us"
        headline1={about.hero.headline1}
        headline2={about.hero.headline2}
        script={about.hero.script}
        intro={about.hero.intro}
        image={imageProps(about.hero.image, 'Full Circle at work')}
        imagePosition="50% 42%"
        facts={about.hero.facts?.map((fact) => fact.text) || []}
      />

      <div className="fc-container">
        {/* What we do */}
        <section className="pt-[clamp(72px,9vw,120px)]">
          <div className="flex flex-wrap gap-[clamp(32px,5vw,80px)]">
            <div className="min-w-0 flex-1 basis-[420px]">
              <div className="fc-eyebrow">{about.whatWeDo.eyebrow}</div>
              <h2 className="mt-3">{about.whatWeDo.heading}</h2>
              <p className="mt-5 max-w-[500px] text-lg font-light leading-relaxed text-white/78">
                {about.whatWeDo.intro}
              </p>
              <div className="mt-8 grid max-w-[520px] grid-cols-2 gap-x-6 gap-y-3">
                {about.whatWeDo.capabilities?.map((capability) => (
                  <div
                    key={capability.text}
                    className="flex items-center gap-3 text-base text-white/90"
                  >
                    <RingBullet />
                    {capability.text}
                  </div>
                ))}
              </div>
            </div>

            <ul className="m-0 min-w-0 flex-1 basis-[520px] list-none border-t border-white/10 p-0">
              {about.whatWeDo.eventTypes?.map((eventType, index) => (
                <ScrollIn
                  as="li"
                  key={eventType.label}
                  variant="rise"
                  delay={index * 60}
                  className="fc-type flex items-baseline justify-between gap-4 border-b border-white/10 py-3.5 font-display text-[clamp(36px,4vw,54px)] leading-none"
                >
                  <span>{eventType.label}</span>
                  <span className="font-body text-[13px] tracking-[2px] text-white/60">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </ScrollIn>
              ))}
            </ul>
          </div>
        </section>

        {/* Our history */}
        <section className="pt-[clamp(72px,9vw,120px)]">
          <div className="flex flex-wrap items-center gap-[clamp(32px,5vw,72px)]">
            <div className="relative min-w-0 flex-1 basis-[460px]">
              <ParallaxImage
                image={historyImage}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="relative aspect-[742/832] max-h-[640px] overflow-hidden rounded-3xl bg-[#141414]"
              />
              <span className="absolute -right-6 top-10">
                <RingMark size={110} stroke={8} />
              </span>
            </div>

            <div className="min-w-0 flex-1 basis-[460px]">
              <div className="fc-eyebrow">{about.history.eyebrow}</div>
              <h2 className="mt-3">{about.history.heading}</h2>

              <div className="mt-7">
                <RingMerge companyOne={about.history.companyOne} companyTwo={about.history.companyTwo} />
              </div>

              <div className="mt-7 space-y-4 text-lg font-light leading-relaxed text-white/80">
                {about.history.paragraphs?.map((paragraph) => (
                  <p key={paragraph.text}>{paragraph.text}</p>
                ))}
              </div>

              <div className="mt-8 grid grid-cols-2 gap-6 border-t border-white/12 pt-6">
                {about.history.stats?.map((stat, index) => (
                  <div key={stat.label}>
                    <div
                      className={`font-display text-[60px] leading-[0.9] ${
                        index === 0 ? 'text-accent' : 'text-white'
                      }`}
                    >
                      {stat.value}
                    </div>
                    <div className="mt-1.5 text-[15px] text-white/70">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Location */}
        <section className="pt-[clamp(72px,9vw,120px)]">
          <div className="flex flex-wrap overflow-hidden rounded-3xl border border-line bg-panel">
            <div className="flex min-w-0 flex-1 basis-[460px] flex-col justify-center px-[clamp(32px,5vw,64px)] py-[clamp(32px,5vw,64px)]">
              <div className="fc-eyebrow">{about.location.eyebrow}</div>
              <h2 className="mt-3 whitespace-pre-line">{about.location.heading}</h2>
              <p className="mt-5 max-w-[480px] text-lg font-light leading-relaxed text-white/80">
                {about.location.body}
              </p>
              {about.location.address ? (
                <div className="mt-7 flex max-w-[480px] items-start gap-3.5 rounded-[14px] border border-line bg-white/[0.04] px-5 py-[18px]">
                  <span className="mt-0.5 shrink-0 text-accent">
                    <PinIcon />
                  </span>
                  <span className="text-base leading-normal">{about.location.address}</span>
                </div>
              ) : null}
            </div>
            <RadarMap
              towns={about.location.towns || []}
              hq={{ latitude: settings.latitude ?? 53.4129, longitude: settings.longitude ?? -1.4037 }}
              label="Full Circle · J34"
            />
          </div>
        </section>

        {/* Commitment */}
        <section className="pt-[clamp(72px,9vw,120px)]">
          <div className="flex flex-wrap items-center gap-[clamp(32px,5vw,72px)]">
            <div className="min-w-0 flex-1 basis-[460px]">
              <div className="fc-eyebrow">{about.commitment.eyebrow}</div>
              <h2 className="mt-3">{about.commitment.heading}</h2>
              <p className="mt-5 max-w-[520px] text-lg font-light leading-relaxed text-white/80">
                {about.commitment.body}
              </p>
              <div className="mt-8 grid gap-3.5 [grid-template-columns:repeat(auto-fit,minmax(150px,1fr))]">
                {about.commitment.pillars?.map((pillar) => (
                  <div key={pillar.title} className="fc-card rounded-[18px] p-[22px]">
                    <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true">
                      <circle
                        cx="15"
                        cy="15"
                        r="11"
                        fill="none"
                        stroke="var(--color-accent)"
                        strokeWidth="4"
                      />
                    </svg>
                    <div className="mt-3.5 font-display text-[30px] leading-none">{pillar.title}</div>
                    <div className="mt-1.5 text-sm leading-normal text-white/65">{pillar.body}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="min-w-0 flex-1 basis-[420px]">
              <ParallaxImage
                image={commitmentImage}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="relative aspect-[742/832] max-h-[620px] overflow-hidden rounded-3xl bg-[#141414]"
              />
            </div>
          </div>
        </section>

        <CtaPanel data={about.cta} image={imageProps(about.cta.image, about.cta.heading)} />
      </div>
    </>
  )
}
