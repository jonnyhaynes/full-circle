import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'

import { ChevronRightIcon } from './Icons'
import type { NavItem } from './MobileNav'
import { Ring, RingBullet } from './Ring'
import { SiteHeader } from './SiteHeader'

import { scriptTrace } from '@/lib/scriptTraces'

/** How long the script line takes to write itself, and its start delay. */
const SCRIPT_WRITE_SECONDS = 1.7
const SCRIPT_WRITE_DELAY_SECONDS = 0.6

type HeroImage = { src: string; alt: string } | null

type HeroProps = {
  nav: NavItem[]
  businessName: string
  /** The route of the current page, used to mark the active menu link. */
  current: string
  /** Breadcrumb label; omit on the home page. */
  breadcrumb?: string
  headline1: string
  headline2: string
  script: string
  intro: string
  image: HeroImage
  facts?: string[]
  actions?: ReactNode
  variant?: 'home' | 'page'
  imagePosition?: string
}

const VARIANTS = {
  home: { minHeight: 760, ring: 820, offset: -330, script: 'clamp(64px, 7.4vw, 118px)' },
  page: { minHeight: 620, ring: 780, offset: -300, script: 'clamp(60px, 7vw, 112px)' },
} as const

/** The page hero banner: photo, scrim, the signature ring, stage beams and the menu. */
export function PageHero({
  nav,
  businessName,
  current,
  breadcrumb,
  headline1,
  headline2,
  script,
  intro,
  image,
  facts,
  actions,
  variant = 'page',
  imagePosition = '50% 45%',
}: HeroProps) {
  const config = VARIANTS[variant]
  const isHome = variant === 'home'
  const trace = scriptTrace(script)

  // One entry per pen stroke: its own duration (proportional to its length, so
  // the pen moves at a constant speed) and a delay covering everything drawn
  // before it, which is what makes the line write left to right.
  const scriptStrokes = trace?.strokes ?? []
  const scriptTotal = trace?.totalLength || 1
  const penStrokes = scriptStrokes.map((stroke, index) => {
    const drawnBefore = scriptStrokes
      .slice(0, index)
      .reduce((sum, previous) => sum + previous.length, 0)
    return {
      ...stroke,
      duration: (stroke.length / scriptTotal) * SCRIPT_WRITE_SECONDS,
      delay: SCRIPT_WRITE_DELAY_SECONDS + (drawnBefore / scriptTotal) * SCRIPT_WRITE_SECONDS,
    }
  })

  return (
    <div className="px-4 pt-5">
      <section className="fc-hero" style={{ minHeight: config.minHeight }}>
        <div aria-hidden="true" className="absolute inset-0">
          {image ? (
            <Image
              src={image.src}
              alt=""
              fill
              priority
              sizes="(max-width: 1360px) 100vw, 1360px"
              className="fc-hero-photo"
              style={{ objectPosition: imagePosition }}
            />
          ) : null}
          <div className="fc-hero-scrim" />
          <div className="fc-hero-vignette" />
        </div>

        <Ring
          className="top-1/2"
          style={{
            width: config.ring,
            height: config.ring,
            right: config.offset,
            marginTop: config.offset - 30,
          }}
        />

        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="fc-beam-1" />
          <div className="fc-beam-2" />
        </div>

        <SiteHeader items={nav} businessName={businessName} current={current} />

        <div
          className={`relative mt-[clamp(64px,8vw,110px)] max-w-[760px] ${isHome ? 'fc-hero-copy' : ''}`}
          style={{ animation: 'fc-rise 1s ease both' }}
        >
          {breadcrumb ? (
            <div className="flex items-center gap-[10px] text-sm tracking-[2px] text-white/60">
              <Link href="/" className="text-white/60 hover:text-accent">
                HOME
              </Link>
              <ChevronRightIcon />
              <span className="text-accent">{breadcrumb.toUpperCase()}</span>
            </div>
          ) : null}

          <h1
            className={`fc-hero-title ${isHome ? 'fc-hero-title--home' : ''} text-white ${
              breadcrumb ? 'mt-[22px]' : 'm-0'
            }`}
          >
            <span>{headline1}</span>
            <span>{headline2}</span>
          </h1>

          {trace ? (
            // The traced line, drawn on stroke by stroke (see `.fc-script-path`).
            // Sized from the same font size, and inside a box of the same height
            // as the text, so it lands exactly where the lettering did.
            <svg
              aria-hidden="true"
              viewBox={trace.viewBox}
              className="fc-script ml-[clamp(8px,6vw,96px)] -mt-[clamp(24px,3.4vw,46px)] block"
              style={{
                width: `calc(${config.script} * ${trace.widthRatio})`,
                height: `calc(${config.script} * ${trace.heightRatio})`,
                transformOrigin: 'left center',
                // The offsets are the ink's bleed outside the text box, so the
                // line lands exactly where the lettering did.
                transform: `translate(calc(${config.script} * ${trace.offsetLeftRatio}), calc(${config.script} * ${trace.offsetTopRatio})) rotate(-5deg)`,
              }}
            >
              {penStrokes.map((stroke, index) => (
                <path
                  key={index}
                  className="fc-script-path"
                  d={stroke.d}
                  pathLength={1}
                  style={{
                    animationDuration: `${stroke.duration.toFixed(3)}s`,
                    animationDelay: `${stroke.delay.toFixed(3)}s`,
                  }}
                  fill="none"
                  stroke="var(--color-accent)"
                  strokeWidth={trace.strokeWidth}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ))}
            </svg>
          ) : (
            <p
              aria-hidden="true"
              className="fc-script ml-[clamp(8px,6vw,96px)] -mt-[clamp(24px,3.4vw,46px)]"
              style={{
                fontSize: config.script,
                transformOrigin: 'left center',
                transform: 'rotate(-5deg)',
                animation: 'fc-fadein 1.2s .6s ease both',
              }}
            >
              {script}
            </p>
          )}

          <p className="mt-[18px] max-w-[560px] text-[19px] font-light leading-relaxed text-white/85">
            {intro}
          </p>

          {facts && facts.length > 0 ? (
            <div className="mt-[30px] flex flex-wrap gap-x-8 gap-y-[14px] text-[15px] tracking-[1px] text-white/85">
              {facts.map((fact) => (
                <span key={fact} className="inline-flex items-center gap-[10px]">
                  <RingBullet />
                  {fact}
                </span>
              ))}
            </div>
          ) : null}

          {actions ? (
            <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-5">{actions}</div>
          ) : null}
        </div>
      </section>
    </div>
  )
}
