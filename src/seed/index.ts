/* eslint-disable @typescript-eslint/no-explicit-any */

import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

import fs from 'fs/promises'
import path from 'path'
import { getPayload, type Payload } from 'payload'
import { fileURLToPath } from 'url'

const { default: config } = await import('../payload.config')

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '../..')
const HANDOVER = path.join(repoRoot, 'docs/fullcircle-handover')

const payload: Payload = await getPayload({ config })

const content = JSON.parse(
  await fs.readFile(path.join(HANDOVER, 'content/content.json'), 'utf8')
) as any

// ---------------------------------------------------------------- utilities

let mediaCache: Map<string, number> | null = null

async function mediaId(relPath: string, alt: string): Promise<number> {
  const filename = path.basename(relPath)

  if (mediaCache?.has(filename)) {
    return mediaCache.get(filename) as number
  }

  const existing = await payload.find({
    collection: 'media',
    where: { filename: { equals: filename } },
    limit: 1,
    overrideAccess: true,
  })

  if (existing.docs[0]) {
    if (existing.docs[0].alt !== alt) {
      await payload.update({
        collection: 'media',
        id: existing.docs[0].id,
        data: { alt },
        overrideAccess: true,
      })
    }
    mediaCache?.set(filename, existing.docs[0].id as number)
    return existing.docs[0].id as number
  }

  const doc = await payload.create({
    collection: 'media',
    data: { alt },
    filePath: path.join(HANDOVER, relPath),
    overrideAccess: true,
  })

  mediaCache?.set(filename, doc.id as number)
  return doc.id as number
}

function paragraphs(...texts: string[]) {
  return {
    root: {
      type: 'root',
      children: texts.filter(Boolean).map((text) => ({
        type: 'paragraph',
        children: [{ type: 'text', text }],
      })),
    },
  }
}

// ------------------------------------------------------- live service copy

const WP_BASE = 'https://fullcircleevents.co.uk/wp-json/wp/v2'

/** Our slug → the slug used on the live WordPress site, where they differ. */
const LIVE_SLUG: Record<string, string> = {
  remembrance: 'rememberance',
}

function decodeEntities(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&pound;/g, '£')
    .replace(/&hellip;/g, '…')
    .replace(/&rsquo;/g, '’')
    .replace(/&lsquo;/g, '‘')
    .replace(/&rdquo;/g, '”')
    .replace(/&ldquo;/g, '“')
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—')
}

function stripTags(html: string): string {
  return decodeEntities(
    html
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  )
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * The body copy for a service page, pulled from the live WordPress site (the
 * copy only exists there). Best effort — without network access it returns an
 * empty list and the seed falls back to the short summary.
 */
async function liveServiceParagraphs(slug: string, title: string): Promise<string[]> {
  const liveSlug = LIVE_SLUG[slug] ?? slug
  try {
    const response = await fetch(
      `${WP_BASE}/pages?slug=${encodeURIComponent(liveSlug)}&per_page=1`
    )
    if (!response.ok) return []

    const rendered = (await response.json() as Array<{ content?: { rendered?: string } }>)[0]
      ?.content?.rendered
    if (!rendered) return []

    // Drop Elementor's inline <style>/<script> blocks before extracting text.
    const html = rendered
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')

    const eyebrow = stripTags(html.match(/<h[1-3][^>]*>(.*?)<\/h[1-3]>/is)?.[1] ?? '')
    const subheading = stripTags(html.match(/<strong[^>]*>(.*?)<\/strong>/is)?.[1] ?? '')

    const paragraphs = Array.from(html.matchAll(/<p[^>]*>(.*?)<\/p>/gis))
      .map((match) => stripTags(match[1] as string))
      .filter((text) => text.length > 50)
      .filter((text) => !text.includes('Get A Quote'))
      .filter((text) => !/[{}]|document\.|function\s*\(|@keyframes|#uc_|var\(/.test(text))

    // Elementor folds the eyebrow, heading and intro into the first <p>; strip
    // the leading heading text back off. Longest match first, so the title
    // (a prefix of the subheading) does not eat into it.
    if (paragraphs.length > 0) {
      let first = paragraphs[0]
      for (const lead of [eyebrow, subheading, title]) {
        if (!lead) continue
        first = first.replace(new RegExp(`^\\s*${escapeRegExp(lead)}\\s*`, 'i'), '')
      }
      paragraphs[0] = first.trim()
    }

    return paragraphs.filter(Boolean)
  } catch {
    return []
  }
}

async function findOne(collection: any, field: string, value: string) {
  const result = await payload.find({
    collection,
    where: { [field]: { equals: value } },
    limit: 1,
    overrideAccess: true,
  })
  return result.docs[0] as any
}

// ---------------------------------------------------------------- media warm-up

async function buildMediaCache() {
  const all = await payload.find({ collection: 'media', limit: 1000, overrideAccess: true })
  mediaCache = new Map(all.docs.map((doc: any) => [doc.filename as string, doc.id as number]))
}

// ---------------------------------------------------------------- services

async function seedServices() {
  console.log('Seeding services')

  let withLiveCopy = 0

  for (const service of content.services as any[]) {
    const image = await mediaId(service.image, service.imageAlt)

    // The longer body copy only exists on the live site; fall back to the summary.
    const liveParagraphs = await liveServiceParagraphs(service.slug, service.title)
    if (liveParagraphs.length > 0) withLiveCopy += 1

    const data: any = {
      title: service.title,
      slug: service.slug,
      group: String(service.group).toLowerCase(),
      summary: service.summary,
      image,
      body: paragraphs(...(liveParagraphs.length > 0 ? liveParagraphs : [service.summary])),
      order: service.order,
    }

    const existing = await findOne('services', 'slug', service.slug)
    if (existing) {
      await payload.update({ collection: 'services', id: existing.id, data, overrideAccess: true })
    } else {
      await payload.create({ collection: 'services', data, overrideAccess: true })
    }
  }

  console.log(`  ${content.services.length} services (${withLiveCopy} with live copy)`)
}

// ---------------------------------------------------------------- disciplines

const DISCIPLINE_IMAGES: Record<string, string> = {
  Audio: 'assets/photos/hooton-lodge-gig.jpg',
  Visual: 'assets/photos/remembrance-church-projection.jpg',
  Infrastructure: 'assets/photos/awards-stage-set-gold.jpg',
}

const DISCIPLINE_ANIMATIONS = ['audio', 'visual', 'infrastructure']

async function seedDisciplines() {
  console.log('Seeding disciplines')

  // Rebuild so ordering and animation keys always match.
  const existing = await payload.find({ collection: 'disciplines', limit: 100, overrideAccess: true })
  for (const doc of existing.docs) {
    await payload.delete({ collection: 'disciplines', id: doc.id, overrideAccess: true })
  }

  for (const [index, discipline] of (content.disciplines as any[]).entries()) {
    const imagePath = DISCIPLINE_IMAGES[discipline.title]
    const image = imagePath ? await mediaId(imagePath, `${discipline.title} at a Full Circle event`) : undefined

    await payload.create({
      collection: 'disciplines',
      data: {
        title: discipline.title,
        summary: discipline.summary,
        points: discipline.points.map((text: string) => ({ text })),
        animation: DISCIPLINE_ANIMATIONS[index] ?? 'audio',
        image,
        order: index,
      } as any,
      overrideAccess: true,
    })
  }

  console.log(`  ${content.disciplines.length} disciplines`)
}

// ---------------------------------------------------------------- process steps

async function seedProcessSteps() {
  console.log('Seeding process steps')
  const steps = content.home.howWeWork.steps as any[]

  const existing = await payload.find({ collection: 'process-steps', limit: 100, overrideAccess: true })
  for (const doc of existing.docs) {
    await payload.delete({ collection: 'process-steps', id: doc.id, overrideAccess: true })
  }

  for (const [index, step] of steps.entries()) {
    await payload.create({
      collection: 'process-steps',
      data: { number: step.num, title: step.title, body: step.body, order: index },
      overrideAccess: true,
    })
  }

  console.log(`  ${steps.length} steps`)
}

// ---------------------------------------------------------------- event types

const EVENT_TYPES = [
  'Award Ceremonies',
  'Conference and Seminars',
  'Corporate Events',
  'Christmas',
  'Festivals',
  'Live Music',
  'Sporting Events',
  'Exhibition and Product Launches',
  'Charity',
  'Bonfire',
  'Remembrance',
]

async function seedEventTypes() {
  console.log('Seeding event types')

  const existing = await payload.find({ collection: 'event-types', limit: 100, overrideAccess: true })
  for (const doc of existing.docs) {
    await payload.delete({ collection: 'event-types', id: doc.id, overrideAccess: true })
  }

  for (const [index, label] of EVENT_TYPES.entries()) {
    await payload.create({
      collection: 'event-types',
      data: { label, order: index },
      overrideAccess: true,
    })
  }

  console.log(`  ${EVENT_TYPES.length} event types`)
}

// ---------------------------------------------------------------- gallery

const GALLERY_CATEGORY: Record<string, string> = {
  'Awards & Corporate': 'awards',
  'Live & Festivals': 'live',
  Community: 'community',
  'Behind the Scenes': 'crew',
}

async function seedGallery() {
  console.log('Seeding gallery')

  const existing = await payload.find({ collection: 'galleryItems', limit: 500, overrideAccess: true })
  for (const doc of existing.docs) {
    await payload.delete({ collection: 'galleryItems', id: doc.id, overrideAccess: true })
  }

  for (const item of content.gallery as any[]) {
    const image = await mediaId(item.image, item.alt)
    await payload.create({
      collection: 'galleryItems',
      data: {
        image,
        caption: item.caption,
        category: GALLERY_CATEGORY[item.category] ?? 'live',
        aspectRatio: item.aspectRatio,
        order: item.order,
      } as any,
      overrideAccess: true,
    })
  }

  console.log(`  ${content.gallery.length} gallery items`)
}

// ---------------------------------------------------------------- testimonials

async function seedTestimonials() {
  console.log('Seeding testimonials')

  const existing = await payload.find({ collection: 'testimonials', limit: 100, overrideAccess: true })
  for (const doc of existing.docs) {
    await payload.delete({ collection: 'testimonials', id: doc.id, overrideAccess: true })
  }

  for (const [index, testimonial] of (content.home.testimonials as any[]).entries()) {
    await payload.create({
      collection: 'testimonials',
      data: { quote: testimonial.quote, name: testimonial.name, order: index },
      overrideAccess: true,
    })
  }

  console.log(`  ${content.home.testimonials.length} testimonials`)
}

// ---------------------------------------------------------------- clients

async function seedClients() {
  console.log('Seeding clients')

  const existing = await payload.find({ collection: 'clients', limit: 100, overrideAccess: true })
  for (const doc of existing.docs) {
    await payload.delete({ collection: 'clients', id: doc.id, overrideAccess: true })
  }

  for (const [index, client] of (content.home.clientLogos as any[]).entries()) {
    const logo = await mediaId(client.logo, client.name)
    await payload.create({
      collection: 'clients',
      data: { name: client.name, logo, order: index },
      overrideAccess: true,
    })
  }

  console.log(`  ${content.home.clientLogos.length} clients`)
}

// ---------------------------------------------------------------- globals

async function seedSiteSettings() {
  const { site } = content

  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      businessName: site.name,
      legalName: site.legalName,
      tagline: site.tagline,
      email: site.contact.email,
      phone: site.contact.phone,
      address: {
        street: 'Meadowhall Road Industrial Estate, Amos Road',
        town: 'Sheffield',
        county: '',
        postcode: 'S9 1BX',
      },
      mapsUrl: site.contact.mapsUrl,
      latitude: 53.4129,
      longitude: -1.4037,
      ogImage: await mediaId(
        'assets/photos/outdoor-stage-led-screens.jpg',
        'Outdoor stage flanked by LED screens in front of a summer crowd'
      ),
      socials: site.social,
      stats: site.stats.map((stat: any) => ({ value: stat.value, label: stat.label })),
    },
    overrideAccess: true,
  })
}

async function seedNavigation() {
  await payload.updateGlobal({
    slug: 'navigation',
    data: {
      header: [
        { label: 'About Us', href: '/about-us' },
        { label: 'Services', href: '/services' },
        { label: 'Backstage', href: '/gallery' },
        { label: 'Contact Us', href: '/contact-us' },
      ],
      footer: [
        { label: 'Home', href: '/' },
        { label: 'About Us', href: '/about-us' },
        { label: 'Services', href: '/services' },
        { label: 'Backstage', href: '/gallery' },
        { label: 'Contact Us', href: '/contact-us' },
        { label: 'Privacy Policy', href: '/privacy-policy' },
      ],
    },
    overrideAccess: true,
  })
}

async function seedHomePage() {
  const home = content.home
  const [headline1, headline2] = home.hero.headline

  await payload.updateGlobal({
    slug: 'home-page',
    data: {
      seo: {
        description:
          'Sheffield’s AV hire and event production team — lighting, sound, staging and technical support for corporate events, festivals, live music, sport and award ceremonies.',
      },
      hero: {
        headline1,
        headline2,
        script: home.hero.script,
        intro: home.hero.intro,
        image: await mediaId(home.hero.image, 'Outdoor stage flanked by LED screens in front of a summer crowd'),
        primary: { label: 'Enquire here', href: '/contact-us' },
        secondary: { label: 'Come backstage', href: '/gallery' },
      },
      stickyTicket: {
        title: home.stickyTicket.title,
        strap: home.stickyTicket.strap,
        line: home.stickyTicket.line,
        cta: { label: home.stickyTicket.cta, href: '/contact-us' },
      },
      howWeWork: {
        eyebrow: 'How we work',
        heading: home.howWeWork.heading,
        intro: home.howWeWork.intro,
      },
      services: {
        eyebrow: 'Our services',
        heading: 'Unique offerings',
        intro:
          'Experienced technicians delivering AV hire, staging, lighting, sound and video for award ceremonies, conferences, corporate events, festivals and live productions.',
      },
      aboutTeaser: {
        eyebrow: 'About us',
        heading: 'Experts in live events & AV solutions',
        body: 'From small PA setups for schools to large-scale festival productions and custom stage sets for prestigious clients, we’ve worked alongside renowned musicians, actors, comedians and sports stars.',
        image: await mediaId(
          'assets/photos/awards-presenter.jpg',
          'Presenter on a Full Circle awards stage with LED screens'
        ),
        linkLabel: 'Read more',
      },
      testimonials: { eyebrow: 'Testimonials', heading: 'What our clients say' },
      clients: {
        eyebrow: 'Trusted by',
        intro: 'Councils, schools, agencies and brands across Yorkshire and beyond.',
      },
      cta: {
        heading: 'Got an event?',
        accent: 'Let’s go live.',
        newLineBeforeAccent: true,
        body: 'Step backstage and see how we turn ideas into reality, from AV setups to staging, lighting and video walls. Then tell us about yours.',
        image: await mediaId(
          'assets/photos/awards-stage-reflection.jpg',
          'Awards stage with LED screens and pyrotechnics reflected in a mirrored floor'
        ),
        primary: { label: 'Get a quote', href: '/contact-us' },
        secondary: { label: 'Come backstage', href: '/gallery' },
      },
    },
    overrideAccess: true,
  })
}

/** Real coordinates, so the radar plots them geographically (north up). */
const TOWNS = [
  // North / north-west
  { name: 'YORK', latitude: 53.959, longitude: -1.0815, delay: '0s' },
  { name: 'LEEDS', latitude: 53.8008, longitude: -1.5491, delay: '.35s' },
  { name: 'BARNSLEY', latitude: 53.5526, longitude: -1.4797, delay: '.7s' },
  // Around the workshop
  { name: 'DONCASTER', latitude: 53.5228, longitude: -1.1285, delay: '1.05s' },
  { name: 'ROTHERHAM', latitude: 53.4302, longitude: -1.3568, delay: '1.4s' },
  { name: 'SHEFFIELD', latitude: 53.3811, longitude: -1.4701, delay: '1.75s' },
  // South
  { name: 'CHESTERFIELD', latitude: 53.235, longitude: -1.4218, delay: '2.1s' },
  { name: 'NOTTINGHAM', latitude: 52.9548, longitude: -1.1581, delay: '2.45s' },
  // East
  { name: 'LINCOLN', latitude: 53.2307, longitude: -0.5406, delay: '2.8s' },
  // West
  { name: 'MANCHESTER', latitude: 53.4808, longitude: -2.2426, delay: '3.15s' },
  { name: 'BUXTON', latitude: 53.259, longitude: -1.9147, delay: '3.5s' },
]

async function seedAboutPage() {
  await payload.updateGlobal({
    slug: 'about-page',
    data: {
      seo: {
        title: 'About Us',
        description:
          'Two companies merged into one full circle. Our history, expertise and the events we produce across Sheffield and Yorkshire.',
      },
      hero: {
        headline1: 'About',
        headline2: 'Full Circle',
        script: 'Expertise & passion',
        intro:
          'We specialise in high-performance staging, lighting, sound and audio visual solutions, combined with bespoke event design and meticulous production management.',
        image: await mediaId(
          'assets/photos/outdoor-stage-crowd.jpg',
          'Crowd in front of an outdoor stage under coloured lights'
        ),
        facts: [
          { text: 'Est. January 2020' },
          { text: '20+ years’ experience' },
          { text: 'Junction 34, M1' },
        ],
      },
      whatWeDo: {
        eyebrow: 'About Full Circle Event Production',
        heading: 'Whatever the event, we bring it to life',
        intro:
          'We bring expertise and innovation to every event, ensuring a seamless and unforgettable experience.',
        capabilities: [
          'Staging',
          'Lighting',
          'Sound',
          'Audio visual',
          'Bespoke event design',
          'Production management',
        ].map((text) => ({ text })),
        eventTypes: [
          'Festivals',
          'Corporate Functions',
          'Conferences',
          'Award Ceremonies',
          'Private Parties',
          'Theatre Productions',
          'Product Launches',
        ].map((label) => ({ label })),
      },
      history: {
        eyebrow: 'Our history & expertise',
        heading: 'Two companies. One full circle.',
        image: await mediaId(
          'assets/photos/rigging-bw.jpg',
          'Crew rigging truss and lighting in an empty venue before a show'
        ),
        companyOne: 'Company One',
        companyTwo: 'Company Two',
        paragraphs: [
          {
            text: 'Full Circle Event Production was founded in January 2020 when two successful event production companies merged, combining decades of experience into one powerhouse of expertise. This collaboration allowed us to expand our capabilities, grow our client base, and increase our inventory to cover the latest event technologies.',
          },
          {
            text: 'Today, we continue to support small local hires while also managing large-scale event design, production, sales and installation services.',
          },
        ],
        stats: [
          { value: '20+', label: 'Years of industry experience' },
          { value: 'Jan 2020', label: 'Two companies merge' },
        ],
      },
      location: {
        eyebrow: 'Strategic location & accessibility',
        heading: 'Junction 34 of the M1',
        body: 'We’re ideally positioned to serve Sheffield, Rotherham, Doncaster, Barnsley, Leeds, York and beyond. Our proximity to top event venues and transport links allows us to efficiently support clients across the region.',
        address: 'Meadowhall Road Industrial Estate, Amos Road, Sheffield, S9 1BX',
        towns: TOWNS,
      },
      commitment: {
        eyebrow: 'Our commitment to excellence',
        heading: 'Flawless productions, executed with precision',
        body: 'We pride ourselves on our collaborative approach, working closely with clients to transform ideas into reality. Our experienced team is dedicated to delivering flawless productions, ensuring every technical aspect, from sound and lighting to staging and visuals, is executed with precision.',
        image: await mediaId(
          'assets/photos/venue-rig-logo-screen.jpg',
          'Venue rigged with truss, moving lights and an LED screen showing the Full Circle logo'
        ),
        pillars: [
          { title: 'Collaborative', body: 'We work closely with you to turn ideas into reality.' },
          {
            title: 'Premium kit',
            body: 'The latest event technology, from local hires to large installs.',
          },
          {
            title: 'First-class service',
            body: 'Technical expertise to make sure every event is a success.',
          },
        ],
      },
      cta: {
        heading: 'Let’s create something',
        accent: 'extraordinary',
        newLineBeforeAccent: false,
        body: 'Have an event in mind? Get in touch today, and let our team bring your vision to life with expert AV solutions and seamless event production.',
        image: await mediaId(
          'assets/photos/awards-stage-set-gold.jpg',
          'Custom awards stage set lit gold with LED screens'
        ),
        primary: { label: 'Get a quote', href: '/contact-us' },
        secondary: { label: 'Come backstage', href: '/gallery' },
      },
    },
    overrideAccess: true,
  })
}

async function seedServicesPage() {
  await payload.updateGlobal({
    slug: 'services-page',
    data: {
      seo: {
        title: 'Services',
        description:
          'AV hire, staging, lighting, sound and video for award ceremonies, conferences, corporate events, festivals and live music.',
      },
      hero: {
        headline1: 'Our',
        headline2: 'Services',
        script: 'Unique offerings',
        intro:
          'Seamless AV hire, staging, lighting, sound and video solutions for award ceremonies, conferences, corporate events, festivals and live productions.',
        image: await mediaId(
          'assets/photos/awards-stage-reflection.jpg',
          'Awards stage reflected in a mirrored floor with pyrotechnics'
        ),
        facts: [{ text: 'Audio' }, { text: 'Visual' }, { text: 'Infrastructure' }],
      },
      disciplines: {
        eyebrow: 'What we deliver',
        heading: 'One team. Every element.',
        intro:
          'Staying ahead with the latest technology is essential. Our experienced technicians bring it all together under one roof.',
      },
      events: {
        eyebrow: 'Events we produce',
        heading: 'Whatever you’re planning',
      },
      cta: {
        heading: 'Don’t see your event?',
        accent: 'Ask us.',
        newLineBeforeAccent: false,
        body: 'We work closely with clients to transform ideas into reality, delivering immersive experiences that captivate audiences and elevate every event.',
        image: await mediaId(
          'assets/photos/awards-presenter.jpg',
          'Presenter on a Full Circle awards stage with LED screens'
        ),
        primary: { label: 'Enquire here', href: '/contact-us' },
        secondary: { label: 'Come backstage', href: '/gallery' },
      },
    },
    overrideAccess: true,
  })
}

async function seedBackstagePage() {
  await payload.updateGlobal({
    slug: 'backstage-page',
    data: {
      seo: {
        title: 'Backstage',
        description:
          'Photographs from award ceremonies, festivals, live music and community events across Yorkshire and beyond.',
      },
      hero: {
        headline1: 'Come',
        headline2: 'Backstage',
        script: 'Our work in action',
        intro:
          'Step backstage and discover the expertise behind our event productions. From AV setups to staging, lighting and video walls, see how we turn ideas into reality.',
        image: await mediaId(
          'assets/photos/outdoor-stage-led-screens.jpg',
          'Outdoor stage flanked by two LED screens in front of a summer crowd'
        ),
        facts: [
          { text: 'Awards & corporate' },
          { text: 'Live & festivals' },
          { text: 'Behind the scenes' },
        ],
      },
      gallery: { eyebrow: 'Our gallery', heading: 'Bringing events to life' },
      cta: {
        heading: 'Your event,',
        accent: 'next.',
        newLineBeforeAccent: false,
        body: 'Like what you see? Tell us what you’re planning and we’ll bring it to life, from concept to completion.',
        image: await mediaId(
          'assets/photos/festival-crowd-from-stage.jpg',
          'View from the stage over a packed festival crowd'
        ),
        primary: { label: 'Enquire here', href: '/contact-us' },
        secondary: { label: 'View our services', href: '/services' },
      },
    },
    overrideAccess: true,
  })
}

async function seedContactPage() {
  await payload.updateGlobal({
    slug: 'contact-page',
    data: {
      seo: {
        title: 'Contact Us',
        description:
          'Get a free site visit and a tailored quote for your event — call, email or send us the details.',
      },
      hero: {
        headline1: 'Let’s',
        headline2: 'Talk',
        script: 'We’re ready',
        intro:
          'Have an event in mind? Get in touch today, and let our team bring your vision to life with expert AV solutions and seamless event production.',
        image: await mediaId(
          'assets/photos/dj-stage-view.jpg',
          'DJ on stage looking out over an evening festival crowd'
        ),
        facts: [
          { text: '0114 3499273' },
          { text: 'info@fullcircleevents.co.uk' },
          { text: 'Sheffield, S9 1BX' },
        ],
      },
      form: {
        eyebrow: 'Tell us about your event',
        heading: 'We’re ready, let’s talk.',
        replyNote: 'We usually reply within one working day.',
        consentLabel: 'I agree to receive emails from Full Circle Event Production Ltd.',
        errorMessage: 'Please add your name, a valid email and a message so we can get back to you.',
      },
      info: {
        ticketLine: 'Free site visit & tailored quote',
        ticketHeading: 'Your access starts here',
        socialsLabel: 'Follow the crew',
      },
      location: {
        eyebrow: 'Junction 34 · M1',
        heading: 'Covering Yorkshire & beyond',
        body: 'Ideally positioned to serve Sheffield, Rotherham, Doncaster, Barnsley, Leeds, York and beyond.',
        towns: TOWNS,
      },
    },
    overrideAccess: true,
  })
}

async function seedGlobals() {
  console.log('Seeding globals')
  await seedSiteSettings()
  await seedNavigation()
  await seedHomePage()
  await seedAboutPage()
  await seedServicesPage()
  await seedBackstagePage()
  await seedContactPage()
}

// ---------------------------------------------------------------- run

console.log('Seeding Full Circle Event Production from the handover package')

await buildMediaCache()
await seedServices()
await seedDisciplines()
await seedProcessSteps()
await seedEventTypes()
await seedGallery()
await seedTestimonials()
await seedClients()
await seedGlobals()

console.log('\nSeed complete.')
process.exit(0)
