import Image from 'next/image'
import Link from 'next/link'

import { ArrowRightIcon } from './Icons'

export type CtaPanelData = {
  heading: string
  accent?: string | null
  newLineBeforeAccent?: boolean | null
  body?: string | null
  primary?: { label?: string | null; href?: string | null } | null
  secondary?: { label?: string | null; href?: string | null } | null
}

/** The photo call-to-action panel that closes most pages. */
export function CtaPanel({
  data,
  image,
}: {
  data: CtaPanelData
  image: { src: string; alt: string } | null
}) {
  if (!image) return null

  return (
    <section className="pt-[clamp(72px,9vw,120px)]">
      <div className="relative flex min-h-[480px] items-center overflow-hidden rounded-3xl bg-[#0d0d0d]">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(max-width: 1320px) 100vw, 1320px"
          className="fc-kenburns object-cover"
          style={{ objectPosition: '60% 50%' }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(5,5,5,0.94) 0%, rgba(5,5,5,0.78) 48%, rgba(5,5,5,0.2) 100%)',
          }}
        />

        <div className="relative max-w-[660px] px-[clamp(24px,5vw,72px)] py-[clamp(36px,6vw,80px)]">
          <h2
            className="m-0 text-white"
            style={{ fontSize: 'clamp(56px,7vw,110px)', lineHeight: 0.88 }}
          >
            {data.heading}
            {data.accent ? (
              <>
                {data.newLineBeforeAccent ? <br /> : ' '}
                <span className="text-accent">{data.accent}</span>
              </>
            ) : null}
          </h2>

          {data.body ? (
            <p className="mt-5 max-w-[560px] text-lg font-light leading-relaxed text-white/85">
              {data.body}
            </p>
          ) : null}

          <div className="mt-[34px] flex flex-wrap items-center gap-7">
            {data.primary?.label ? (
              <Link href={data.primary.href || '/contact-us'} className="fc-btn">
                {data.primary.label}
                <ArrowRightIcon />
              </Link>
            ) : null}
            {data.secondary?.label ? (
              <Link href={data.secondary.href || '/gallery'} className="fc-link">
                {data.secondary.label}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
