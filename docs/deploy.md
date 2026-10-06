# Deploy runbook

One Next.js app on Vercel, with Payload embedded — admin, API and public site deploy together.

## Requirements

- Node 22
- pnpm 10
- Docker (for local Postgres)

## Local development

```bash
pnpm install
docker compose up -d   # Postgres on :55433
pnpm migrate
pnpm seed              # seeds content and images from the handover package (no network needed)
pnpm dev
```

## URLs

The public routes match the live site: `/`, `/about-us`, `/services`, `/gallery`, `/contact-us`,
`/privacy-policy`, and each service under `/services` (e.g. `/services/live-music`).
`next.config.ts` redirects the live site's root service URLs (e.g. `/live-music`), the old `/about`
and `/contact`, and `/testimonials` to their new homes.

## Environment variables

Set these for **Preview** and **Production** in Vercel:

| Variable | Notes |
|---|---|
| `DATABASE_URL` | **Pooled** Neon connection string (serverless opens many short-lived connections) |
| `PAYLOAD_SECRET` | Long random string |
| `NEXT_PUBLIC_SERVER_URL` | e.g. `https://full-circle.colouringcode.com` |
| `EMAIL_FROM_ADDRESS`, `EMAIL_FROM_NAME` | Enquiry notification sender |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | Omit to fall back to ethereal.email in dev |
| `ENQUIRY_NOTIFICATION_EMAIL` | Where contact-form notifications go |
| `R2_BUCKET`, `R2_ENDPOINT`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_PUBLIC_URL` | Leave blank to keep media on local disk in development |

Every optional integration degrades gracefully — without SMTP the app uses a mock inbox, without R2
it writes media to disk.

## Vercel notes

- **One project.** Payload's admin and API run on the **Node.js runtime**, not Edge.
- **Media must not go on the filesystem** — Vercel's disk is ephemeral. That's what R2 is for.
- **The 4.5 MB function body limit is the main upload gotcha.** The S3/R2 adapter is configured with
  `clientUploads: true` so the browser uploads straight to the bucket and only the reference reaches
  the function. Keep that on.
- **Migrations** run as a controlled step (`pnpm migrate`), never per-request.
- Separate database per environment, so a preview deploy can never touch production data.
- **Revalidation:** publishing in `/admin` calls `revalidatePath`/`revalidateTag`, so the live page
  updates within seconds.

## First deploy

1. Push to GitHub.
2. Import the repo in Vercel.
3. Add the environment variables above.
4. Deploy.
5. Run `pnpm migrate` against the production database (`DATABASE_URL` from Neon).
6. Visit `/admin` and create the first admin user.
7. Add the domain, then confirm the prototype markings are still in place.

## Post-deploy checks

- [ ] `/` loads over HTTPS and the prototype notice bar is visible
- [ ] `/admin` loads and you can sign in
- [ ] Publishing a service updates the live page within seconds
- [ ] A photo larger than 4.5 MB uploads (proves client uploads are working)
- [ ] `curl -I https://<domain>/` shows `X-Robots-Tag: noindex...`
- [ ] `https://<domain>/robots.txt` disallows everything
- [ ] Contact form submits and the enquiry appears under **Lead capture → Form submissions**

## Going live for real

See `docs/prototype-safeguards.md` for the exact list to remove (notice bar, `X-Robots-Tag`,
`noindex` metadata, `robots.txt`, README banner) and the domain cutover from
`full-circle.colouringcode.com` to `fullcircleevents.co.uk`.
