# Research Summary — El Portal App (for the marketing site)

**Date:** 2026-06-12
**Source:** 4 grounded investigations of the real el-portal app repo (`C:/Users/20252128/dev/Projects/el-portal`), in `.planning/research/app-features/`:
- `01-vision-core-model.md` — positioning, Version→Cycle→Day, rooms, vocabulary
- `02-daily-tracking.md` — Pulse, Habits, Day, Cycle execution
- `03-intelligence-analytics.md` — Trends, Insights, AI narratives, the Lab, MCP
- `04-onboarding-data-platform.md` — onboarding, settings, privacy/consent, platform

> These four files are the **authoritative content source** for the Features page. Read them before writing feature copy. Every marketing claim must trace to one of them.

## Positioning (use this voice)

**"The gateway between your current self and your future self."** A personal operating system for high-performers built on **identity-first planning** — design who you want to become, not a task list. The brand is **The Companion**: *the system reads, you decide.* Not a coach, not a meditation app, not a feed, not gamification.

## The core model — Version → Cycle → Day

- **Version** — the macro chapter (default ~90 days, configurable). Who you're becoming this season: number, title, persona, ambitious goals.
- **Cycle** — the tactical sprint (default 6 × 15 days, configurable). Focus priorities, frictions, CCH (Beliefs/Characteristics/Skills), mantras, learning focus, habits, goals.
- **Day** — the execution unit (always one). Do the habits, check in.
- Tagline from docs: *"Strip any of them away and planning collapses into either daydreaming or grind."*

## Feature inventory (real, with in-app names)

**Daily loop**
- **Dashboard** — daily HUD: version/cycle, days remaining, today's habits, weekly chart, focus priorities, mantras, CCH. Morning boot → evening shutdown.
- **Pulse** — daily check-in; words not numbers (mood, energy, sleep, freeform). Feeds the trends engine.
- **Habits** — daily rituals, checkbox tracking, link to consistency goals; streak + reliability metrics.

**Structure & identity**
- **Lab** — where versions/cycles are created and configured (priorities, frictions, CCH, mantras, habits, goals).
- **Goals** — grid of Project Goals (subtask progress) and Consistency Goals (habit-linked, asymptotic curve).
- **Archives** — persistent knowledge: routines, 5-year vision, mantra bank, study notes, debrief history, identity bank.
- **Cinema** — full-screen vision-board carousel (Me, Her, Purpose, Social, Material).

**Intelligence (the "Companion reads & analyzes" story)**
- **Trends** — analytics: performance charts over cycle/version, wellbeing composites, habit reliability tables, heatmaps, mood calendars, **correlation analysis**.
- **Insights / AI Narratives** — plain-language summaries via **Google Gemini 2.5 Flash** (Vercel AI SDK). Pro-tier, opt-in; configurable frequency; optional sentiment analysis.
- **Cycle retrospectives / Debrief** — structured end-of-cycle review.

**Platform & trust**
- **3-bucket GDPR consent** — C (required: mood/habit/cycle), A (optional analytics, PostHog EU, pseudonymous, no cookies), B (optional AI research corpus). Audit-logged.
- **Data ownership** — export everything (JSON) and permanent delete, in-app.
- **i18n** — 5 languages: English, Español, 中文, Português, Français.
- **Customizable tempo** — set cycle length and cycles-per-version.

## Table-stakes vs differentiators (for the marketing emphasis)

- **Differentiators (lead with these):** identity-first Version→Cycle→Day model; Pulse (words, not scores); correlation/insight engine that surfaces patterns; configurable tempo; "the system reads, you decide" Companion stance; privacy-first 3-bucket consent.
- **Table-stakes (support, don't headline):** habit checkboxes, settings, notifications, onboarding, export/delete, dark mode.

## Truthfulness guardrails (DO NOT overstate)

1. **Frankfurt / EU region** — claimed on the current marketing privacy page but **NOT verified in app code** (Supabase region is env-driven). Confirm with the user / Supabase dashboard before asserting a specific city. PostHog EU instance IS confirmed in code.
2. **PWA** — **not** a true installable PWA (no manifest; separate mobile routes). Don't claim "installable app".
3. **Planned, not shipped** — Calendar sync, Todoist sync, focus-workstation timer are roadmap items. Mark as "coming" or omit.
4. **AI providers** — Gemini 2.5 Flash confirmed; AI features are Pro-tier and opt-in. Frame accordingly.
5. **"Her" slide in Cinema** — present in code, unexplained in docs; treat as a personal/example slide, not a named feature.

## Implications for the marketing build

- **Features page** can confidently headline: identity-first planning, the temporal system, Pulse, Goal intelligence, Trends/insight engine, privacy-first design, multilingual. Use the real room names as section anchors.
- **Privacy page** copy already aligns well with the verified facts (PostHog EU, opt-in, export/delete, Gemini) — the rebrand is mostly visual; just re-verify the region wording.
- **Pricing** mentions free + lifetime/Pro; the Pro gating of AI insights is real — keep consistent.
