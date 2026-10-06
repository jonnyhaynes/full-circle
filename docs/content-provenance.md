# Content provenance

Where every asset and piece of copy in this prototype came from, and what still needs a human eye.

## Source

The build follows the **approved design handover** in `docs/fullcircle-handover/`, which Jonny
prepared in October 2026. That package is now the single source of truth:

| What | Where from |
|---|---|
| Page copy | `docs/fullcircle-handover/design-source/*.dc.html` (the approved prototypes) and `content/content.json` |
| Service body copy | The live WordPress site (`/wp-json/wp/v2/pages`), fetched by `pnpm seed` — the longer copy for each of the 13 service pages only exists there |
| Location map coordinates | Real latitude/longitude for the workshop and each town, so the radar places them geographically |
| Photography | `docs/fullcircle-handover/assets/photos/` — 27 photos taken from the live site |
| Client logos | `docs/fullcircle-handover/assets/client-logos/` — 6 logos, converted to white on transparent |
| Design tokens | `docs/fullcircle-handover/content/tokens.css` |
| Hero script lines | Traced from Mrs Saint Delafield by `scripts/_trace.mjs` into `src/lib/scriptTraces.json`, so the line can be drawn on as handwriting |
| Brand palette + type | `#05F60E` green from the live site; Bebas Neue, Jost, Mrs Saint Delafield and Comfortaa from Google Fonts |

The handover package is the source for the pages, photography and settings. The only thing still read
from the live site at seed time is the service body copy (with a fallback to the short summary when
there is no network).

## Known gaps to review before launch

These mirror the open items in `HANDOVER.md` §10 and need the client's sign-off:

- **"How we work" step copy** was written during design (`source: "draft"` in `content.json`).
- **Gallery captions** were written from what is in each photo; event names need confirming.
- **Service filter groups** (Corporate / Entertainment / Community / Technical) are a design
  suggestion.
- **The About history animation** shows "Company One / Company Two"; confirm whether the two merged
  companies can be named.
- **Celebrity Meet and Greets** names Tyson Fury, Floyd Mayweather, Frank Bruno and Ricky Hatton (as
  on the live site). Confirm they are happy to keep it.
- **Contact form**: phone, event date and event type are new fields, and "We usually reply within one
  working day" is a new promise. Both need agreement.
- **Alt text** is written for the hero and gallery images; every image should still be reviewed.
- **Vector logo** and **hi-res photography**: the supplied photos are web-sized. Ask the client for
  hi-res originals, especially for the hero banners (which need at least 2400px wide).
- **Privacy Policy** wording is reproduced as-is from the live site.

## Rights

Full Circle Event Production's name, logo, photography and copy remain the property of Full Circle
Event Production Ltd. They are included here for demonstration only, inside an unaffiliated
prototype, and are not covered by the code licence.
