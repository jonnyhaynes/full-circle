# Prototype safeguards

This document tracks every layer of prototype marking so the site can never be mistaken for the
live Full Circle Event Production website.

## What is in place

1. **Dismissible notice bar** (`src/components/PrototypeNotice.tsx`) on every public page, stored in
   `localStorage` once dismissed.
2. **`X-Robots-Tag: noindex, nofollow, noarchive, nosnippet, noimageindex`** on every route via
   `next.config.ts` headers.
3. **`robots` metadata** in `src/app/(frontend)/layout.tsx` (`noindex, nofollow`).
4. **`robots.txt`** at `src/app/robots.ts` disallowing all crawlers.
5. **README + GitHub** banner and description.

## How to go live (do not do this without client sign-off)

1. Remove or disable the notice bar component.
2. Remove the `X-Robots-Tag` header rule in `next.config.ts`.
3. Remove the `robots` metadata in `src/app/(frontend)/layout.tsx`.
4. Update `src/app/robots.ts` to allow indexing and point to the real sitemap.
5. Update the README and GitHub description to remove the prototype language.
6. Switch the domain from `full-circle.colouringcode.com` to `fullcircleevents.co.uk`.
