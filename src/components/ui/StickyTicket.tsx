'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import { ArrowRightIcon, CloseIcon, TicketIcon } from './Icons'

type TicketData = {
  title?: string | null
  strap?: string | null
  line?: string | null
  cta?: { label?: string | null; href?: string | null } | null
}

/**
 * The "All Access" ticket on the home page. Starts open on desktop and
 * minimised as a round button on phones; the X dismisses it permanently via
 * localStorage. It enters with a small pop.
 */
export function StickyTicket({ data }: { data: TicketData }) {
  const [state, setState] = useState<'open' | 'mini' | 'gone'>('open')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let dismissed = false
    let phone = false
    try {
      dismissed = window.localStorage.getItem('fc-ticket-dismissed') === '1'
    } catch {
      // ignore
    }
    try {
      phone = window.matchMedia('(max-width: 640px)').matches
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of persisted state
    setState(dismissed ? 'gone' : phone ? 'mini' : 'open')
    setReady(true)
  }, [])

  const dismiss = () => {
    try {
      window.localStorage.setItem('fc-ticket-dismissed', '1')
    } catch {
      // ignore
    }
    setState('gone')
  }

  if (!ready || state === 'gone') return null

  const href = data.cta?.href || '/contact-us'
  const label = data.cta?.label || 'Get in touch'

  return (
    <div className="fixed bottom-[clamp(12px,2vw,28px)] right-[clamp(12px,2vw,28px)] z-40">
      {state === 'open' ? (
        <div
          role="region"
          aria-label="Get a quote"
          className="relative w-[252px] rounded-[22px] px-[18px] pb-[18px] pt-4 text-ink"
          style={{
            background: 'var(--color-accent)',
            boxShadow: '0 30px 60px -18px rgba(0,0,0,0.85), 0 0 0 1px rgba(0,0,0,0.2)',
            transformOrigin: 'bottom right',
            animation: 'fc-ticketin .5s cubic-bezier(.2,.9,.3,1.2) both',
          }}
        >
          <button
            type="button"
            onClick={dismiss}
            aria-label="Close and don’t show again"
            className="absolute -right-2.5 -top-3.5 z-[2] flex h-10 w-10 items-center justify-center rounded-full border-2 border-accent bg-canvas text-white"
          >
            <CloseIcon />
          </button>

          <div
            className="relative mx-1 mt-0.5 rounded-md bg-ticket px-3.5 pb-3 pt-3.5"
            style={{
              transform: 'rotate(-5deg)',
              boxShadow: '0 14px 26px -12px rgba(0,0,0,0.55)',
              animation: 'fc-float 6s 1s ease-in-out infinite',
            }}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="font-display text-[26px] leading-[0.95]">{data.title}</div>
              <svg width="24" height="24" viewBox="0 0 26 26" aria-hidden="true" className="shrink-0">
                <circle cx="13" cy="13" r="10" fill="none" stroke="#050505" strokeWidth="3.5" />
              </svg>
            </div>
            <div className="mt-2.5 text-[9.5px] font-semibold tracking-[1.5px]">{data.strap}</div>
            <div
              aria-hidden="true"
              className="mt-2 h-[18px] opacity-[0.85]"
              style={{
                background:
                  'repeating-linear-gradient(90deg, #050505 0 2px, transparent 2px 4px, #050505 4px 5px, transparent 5px 8px)',
              }}
            />
            <span
              aria-hidden="true"
              className="absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full"
              style={{ background: 'var(--color-accent)' }}
            />
            <span
              aria-hidden="true"
              className="absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full"
              style={{ background: 'var(--color-accent)' }}
            />
          </div>

          <Link href={href} className="mt-4 flex items-end justify-between gap-2.5 text-ink">
            <span>
              <span className="block text-sm font-medium leading-tight">{data.line}</span>
              <span className="mt-[3px] block font-display text-[30px] leading-none">{label}</span>
            </span>
            <span className="flex h-[46px] w-[46px] flex-none items-center justify-center rounded-full bg-canvas text-white">
              <ArrowRightIcon size={16} />
            </span>
          </Link>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setState('open')}
          aria-label="Open All Access: get a quote"
          className="relative flex h-[68px] w-[68px] items-center justify-center rounded-full text-ink"
          style={{
            background: 'var(--color-accent)',
            boxShadow: '0 16px 40px -10px rgba(0,0,0,0.8)',
            animation: 'fc-ticketin .45s cubic-bezier(.2,.9,.3,1.2) both',
          }}
        >
          <span
            aria-hidden="true"
            className="absolute -inset-1.5 rounded-full border-2 border-accent"
            style={{ animation: 'fc-tping 2.4s ease-out infinite' }}
          />
          <TicketIcon size={30} />
        </button>
      )}
    </div>
  )
}
