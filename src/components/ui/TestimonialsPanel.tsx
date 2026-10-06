'use client'

import Image from 'next/image'
import { useState } from 'react'

import { ArrowLeftIcon, ArrowRightIcon } from './Icons'

type Testimonial = { quote: string; name: string }
type Client = { name: string; logo: { src: string; alt: string } | null }

/**
 * The split panel: a quote slider on the left (previous/next, progress-bar tabs,
 * a fade between quotes — never auto-advancing) and the "trusted by" logo grid
 * on the right.
 */
export function TestimonialsPanel({
  eyebrow,
  heading,
  testimonials,
  clientsEyebrow,
  clientsIntro,
  clients,
}: {
  eyebrow: string
  heading: string
  testimonials: Testimonial[]
  clientsEyebrow: string
  clientsIntro: string
  clients: Client[]
}) {
  const [index, setIndex] = useState(0)

  if (testimonials.length === 0) return null
  const quote = testimonials[index]

  return (
    <div className="flex flex-wrap overflow-hidden rounded-3xl border border-line bg-panel">
      <div
        className="min-w-0 flex-1 basis-[560px] px-[clamp(32px,5vw,64px)] py-[clamp(32px,5vw,64px)]"
        style={{
          background:
            'radial-gradient(ellipse 60% 80% at 0% 0%, var(--color-accent-16), rgba(0,0,0,0) 70%)',
        }}
      >
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <div className="fc-eyebrow">{eyebrow}</div>
            <h2 className="mt-3">{heading}</h2>
          </div>
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={() => setIndex((index + testimonials.length - 1) % testimonials.length)}
              aria-label="Previous testimonial"
              className="flex h-[52px] w-[52px] items-center justify-center rounded-full border border-white/30 text-white"
            >
              <ArrowLeftIcon />
            </button>
            <button
              type="button"
              onClick={() => setIndex((index + 1) % testimonials.length)}
              aria-label="Next testimonial"
              className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-accent text-accent-ink"
            >
              <ArrowRightIcon size={20} />
            </button>
          </div>
        </div>

        <figure className="mt-10 min-h-[210px]">
          <svg width="56" height="56" viewBox="0 0 64 64" aria-hidden="true">
            <circle cx="32" cy="32" r="27" fill="none" stroke="var(--color-accent)" strokeWidth="6" />
            <text x="32" y="47" textAnchor="middle" className="font-display" fontSize="44" fill="#fff">
              &ldquo;
            </text>
          </svg>
          <div key={index} style={{ animation: 'fc-fade .6s ease both' }}>
            <blockquote className="mt-[18px] text-[clamp(21px,2.1vw,28px)] font-light leading-[1.45] text-white">
              {quote.quote}
            </blockquote>
            <figcaption className="mt-5 font-display text-[28px] tracking-[1px] text-accent">
              {quote.name}
            </figcaption>
          </div>
        </figure>

        <div role="tablist" aria-label="Choose testimonial" className="mt-7 flex gap-2">
          {testimonials.map((entry, position) => {
            const active = position === index
            return (
              <button
                key={entry.name}
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={entry.name}
                onClick={() => setIndex(position)}
                className="flex h-11 items-center p-0 transition-[width] duration-300"
                style={{ width: active ? 72 : 32 }}
              >
                <span
                  className="block h-1 w-full rounded-sm"
                  style={{ background: active ? 'var(--color-accent)' : 'rgba(255,255,255,0.25)' }}
                />
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex min-w-0 flex-1 basis-[380px] flex-col border-l border-line bg-card px-[clamp(32px,5vw,64px)] py-[clamp(32px,5vw,64px)]">
        <div className="fc-eyebrow">{clientsEyebrow}</div>
        <p className="mt-3 max-w-[380px] text-[17px] leading-snug text-white/70">{clientsIntro}</p>
        <div className="mt-7 grid flex-1 grid-cols-2 gap-3">
          {clients.map((client) => (
            <div
              key={client.name}
              className="flex min-h-[104px] items-center justify-center rounded-[14px] border border-line bg-white/[0.02] px-5 py-[18px]"
            >
              {client.logo ? (
                <Image
                  src={client.logo.src}
                  alt={client.logo.alt || client.name}
                  width={220}
                  height={80}
                  className="max-h-[70px] w-auto max-w-full object-contain"
                />
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
