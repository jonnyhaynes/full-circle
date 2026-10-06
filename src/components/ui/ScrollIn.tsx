'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Reveals its children as they scroll into view, staggered by `delay`.
 *
 * The hidden state lives in CSS (`.fc-scroll-in`), and the `data-reveal`
 * attribute lets the no-JS fallback in the layout reveal it. `as` lets it be an
 * `<li>`, so list items can be staggered without an invalid wrapper element.
 */
export function ScrollIn({
  children,
  delay = 0,
  variant = 'rise',
  as = 'div',
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  variant?: 'rise' | 'bounce'
  as?: 'div' | 'li'
  className?: string
}) {
  const ref = useRef<HTMLElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- show at once when motion is reduced
      setShown(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShown(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const Tag = as as React.ElementType

  return (
    <Tag
      ref={ref}
      data-reveal=""
      data-shown={shown}
      data-variant={variant}
      className={`fc-scroll-in ${className}`}
      style={{ '--fc-scroll-delay': `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  )
}
