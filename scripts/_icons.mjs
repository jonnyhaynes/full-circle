import fs from 'node:fs/promises'

import sharp from 'sharp'

/**
 * Generate the favicon set from the brand mark: the "full circle" ring (the
 * site's signature motif and the logo's mark) in the brand green, on a
 * transparent ground so it reads on both light and dark tab bars.
 *
 *   src/app/icon.svg       modern browsers, crisp at any size
 *   src/app/apple-icon.png iOS home screen (180x180)
 *   src/app/favicon.ico    16/32/48 for everything else
 */
const ACCENT = '#05F60E'

const ringSvg = (size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
  <circle cx="32" cy="32" r="20" fill="none" stroke="${ACCENT}" stroke-width="8"/>
</svg>`

/** Rasterise at 4x then downscale, so the ring's edges are anti-aliased. */
async function ringPng(size) {
  return sharp(Buffer.from(ringSvg(size * 4)))
    .resize(size, size, { kernel: 'lanczos3' })
    .png()
    .toBuffer()
}

/** Assemble a multi-size .ico holding the PNGs. */
function buildIco(entries) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(entries.length, 4)

  const directory = Buffer.alloc(16 * entries.length)
  let offset = 6 + directory.length
  const blobs = []

  entries.forEach((entry, index) => {
    const at = index * 16
    directory.writeUInt8(entry.size >= 256 ? 0 : entry.size, at)
    directory.writeUInt8(entry.size >= 256 ? 0 : entry.size, at + 1)
    directory.writeUInt8(0, at + 2)
    directory.writeUInt8(0, at + 3)
    directory.writeUInt16LE(1, at + 4)
    directory.writeUInt16LE(32, at + 6)
    directory.writeUInt32LE(entry.png.length, at + 8)
    directory.writeUInt32LE(offset, at + 12)
    offset += entry.png.length
    blobs.push(entry.png)
  })

  return Buffer.concat([header, directory, ...blobs])
}

await fs.writeFile('src/app/icon.svg', ringSvg(64) + '\n')
await fs.writeFile('src/app/apple-icon.png', await ringPng(180))

const sizes = [16, 32, 48]
const entries = []
for (const size of sizes) entries.push({ size, png: await ringPng(size) })
await fs.writeFile('src/app/favicon.ico', buildIco(entries))

for (const file of ['icon.svg', 'apple-icon.png', 'favicon.ico']) {
  const stat = await fs.stat(`src/app/${file}`)
  console.log(`WROTE src/app/${file} (${Math.round(stat.size / 1024)}KB)`)
}
