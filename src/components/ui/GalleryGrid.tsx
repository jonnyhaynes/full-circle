'use client'

import Image from 'next/image'
import { useCallback, useState } from 'react'

import { PlusIcon } from './Icons'
import { Lightbox, type LightboxItem } from './Lightbox'
import { ScrollIn } from './ScrollIn'

export type GalleryEntry = {
  id: number | string
  src: string
  alt: string
  caption: string
  category: string
  aspectRatio: string
}

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'awards', label: 'Awards & Corporate' },
  { value: 'live', label: 'Live & Festivals' },
  { value: 'community', label: 'Community' },
  { value: 'crew', label: 'Behind the Scenes' },
]

const CATEGORY_LABELS: Record<string, string> = {
  awards: 'AWARDS & CORPORATE',
  live: 'LIVE & FESTIVALS',
  community: 'COMMUNITY',
  crew: 'BEHIND THE SCENES',
}

/** The Backstage masonry gallery with filters and a keyboard-accessible lightbox. */
export function GalleryGrid({ items }: { items: GalleryEntry[] }) {
  const [filter, setFilter] = useState('all')
  const [open, setOpen] = useState<number | null>(null)

  const shown = items.filter((item) => filter === 'all' || item.category === filter)
  const isOpen = open !== null && open >= 0 && open < shown.length

  const close = useCallback(() => setOpen(null), [])
  const prev = useCallback(
    () =>
      setOpen((current) => (current === null ? null : (current + shown.length - 1) % shown.length)),
    [shown.length]
  )
  const next = useCallback(
    () => setOpen((current) => (current === null ? null : (current + 1) % shown.length)),
    [shown.length]
  )

  const lightboxItems: LightboxItem[] = shown.map((item) => ({
    id: item.id,
    src: item.src,
    alt: item.alt,
    caption: item.caption,
    groupLabel: CATEGORY_LABELS[item.category] ?? item.category.toUpperCase(),
  }))

  return (
    <>
      <div role="tablist" aria-label="Filter photos" className="flex flex-wrap gap-x-[26px] gap-y-1">
        {FILTERS.map((entry) => {
          const count =
            entry.value === 'all'
              ? items.length
              : items.filter((item) => item.category === entry.value).length
          return (
            <button
              key={entry.value}
              type="button"
              role="tab"
              aria-selected={filter === entry.value}
              onClick={() => {
                setFilter(entry.value)
                setOpen(null)
              }}
              className="fc-filter"
            >
              {entry.label} <span className="fc-filter-count">{count}</span>
            </button>
          )
        })}
      </div>

      <div key={filter} className="fc-masonry mt-10">
        {shown.map((item, index) => (
          <ScrollIn key={item.id} variant="rise" delay={Math.min(index, 12) * 40}>
            <button
              type="button"
              onClick={() => setOpen(index)}
              aria-label={`View photo: ${item.caption}`}
              className="fc-tile"
            >
            <span className="relative block w-full" style={{ aspectRatio: item.aspectRatio }}>
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 768px) 100vw, 300px"
                className="object-cover"
              />
            </span>
            <span
              className="fc-tile-cap absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 px-[18px] pb-4 pt-10"
              style={{ background: 'linear-gradient(to top, rgba(5,5,5,0.92), rgba(5,5,5,0))' }}
            >
              <span className="text-left">
                <span className="block text-[11px] tracking-[2px] text-accent">
                  {CATEGORY_LABELS[item.category] ?? item.category.toUpperCase()}
                </span>
                <span className="mt-1 block font-display text-[26px] leading-none text-white">
                  {item.caption}
                </span>
              </span>
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full border-[3px] border-accent text-white">
                <PlusIcon />
              </span>
            </span>
            </button>
          </ScrollIn>
        ))}
      </div>

      {isOpen ? (
        <Lightbox items={lightboxItems} index={open} onClose={close} onPrev={prev} onNext={next} />
      ) : null}
    </>
  )
}
