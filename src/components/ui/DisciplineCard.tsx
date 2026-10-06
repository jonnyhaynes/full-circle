import Image from 'next/image'

import { DisciplineAnimation } from './DisciplineAnimation'

type Discipline = {
  title: string
  summary: string
  points?: { text: string }[] | null
  animation: string
  image?: unknown
}

/** The Services page card: a looping micro-animation above the title and copy. */
export function DisciplineCard({ discipline, index }: { discipline: Discipline; index: number }) {
  return (
    <article className="fc-card fc-disc rounded-3xl p-[30px]">
      <DisciplineAnimation variant={discipline.animation} />
      <div className="mt-[26px] text-[13px] tracking-[2px] text-white/60">
        {String(index + 1).padStart(2, '0')}
      </div>
      <h3 className="mt-1.5 font-display text-[56px] leading-[0.95]">{discipline.title}</h3>
      <p className="mt-3 text-base leading-relaxed text-white/72">{discipline.summary}</p>
      {discipline.points && discipline.points.length > 0 ? (
        <ul className="mt-5 flex flex-col gap-2.5 border-t border-white/10 pt-[18px] text-[15px]">
          {discipline.points.map((point) => (
            <li key={point.text} className="flex items-center gap-2.5">
              <span className="h-[7px] w-[7px] rounded-full bg-accent" />
              {point.text}
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  )
}

const POSITIONS: Record<string, string> = {
  audio: '50% 35%',
  visual: '50% 30%',
  infrastructure: '50% 50%',
}

/** The home page card: a photograph with a numbered ring, title and dot-list. */
export function HomeDisciplineCard({
  discipline,
  image,
  index,
}: {
  discipline: Discipline
  image: { src: string; alt: string } | null
  index: number
}) {
  return (
    <article className="fc-card flex h-full flex-col overflow-hidden">
      <div className="relative h-[320px] overflow-hidden bg-[#141414]">
        {image ? (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
            style={{ objectPosition: POSITIONS[discipline.animation] || '50% 50%' }}
          />
        ) : null}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to top, #0e0e0e 0%, rgba(14,14,14,0) 55%)',
          }}
        />
        <span className="absolute left-[18px] top-[18px] flex h-[52px] w-[52px] items-center justify-center rounded-full border-[3px] border-accent bg-black/60 font-display text-[22px]">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3.5 px-[26px] pb-7 pt-1">
        <h3 className="font-display text-[54px] leading-[0.9]">{discipline.title}</h3>
        <p className="text-base leading-snug text-white/72">{discipline.summary}</p>
        {discipline.points && discipline.points.length > 0 ? (
          <div className="mt-auto flex flex-wrap gap-x-[18px] gap-y-1.5 pt-2.5 text-sm text-white/85">
            {discipline.points.map((point) => (
              <span key={point.text} className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                {point.text}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  )
}
