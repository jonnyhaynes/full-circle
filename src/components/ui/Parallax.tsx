'use client'

import { useEffect, useRef } from 'react'

/**
 * A subtle vertical parallax for an image inside a fixed frame. This renders the
 * frame; the image inside (oversized and cropped, see the caller) shifts by
 * `strength` pixels as the frame crosses the viewport.
 *
 * The offset is written to a CSS custom property rather than React state, so
 * scrolling never re-renders. With reduced motion the property is left at zero.
 */
export function Parallax({
  children,
  strength = 26,
  className = '',
}: {
  children: React.ReactNode
  strength?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const clamp = (value: number) => Math.min(1, Math.max(-1, value))
    let frame = 0
    let visible = true

    const update = () => {
      frame = 0
      const rect = element.getBoundingClientRect()
      const viewportCentre = window.innerHeight / 2
      const elementCentre = rect.top + rect.height / 2
      // +1 when the frame is below the fold, -1 when it has passed above it.
      const progress = clamp((elementCentre - viewportCentre) / (viewportCentre + rect.height / 2))
      element.style.setProperty('--fc-parallax', `${(-progress * strength).toFixed(2)}px`)
    }

    const onScroll = () => {
      if (!visible || frame) return
      frame = requestAnimationFrame(update)
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting)
      onScroll()
    })
    observer.observe(element)

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    update()

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [strength])

  return (
    <div ref={ref} data-parallax="" className={className}>
      {children}
    </div>
  )
}
