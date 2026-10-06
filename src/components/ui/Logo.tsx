import Link from 'next/link'

/**
 * The client's logo, recreated as vectors: a solid green ring (never broken — the
 * client was explicit that a ring with a gap is "not full circle") beside the
 * Comfortaa wordmark, with the two "o"s in "Production" in green.
 */
export function Logo({
  businessName,
  size = 'header',
}: {
  businessName: string
  size?: 'header' | 'footer'
}) {
  const ring = size === 'header' ? 50 : 54
  const top = size === 'header' ? 'text-[27px]' : 'text-[29px]'
  const bottom = size === 'header' ? 'text-[13.5px]' : 'text-[14.5px]'

  return (
    <Link href="/" aria-label={`${businessName} home`} className="flex shrink-0 items-center gap-3">
      {/* The glow sits on the svg element, not the circle inside it — an SVG
          clips its own contents, which would trap the drop-shadow in the box. */}
      <svg
        width={ring}
        height={ring}
        viewBox="0 0 54 54"
        aria-hidden="true"
        className="shrink-0"
        style={{ animation: 'fc-logo-glow 4s ease-in-out infinite' }}
      >
        <circle cx="27" cy="27" r="23.5" fill="none" stroke="var(--color-accent)" strokeWidth="6" />
      </svg>
      <span className="flex flex-col items-end font-logo leading-none text-white">
        <span className={`${top} font-medium tracking-[-0.3px]`}>Full Circle</span>
        <span className={`mt-[5px] ${bottom} font-medium`}>
          Event Pr<span className="text-accent">o</span>ducti<span className="text-accent">o</span>n
        </span>
      </span>
    </Link>
  )
}
