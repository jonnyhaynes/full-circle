'use client'

import { useEffect, useRef } from 'react'

import type { ProcessStep } from '@/payload-types'

/**
 * The "How we work" timeline. The green line, the node fills and the closing
 * ring are all driven by how far the section has scrolled through the viewport
 * rather than a fixed loop, so the line draws under the reader's own scroll.
 *
 * Progress is written to CSS custom properties on the root (not React state) so
 * the scroll handler never triggers a re-render.
 */
export function HowWeWork({
  steps,
  eyebrow,
  heading,
  intro,
}: {
  steps: Pick<ProcessStep, 'title' | 'body' | 'number'>[]
  eyebrow: string
  heading: string
  intro: string
}) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const setFinalState = () => {
      root.style.setProperty('--fc-progress', '1')
      root.style.setProperty('--fc-ring', '1')
      root.style.setProperty('--fc-end', '1')
      for (let index = 0; index < steps.length; index += 1) {
        root.style.setProperty(`--n${index}`, '1')
      }
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setFinalState()
      return
    }

    let frame = 0
    let visible = true
    const clamp = (value: number) => Math.min(1, Math.max(0, value))

    const update = () => {
      frame = 0
      const rect = root.getBoundingClientRect()
      const viewport = window.innerHeight
      // The wrapper is taller than the viewport, so while it is pinned the extra
      // scroll is the travel: 0 when it pins, 1 when it releases.
      const travel = Math.max(1, rect.height - viewport)
      const progress = clamp(-rect.top / travel)

      // The line draws first, then the ring closes and the "Full circle" text
      // lights — so the circle is complete exactly as the section unpins.
      const line = clamp(progress / 0.6)
      root.style.setProperty('--fc-progress', String(line))
      steps.forEach((_, index) => {
        // Nodes sit evenly along the track, so each lights as the drawing line
        // reaches its position (the last at three-quarters of the line).
        const arrival = steps.length > 0 ? index / steps.length : 0
        root.style.setProperty(`--n${index}`, String(clamp((line - arrival) / 0.08)))
      })
      root.style.setProperty('--fc-ring', String(clamp((progress - 0.6) / 0.4)))
      root.style.setProperty('--fc-end', String(clamp((progress - 0.72) / 0.28)))
    }

    const onScroll = () => {
      if (!visible || frame) return
      frame = requestAnimationFrame(update)
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting)
      onScroll()
    })
    observer.observe(root)

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    update()

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [steps])

  if (steps.length === 0) return null

  return (
    <section ref={rootRef} className="fc-timeline fc-timeline-pin relative">
      <div className="fc-timeline-sticky">
        <div className="w-full py-[clamp(32px,5vw,64px)]">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="fc-eyebrow">{eyebrow}</div>
              <h2 className="mt-3">{heading}</h2>
            </div>
            <p className="m-0 max-w-[420px] text-lg font-light leading-relaxed text-white/75">
              {intro}
            </p>
          </div>

          <div className="relative mt-12">
            <div
              aria-hidden="true"
              className="fc-track absolute left-[22px] right-[120px] top-[21px] h-[2px] bg-white/10"
            >
              <div
                data-timeline-fill=""
                className="h-full bg-accent shadow-[0_0_14px_var(--color-accent)]"
                style={{
                  transformOrigin: 'left center',
                  transform: 'scaleX(var(--fc-progress, 0))',
                  willChange: 'transform',
                }}
              />
            </div>

            <ol className="fc-steps relative m-0 list-none p-0">
              {steps.map((step, index) => (
                <li key={step.title} className="min-w-0 pr-7">
                  <span aria-hidden="true" className="relative flex h-11 w-11">
                    <span className="absolute inset-0 rounded-full border-[3px] border-accent bg-canvas" />
                    <span
                      className="absolute inset-0 rounded-full bg-accent shadow-[0_0_22px_var(--color-accent-35)]"
                      style={{ opacity: `var(--n${index}, 0)` }}
                    />
                  </span>
                  <div className="mt-[26px] text-[13px] tracking-[2px] text-white/60">
                    {step.number}
                  </div>
                  <h3 className="mt-1.5 font-display text-[44px] leading-none">{step.title}</h3>
                  <p className="mt-3 text-base leading-relaxed text-white/72">{step.body}</p>
                </li>
              ))}

              <li aria-hidden="true" className="fc-endring flex flex-col items-center">
                <div className="relative -mt-[38px] h-[120px] w-[120px]">
                  <svg
                    viewBox="0 0 120 120"
                    className="absolute inset-0 h-full w-full rotate-180"
                    style={{ overflow: 'visible' }}
                  >
                    <circle
                      cx="60"
                      cy="60"
                      r="52"
                      fill="none"
                      stroke="rgba(255,255,255,0.08)"
                      strokeWidth="6"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="52"
                      fill="none"
                      stroke="var(--color-accent)"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray="326.7"
                      style={{
                        strokeDashoffset: 'calc(326.7 - 326.7 * var(--fc-ring, 0))',
                        filter: 'drop-shadow(0 0 10px var(--color-accent-35))',
                      }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-center font-display text-2xl leading-[0.95]">
                    <span className="text-white/50">
                      Full
                      <br />
                      circle
                    </span>
                    <span
                      className="absolute inset-0 flex items-center justify-center text-accent"
                      style={{ opacity: 'var(--fc-end, 0)' }}
                    >
                      Full
                      <br />
                      circle
                    </span>
                  </div>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
