# Editor guide

A plain-English guide for the site owner. Everything here is done in the CMS at `/admin` — there is
no code to touch.

## Logging in

Go to `https://full-circle.colouringcode.com/admin` and sign in with the account set up for you.

## How changes go live

Most content is **draft → publish**. Edit what you need, then press **Publish** (top right). The
public page updates within seconds — no deploy, no waiting.

---

## The pages

Each page has its own entry under **Pages** in the sidebar. Open one to change its copy and images:

- **Home page** — the hero (two headline lines, the green script line, the intro, the background
  photo), the two buttons, the *All Access* ticket, the section headings, the About teaser and the
  closing call to action.
- **About page** — the hero, "What we do" (including the numbered event list), "Our history"
  (including the two company names in the merge animation), the location radar and towns,
  the commitment pillars and the closing call to action.
- **Services page** — the hero, the "One team. Every element." heading and the "Whatever you're
  planning" heading.
- **Backstage page** — the hero and the gallery heading.
- **Contact page** — the hero, the enquiry form headings and messages, the ticket wording and the
  location strip.

**The hero always has two short headline lines and one short script line.** Keep them short or the
layout will wrap awkwardly.

Every page also has a **Search engines** panel at the bottom, with a **title** (just the page name —
the site name is added after it) and a **description** (one sentence, about 150 characters). These are
what Google and social previews show, and each service has the same panel on its detail page.

## The script line

The handwritten green line in each hero is **traced artwork**, not live text — it is drawn on as if
written by hand, and it is tied to the exact wording. If you change a script line in the CMS, that
hero's line reverts to plain script type (the old fade-in) rather than breaking. Tell your developer
the new wording and they can re-trace it.

## The location map

The map on the About and Contact pages places each town from its real latitude and longitude, so the
directions and relative distances between them are correct rather than hand-placed. To move or add a
town, edit its **Latitude** and **Longitude** — a quick search for the town name will give you the
numbers. The workshop itself sits in the middle of the map; its coordinates are under
**Settings → Business details**.

---

## Services

Open **Services** in the sidebar. There are 13, one per event type.

- **Title**, **Group** and **Summary** — the group decides which filter button the card sits under
  on the Services page (Corporate, Entertainment, Community or Technical).
- **Card image** — a portrait photo (roughly 4:5). It is used on the card and on the detail page
  hero.
- **Body** — the deeper copy for the service's own page. Each service has a page at its slug (for
  example `/live-music`), so the URLs match the old website.
- **Order** (sidebar) — lower numbers appear first. **Slug** is the page address; only change it if
  you really mean to change the URL.

## Disciplines

Open **Disciplines** for the three Audio / Visual / Infrastructure cards. Each has a summary, a
dot-list of points, and a **Card image** used on the home page. **Animation** picks the looping
graphic shown on the Services page (equaliser, stage lights, or truss).

## Process steps

Open **Process steps** to edit the four steps in the "Every event comes full circle" timeline on the
home page (Concept, Plan, Build, Show).

## Event types

Open **Event types** to manage the list that runs across the home page marquee and fills the buttons
on the contact form. (The numbered list on the About page is edited inside the About page itself.)

## Gallery (Backstage)

Open **Gallery items**. Each photo has:

- **Image** — the photograph.
- **Caption** — shown on the tile and in the full-screen viewer (e.g. "Business Awards 2024").
- **Category** — which filter it lives under: Awards & corporate, Live & festivals, Community or
  Behind the scenes.
- **Aspect ratio** (sidebar) — the shape of the tile in the grid. Match the photograph where you
  can, so the masonry stays tidy.
- **Order** (sidebar) — lower numbers appear first.

## Testimonials

Open **Testimonials** to add or edit a quote. **Name or organisation** is shown in green under the
quote. The slider on the home page never advances on its own — visitors step through it.

## Client logos

Open **Clients** to manage the "Trusted by" grid on the home page. Upload a **white logo on a
transparent background** — logos with a white box around them show as white rectangles on the dark
background. **Order** sets the sequence.

## Navigation

Open **Settings → Navigation** to change the header and footer menus. Each item has a **Label** and
an **Href** (e.g. `/services`, `/contact-us`). The green **Get a quote** button always points at the
contact page.

## Business details

Open **Settings → Business details** to change the phone number, email, address, Google Maps link,
social links and the two stats (20+ / 2020) shown on the home page. These feed the header, footer
and contact page, so you only change them in one place.

## Photos and alt text

**Alt text is required on every image** — it's what screen readers announce, and it's the single
biggest accessibility factor on a photography-led site. Describe what's in the photo in a short
sentence, e.g. *"Crowd watching a band on a lit stage at an outdoor festival"*.

## If something looks wrong

Nothing is ever lost: every content type keeps **versions**, so you can open a document's history and
restore an earlier draft. Publishing a change again will always fix the live page.
