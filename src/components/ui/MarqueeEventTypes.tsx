/**
 * The endlessly scrolling strip of event types: Bebas words alternating solid
 * white and outlined, separated by small green rings.
 */
export function MarqueeEventTypes({ items }: { items: string[] }) {
  if (items.length === 0) return null
  const doubled = [...items, ...items]

  return (
    <div
      aria-hidden="true"
      className="overflow-hidden whitespace-nowrap border-y border-line bg-[#080808] py-5"
    >
      <div className="inline-flex" style={{ animation: 'fc-marquee 40s linear infinite' }}>
        {doubled.map((label, index) => (
          <span
            key={`${label}-${index}`}
            className="inline-flex items-center gap-8 pr-8 font-display text-[52px] leading-none"
            style={{
              color: index % 2 === 0 ? '#ffffff' : 'transparent',
              WebkitTextStroke: index % 2 === 0 ? '0px transparent' : '1.5px rgba(255,255,255,0.7)',
            }}
          >
            {label}
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="9" fill="none" stroke="var(--color-accent)" strokeWidth="3.5" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  )
}
