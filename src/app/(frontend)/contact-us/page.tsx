import type { Metadata } from 'next'
import { ContactForm } from '@/components/ui/ContactForm'
import {
  FacebookIcon,
  InstagramIcon,
  MailIcon,
  PhoneIcon,
  PinIcon,
  YouTubeIcon,
} from '@/components/ui/Icons'
import { PageHero } from '@/components/ui/PageHero'
import { RadarMap } from '@/components/ui/RadarMap'
import { getSiteChrome, itemsFrom } from '@/lib/content'
import { imageProps } from '@/lib/media'
import { getPayloadClient } from '@/lib/payload'

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayloadClient()
  const page = await payload.findGlobal({ slug: 'contact-page', depth: 0 })
  return {
    title: page.seo?.title || 'Contact Us',
    description: page.seo?.description || undefined,
  }
}

export default async function ContactPage() {
  const payload = await getPayloadClient()
  const { settings, navigation } = await getSiteChrome()

  const [page, eventTypes] = await Promise.all([
    payload.findGlobal({ slug: 'contact-page', depth: 2 }),
    payload.find({ collection: 'event-types', sort: 'order', limit: 50 }),
  ])

  const addressLine = [settings.address?.street, settings.address?.town, settings.address?.postcode]
    .filter(Boolean)
    .join(', ')

  return (
    <>
      <PageHero
        nav={itemsFrom(navigation, 'header')}
        businessName={settings.businessName || 'Full Circle Event Production'}
        current="/contact-us"
        breadcrumb="Contact us"
        headline1={page.hero.headline1}
        headline2={page.hero.headline2}
        script={page.hero.script}
        intro={page.hero.intro}
        image={imageProps(page.hero.image, 'Full Circle at an evening event')}
        imagePosition="50% 55%"
        facts={page.hero.facts?.map((fact) => fact.text) || []}
      />

      <div className="fc-container">
        <section id="enquiry" className="pt-[clamp(56px,7vw,96px)]">
          <div className="flex flex-wrap items-stretch gap-6">
            <div
              className="min-w-0 flex-1 basis-[600px] rounded-3xl border border-line px-[clamp(28px,4.5vw,56px)] py-[clamp(28px,4.5vw,56px)]"
              style={{
                background:
                  'radial-gradient(ellipse 60% 70% at 0% 0%, var(--color-accent-16), rgba(0,0,0,0) 70%), var(--color-panel)',
              }}
            >
              <ContactForm
                eventTypes={eventTypes.docs.map((entry) => entry.label)}
                labels={{
                  eyebrow: page.form.eyebrow,
                  heading: page.form.heading,
                  replyNote: page.form.replyNote,
                  consentLabel: page.form.consentLabel,
                  errorMessage: page.form.errorMessage,
                }}
              />
            </div>

            <div className="flex min-w-0 flex-1 basis-[340px] flex-col gap-[18px]">
              <div className="rounded-3xl px-[22px] pb-[22px] pt-5 text-ink" style={{ background: 'var(--color-accent)' }}>
                <div
                  className="relative mx-1.5 mt-1 rounded-md bg-ticket px-4 pb-3.5 pt-4"
                  style={{
                    transform: 'rotate(-4deg)',
                    boxShadow: '0 14px 26px -12px rgba(0,0,0,0.55)',
                    animation: 'fc-float-4 6s ease-in-out infinite',
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-display text-[28px] leading-[0.95]">
                      Full Circle
                      <br />
                      All Access
                    </div>
                    <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true" className="shrink-0">
                      <circle cx="13" cy="13" r="10" fill="none" stroke="#050505" strokeWidth="3.5" />
                    </svg>
                  </div>
                  <div className="mt-3 text-[10px] font-semibold tracking-[1.6px]">
                    AUDIO · VISUAL · INFRASTRUCTURE
                  </div>
                  <div
                    aria-hidden="true"
                    className="mt-2.5 h-5 opacity-[0.85]"
                    style={{
                      background:
                        'repeating-linear-gradient(90deg, #050505 0 2px, transparent 2px 4px, #050505 4px 5px, transparent 5px 8px)',
                    }}
                  />
                </div>
                <div className="mt-5 text-[15px] font-medium leading-tight">{page.info.ticketLine}</div>
                <div className="mt-1 font-display text-[34px] leading-none">{page.info.ticketHeading}</div>
              </div>

              <div className="rounded-3xl border border-line bg-card px-[22px] py-2">
                {settings.email ? (
                  <a
                    href={`mailto:${settings.email}`}
                    className="fc-row flex items-center gap-4 border-b border-line py-[18px]"
                  >
                    <span className="fc-row-ring flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-[3px] border-accent text-white">
                      <MailIcon />
                    </span>
                    <span>
                      <span className="block text-xs tracking-[2px] text-white/55">EMAIL</span>
                      <span className="mt-0.5 block text-[17px]">{settings.email}</span>
                    </span>
                  </a>
                ) : null}
                {settings.phone ? (
                  <a
                    href={`tel:${settings.phone.replace(/\s/g, '')}`}
                    className="fc-row flex items-center gap-4 border-b border-line py-[18px]"
                  >
                    <span className="fc-row-ring flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-[3px] border-accent text-white">
                      <PhoneIcon />
                    </span>
                    <span>
                      <span className="block text-xs tracking-[2px] text-white/55">PHONE</span>
                      <span className="mt-0.5 block text-[17px]">{settings.phone}</span>
                    </span>
                  </a>
                ) : null}
                {addressLine ? (
                  <a
                    href={settings.mapsUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fc-row flex items-center gap-4 py-[18px]"
                  >
                    <span className="fc-row-ring flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-[3px] border-accent text-white">
                      <PinIcon />
                    </span>
                    <span>
                      <span className="block text-xs tracking-[2px] text-white/55">
                        FIND US · GET DIRECTIONS
                      </span>
                      <span className="mt-0.5 block text-base leading-normal">{addressLine}</span>
                    </span>
                  </a>
                ) : null}
              </div>

              <div className="rounded-3xl border border-line bg-card p-[22px]">
                <div className="text-xs tracking-[2px] text-white/55">
                  {page.info.socialsLabel?.toUpperCase()}
                </div>
                <div className="mt-3.5 flex gap-3">
                  {settings.socials?.instagram ? (
                    <a
                      className="fc-social"
                      href={settings.socials.instagram}
                      aria-label="Instagram"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <InstagramIcon />
                    </a>
                  ) : null}
                  {settings.socials?.facebook ? (
                    <a
                      className="fc-social"
                      href={settings.socials.facebook}
                      aria-label="Facebook"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FacebookIcon />
                    </a>
                  ) : null}
                  {settings.socials?.youtube ? (
                    <a
                      className="fc-social"
                      href={settings.socials.youtube}
                      aria-label="YouTube"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <YouTubeIcon />
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="pt-[clamp(56px,7vw,96px)]">
          <div className="relative flex min-h-[380px] flex-wrap items-center overflow-hidden rounded-3xl border border-line">
            <div className="relative z-10 min-w-0 flex-1 basis-[420px] px-[clamp(32px,5vw,64px)] py-[clamp(32px,5vw,64px)]">
              <div className="fc-eyebrow">{page.location.eyebrow}</div>
              <h2 className="mt-3">{page.location.heading}</h2>
              <p className="mt-4.5 max-w-[440px] text-[17px] font-light leading-relaxed text-white/78">
                {page.location.body}
              </p>
            </div>
            <RadarMap
              towns={page.location.towns || []}
              hq={{ latitude: settings.latitude ?? 53.4129, longitude: settings.longitude ?? -1.4037 }}
              label="Full Circle HQ"
            />
          </div>
        </section>
      </div>
    </>
  )
}
