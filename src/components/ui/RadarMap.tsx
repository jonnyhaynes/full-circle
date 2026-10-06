type Coordinate = { latitude: number; longitude: number }

type Town = Coordinate & {
  name: string
  delay?: string | null
}

/**
 * The "radar" map used on the About and Contact pages. Rather than hand-placed
 * percentages, the towns and the workshop are plotted from their real
 * coordinates with a simple equirectangular projection (longitude scaled by the
 * cosine of the latitude, so east–west distances are true at this latitude). So
 * the directions and relative distances between the dots are geographically
 * correct, without showing an actual map.
 *
 * The animation is the decorative radar: two expanding pings out from the
 * workshop, static range rings and a slowly rotating dashed ring.
 */
export function RadarMap({
  towns,
  hq,
  label,
}: {
  towns: Town[]
  hq: Coordinate
  label: string
}) {
  const points: Coordinate[] = [hq, ...towns]
  const meanLat = points.reduce((sum, point) => sum + point.latitude, 0) / points.length
  const k = Math.cos((meanLat * Math.PI) / 180)

  // Project to a plane with north up and longitude scaled for true distances.
  const project = (point: Coordinate) => ({ x: point.longitude * k, y: -point.latitude })

  // Centre on the workshop rather than on the towns' bounding box, so it sits in
  // the middle of the map and places can be plotted in any direction — and more
  // added to the south, east or west later — without it drifting off-centre.
  const centre = project(hq)
  const reach = points.reduce((max, point) => {
    const projected = project(point)
    return Math.max(max, Math.abs(projected.x - centre.x), Math.abs(projected.y - centre.y))
  }, 0)

  // A square viewBox with a margin for the rings; `meet` keeps the map's true
  // aspect ratio whatever shape the panel is.
  const half = Math.max(reach, 0.001) * 1.22
  const size = half * 2

  const at = (point: Coordinate) => {
    const projected = project(point)
    return { x: projected.x - centre.x, y: projected.y - centre.y }
  }

  const hqAt = at(hq)
  const font = size * 0.026
  const vein = size * 0.0025

  return (
    <div
      aria-hidden="true"
      className="relative min-h-[380px] flex-1 basis-[420px] self-stretch overflow-hidden"
      style={{
        background: `radial-gradient(circle at 50% 60%, var(--color-accent-16), rgba(0,0,0,0) 60%), #080808`,
      }}
    >
      <svg
        viewBox={`${-half} ${-half} ${size} ${size}`}
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 h-full w-full"
      >
        {/* range rings, centred on the workshop */}
        <circle cx={hqAt.x} cy={hqAt.y} r={half * 0.3} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={vein} />
        <circle cx={hqAt.x} cy={hqAt.y} r={half * 0.5} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={vein} />
        <circle
          cx={hqAt.x}
          cy={hqAt.y}
          r={half * 0.74}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={vein}
          strokeDasharray={`${vein * 5} ${vein * 7}`}
          style={{ transformBox: 'fill-box', transformOrigin: 'center', animation: 'fc-spin 90s linear infinite' }}
        />

        {/* the two expanding pings */}
        <circle
          cx={hqAt.x}
          cy={hqAt.y}
          r={half * 0.9}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={vein * 2}
          style={{ transformBox: 'fill-box', transformOrigin: 'center', animation: 'fc-ping 4s ease-out infinite' }}
        />
        <circle
          cx={hqAt.x}
          cy={hqAt.y}
          r={half * 0.9}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={vein * 2}
          style={{ transformBox: 'fill-box', transformOrigin: 'center', animation: 'fc-ping 4s 2s ease-out infinite' }}
        />

        {towns.map((town) => {
          const point = at(town)
          const toTheWest = point.x < hqAt.x
          const textX = point.x + (toTheWest ? -font * 0.6 : font * 0.6)
          return (
            <g key={town.name}>
              <circle
                cx={point.x}
                cy={point.y}
                r={font * 0.34}
                fill="none"
                stroke="#ffffff"
                strokeWidth={vein}
                style={{
                  transformBox: 'fill-box',
                  transformOrigin: 'center',
                  animation: `fc-ping 4s ease-out ${town.delay || '0s'} infinite`,
                }}
              />
              <circle cx={point.x} cy={point.y} r={font * 0.2} fill="#ffffff" />
              <text
                x={textX}
                y={point.y + font * 0.34}
                textAnchor={toTheWest ? 'end' : 'start'}
                fill="rgba(255,255,255,0.85)"
                fontSize={font}
                letterSpacing={font * 0.14}
                className="font-display"
              >
                {town.name}
              </text>
            </g>
          )
        })}

        {/* the workshop */}
        <circle
          cx={hqAt.x}
          cy={hqAt.y}
          r={font * 0.5}
          fill="var(--color-accent)"
          style={{ filter: 'drop-shadow(0 0 8px var(--color-accent))' }}
        />
        <text
          x={hqAt.x}
          y={hqAt.y - font * 1.2}
          textAnchor="middle"
          fill="var(--color-accent)"
          fontSize={font * 1.15}
          className="font-display"
        >
          {label}
        </text>
      </svg>
    </div>
  )
}
