import type { CSSProperties } from 'react'

/**
 * The signature "full circle" ring — a stack of three layers:
 *  1. an outer dashed white ring spinning clockwise (60s),
 *  2. the main conic green ring (with a travelling pale highlight) masked to a
 *     stroke and spinning the other way (34s),
 *  3. a white dot orbiting on its own layer (18s).
 * The circle is always complete. Position and size come from the caller.
 */
export function Ring({ className = '', style }: { className?: string; style?: CSSProperties }) {
  return (
    <div aria-hidden="true" className={`fc-ring ${className}`} style={style}>
      <div className="fc-ring-dash" />
      <div className="fc-ring-main" />
      <div className="fc-ring-dot">
        <span />
      </div>
    </div>
  )
}

/** A small static green ring — used as a bullet in lists and facts. */
export function RingBullet({ size = 14, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      <circle cx="7" cy="7" r="5" fill="none" stroke="var(--color-accent)" strokeWidth="2.4" />
    </svg>
  )
}

/** A larger static ring, e.g. the glowing accent over a photo. */
export function RingMark({ size = 120, stroke = 8 }: { size?: number; stroke?: number }) {
  /*
   * An HTML element rather than an SVG on purpose: the glow is a drop-shadow, and
   * an SVG clips its own contents to the viewBox, which traps the glow inside a
   * square. Sized to match the SVG it replaced (an 8/120 stroke in a 120 viewBox).
   */
  const outer = (size * 112) / 120
  const border = (size * stroke) / 120

  return (
    <span
      aria-hidden="true"
      className="block rounded-full"
      style={{
        width: outer,
        height: outer,
        border: `${border}px solid var(--color-accent)`,
        animation: 'fc-glow 4s ease-in-out infinite',
      }}
    />
  )
}

/**
 * The About-page history animation: two rings slide together, turn green and
 * reveal "Full Circle", then reset.
 */
export function RingMerge({
  companyOne,
  companyTwo,
}: {
  companyOne: string
  companyTwo: string
}) {
  const centred: CSSProperties = {
    position: 'absolute',
    left: '50%',
    top: 0,
    width: 170,
    height: 170,
    marginLeft: -85,
  }

  return (
    <div aria-hidden="true" style={{ position: 'relative', height: 170, maxWidth: 420 }}>
      {['fc-mergeL 8s cubic-bezier(.65,0,.35,1) infinite', 'fc-mergeR 8s cubic-bezier(.65,0,.35,1) infinite'].map(
        (animation) => (
          <svg key={animation} viewBox="0 0 160 160" style={{ ...centred, animation }}>
            <circle
              cx="80"
              cy="80"
              r="66"
              fill="none"
              stroke="rgba(255,255,255,0.55)"
              strokeWidth="7"
              style={{ animation: 'fc-merge-c 8s ease infinite' }}
            />
          </svg>
        )
      )}
      <div
        style={{
          ...centred,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          fontFamily: 'var(--font-comfortaa)',
          fontSize: 18,
          fontWeight: 500,
          lineHeight: 1.15,
          animation: 'fc-mergeTxt 8s ease infinite',
        }}
      >
        Full
        <br />
        Circle
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: -4,
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 12,
          letterSpacing: 2,
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.6)',
          animation: 'fc-mergeTag 8s ease infinite',
        }}
      >
        <span>{companyOne}</span>
        <span>{companyTwo}</span>
      </div>
    </div>
  )
}
