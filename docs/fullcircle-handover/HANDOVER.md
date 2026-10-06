# Full Circle Event Production — website build handover

**For:** the agent or developer building the production site and wiring it into the CMS.
**From:** design session with Jonny, October 2026.
**Client:** Full Circle Event Production Ltd, Sheffield. Current site: https://fullcircleevents.co.uk (WordPress + Elementor).

The design is approved. Your job is to rebuild it as production code with CMS-managed content. Keep the look, motion and behaviour exactly as described here; improve the engineering.

---

## 1. What's in this package

| Path | What it is |
|---|---|
| `HANDOVER.md` | This brief. Read it first. |
| `design-source/01-home.dc.html` … `05-contact.dc.html` | The approved prototypes, one per page. **Reference only, not production code.** |
| `design-source/blob-to-asset-map.json` | Maps the prototype's original asset IDs to files in `assets/` (already swapped in the HTML). |
| `content/content.json` | All page content as structured data: services, gallery, testimonials, clients, steps, contact details. Seed the CMS from this. |
| `content/tokens.css` | Colours, fonts, sizes, radii as CSS custom properties. |
| `assets/photos/` | 27 photos taken from the live site (web-compressed, see §9). |
| `assets/client-logos/` | 6 client logos, converted to white on transparent for the dark theme. |
| `assets/brand/logo-original-309x94.png` | The client's current logo file (low-res). The build uses a vector recreation instead (§4.1). |

**Reading the prototypes.** Each `.dc.html` is a self-contained page for a design-canvas runtime. Inside you'll see:
- `<helmet><style>`: the page CSS, keyframes and hover rules. Reuse these directly.
- Inline `style="…"`: exact spacing, sizes and colours per element.
- `{{name}}`: values computed in the `<script type="text/x-dc">` block at the bottom (`renderVals()`). `{{accent}}` is always `#05F60E`; `{{glow35}}`/`{{glow15}}` are the green at 35%/16% alpha.
- `<sc-for list=…>` is a loop and `<sc-if value=…>` is a conditional. The data arrays live in the script block and are mirrored in `content/content.json`.
- `<script src="./support.js">` and `x-dc` are the prototype runtime. Don't ship them.

Open the files in a browser for structure, but note they won't run without that runtime. The live canvas (ask Jonny for access) shows them running.

---

## 2. Site map

| Page | Prototype | Notes |
|---|---|---|
| Home `/` | `01-home` | Photo-banner hero, sticky ticket, event-type marquee, How We Work, services, about teaser, testimonials + client logos, CTA panel |
| About Us `/about-us/` | `02-about` | Keep the existing URL |
| Services `/services/` | `03-services` | Lists all 13 services; links out to service detail pages (§6) |
| Backstage `/gallery/` | `04-backstage-gallery` | Menu label "Backstage"; keep the existing `/gallery/` URL for SEO |
| Contact Us `/contact-us/` | `05-contact` | Keep the existing URL |

**Main menu (all pages):** About Us · Services · Backstage · Contact Us, plus a green **Get a Quote** button to Contact. The logo links home. The current page's menu link is green with a 2px green underline (`aria-current="page"`).

**Footer (all pages):** logo, tagline, links (Home, About Us, Services, Backstage, Contact Us, Privacy Policy), and contact details from `content.json → site.contact`.

**Routing in the prototypes:** links between pages point at `*.dc.html`. Map them to the real URLs above. Every "Get a Quote" / "Enquire here" button goes to Contact; every "Come Backstage" link goes to `/gallery/`.

---

## 3. Design system

Tokens are in `content/tokens.css`. The essentials:

- **Colour:** near-black backgrounds (`#050505` page, `#0B0B0B` panels, `#0E0E0E` cards), white text, and the client's neon green **`#05F60E`**. The green is a hard brand requirement: it's the colour on their current site and must not change. Text on green fills is always black (`#050505`) for contrast. White text on green fails contrast, so never use it.
- **Type:**
    - **Bebas Neue** for headlines and numbers.
    - **Jost** for body and UI (also the current site's body font).
    - **Mrs Saint Delafield** for exactly one green script line per page hero, rotated −5° and overlapping the headline's bottom edge.
    - **Comfortaa** for the logo only.
    - All four are on Google Fonts. Self-host them in production.
- **Eyebrows:** 14px Jost 600, uppercase, letter-spacing 3px, green, above each H2.
- **Buttons:**
    - Primary is a green pill (black text, 60px tall, uppercase, letter-spacing 1px) with an arrow icon.
    - Secondary is either a 58px outlined circle with a play icon plus an uppercase label, or an uppercase text link with a 2px green underline.
    - On hover, primary buttons lift 2px and gain a green glow.
- **Shapes:** hero panels have a 32px radius, panels 24px, cards 20px. Borders are `rgba(255,255,255,.08)`. Cards lift 6px on hover and their border turns green.
- **Icons:** inline stroke SVGs, 2–2.4px stroke, round caps. No emoji, no icon font.
- **Bullets:** small green rings or dots. The ring motif is used everywhere instead of generic bullets.

---

## 4. Shared components

### 4.1 Logo
A vector recreation of the client's PNG:
- A solid green ring: 54px viewBox, r=23.5, stroke-width 6.
- To its right, "Full Circle" in Comfortaa 500 at ~27px, with "Event Production" right-aligned underneath at ~13.5px.
- The two "o"s in "Production" are green.

Markup is in any prototype's `<header>`. **Ask the client for their master vector logo** and swap it in if one exists.

### 4.2 The "full circle" ring (signature motif)
**The ring must always be a complete, unbroken circle.** The client was explicit: a ring with a gap is "not full circle".

Build it as a stack of three layers:
1. An outer dashed ring: 1px, white at 22% opacity, rotating clockwise in 60s.
2. The main green ring: a `conic-gradient(#05F60E 0–250deg, #D6FFD8 300deg, #05F60E 330–360deg)`, masked to an 8–9px stroke with a radial mask, a green `drop-shadow` glow, and a reverse rotation over ~30s. The pale highlight is what you see travelling around the ring.
3. A white 12–14px dot that orbits on its own layer (18s).

Uses:
- **Inner-page hero banners and the home hero:** a ~780–820px ring positioned half off the right edge of the panel.
- **About history section:** a merge animation where two rings slide together and become "Full Circle".
- **How We Work:** the closing ring at the end of the timeline.
- **Success state:** the ring that draws itself when the contact form is sent.
- **Small accents:** decorative rings and list bullets throughout the pages.

### 4.3 Page hero banner (all pages)
1. **Panel:** max-width 1360px, 32px radius, `#0B0B0B`, min-height ~620px (760px on Home), with the menu inside it at the top.
2. **Photo:** a full-bleed background photo that eases in from scale 1.08 over 1.8s. Two overlays sit on it:
   - a left-to-right dark gradient (97% → 15% opacity) so the text stays readable;
   - a top-and-bottom vignette.
3. **Ring:** the full-circle ring (4.2), half off the right edge.
4. **Stage beams:** two blurred light beams hanging from the top that sway slowly (`fc-sway`/`fc-sway2`, 8–10s). One is green at 35%, one white at 14%.
5. **Content (left):**
   - a breadcrumb (Home › Page) on inner pages;
   - a two-line Bebas H1;
   - the green script line;
   - an intro paragraph;
   - on inner pages only, a facts line (three items, each with a small green ring) or buttons.

| Page | H1 | Script | Photo |
|---|---|---|---|
| Home | From concept / to completion | Bring it full circle | outdoor-stage-led-screens.jpg |
| About | About / Full Circle | Expertise & passion | outdoor-stage-crowd.jpg |
| Services | Our / Services | Unique offerings | awards-stage-reflection.jpg |
| Backstage | Come / Backstage | Our work in action | outdoor-stage-led-screens.jpg |
| Contact | Let's / Talk | We're ready | dj-stage-view.jpg |

The Home and Backstage heroes share a photo. Swap one if the client supplies more images.

### 4.4 Image CTA panel (bottom of most pages)
A 24px-radius panel with a full-bleed photo and a dark left gradient. It holds a big Bebas H2 with one phrase in green, a supporting line, and the two hero-style buttons.

### 4.5 Footer
See §2. Contact details come from the CMS site settings.

---

## 5. Page-by-page

### 5.1 Home (`01-home.dc.html`)
1. **Hero** (4.3), with the "Enquire here" and "Come backstage" buttons.
2. **Sticky "All Access" ticket** (homepage only):
   - **Look:** fixed to the bottom-right corner (inset `clamp(12px,2vw,28px)`). It's a 252px green card holding a tilted (−5°) paper ticket stub: "Full Circle / All Access", "Audio · Visual · Infrastructure", a barcode strip, and notches on both sides. The stub floats gently. Below it sit "Site visit & tailored quote" and "Get in touch" with a black circular arrow. The whole card links to Contact.
   - **Close:** a black circular **X** on the card's top-right corner dismisses it permanently. Store `fc-ticket-dismissed=1` in localStorage, wrapped in try/catch, and don't render it again on later visits.
   - **Phones (≤640px):** it starts minimised as a 68px green round button with a ticket icon and a pulsing ring. Tapping it opens the full card, which has the same X.
   - **Desktop:** it starts open.
   - **Motion:** it enters with a small scale/translate pop.
   - **Accessibility:** use `role="region"` with a label, an X with `aria-label="Close and don't show again"`, and the round button labelled "Open All Access: get a quote".
3. **Event-type marquee:** an endless horizontal scroll (40s) of Bebas event types. Items alternate solid white and outlined, separated by small green rings. The types are in `content.json → home.marqueeEventTypes`.
4. **How We Work timeline:**
   - **Layout:** a heading and intro, then four columns (Concept, Plan, Build, Show), each with a number, title and line of text. There's nothing to click.
   - **The loop (9s):** a green line draws left to right. Each step's node fills green and glows as the line passes. The line then closes into a ring at the end that lights up "Full circle", and everything fades and replays. The keyframes are `fc-line`, `fc-node0–3`, `fc-close` and `fc-endtext`.
   - **Phones (≤900px):** the steps go to a 2×2 grid and the line and end ring are hidden.
5. **Services, three cards:** Audio, Visual and Infrastructure, each with a photo, number, title, summary and dot-list. The image zooms on hover. (Consider linking each card to Services.)
6. **About teaser:** an awards photo with a decorative glowing ring, the "Experts in live events & AV solutions" copy, the 20+ / 2020 stats and a "Read more" link to About.
7. **Testimonials and Trusted By, in one split panel:**
   - **Left:** a quote slider with three real quotes. It has previous and next buttons (the next button is green), progress bars that double as tabs, and a fade between quotes. It is not auto-advancing.
   - **Right:** "Trusted by" with a 2×3 grid of white client logos.
8. **CTA panel:** "Got an event? Let's go live." over awards-stage-reflection.jpg.
9. **Footer.**

### 5.2 About (`02-about.dc.html`)
Copy is from the live About page.
1. **Hero:** facts line reading Est. January 2020 · 20+ years' experience · Junction 34, M1.
2. **What we do:**
   - **Left:** intro and a 2-column capabilities list with ring bullets.
   - **Right:** a large Bebas list of 7 event types, numbered 01–07, that turn green and nudge right on hover.
3. **Our history:**
   - **Left:** the black-and-white rigging photo.
   - **Right:** "Two companies. One full circle." with an 8s merge animation. Two rings sit apart, labelled "Company One" and "Company Two", then slide together, turn green and reveal "Full Circle" (keyframes `fc-mergeL/R`).
   - **Copy:** the merger paragraphs and two stats.
   - **Open item:** the real company names (§10).
4. **Location panel:** "Junction 34 of the M1", the address, and a stylised radar map. Full Circle is a pulsing green dot with expanding rings, and six towns sit around it with blinking dots. This is decorative and approximate, not a real map.
5. **Commitment:** copy, three small pillar cards and the venue-rig photo.
6. **CTA:** "Let's create something extraordinary".

### 5.3 Services (`03-services.dc.html`)
1. **Hero:** facts line reading Audio · Visual · Infrastructure.
2. **"One team. Every element.":** three discipline cards, each with its own looping micro-animation:
   - **Audio:** a bouncing equaliser.
   - **Visual:** four stage lights with pulsing beams.
   - **Infrastructure:** a floating truss with a glowing green deck.
   - The copy is in `content.json → disciplines`.
3. **"Whatever you're planning":** a filterable grid of all 13 services.
   - **Filters:** All · Corporate · Entertainment · Community · Technical, each with a count. They are tabs with `aria-selected`.
   - **Cards:** portrait (472:600) with the photo, a ring, the group label and the title. On hover the photo dims and zooms and a summary plus "Find out more" slide up. On touch devices the summary is always shown.
   - **Motion:** cards fade and rise in sequence when the filter changes.
   - **Data:** `content.json → services` (title, slug, group, summary, image).
4. **CTA:** "Don't see your event? Ask us."

### 5.4 Backstage / gallery (`04-backstage-gallery.dc.html`)
1. **Hero:** facts line reading Awards & corporate · Live & festivals · Behind the scenes.
2. **Gallery:**
   - **Layout:** a masonry grid (CSS columns, ~280px min) of 25 photos.
   - **Filters:** All · Awards & Corporate · Live & Festivals · Community · Behind the Scenes.
   - **Hover:** the photo zooms and a caption (category and title) slides up with a ring "+".
   - **Lightbox:** clicking opens a full-screen viewer with a counter, previous/next buttons, a close button and the caption.
   - **Lightbox in production:** add Esc to close, arrow-key navigation, a focus trap and focus return.
   - **Data:** `content.json → gallery`.
3. **CTA:** "Your event, next."

### 5.5 Contact (`05-contact.dc.html`)
1. **Hero:** facts line showing phone · email · postcode.
2. **Enquiry form** (left, large panel):
   - **Fields:** Name\*, Email\*, Phone, Event date, Type of event (single-select pill buttons with `aria-pressed`), Message\*, and a consent checkbox reading "I agree to receive emails from Full Circle Event Production Ltd."
   - **Validation:** inline. Invalid fields get a red border and the form shows an alert line.
   - **Success state:** a ring draws itself and the page reads "Thanks, {first name}", with a "Send another enquiry" link.
   - **Prototype vs production:** the prototype does not submit anywhere. In production, post to the CMS's form handler or email service, add spam protection (the live form uses reCAPTCHA), and keep the success state.
3. **Info column:**
   - the green All Access ticket ("Free site visit & tailored quote");
   - email, phone and address rows, with the address linking to Google Maps directions;
   - Instagram, Facebook and YouTube buttons.
4. **Location strip:** "Covering Yorkshire & beyond" with the radar map from About.

---

## 6. CMS content model (suggested)

Build for whatever CMS the business uses. The current site is WordPress/Elementor, so these map naturally to custom post types plus ACF/options, but nothing here is WordPress-specific.

| Type | Fields | Notes |
|---|---|---|
| **Site settings** (singleton) | name, tagline, email, phone, address, maps URL, socials, stats[] | Footer, contact page, hero facts |
| **Page** (Home/About/Services/Backstage/Contact) | hero: h1 line 1, h1 line 2, script line, intro, image, facts[]; SEO title/description; sections (flexible blocks) | Hero must stay two short H1 lines and one short script line |
| **Service** (×13) | title, slug, group (Corporate/Entertainment/Community/Technical), summary, image (portrait), alt, order, body (rich text for a detail page) | The live site has a page per service (e.g. `/live-music/`). Keep those URLs and restyle detail pages with the hero banner + body + CTA panel |
| **Discipline** (×3) | title, summary, points[], animation key (audio/visual/infrastructure) | Services page cards + home service cards |
| **Gallery item** | image, caption, alt, category, aspect ratio (or derive), order | Backstage page |
| **Testimonial** | quote, name/organisation, order | Home slider |
| **Client** | name, logo (white on transparent), URL (optional), order | Trusted By grid |
| **Process step** (×4) | number, title, body | How We Work |
| **Event type** | label, order | Home marquee, About list, contact form pills |
| **Enquiry** (form submissions) | name, email, phone, event date, event type, message, consent, timestamp | Notify info@fullcircleevents.co.uk |

Seed everything from `content/content.json`. Images are referenced as `assets/...` paths.

---

## 7. Motion and interaction rules

- **Animations:** all are CSS keyframes, and they're defined in each prototype's `<helmet><style>`. Reuse the names and timings.
- **Reduced motion:** honour `prefers-reduced-motion: reduce` by turning off all animation and transitions. Every prototype already does this, so keep it.
- **Entrances:**
  - Hero text rises in (`fc-rise`, 1s).
  - The script line fades in after a 0.6s delay.
  - Banner photos ease in from scale 1.08.
- **Ambient loops:** the spinning ring layers, swaying beams, marquee, How We Work timeline, discipline micro-animations, About merge animation and radar pings. Keep them all slow and subtle.
- **Hover:** cards lift and zoom, primary buttons lift and glow, and links turn green.
- **Performance:**
  - Pause off-screen loops with an IntersectionObserver if they cost anything.
  - Lazy-load images below the fold.
  - Serve AVIF/WebP with `srcset`.

## 8. Responsive and accessibility

- **Fluid pages:**
  - Pages are fluid, with a max container width of 1320px and a 16px side gutter.
  - Layouts use flex-wrap and grid with `minmax`, so they collapse to one column on phones.
  - Type uses `clamp()`.
- **At phone width:**
  - The menu needs a proper mobile menu. The prototype just wraps the links, so build a burger.
  - The hero ring is mostly off-canvas.
  - How We Work goes to a 2×2 grid.
  - The sticky ticket starts minimised.
- **Accessibility:**
  - Use real buttons, links and labelled inputs throughout.
  - Icon-only buttons have `aria-label`.
  - Filters are tabs.
  - Decorative graphics are `aria-hidden`.
  - Keep text contrast at 4.5:1 or better: white or muted white on black, black on green.
  - Add visible focus styles (a green outline is fine). The prototypes rely on browser defaults.
- **Semantics:** one H1 per page, and H2s per section.

## 9. Assets

- **Source:** the photos were downloaded from the live site, so they're web-sized. The service photos are only 472px wide.
- **Hi-res originals:** ask the client for hi-res originals, especially for the hero banners (which need at least 2400px wide) and the service cards.
- **File naming:** file names describe the content. `content.json` maps each image to where it's used.
- **Client logos:** converted to white silhouettes for the dark theme. Get official versions if possible.
- **Excluded logos:** the live site's Nexus logo appears twice (one copy dropped), and an orange "R4" logo was left out as unidentified.

## 10. Open items needing client sign-off

1. **How We Work step copy** (all four steps) was written during design. `source: "draft"` in content.json.
2. **Gallery captions** were written from what's in each photo (e.g. "Business Awards 2024", "Hooton Lodge Farm"). Event names need confirming.
3. **Service filter groups** (Corporate/Entertainment/Community/Technical) are a design suggestion.
4. **About history animation** has "Company One / Company Two" placeholders. Confirm whether the two merged companies can be named.
5. **Celebrity Meet and Greets** summary names Tyson Fury, Floyd Mayweather, Frank Bruno and Ricky Hatton (as on the live site). Confirm they're happy to keep it.
6. **Contact form:** phone, event date and event type are new fields, and "We usually reply within one working day" is a new promise. Both need agreement.
7. **Three-card copy (Audio/Visual/Infrastructure)** and the Services discipline cards are lightly rewritten from live-site copy. Worth a read.
8. **Vector logo** and hi-res photography (§9).
9. **Privacy Policy** page: carry over the existing `/privacy-policy/` content and restyle it with the inner-page hero.
10. **Redirects:** keep `/about-us/`, `/services/`, `/gallery/`, `/contact-us/` and all service detail URLs. Drop `/testimonials/` from the menu and redirect it to the home testimonials section (`/#testimonials`), since testimonials now live on Home.

## 11. Definition of done

- [ ] All five pages match the prototypes visually at 1440px, 1024px, 768px and 390px.
- [ ] All copy, images, services, gallery, testimonials, clients and contact details come from the CMS. Nothing is hard-coded except UI labels.
- [ ] The rings are complete circles everywhere and the signature animations run as specified, with reduced-motion respected.
- [ ] The sticky ticket works: open on desktop, minimised on phones, and the X dismisses it permanently.
- [ ] The services filter, gallery filter and lightbox (with keyboard support), testimonial slider and contact form (real submission, validation, spam protection, success state) all work.
- [ ] Mobile menu built.
- [ ] Existing URLs preserved or redirected. SEO titles and descriptions are editable.
- [ ] Lighthouse scores of 90+ for accessibility and best practices. Images optimised and lazy-loaded.
