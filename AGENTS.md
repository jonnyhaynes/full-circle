# Full Circle Event Production — agent guide

This file orients AI agents (Command Code, Claude Code, Codex, …) on this repo. Keep it
lean — it points, it doesn't explain. Substantive design and rationale live in `/docs`;
read those before any non-trivial change. If a section here wants more than a few lines,
move it to its own doc under `/docs` and link it.

## What this is

A Next.js 16 + Payload 3 rebuild of **Full Circle Event Production Ltd's** website, built
from the approved design handover. **It is a prototype, not the live site** — not
affiliated with, commissioned by, or endorsed by the company, and it carries prototype
markings (see below) that must stay until a deliberate cutover.

See `README.md` for status and `docs/dev-workflow.md` for how we build here.

## Stack

- **Next.js 16** (App Router) + **React 19**; TypeScript strict — avoid `any`.
- **Payload 3** CMS embedded in the app (admin + API on the Node.js runtime, not Edge).
- **Tailwind CSS v4**; design tokens live in `src/app/(frontend)/globals.css`.
- **Postgres** (Docker locally, Neon in production) via `@payloadcms/db-postgres`.
- **Cloudflare R2** for media in production, local disk in development.
- **pnpm 10** is the package manager (pinned via `packageManager` in `package.json`).
- Deployed on **Vercel**; see `docs/deploy.md`.

Commands:

- Type-check: `pnpm typecheck` (`tsc --noEmit`)
- Lint: `pnpm lint` (ESLint, `--max-warnings 0`)
- Build: `pnpm build`
- Integration tests: `pnpm test:int` (Vitest)
- E2E / accessibility: `pnpm test:e2e` (Playwright + axe; **local only** — needs seeded content)
- Data: `pnpm migrate`, `pnpm seed`

There is no `pnpm test` script and no Prettier config.

## Load-bearing principles

These shape the schema and the code. Don't change them without checking the relevant doc.

- **Prototype markings stay until cutover.** The `noindex` metadata, `X-Robots-Tag` header,
  notice bar, `robots.txt` and README banner are deliberate and must not be removed
  piecemeal — see `docs/prototype-safeguards.md`.
- **Media never touches the filesystem in production.** Vercel's disk is ephemeral; R2 is
  the store, with `clientUploads: true` to stay under the 4.5 MB function-body limit.
- **Payload runs on the Node.js runtime**, never Edge (admin + API).
- **Migrations are a controlled step** (`pnpm migrate`), never per-request, and every
  environment has its own database — a preview deploy must never reach production data.
- **Publishing revalidates.** `/admin` publishes call `revalidatePath`/`revalidateTag`; the
  live page must update within seconds.
- **Content is seeded, not hand-entered.** `pnpm seed` rebuilds from
  `docs/fullcircle-handover/` and must stay idempotent and re-runnable.
- **Optional integrations degrade gracefully** (no SMTP → mock inbox; no R2 → local disk).

## Scope boundaries

What this project is **not**, and shouldn't drift towards:

- Not the live, client-owned site — do not deploy content or branding without the client's
  involvement and consent (see the README banner).
- Not a general-purpose CMS, CRM or marketing platform; Payload is here to serve this site.
- Not a place for client data, credentials, or production secrets in the repo or the model.

## How we work (the short version)

Full process: `docs/dev-workflow.md`. The non-negotiables:

- **Plan first.** For non-trivial work, save an implementation plan to
  `docs/plans/<ticket>.md` and get a human to approve it before writing code. The plan is
  what gets reviewed, not the first code.
- **A human reviews and merges every PR.** The agent opens the PR and gets CI green; a
  named person reviews the diff against the plan and merges. The agent never merges.
- **Never put secrets, credentials, or client data into the model.** If unsure, it's out of
  bounds until you've asked.
- **Mark AI-assisted work.** Prefix AI-assisted PR titles `[ai-assisted]`, reference the
  approved plan doc, and end the description with a `Manually reviewed by <name>` line.

## Documents

Source of truth lives in `/docs`. Read the relevant doc before responding:

- `docs/dev-workflow.md` — how we build (the loop + standing conventions)
- `docs/deploy.md` — build, environment variables and deployment runbook
- `docs/editor-guide.md` — plain-English guide for the site owner
- `docs/content-provenance.md` — where every asset came from, and what needs review
- `docs/prototype-safeguards.md` — the prototype markings and how to remove them at cutover
- `docs/fullcircle-handover/` — the approved design source
- `docs/plans/` — approved implementation plans

## Working style

- Push back where appropriate rather than agreeing reflexively.
- When changing a load-bearing principle or scope boundary, flag it explicitly rather than
  slipping it in.
- Prefer pointing at a doc section over reproducing its content here.

## Raising pull requests

This project uses **GitHub**. Raise PRs with the `gh` CLI (or the REST API):

- Repo: `jonnyhaynes/full-circle` · Target branch: `main`.
- Push the branch (`git push -u origin <branch>`), then `gh pr create`.
- **Mark AI-assisted PRs:** prefix the title `[ai-assisted]` (or add an `ai-assisted`
  label), reference the approved plan doc (`docs/plans/<ticket>.md`) in the body, and end it
  with a `Manually reviewed by <name>` line confirming the diff was read.
- Keep the `Co-Authored-By` trailer on commits. **A human merges** once CI is green and the
  diff has been reviewed against the plan.

**Issue tracker: GitHub Issues.** One issue = one unit of work; acceptance criteria are the
test contract. Reference the issue in the branch name and PR, and close it from the PR
(`Closes #NN`) once merged.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
