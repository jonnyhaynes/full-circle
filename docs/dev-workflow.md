# Full Circle Event Production — development workflow

The repeatable process and standing conventions for building Full Circle Event Production.
This captures *how* we build; *what* to build lives in the source-of-truth docs under
`/docs`. Read the relevant sections before starting a piece of work, and flag any change to
a load-bearing decision explicitly rather than slipping it in.

---

## The loop (per ticket / unit of work)

1. **Orient** — read the issue and the relevant repo docs. Work on an isolated branch so
   your work doesn't collide with others'.
2. **Plan** — the agent produces an implementation plan and saves it to
   `docs/plans/<ticket>.md`. **A human reviews and approves the plan before any code is
   written.** This is the single biggest quality lever: the plan is diffable,
   referenceable, and decoupled from any one agent session.
3. **Backlog** — break the approved plan into tracked work (GitHub issues), each item
   carrying its acceptance criteria as the test contract.
4. **Build** — work the plan task by task, **test-first**: each acceptance criterion
   becomes a failing test before the implementation. Prefer a fresh agent context per task
   — it keeps each unit focused and reviewable. Review between tasks: does it match the
   plan, and is the code good?
5. **Review** — run a code review across the branch. **Vet the findings; don't blindly
   apply them.** Fix the real issues and strengthen any test that passed when it shouldn't.
6. **Ship** — get `pnpm typecheck`, `pnpm lint` and `pnpm build` green locally (the same
   gates CI runs), then open a PR. CI must be green before review. The Playwright suite
   (`pnpm test:e2e`) needs seeded content, so it runs locally rather than in CI.
7. **Land** — a human reviews the diff against the plan and merges. Then sync `main`,
   delete the branch, and file any deferred follow-up work as GitHub issues.

Automation never moves the human gates: **plan approval (step 2) and the merge (step 7) are
always a person's decision.**

---

## Standing conventions

### Stack & tooling

- **Package manager:** pnpm (pinned via `packageManager` in `package.json`). Use it; don't
  mix in npm/yarn. Commit `pnpm-lock.yaml`.
- **TypeScript:** strict mode; avoid `any`. `pnpm typecheck` (`tsc --noEmit`) is a CI gate.
- **Framework:** Next.js 16 (App Router) + Payload 3 embedded in the app. Read the bundled
  guide in `node_modules/next/dist/docs/` before writing Next.js code — this major version
  differs from older conventions. Keep Payload on the Node.js runtime, never Edge.
- **Styling:** Tailwind CSS v4; design tokens live in `src/app/(frontend)/globals.css`.
- **Testing:** the acceptance criteria are the test contract. Use `pnpm test:int` (Vitest)
  for unit/integration and `pnpm test:e2e` (Playwright + axe) for end-to-end and
  accessibility. There is no `pnpm test` script. Test behaviour, not implementation; a test
  must fail if the feature is removed.
- **Lint:** ESLint (`pnpm lint`, `--max-warnings 0`). There is no Prettier config — match
  the surrounding code.

### Secrets & sensitive data

- Secrets never go in the repo or the model. `.env*` files are git-ignored (only
  `.env.example` is tracked) — keep it that way.
- Client or production data is out of bounds. Anything touching sensitive data needs an
  explicit OK first.
- Optional integrations must keep degrading gracefully (no SMTP → mock inbox; no R2 → local
  disk); a missing credential must never break local development.
- Tool-specific guardrails (permissions, hooks, skills) are **personal and git-ignored**
  (`.claude/`, `.commandcode/`, `.agents/`) — each developer configures their own agent
  tool. If a convention matters to everyone, put it in a tracked doc, not a personal config.

### Git & pull requests

This project uses **GitHub**. Raise PRs with the `gh` CLI (or the REST API):

- Repo: `jonnyhaynes/full-circle` · Target branch: `main`.
- Push the branch (`git push -u origin <branch>`), then `gh pr create`.
- **Mark AI-assisted PRs:** prefix the title `[ai-assisted]` (or add an `ai-assisted`
  label), reference the approved plan doc (`docs/plans/<ticket>.md`) in the body, and end it
  with a `Manually reviewed by <name>` line confirming the diff was read.
- Keep the `Co-Authored-By` trailer on commits. **A human merges** once CI is green and the
  diff has been reviewed against the plan.
- Leave the managed `nextjs-agent-rules` block in `AGENTS.md` intact — `next dev` re-adds
  it, so removing it just recreates an uncommitted change.

**Issue tracker: GitHub Issues.** One issue = one unit of work; acceptance criteria are the
test contract. Reference the issue in the branch name and PR, and close it from the PR
(`Closes #NN`) once merged.

---

*This doc is the standing process. Update it when a convention genuinely changes (and say
so), rather than re-deciding per ticket.*
