import Link from 'next/link'

import { Logo } from './Logo'
import { MobileNav, type NavItem } from './MobileNav'

/**
 * Sits inside the hero panel (not fixed to the viewport): the page's menu is
 * part of the banner, as in the approved design. The current page's link is
 * green with a 2px green underline.
 */
export function SiteHeader({
  items,
  businessName,
  current,
}: {
  items: NavItem[]
  businessName: string
  current?: string
}) {
  return (
    <header className="relative z-20 flex flex-wrap items-center justify-between gap-5">
      <Logo businessName={businessName} />

      <nav
        aria-label="Main"
        className="hidden items-center gap-[clamp(16px,3vw,40px)] text-base font-medium md:flex"
      >
        {items.map((item) => {
          const active = current === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={
                active
                  ? 'border-b-2 border-accent pb-1 text-accent'
                  : 'text-white/85 hover:text-accent'
              }
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="flex items-center gap-3">
        <Link href="/contact-us" className="fc-btn fc-btn-sm hidden sm:inline-flex">
          Get a quote
        </Link>
        <MobileNav items={items} current={current} />
      </div>
    </header>
  )
}
