'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import { ArrowRightIcon } from './Icons'
import { ScrollIn } from './ScrollIn'

export type ExplorerService = {
  id: number | string
  title: string
  group: string
  summary: string
  image: { src: string; alt: string } | null
  href: string
}

const GROUPS = [
  { value: 'all', label: 'All' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'community', label: 'Community' },
  { value: 'technical', label: 'Technical' },
]

const GROUP_LABELS: Record<string, string> = {
  corporate: 'CORPORATE',
  entertainment: 'ENTERTAINMENT',
  community: 'COMMUNITY',
  technical: 'TECHNICAL',
}

/** The filterable grid of all services on the Services page. */
export function ServiceExplorer({ services }: { services: ExplorerService[] }) {
  const [filter, setFilter] = useState('all')

  const shown = services.filter((service) => filter === 'all' || service.group === filter)

  return (
    <>
      <div
        role="tablist"
        aria-label="Filter services"
        className="flex flex-wrap gap-x-[26px] gap-y-1"
      >
        {GROUPS.map((group) => {
          const count =
            group.value === 'all'
              ? services.length
              : services.filter((service) => service.group === group.value).length
          return (
            <button
              key={group.value}
              type="button"
              role="tab"
              aria-selected={filter === group.value}
              onClick={() => setFilter(group.value)}
              className="fc-filter"
            >
              {group.label} <span className="fc-filter-count">{count}</span>
            </button>
          )
        })}
      </div>

      <div key={filter} className="mt-10 grid gap-[18px] [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))]">
        {shown.map((service, index) => (
          <ScrollIn key={service.id} variant="rise" delay={index * 50}>
            <article className="fc-svc">
              {service.image ? (
                <Image
                  src={service.image.src}
                  alt={service.image.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 300px"
                  className="object-cover"
                />
              ) : null}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to top, rgba(5,5,5,0.95) 0%, rgba(5,5,5,0.35) 45%, rgba(5,5,5,0) 70%)',
                }}
              />
              <span
                aria-hidden="true"
                className="fc-svc-ring absolute left-4 top-4 h-[18px] w-[18px] rounded-full border-[3px] border-accent"
              />
              <span className="absolute right-[18px] top-4 text-xs tracking-[2px] text-white/70">
                {GROUP_LABELS[service.group] ?? service.group.toUpperCase()}
              </span>
              <div className="absolute inset-x-0 bottom-0 p-[22px]">
                <h3 className="m-0 font-display text-[36px] leading-[0.95]">{service.title}</h3>
                <div className="fc-svc-body">
                  <p className="mt-2.5 text-[14.5px] leading-snug text-white/85">{service.summary}</p>
                  <Link
                    href={service.href}
                    className="fc-link mt-3 !min-h-9 gap-2 !text-[13px] !font-semibold !tracking-[1.5px]"
                  >
                    Find out more
                    <ArrowRightIcon size={14} />
                  </Link>
                </div>
              </div>
            </article>
          </ScrollIn>
        ))}
      </div>
    </>
  )
}
