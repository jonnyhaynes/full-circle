import Link from 'next/link'

import { MailIcon, PhoneIcon, PinIcon } from './Icons'
import { Logo } from './Logo'
import type { NavItem } from './MobileNav'
import { YorkshireRose } from './YorkshireRose'

type FooterSettings = {
  businessName?: string | null
  legalName?: string | null
  tagline?: string | null
  email?: string | null
  phone?: string | null
  mapsUrl?: string | null
  address?: {
    street?: string | null
    town?: string | null
    county?: string | null
    postcode?: string | null
  } | null
}

/** The site footer: logo + tagline, the menu, and the contact details. */
export function Footer({ settings, items }: { settings: FooterSettings; items: NavItem[] }) {
  const addressLines = [
    settings.address?.street,
    settings.address?.town,
    settings.address?.county,
    settings.address?.postcode,
  ].filter((line): line is string => Boolean(line))

  const addressContents = addressLines.length ? (
    <>
      <PinIcon size={18} className="mt-0.5 shrink-0 text-accent" />
      <span className="whitespace-pre-line leading-normal">{addressLines.join('\n')}</span>
    </>
  ) : null

  return (
    <footer className="border-t border-line pb-10 pt-16">
      <div className="flex flex-wrap justify-between gap-9">
        <div className="flex max-w-[360px] flex-col gap-[18px]">
          <Logo businessName={settings.businessName || 'Full Circle Event Production'} size="footer" />
          <span className="text-[15px] leading-relaxed text-white/65">{settings.tagline}</span>
        </div>

        <nav aria-label="Footer" className="flex flex-col gap-[10px] text-[15px]">
          {items.map((item) => (
            <Link key={item.href} href={item.href} className="text-white/75 hover:text-accent">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-[14px] text-[15px] text-white/75">
          <span className="text-[13px] font-semibold tracking-[2px] text-accent">CONTACT</span>

          {settings.email ? (
            <a
              href={`mailto:${settings.email}`}
              className="flex items-center gap-3 text-white/75 hover:text-accent"
            >
              <MailIcon size={16} className="shrink-0 text-accent" />
              {settings.email}
            </a>
          ) : null}

          {settings.phone ? (
            <a
              href={`tel:${settings.phone.replace(/\s/g, '')}`}
              className="flex items-center gap-3 text-white/75 hover:text-accent"
            >
              <PhoneIcon size={16} className="shrink-0 text-accent" />
              {settings.phone}
            </a>
          ) : null}

          {addressContents ? (
            settings.mapsUrl ? (
              <a
                href={settings.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 text-white/75 hover:text-accent"
              >
                {addressContents}
              </a>
            ) : (
              <span className="flex items-start gap-3">{addressContents}</span>
            )
          ) : null}
        </div>
      </div>

      <div className="mt-12 flex flex-col gap-1 text-xs text-white/60">
        <p className="m-0">
          © {new Date().getFullYear()}{' '}
          {settings.legalName || settings.businessName || 'Full Circle Event Production'}. All rights
          reserved.
        </p>
        <p className="m-0">
          Forged in Yorkshire
          <YorkshireRose />
          by{' '}
          <a
            href="https://www.colouringcode.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-white/20 underline-offset-4 transition-colors hover:text-accent"
          >
            Colouring Code
          </a>
        </p>
      </div>
    </footer>
  )
}
