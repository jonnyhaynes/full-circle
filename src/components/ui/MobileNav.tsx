'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import { CloseIcon } from './Icons'

export type NavItem = { label: string; href: string }

/** The burger menu for phones. The desktop nav is hidden below `md`. */
export function MobileNav({ items, current }: { items: NavItem[]; current?: string }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  if (items.length === 0) return null

  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen((value) => !value)}
        className="relative z-50 flex h-[50px] w-[50px] items-center justify-center rounded-full border border-line-strong text-body md:hidden"
      >
        {open ? (
          <CloseIcon size={18} />
        ) : (
          <span className="flex flex-col gap-[5px]" aria-hidden="true">
            <span className="block h-[2px] w-[22px] bg-current" />
            <span className="block h-[2px] w-[22px] bg-current" />
            <span className="block h-[2px] w-[22px] bg-current" />
          </span>
        )}
      </button>

      {open ? (
        <div
          id="mobile-nav"
          className="fixed inset-0 z-40 overflow-y-auto bg-canvas px-6 pb-16 pt-32 md:hidden"
        >
          <nav aria-label="Main" className="flex flex-col">
            {items.map((item) => {
              const active = current === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? 'page' : undefined}
                  className={`border-b border-line py-5 font-display text-5xl uppercase ${
                    active ? 'text-accent' : 'text-body'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <Link
            href="/contact-us"
            onClick={() => setOpen(false)}
            className="fc-btn mt-10"
          >
            Get a quote
          </Link>
        </div>
      ) : null}
    </>
  )
}
