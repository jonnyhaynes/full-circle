import Image from 'next/image'

import { Parallax } from './Parallax'

/**
 * A framed, full-bleed image that drifts slightly as it scrolls (see Parallax).
 * The image is oversized inside the frame — 130% tall, shifted up 15% — so the
 * drift never exposes an edge. The frame (rounded corners, aspect ratio, crop)
 * is supplied by the caller through `className`.
 */
export function ParallaxImage({
  image,
  sizes,
  className = '',
  strength,
}: {
  image: { src: string; alt: string } | null
  sizes: string
  className?: string
  strength?: number
}) {
  return (
    <Parallax className={className} strength={strength}>
      {image ? (
        <div
          className="absolute inset-x-0 -top-[15%] h-[130%] will-change-transform"
          style={{ transform: 'translate3d(0, var(--fc-parallax, 0px), 0)' }}
        >
          <Image src={image.src} alt={image.alt} fill sizes={sizes} className="object-cover" />
        </div>
      ) : null}
    </Parallax>
  )
}
