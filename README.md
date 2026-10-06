# Full Circle Event Production — Website Prototype

> ⚠️ **This is a prototype, not a live website.**
>
> This repository is an exploratory rebuild of **Full Circle Event Production Ltd’s** website for
> demonstration purposes. It is **not affiliated with, commissioned by or endorsed by** Full Circle
> Event Production Ltd. Content has been assembled from their public site and should not be used or
> deployed without their involvement and consent.
>
> For the real business, see [fullcircleevents.co.uk](https://fullcircleevents.co.uk/).

## Design

This build follows the approved design handover (`docs/fullcircle-handover/`): a dark
`#050505` canvas with the client's neon green `#05F60E`, Bebas Neue headlines, Jost body copy,
a single Mrs Saint Delafield script line per hero, and Comfortaa for the logo. Its signature is the
"full circle" ring — an animated, always-complete ring used in the hero, the timeline, the About
history merge, the location radar and the contact success state.

Each page has its own layout, rebuilt from the five approved prototypes:

- `/` — photo hero, the sticky "All Access" ticket, event-type marquee, How We Work timeline,
  disciplines, About teaser, testimonial slider + trusted-by grid.
- `/about-us`, `/services`, `/gallery` (Backstage), `/contact-us` — inner-page heroes with their own
  sections, plus a service detail page at `/services/<slug>` for each of the 13 services.

## Stack

- **Next.js 16** with the App Router
- **Payload 3** CMS (embedded in the Next.js app)
- **Tailwind CSS v4** (design tokens in `src/app/(frontend)/globals.css`)
- **Postgres** (Docker locally, Neon in production)
- **Cloudflare R2** for media in production, local disk in development
- Hosted on **Vercel**

## Getting started

```bash
# Install dependencies
pnpm install

# Start Postgres
docker compose up -d

# Run migrations and seed content from the handover package
pnpm migrate
pnpm seed

# Start the dev server
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the site and
[http://localhost:3000/admin](http://localhost:3000/admin) for the CMS.

`pnpm seed` reads `docs/fullcircle-handover/` for the pages, photography and settings, and pulls the
longer body copy for each of the 13 service pages from the live WordPress site (falling back to the
short summary when there is no network). It is safe to re-run: services match on slug, testimonials
and clients on name, media on filename, and gallery, disciplines, process steps and event types are
rebuilt from scratch.

## Verification

```bash
pnpm typecheck   # TypeScript
pnpm lint        # ESLint
pnpm build       # production build
pnpm test:e2e    # Playwright: axe + interaction tests
```

The Playwright suite visits every page and asserts **zero axe violations** (WCAG 2.0/2.1/2.2 A + AA),
then checks the skip link, the services and gallery filters, the lightbox (open → arrow keys → Esc →
focus return), the testimonial slider, the contact form (validation → success), the sticky ticket
(desktop open / phone minimised / permanent dismiss) and reduced-motion behaviour. It needs seeded
content, so it runs locally rather than in CI — CI covers `typecheck`, `lint`, `migrate` and `build`.

## Documentation

- `docs/editor-guide.md` — plain-English guide for the site owner
- `docs/deploy.md` — build, environment variables and deployment runbook
- `docs/content-provenance.md` — where every asset came from, and what needs review
- `docs/prototype-safeguards.md` — the prototype markings and how to remove them at cutover
- `docs/fullcircle-handover/` — the approved design source

## Prototype safeguards

This prototype is marked as such in five places:

1. Dismissible notice bar on every public page.
2. `X-Robots-Tag: noindex, nofollow, noarchive, nosnippet, noimageindex` header.
3. `robots` metadata with `noindex, nofollow`.
4. `robots.txt` disallowing all crawlers.
5. README banner and GitHub description.

See `docs/prototype-safeguards.md` for the full checklist and how to remove them at cutover.

## License

Code in this repository is provided as a prototype and is not licensed for reuse. Full Circle Event
Production’s name, logo, text and photography remain the property of Full Circle Event Production
Ltd and are included for demonstration only.
