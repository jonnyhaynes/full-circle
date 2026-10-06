'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'

import { ArrowLeftIcon, ArrowRightIcon, CloseIcon } from './Icons'

export type LightboxItem = {
  id: number | string
  src: string
  alt: string
  caption: string
  groupLabel: string
}

/**
 * Full-screen photo viewer with a counter, previous/next, Esc to close, arrow
 * keys, a focus trap and focus return to the tile that opened it.
 */
export function Lightbox({
  items,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  items: LightboxItem[]
  index: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const previousFocus = useRef<HTMLElement | null>(null)

  useEffect(() => {
    previousFocus.current = document.activeElement as HTMLElement | null
    const node = ref.current
    node?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (event.key === 'ArrowLeft') {
        onPrev()
        return
      }
      if (event.key === 'ArrowRight') {
        onNext()
        return
      }
      if (event.key !== 'Tab' || !node) return

      const focusables = Array.from(
        node.querySelectorAll<HTMLElement>('button, [href], [tabindex]:not([tabindex="-1"])')
      )
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      previousFocus.current?.focus?.()
    }
  }, [onClose, onPrev, onNext])

  const item = items[index]
  if (!item) return null

  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      className="fixed inset-0 z-50 flex flex-col backdrop-blur-md"
      style={{ background: 'rgba(5,5,5,0.94)', animation: 'fc-fadein .35s ease both' }}
    >
      <div className="flex items-center justify-between gap-4 px-[clamp(16px,3vw,32px)] py-[18px]">
        <span className="text-sm tracking-[2px] text-white/70">
          <span className="text-accent">{index + 1}</span> / {items.length}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close photo viewer"
          className="flex h-[52px] w-[52px] items-center justify-center rounded-full border border-white/30 text-white"
        >
          <CloseIcon size={20} />
        </button>
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center gap-[clamp(8px,2vw,24px)] px-[clamp(8px,2vw,24px)]">
        <button
          type="button"
          onClick={onPrev}
          aria-label="Previous photo"
          className="flex h-14 w-14 flex-none items-center justify-center rounded-full border border-white/30 bg-black/50 text-white"
        >
          <ArrowLeftIcon />
        </button>

        <figure
          key={item.id}
          className="relative min-h-0 min-w-0 flex-1"
          style={{ height: '100%', maxHeight: 'calc(100vh - 200px)', animation: 'fc-zoomin .45s ease both' }}
        >
          <Image
            src={item.src}
            alt={item.alt}
            fill
            sizes="100vw"
            className="object-contain"
          />
        </figure>

        <button
          type="button"
          onClick={onNext}
          aria-label="Next photo"
          className="flex h-14 w-14 flex-none items-center justify-center rounded-full bg-accent text-accent-ink"
        >
          <ArrowRightIcon size={20} />
        </button>
      </div>

      <div className="px-[clamp(16px,3vw,32px)] pb-[26px] pt-[18px] text-center">
        <div className="text-xs tracking-[2px] text-accent">{item.groupLabel}</div>
        <div className="mt-1 font-display text-[34px] leading-none text-white">{item.caption}</div>
      </div>
    </div>
  )
}
