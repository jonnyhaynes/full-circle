/*
 * The three looping micro-animations shown above each discipline on the
 * Services page. Bar heights and timings are fixed (not random) so the server
 * and client render identical markup.
 */
const EQ = Array.from({ length: 18 }, (_, index) => ({
  height: 22 + Math.round(Math.abs(Math.sin(index * 0.9)) * 42),
  duration: `${(0.7 + (index % 4) * 0.18).toFixed(2)}s`,
  delay: `${(-(index * 0.12)).toFixed(2)}s`,
}))

const LIGHTS = ['0s', '.6s', '1.2s', '1.8s']

export function DisciplineAnimation({ variant }: { variant: string }) {
  if (variant === 'visual') {
    return (
      <div aria-hidden="true" className="relative flex h-16 items-start gap-[22px]">
        {LIGHTS.map((delay) => (
          <span key={delay} className="relative block h-16 w-[26px]">
            <span className="absolute left-[3px] top-0 block h-3 w-5 rounded bg-white" />
            <span
              className="absolute left-[-6px] top-3 block h-[52px] w-[38px]"
              style={{
                clipPath: 'polygon(35% 0, 65% 0, 100% 100%, 0 100%)',
                background: 'linear-gradient(to bottom, var(--color-accent), rgba(5,246,14,0))',
                animation: `fc-beam 2.4s ease-in-out ${delay} infinite`,
              }}
            />
          </span>
        ))}
      </div>
    )
  }

  if (variant === 'infrastructure') {
    return (
      <div
        aria-hidden="true"
        className="relative h-16"
        style={{ animation: 'fc-truss 4s ease-in-out infinite' }}
      >
        <div
          className="absolute left-0 right-[30%] top-1 h-[18px] border-y-[3px] border-white"
          style={{
            background:
              'repeating-linear-gradient(60deg, rgba(255,255,255,0) 0 9px, rgba(255,255,255,0.75) 9px 11px, rgba(255,255,255,0) 11px 20px)',
          }}
        />
        <div className="absolute left-[10%] top-[22px] h-[42px] w-[3px] bg-white/50" />
        <div className="absolute left-[58%] top-[22px] h-[42px] w-[3px] bg-white/50" />
        <div className="absolute bottom-0 left-0 right-[30%] h-1.5 rounded bg-accent shadow-[0_0_16px_var(--color-accent)]" />
      </div>
    )
  }

  return (
    <div aria-hidden="true" className="flex h-16 items-center gap-1">
      {EQ.map((bar, index) => (
        <span
          key={index}
          className="w-1.5 rounded-full bg-accent"
          style={{
            height: bar.height,
            animation: `fc-eq ${bar.duration} ease-in-out ${bar.delay} infinite`,
          }}
        />
      ))}
    </div>
  )
}
