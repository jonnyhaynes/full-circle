/**
 * Trace the hero script lines into pen paths.
 *
 * The script line is live CMS text in a webfont, and a webfont has no stroke
 * paths — so to draw it "as if written by hand" (loops of an l, crossbars of a
 * t, in pen order) the lettering has to exist as vector paths. This generates
 * them:
 *
 *   1. render each line in Chromium with the real Mrs Saint Delafield,
 *   2. threshold it to a mask and thin it to a 1px centreline (Zhang–Suen),
 *   3. trace that centreline into pen strokes, in reading order,
 *   4. simplify and normalise each to a height-100 viewBox.
 *
 * Run with `node scripts/_trace.mjs`. It writes `docs/script-traces.json` (the
 * paths) and a review sheet to the session scratchpad showing the trace over the
 * glyphs. Re-run it if the lines change or the font is swapped.
 *
 * Notes for maintainers:
 *  - A diagonal step whose corner is already bridged by an orthogonal neighbour
 *    is dropped. Without that, staircase corners on a diagonal read as junctions
 *    and shatter a clean line into thousands of one-pixel fragments.
 *  - Tracing prefers to carry straight on and restarts at the nearest unused
 *    edge after a dead end, so the strokes stay in reading order — which is what
 *    the draw-on animation needs.
 */
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { chromium } from '@playwright/test'
import sharp from 'sharp'

/* Review artefacts go to the system temp dir, not the repo. */
const OUT = path.join(os.tmpdir(), 'full-circle-script-traces')

const FONT_URL =
  'https://fonts.gstatic.com/s/mrssaintdelafield/v14/v6-IGZDIOVXH9xtmTZfRagunqBw5WC62QKknL-mYF20.woff2'

const PHRASES = [
  'Bring it full circle',
  'Expertise & passion',
  'Unique offerings',
  'Our work in action',
  'We\u2019re ready',
  'Part of the full circle',
]

const FONT_SIZE = 360
const RDP_EPS = 1.1
/* Must match the script line's line-height on the site: the traced path is
   placed inside a box of this height, so the layout is identical to the text. */
const LINE_HEIGHT = 1.65
/* Threshold chosen low so the hairline tapers of the script are captured whole —
   cut too high and strokes break, which shows as gaps in the traced path. */
const ALPHA_CUTOFF = 96
/* Rasterise well above the display size: the script's thin tapers are only a
   couple of pixels wide, and at lower resolution the thinning absorbs them,
   leaving holes in the centreline. (Kept at 2, with a larger font, because a
   bigger scale factor blows Chromium's screenshot size limit on the longest
   line — the text size buys the same detail.) */
const SUPERSAMPLE = 2
/* Strokes shorter than this (in raster pixels) are thinning noise, not ink. */
const MIN_STROKE = 5
/*
 * Padding around the rendered line. A script's flourishes (the left arm of a
 * "W", a descender) reach outside the text box, and a zero-padding screenshot
 * clips them — which silently loses that part of the trace. The padding is
 * subtracted again below, so the path still lines up with the text box.
 */
const PAD = 60

const NEIGHBOURS = [
  [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1],
]

/** Neighbours, dropping redundant diagonal steps (see note in trace()). */
function neighboursOf(index, grid, width, height) {
  const x = index % width
  const y = (index - x) / width
  const out = []
  for (const [dx, dy] of NEIGHBOURS) {
    const nx = x + dx
    const ny = y + dy
    if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue
    const ni = ny * width + nx
    if (!grid[ni]) continue
    if (dx !== 0 && dy !== 0) {
      if (grid[(y + dy) * width + x] || grid[y * width + (x + dx)]) continue
    }
    out.push(ni)
  }
  return out
}

function thin(input, width, height) {
  const grid = Uint8Array.from(input)
  const at = (x, y) => grid[y * width + x]
  let changed = true
  while (changed) {
    changed = false
    for (const step of [0, 1]) {
      const remove = []
      for (let y = 1; y < height - 1; y += 1) {
        for (let x = 1; x < width - 1; x += 1) {
          if (!at(x, y)) continue
          const n = [
            at(x, y - 1), at(x + 1, y - 1), at(x + 1, y), at(x + 1, y + 1),
            at(x, y + 1), at(x - 1, y + 1), at(x - 1, y), at(x - 1, y - 1),
          ]
          const filled = n.reduce((s, v) => s + v, 0)
          if (filled < 2 || filled > 6) continue
          let transitions = 0
          for (let i = 0; i < 8; i += 1) if (n[i] === 0 && n[(i + 1) % 8] === 1) transitions += 1
          if (transitions !== 1) continue
          const [p2, , p4, , p6, , p8] = n
          if (step === 0) {
            if (p2 * p4 * p6 !== 0 || p4 * p6 * p8 !== 0) continue
          } else if (p2 * p4 * p8 !== 0 || p2 * p6 * p8 !== 0) continue
          remove.push(y * width + x)
        }
      }
      if (remove.length) {
        changed = true
        for (const i of remove) grid[i] = 0
      }
    }
  }
  return grid
}

/**
 * Walk the skeleton into pen strokes, preferring to carry straight on and never
 * using an edge twice; a dead end restarts at the nearest unused edge so the
 * strokes stay in reading order.
 */
function trace(grid, width, height) {
  const edgeKey = (a, b) => (a < b ? `${a}_${b}` : `${b}_${a}`)
  const directionOf = (from, to) => [
    (to % width) - (from % width),
    ((to - (to % width)) / width) - ((from - (from % width)) / width),
  ]

  const used = new Set()
  let remaining = 0
  for (let index = 0; index < grid.length; index += 1) {
    if (grid[index]) remaining += neighboursOf(index, grid, width, height).length
  }
  remaining /= 2

  const nearestWithEdge = (from) => {
    const fx = from % width
    const fy = (from - fx) / width
    let best = -1
    let bestDistance = Infinity
    for (let index = 0; index < grid.length; index += 1) {
      if (!grid[index]) continue
      const neighbours = neighboursOf(index, grid, width, height)
      if (!neighbours.some((n) => !used.has(edgeKey(index, n)))) continue
      const dx = (index % width) - fx
      const dy = (index - (index % width)) / width - fy
      const distance = dx * dx + dy * dy
      if (distance < bestDistance) {
        bestDistance = distance
        best = index
      }
    }
    return best
  }

  const strokes = []
  let current = nearestWithEdge(0)

  while (remaining > 0 && current >= 0) {
    const path = [current]
    let heading = null
    for (;;) {
      const options = neighboursOf(current, grid, width, height).filter(
        (n) => !used.has(edgeKey(current, n))
      )
      if (!options.length) break
      let pick = options[0]
      if (options.length > 1) {
        let best = -Infinity
        for (const option of options) {
          const direction = directionOf(current, option)
          const length = Math.hypot(direction[0], direction[1])
          const dot = heading
            ? (direction[0] * heading[0] + direction[1] * heading[1]) / length
            : 0
          if (dot > best) {
            best = dot
            pick = option
          }
        }
      }
      used.add(edgeKey(current, pick))
      remaining -= 1
      path.push(pick)
      heading = directionOf(current, pick)
      current = pick
    }
    strokes.push(path)
    current = remaining > 0 ? nearestWithEdge(current) : -1
  }

  return strokes
}

function rdp(points, epsilon) {
  if (points.length < 3) return points
  const [first] = points
  const last = points[points.length - 1]
  let index = -1
  let max = 0
  for (let i = 1; i < points.length - 1; i += 1) {
    const dx = last.x - first.x
    const dy = last.y - first.y
    const length = Math.hypot(dx, dy) || 1
    const d = Math.abs((points[i].x - first.x) * dy - (points[i].y - first.y) * dx) / length
    if (d > max) {
      max = d
      index = i
    }
  }
  if (max <= epsilon) return [first, last]
  return rdp(points.slice(0, index + 1), epsilon)
    .slice(0, -1)
    .concat(rdp(points.slice(index), epsilon))
}

// ------------------------------------------------------------------ run

const browser = await chromium.launch()
const page = await browser.newPage({ deviceScaleFactor: SUPERSAMPLE })
const results = []
const panels = []

for (const text of PHRASES) {
  const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;')
  await page.setContent(
    `<!doctype html><html><head><meta charset="utf-8"><style>
      @font-face { font-family:'MSD'; src:url('${FONT_URL}') format('woff2'); font-display:block; }
      html,body{margin:0;background:transparent}
      #t{display:inline-block;font-family:'MSD';font-size:${FONT_SIZE}px;line-height:${LINE_HEIGHT};color:#fff;padding:${PAD}px;white-space:nowrap}
    </style></head><body><span id="t">${escaped}</span></body></html>`,
    { waitUntil: 'networkidle' }
  )
  await page.evaluate(() => document.fonts.ready)
  const raster = await (await page.$('#t')).screenshot({ omitBackground: true })

  const { data, info } = await sharp(raster).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width, height, channels } = info
  const mask = new Uint8Array(width * height)
  for (let i = 0; i < width * height; i += 1) mask[i] = data[i * channels + 3] > ALPHA_CUTOFF ? 1 : 0

  const skeleton = thin(mask, width, height)
  // Drop isolated pixels. At this resolution a real dot (an i, a full stop) is
  // many pixels wide, so a pixel with no neighbours is thinning noise — and kept
  // it would draw as a stray dot, since a lone stroke is widened below.
  for (let i = 0; i < skeleton.length; i += 1) {
    if (skeleton[i] && neighboursOf(i, skeleton, width, height).length === 0) skeleton[i] = 0
  }
  // Keep every stroke, however short: the dots on the i's trace to only a
  // couple of points, and dropping them leaves the dot missing entirely. A
  // single-point stroke is widened to a sliver so its round cap draws a dot.
  // Only fragments below MIN_STROKE are dropped — at this resolution a real dot
  // is ~40px of skeleton, so anything of a few pixels is noise, and left in it
  // renders as a stray dot.
  const strokes = trace(skeleton, width, height)
    .map((path) => path.map((i) => ({ x: i % width, y: (i - (i % width)) / width })))
    .map((points) => rdp(points, RDP_EPS))
    .filter((points) => {
      let length = 0
      for (let i = 1; i < points.length; i += 1) {
        length += Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y)
      }
      return points.length > 1 && length >= MIN_STROKE
    })

  const toCss = (value) => value / SUPERSAMPLE - PAD
  const boxWidth = width / SUPERSAMPLE - PAD * 2
  const boxHeight = LINE_HEIGHT * FONT_SIZE

  // The viewBox has to cover the ink, not just the text box: a script's
  // flourishes (the left arm of a "W", a descender) reach outside it, and an SVG
  // clips to its viewBox — which would cut them off. The element is offset by
  // the same amounts so it still lines up with where the text sat.
  const inkMinX = strokes.reduce((min, stroke) => Math.min(min, ...stroke.map((p) => p.x)), Infinity)
  const inkMaxX = strokes.reduce((max, stroke) => Math.max(max, ...stroke.map((p) => p.x)), -Infinity)
  const inkMinY = strokes.reduce((min, stroke) => Math.min(min, ...stroke.map((p) => p.y)), Infinity)
  const inkMaxY = strokes.reduce((max, stroke) => Math.max(max, ...stroke.map((p) => p.y)), -Infinity)
  const left = Math.min(0, toCss(inkMinX))
  const top = Math.min(0, toCss(inkMinY))
  const right = Math.max(boxWidth, toCss(inkMaxX))
  const bottom = Math.max(boxHeight, toCss(inkMaxY))

  // Average ink width, from the mask area over the skeleton length, so the drawn
  // stroke carries the same weight as the letterforms.
  let skeletonEdges = 0
  for (let i = 0; i < skeleton.length; i += 1) {
    if (skeleton[i]) skeletonEdges += neighboursOf(i, skeleton, width, height).length
  }
  skeletonEdges /= 2
  const inkPixels = mask.reduce((sum, value) => sum + value, 0)
  const strokeWidth = skeletonEdges ? inkPixels / skeletonEdges / SUPERSAMPLE : 4

  const points = strokes.reduce((sum, stroke) => sum + stroke.length, 0)
  // Order the pen strokes left to right (then top to bottom), so the draw-on
  // sweeps across the line the way it was written. The walk order is close to
  // this but not reliably — it restarts at the nearest unused edge, which can
  // pick up a stroke further right before one slightly left.
  const leftToRight = strokes
    .map((stroke) => ({
      stroke,
      minX: stroke.reduce((m, point) => Math.min(m, point.x), Infinity),
      minY: stroke.reduce((m, point) => Math.min(m, point.y), Infinity),
    }))
    .sort((a, b) => a.minX - b.minX || a.minY - b.minY)
    .map((entry) => entry.stroke)

  // One path per pen stroke, in that order, with its own length. The draw-on
  // needs them separate: `stroke-dasharray` restarts per subpath, so a single
  // path with every stroke in it animates all of them at once instead of writing
  // left to right.
  const strokeData = leftToRight.map((stroke) => {
    let length = 0
    for (let i = 1; i < stroke.length; i += 1) {
      length += Math.hypot(stroke[i].x - stroke[i - 1].x, stroke[i].y - stroke[i - 1].y)
    }
    return {
      d: stroke
        .map(
          (point, i) =>
            `${i === 0 ? 'M' : 'L'}${toCss(point.x).toFixed(1)} ${toCss(point.y).toFixed(1)}`
        )
        .join(' '),
      // A length, not a position — so scale it but do not take the padding off
      // (doing that made short strokes negative, and a negative duration is
      // invalid CSS, so those strokes drew immediately).
      length: Number((length / SUPERSAMPLE).toFixed(1)),
    }
  })

  results.push({
    text,
    viewBox: `${left.toFixed(1)} ${top.toFixed(1)} ${(right - left).toFixed(1)} ${(bottom - top).toFixed(1)}`,
    widthRatio: Number(((right - left) / FONT_SIZE).toFixed(4)),
    heightRatio: Number(((bottom - top) / FONT_SIZE).toFixed(4)),
    offsetLeftRatio: Number((left / FONT_SIZE).toFixed(4)),
    offsetTopRatio: Number((top / FONT_SIZE).toFixed(4)),
    strokeWidth: Number(strokeWidth.toFixed(2)),
    totalLength: Number(strokeData.reduce((sum, stroke) => sum + stroke.length, 0).toFixed(1)),
    points,
    strokes: strokeData,
  })

  console.log(
    `TRACE ${JSON.stringify(text)} strokes=${strokeData.length} points=${points} box=${boxWidth.toFixed(0)}x${boxHeight.toFixed(0)} stroke=${strokeWidth.toFixed(2)}`
  )

  // Overlay panel: the glyph greyed, the trace on top, in mask pixels.
  const maskPng = await sharp(
    Buffer.from(
      (() => {
        const rgb = Buffer.alloc(width * height * 3)
        for (let i = 0; i < width * height; i += 1) {
          const on = mask[i]
          rgb[i * 3] = on ? 44 : 8
          rgb[i * 3 + 1] = on ? 44 : 8
          rgb[i * 3 + 2] = on ? 44 : 8
        }
        return rgb
      })()
    ),
    { raw: { width, height, channels: 3 } }
  )
    .png()
    .toBuffer()

  const pixelPath = strokes
    .map((s) => s.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' '))
    .join(' ')

  panels.push(`<section>
    <p class="label">${escaped} — ${strokes.length} strokes, ${points} points</p>
    <div style="position:relative;width:${width}px;height:${height}px">
      <img src="data:image/png;base64,${maskPng.toString('base64')}" style="position:absolute;inset:0;width:${width}px;height:${height}px">
      <svg viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" style="position:absolute;inset:0">
        <path d="${pixelPath}" fill="none" stroke="#05F60E" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
  </section>`)
}

await page.setContent(
  `<!doctype html><html><head><meta charset="utf-8"><style>
    body{background:#050505;color:#fff;font-family:system-ui,sans-serif;margin:0;padding:24px}
    section{margin-bottom:28px;border-bottom:1px solid #222;padding-bottom:20px}
    .label{font-size:13px;color:#8c8c8c;margin:0 0 10px;letter-spacing:1px}
  </style></head><body>${panels.join('')}</body></html>`,
  { waitUntil: 'load' }
)
await page.setViewportSize({ width: 2600, height: 900 })
await page.screenshot({ path: `${OUT}/compare.png`, fullPage: true })
await browser.close()

await fs.mkdir('src/lib', { recursive: true })
await fs.mkdir(OUT, { recursive: true })
await fs.writeFile('src/lib/scriptTraces.json', JSON.stringify(results, null, 2))
await fs.writeFile(`${OUT}/paths.json`, JSON.stringify(results, null, 2))

// The committed review sheet, straight from the run.
await sharp(`${OUT}/compare.png`)
  .resize({ width: 2200 })
  .png({ compressionLevel: 9, palette: true })
  .toFile('docs/script-traces.png')

console.log(`WROTE src/lib/scriptTraces.json and docs/script-traces.png (review sheet also in ${OUT})`)
