# Airman Apex

The MRT-facilitated unit program app: the 24-module AAPEX walkthrough (class-only), GENE, the private Almanac, check-ins and outcomes, plus the unit side (anonymous feedback, growth-session requests, tracks and events, flight blocks). Next.js · Supabase · Claude API · Resend · Vercel.

## Setup (local, 6 steps)

1. `npm install`
2. `cp .env.example .env.local` and set `APEX_ADMIN_EMAIL` to your email.
3. `npm run dev` and open http://localhost:3000. Without Supabase keys the app uses a local dev store (`.data/`) and signs in without email. Production refuses that mode.
4. Sign in with your admin email (no invite code needed). Go to **People** and create invite codes for learners and facilitators.
5. `npm run bundle:pilot`, then **Admin → Import content** and upload `pilot-bundle.json`. Review each diff and approve.
6. **Classes & room → Start class** (P1 = M01, M09, M17). Learners join with the code or QR.

## Setup (Supabase + Vercel)

1. Create a Supabase project; run `supabase/migrations/*.sql`; enable Email (magic link); set the redirect URL to `/auth/callback`.
2. Add every variable from `.env.example` to Vercel. `ANTHROPIC_API_KEY` and `GITHUB_TOKEN` (read access to SIGNETOPS) power GENE.
3. Verify a non-.mil `NOTIFY_FROM` domain in Resend.
4. Share `APEX_IMPORT_SECRET` with Studiolo for `studiolo.apex/1` packages (`POST /api/import/studiolo`).
5. Deploy a preview. Production only on Nolan's approval.

## Checks

`npm run typecheck && npm run lint && npm test && npm run build` — unit tests cover scale scoring, diff-in-diff and Cohen's d against a hand calculation, the class wall, the Bridge gate, the 5-response threshold, content-free emails and GENE's cadence rule.

## Before go-live (not code)

- [ ] Unit privacy office / JA sign-off on data handling
- [ ] Privacy Act statement decision for the request form
- [ ] Referral language coordinated with the Chaplain and MFLC (warm handoff link)
- [ ] Retention: purge request threads 90 days after completion; keep anonymous aggregates
- [ ] Confirm .mil inboxes accept the sender domain
- [ ] Decide `modules_readable_after_completion` (Admin → Settings; default off)

## Status against the build phases

| Phase | State |
|---|---|
| 0 Foundation | Built. Azure workflow removed. 390px, no horizontal scroll. |
| 1 Auth and roles | Built: invite code + email + consent, magic link, roles, anon ids, role-gated routes, env admin seed. |
| 2 Feedback loop | Built and verified: hidden at 4, shown at 5; responses unlinked; You said / We did. |
| 3 Growth sessions | Built: request, thread, status, content-free notifications. Needs Resend to send email. |
| 4 Tracks, events, blocks | Built: four tracks, Guardian Gauntlet (date/location `[NOLAN]`), RSVP/cancel, Discord, flight blocks. |
| 5 Content model | Built: 24 placeholder modules, sessions view, JSON/Studiolo import with diff + approval, pilot bundle script. |
| 6 Class wall | Built and verified by API: locked before join, open in class, locked after End class. |
| 7 GENE + Almanac | Built: 3 questions then a closing line, observations, True/Partly/Not with the 70% rule, seal, export, delete, Day 7/30. Needs `ANTHROPIC_API_KEY` for live GENE. |
| 8 Interactive layer | Not started: break games and the radial transition engine. |
| 9 Polish + PDF briefing | Partly: error/empty states; PDF briefing not started. |
| 10 Slide player | Built: 13-slide map, Bridge gate server-enforced, thumbnails, swipe, activity cues. |
| 11 Room control (realtime) | Not started: follow-room sync, reveals, disruptions, projector route. |
| 12 Check-ins + outcomes | Built: agreement, T0–T3 scales verbatim, means, diff-in-diff, Cohen's d, CSV. |
| 13 Admin + audit + safety | Built: material list, Closing Law authoring, access changes, audit log, safety flags. |
