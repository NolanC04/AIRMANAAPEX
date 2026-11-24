# CLAUDE.md — Airman Apex

Read `.github/copilot-instructions.md`, then `.github/instructions/design.instructions.md` (it supersedes the old navy/Barlow design and resolves the open decision: this app replaces the on-device pilot app), then `docs/build-phases.md`.

## Standing rules

- Not unit tooling: no feedback campaigns, flight blocks, unit reports or leadership briefings. Those live in NolanC04/UNITTOOLS. Official duty training never uses this app.

- Own code, no Base44. Next.js + Supabase + Vercel; Claude API only for GENE, server-side, through `lib/gene.ts`.
- Preview first. Never merge to main or deploy production without Nolan's approval.
- Privacy: feedback responses carry no user id (receipts are separate, dates only); reports hidden below 5 responses; notification emails carry no content.
- Almanac private: owner only; facilitators see an entry only when the learner shares it (RLS + server).
- Class wall and Bridge gate are enforced on the server (`lib/access.ts`, `lib/guard.ts`) and in RLS (`module_content` view).
- No clinical or diagnostic language. No streaks, points, XP, badges, leaderboards. No fabrication: missing content renders `[NOLAN: …]`.
- Closing Laws: Nolan-authored only (`/api/laws`); `closing_draft` from the pilot compendium is never shown to learners.
- Admin-judgment gate: imports become proposals with a diff; approval needs a checkbox and a click.
- Loud failure: one silent retry, then a visible message with Retry.
- Military Crisis Line (988 then 1, text 838255) in the footer and on request screens. Unofficial disclaimer everywhere. No USAF logos.
- AAPEX materials never mention The Vantage: no byline, footer, email, export or module text. `lib/brand.ts` blocks it on import.
- GENE's prompt is fetched from NolanC04/SIGNETOPS `cowork-prompts/gene.md`; never copy it here. Pin it with `GENE_PROMPT_REF` (a commit SHA) for the pilot.
- GENE validation: every GENE call files a `gene_reads` row (model, prompt hash, rubric version, tokens). Raters score first reads blind at `/rate`; they never see identity, GENE's grade, or another rater's grade. Agreement (quadratic weighted kappa) shows in Admin. GENE stays experimental until it meets the target Nolan sets before T-0.

## Checks

`npm run typecheck && npm run lint && npm test && npm run build`
