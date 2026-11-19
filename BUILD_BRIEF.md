# Airman Apex — Build Brief

Owner: Nolan Langford · Written 18 Nov 2026 · App 1 of 4 in the Vantage build (Airman Apex, Studiolo, Signet Ops, The Vantage)

Read this whole file and the Standing Rules before writing code. Preview first: nothing deploys to production until Nolan approves.

## State of this repo (audited 18 Nov 2026)

`main` holds only `.github/workflows`. No app code is here yet. An earlier README in SIGNETOPS refers to a repo named `airman-apex`; that repo is not on this account. If that code exists elsewhere, bring it in; otherwise build fresh from this brief.

## What the app is

One app with two halves: the MRT-facilitated program app for the unit, and the 24-module AAPEX walkthrough.

### Half 1: Facilitation

- **Feedback loop.** Facilitator pushes feedback forms to a unit or flight. Loop: sent, received, stored, reported. Feedback is anonymous. Flight-level reports stay hidden until at least 5 responses.
- **Growth session requests.** Any Airman can request one-on-one, small group or whole-flight coaching. Requests route only to admin and facilitator emails, with a threaded conversation in the app. Emails notify and link in; they never contain the request reason. Request status: new, scheduled, completed, closed.
- **Tracks.** Hybrid Athletes (run club, fitness events), Hybrid Intellects (extended conversation on relevant uncommon strategies), Faith Forward (Bible study rooted in application), Social (mentorship and unit events, e.g. the Guardian Gauntlet). Events support RSVP.
- **Discord.** Built-in link to the Airman AAPEX Discord (URL is a setting).
- **Block calendar.** Monthly 45-minute resiliency block per flight during training week; topic chosen from feedback results.
- **You said / we did.** A page showing what feedback changed.

### Half 2: Module walkthrough

- 24 modules in three phases: Phase 1 Resiliency (Shield), Phase 2 Efficacy (Sword), Phase 3 Polymathy (Star), 8 modules each. Delivered as 8 sessions, three modules per session (k, k+8, k+16).
- Each module: Learn, Field work, Reflect (one GENE Socratic question that grades the reasoning, not the answer), Review (Day 7 and Day 30).
- Interactive layer: GENE Socratic assessment, verification, the 12 break games, the radial transition engine (SHATTER / HELIX / FOLD). Use the existing walkthrough visual as the design reference.
- GENE prompt: follow `cowork-prompts/gene.md` in NolanC04/SIGNETOPS. Keep a pointer to it, not a copy.
- Almanac: sealed entries per module; private to the Airman; exportable by the Airman.
- Closing Laws: only Nolan-authored laws are ever shown. AI never authors them.

### Class-only access wall

Modules are locked outside class. The facilitator starts a session from the admin view, which creates a short class code and a QR code. Only that session's modules unlock, only for Airmen who joined, until the facilitator closes the session. Decide with Nolan whether completed modules stay readable afterward.

## Roles

Airman, Facilitator (MRT), Admin (Nolan).

## Data model (starting point)

User(id, role, unit, flight, anon_id) · FeedbackCampaign(id, unit, flight, form_id, sent_at, closes_at) · FeedbackResponse(campaign_id, answers, no user link) · SessionRequest(id, user_id, kind, status, created_at) · RequestMessage(request_id, author_id, body, at) · Track · Event(track_id, title, starts_at) · RSVP · ClassSession(id, code, module_ids[], opened_by, opened_at, closed_at) · SessionJoin(session_id, user_id) · ModuleEntry(user_id, module, fieldwork, reflection, commitment, law, shared, sealed_at)

## Build order

1. Scaffold (Next.js + Supabase auth), roles, login.
2. Feedback loop end to end, with the 5-response threshold.
3. Session requests, email routing, threads.
4. Tracks, events, RSVP, Discord setting, block calendar.
5. Module walkthrough content model, then class-code unlock.
6. GENE, break games, transition engine.
7. Mobile pass, accessibility pass, PDF briefing export.

## Before go-live (non-code)

- Run data handling past the unit privacy office / JA.
- Confirm whether a Privacy Act statement is needed on the request form.
- Coordinate referral language with the Chaplain and MFLC.
- Military Crisis Line visible: 988 then press 1, or text 838255.
- Retention: purge request threads 90 days after completion; keep anonymous aggregates.
- Use a non-.mil sender domain for notifications and test .mil delivery.

## Open decision

The 15 Nov 2026 pilot app keeps everything on-device with no server. The class-code unlock and request routing need a backend. Reconcile before build step 5: either this app replaces the pilot app, or the pilot app stays as the March 2027 cohort tool and this app handles the unit side.

## Standing Rules (all four repos)

- Own code, no Base44. Next.js + React, Supabase, Vercel, Claude API where AI is used.
- Preview first. Every branch gets a Vercel preview; deploy on Nolan's approval.
- Admin-judgment gate: every AI result is a proposal; nothing ships without approval and a named author of record.
- No fabrication. Gaps are marked [NOLAN: ...]. No invented quotes, stats or testimonials.
- No clinical or diagnostic language. No streaks, points, XP, badges or leaderboards.
- Loud failure: one silent retry, then a visible error with a retry button.
- Keep a CLAUDE.md with these rules and a README with setup.
