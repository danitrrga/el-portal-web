# El Portal — Onboarding, Data, Privacy & Platform

## Feature Inventory

### Onboarding Flow

**What it does:** 6-screen animated cinematic walkthrough introducing core concepts (personal OS, cycle structure, habits, goals, identity, dashboarding). Each screen has thematic animations, escalating visual complexity, and progressive revelation.

**User benefit:** Orienting new users to the system metaphor and feature set without overwhelming; motion design conveys polish and intentionality.

**In-app labels:**
- Screen 1: "You are not static" (mantra-focused intro)
- Screen 2: Version structure
- Screen 3: Cycle/milestone planning
- Screen 4: Habit & goal logging
- Screen 5: Pulse check-in / daily reflections
- Screen 6: Dashboard insights view + "Begin Journey" CTA

**File evidence:** `src/components/onboarding/OnboardingFlow.tsx` (orchestrator with 6-screen registry), `src/components/onboarding/screens/Screen[1-6].tsx`

**Table-stakes vs differentiator:** Table-stakes for any personal-OS product. Differentiator is the motion choreography and thematic consistency (per-screen palettes, layered light compositions, manifesto-first messaging).

---

### In-App Tour (Guided Walkthrough)

**What it does:** Post-onboarding coachmark system that highlights dashboard features (sidebar sections, Lab, archives, insights panels). Uses spotlight overlays and connector lines to guide attention. Phases: sidebar → dashboard → lab → finale. Replay button in General settings.

**User benefit:** Reduces cognitive load for power-user features (bulk-edit habits, cycle version management, insight browsing); helps users find features they've overlooked.

**In-app labels:** "Replay tour" button in General tab; tour text embedded in `next-intl` translations.

**File evidence:** `src/components/tour/` directory; `useTourSignal.ts` for state management; tour phases in `src/components/tour/tours/phases/`.

**Table-stakes vs differentiator:** Table-stakes; implementation is solid (accessibility-focused, skippable).

---

### First-Run Consent Modal (Bucket C — Data Storage)

**What it does:** Mandatory GDPR Art. 9(2)(a) consent gate. User must explicitly agree to have mood/habit/cycle data stored before using the app. Declining signs them out. Non-dismissible dialog; user cannot proceed without consent or signout.

**User benefit:** Transparent about sensitive data handling; gives user agency over personal wellness data.

**In-app labels:**
- Title: "One thing first"
- Checkbox: "Yes, store my mood, habit, and cycle data so El Portal can work for me."
- Buttons: "Decline" (sign out), "Begin" (accept)

**File evidence:** `src/components/consent/FirstRunConsentModal.tsx` (lines 11–12 note Bucket C is mandatory under GDPR Art. 9(2)(a))

**Table-stakes vs differentiator:** Table-stakes for EU compliance. Differentiator is the plain-language promise list (not legal-speak) and the integration with Bucket A/B opt-in flow.

---

### Privacy Settings Tab

**What it does:** Single control panel for all data/consent decisions. Three sections:
1. **Required** (disabled toggle) — mood/habit/cycle data. Explains revoking signs out and deletes data.
2. **Optional** (toggles):
   - Bucket A: "Anonymous usage stats" — clicks, navigation, performance, errors. Hosted in EU. PostHog, no content.
   - Bucket B: "AI research corpus" — save future AI reports and reactions pseudonymously for training better insight models.
3. **Your data** (actions):
   - Export everything: Downloads JSON file of all El Portal data (POST `/api/me/export`)
   - Delete account: Permanent erasure (POST `/api/me/delete` with "DELETE" confirmation)

**User benefit:** GDPR compliance (export/delete rights); granular control over telemetry and AI use; peace of mind via transparency.

**In-app labels:** Exact UI strings match the toggles above. Footer link: "Read the full privacy page" (external link to marketing site `/privacy`).

**File evidence:** `src/components/settings/PrivacyTab.tsx` (entire file)

**Table-stakes vs differentiator:** Table-stakes for GDPR. Differentiator is the bucket-based consent model (not one binary toggle) and the split between functional data (C) vs. analytics (A) vs. research (B).

---

### General Settings Tab

**What it does:** Multi-section customization panel:
1. **Language** — 5-language selector (English, Español, 中文, Português, Français). Persists to `localStorage`.
2. **Keyboard Shortcuts** — eyebrow + hint toggle for showing shortcut overlay in sidebar (via `?` key).
3. **Features** — toggle Identity System (Fingerprint icon), Replay Tour button.
4. **Tempo & Structure** — customize cycle length (days) and cycles-per-version count. Real-time visual timeline. Save triggers validation (days % cycles == 0).

**User benefit:** Adapt the system rhythm to personal workflows; multi-language support for non-English speakers; keyboard power-users can hide hints if learned.

**In-app labels:** Sections titled "Language", "Keyboard Shortcuts", "Features", "Tempo & Structure". Tempo saves to `supabaseService.updateSystemSettings(days, cycles)`.

**File evidence:** `src/components/settings/GeneralTab.tsx`

**Table-stakes vs differentiator:** Tempo/Structure is differentiator (unique to cycle-based personal OS). Language/Shortcuts/Features are table-stakes.

---

### Appearance Settings Tab

**What it does:** Two toggles:
1. **Theme** — Dark/Light mode. Dark is primary; light is supported. Current theme shown (e.g., "DARK").
2. **Sidebar default** — Whether sidebar starts collapsed or expanded on next session.

**User benefit:** Interface comfort; compact vs. spacious layouts per preference.

**In-app labels:** "Theme", "Sidebar default".

**File evidence:** `src/components/settings/AppearanceTab.tsx`

**Table-stakes vs differentiator:** Table-stakes.

---

### Storage Tab

**What it does:** Real-time storage usage breakdown across 7 data categories (versions, cycles, habits/logs, goals, archives, identity/mantras, slides). Free tier capped at 60 MB. Pro tier shows unlimited indicator. Stacked bar chart + record counts per category.

**User benefit:** Understand what's consuming storage; plan upgrades.

**In-app labels:** Category labels: "Media", "Data", "Versions", "Cycles", "Habits & Logs", "Goals", "Archives", "Identity & Mantras", "Slides".

**File evidence:** `src/components/settings/StorageTab.tsx` (DATA_CATEGORIES list at line 26).

**Table-stakes vs differentiator:** Table-stakes.

---

### API Keys Tab

**What it does:** Create/manage long-lived API keys for programmatic access. Each key has a name, permissions (read-only, standard, full access presets + granular tool toggles), optional expiry. Shows last-used timestamp and copy/edit/delete actions.

**User benefit:** Developers can integrate El Portal data into external tools without app-level changes.

**In-app labels:** "API Keys", "Read-only", "Standard", "Full access", "Tool permissions".

**File evidence:** `src/components/settings/ApiKeysTab.tsx` (PRESETS and ALL_TOOL_NAMES arrays).

**Table-stakes vs differentiator:** Differentiator for developers/power-users; not core UX.

---

### Notifications Tab

**What it does:** Granular notification preferences:
- 8 in-app notification toggles: new insights, cycle deadlines, version deadlines, streak milestones, perfect days, goal completions, debrief ready, no active cycle.
- Email digest toggle + day-of-week selector (default: Sunday).

Auto-saves to user settings on change (debounced 800ms).

**User benefit:** Control notification noise; opt into weekly digest.

**In-app labels:** Exact toggle titles from NOTIF_DEFAULTS (line 13).

**File evidence:** `src/components/settings/NotificationsTab.tsx`

**Table-stakes vs differentiator:** Table-stakes.

---

### Pulse & Insights Tab (Pro-only)

**What it does:** Pro-exclusive settings for AI-powered insight reports:
- Enable/disable reports
- Include habits in analysis toggle
- Report frequency selector (biweekly, monthly, bimonthly, quarterly, per-cycle)
- Sentiment analysis toggle (Tier 2 opt-in)
- AI narratives toggle (Tier 2 opt-in)

Reports use Google Gemini 2.5 Flash via Vercel AI SDK to summarize correlations in plain language.

**User benefit:** AI-driven wellness summaries tailored to cycle rhythm.

**In-app labels:** "Pulse & Insights", "Report frequency", "Include habits", "Sentiment analysis", "AI narratives".

**File evidence:** `src/components/settings/PulseTab.tsx`; AI backend: `src/lib/aiSummary.ts` (uses `google("gemini-2.5-flash")` from `@ai-sdk/google`).

**Table-stakes vs differentiator:** Differentiator for Pro tier. Sentiment/narrative opt-ins signal privacy-conscious AI use.

---

### Archives — Multi-Tab Historical View

**What it does:** 7 distinct archive tabs (Debrief History, Life Checklist, Identity Bank, Mantra Bank, Slides, Theory Notes, Cycle Archive [implied]). Each tab has independent sidebar, editor view, full-text search. Uses MDXEditor for rich editing.

**User benefit:** Review historical reflections, identity statements, mantras, checklists, slides without cluttering active workspace.

**In-app labels:** Tab names visible in archives nav.

**File evidence:** `src/components/archives/ArchiveEditorView.tsx` (MDXEditor wrapper); `src/components/archives/DebriefHistoryView.tsx`, `IdentityBankView.tsx`, `MantraBankView.tsx`, etc.

**Table-stakes vs differentiator:** Differentiator for reflection-heavy workflows.

---

## Privacy/Data Claims Verification

**Marketing privacy page claims:**
1. **EU-hosted (Frankfurt)** — **NOT FOUND IN CODE**. Supabase region is set via environment variables; no region config visible in `src/lib/supabase.ts`. Supabase default region varies by project; marketing claim needs verification.
2. **Supabase + PostHog + Vercel + Google Gemini** — **CONFIRMED**: Supabase auth & DB (`src/lib/supabase.ts`), PostHog telemetry EU instance (`src/lib/telemetry/posthog.ts` lines 14–19: `POSTHOG_HOST = '/relay'`, `POSTHOG_UI_HOST = 'https://eu.posthog.com'`), Vercel deployment (implied via Next.js), Google Gemini 2.5 Flash (`src/lib/aiSummary.ts` lines 72, 104).
3. **Opt-in analytics** — **CONFIRMED**: Bucket A consent (PostHog) is optional; initialized only when consent.A is true (ConsentContext.tsx lines 129–136). PostHog uses memory persistence (no cookies) and person_profiles='identified_only' (pseudonymous). Reverse-proxied through `/relay` to bypass ad blockers.
4. **Export/delete rights** — **CONFIRMED**: PrivacyTab.tsx implements `/api/me/export` (POST, downloads JSON) and `/api/me/delete` (POST with "DELETE" confirmation, signs out and redirects to login).
5. **No content collection, stack traces only** — **CONFIRMED**: PostHog config (lines 88–89 in posthog.ts) disables DOM/session recording, enables stack-trace-only error capture. Privacy context (lines 83–84) confirms "no content" posture.

**Mismatches flagged:**
- **Frankfurt hosting**: Verify in Supabase dashboard. Code does not hardcode region.

---

## Platform Facts

### Languages Supported
- **Code evidence:** `src/lib/i18n.ts` defines `locales = ['en', 'es', 'zh', 'pt', 'fr']`.
- **Supported:** English, Español, 中文 (Simplified Chinese), Português, Français.
- **Default:** English.
- **Implementation:** `next-intl` library; translations in `src/messages/*.json`.
- **User-configurable:** Yes, in General settings tab.

### PWA / Mobile Support
- **No manifest.json found in public/**.
- **Mobile routes exist** (`src/app/(mobile)/m/habits`, `/m/goals`, `/m/analytics`, `/m/trends`).
- **Product audit notes** (docs/product-audit.md lines 55–59): Parallel mobile routes vs. responsive design is a known issue — not resolved; considered "accidental divergence."
- **Conclusion:** Not a true PWA (no installable manifest). Mobile support is via separate responsive routes, not a unified responsive design.

### Hosting / Deployment
- **Frontend:** Vercel (Next.js 16 App Router).
- **Database / Auth:** Supabase (PostgreSQL + GoTrue).
- **AI:** Google Gemini 2.5 Flash (via Vercel AI SDK).
- **Analytics:** PostHog EU instance.
- **Region:** Supabase region not hardcoded in app code; set via `NEXT_PUBLIC_SUPABASE_URL` environment variable. Marketing claim of Frankfurt hosting should be verified against Supabase project settings.

### Data Model Snapshot
From `StorageTab.tsx`, tracked tables:
- `versions` — strategic version/season containers
- `cycles` — milestone/sprint cycles within versions
- `habits`, `habit_logs` — habit tracking & logs
- `goals` — goal items
- `archive_items` — historical archive entries
- `identity_items`, `mantras` — identity statements and mantras
- `slides` — vision board slides

### Consent Architecture

**Three-bucket model (GDPR-compliant):**
- **Bucket C (Required):** Mood, habit, cycle data. Mandatory to use app.
- **Bucket A (Optional):** Anonymous usage stats (clicks, nav, perf, errors). PostHog.
- **Bucket B (Optional):** AI research corpus (future reports + reactions, pseudonymous). Trains insight models.

**Audit trail:** Each consent change appended to database; persisted via `recordConsent(userId, bucket, granted)` in `src/lib/consent/consentService.ts`.

---

## Marketing-Ready Highlights

1. **GDPR-First Design:** Mandatory consent for sensitive data (mood/habits), with granular opt-in for analytics and AI use. No dark patterns; users can decline and still visit (onboarding shows this path).

2. **Privacy-Safe Analytics:** PostHog telemetry uses pseudonymous mode (Supabase UUID only, no PII) with memory-only persistence (no cookies). Can be fully disabled by toggling Bucket A off in Settings.

3. **Multilingual from Day One:** Full i18n support for 5 languages (EN, ES, ZH, PT, FR) with user-selectable language in General settings. Translations embedded, not external.

4. **Data Ownership & Portability:** Users can export all data as JSON (Settings > Privacy > Export everything) or permanently delete account with one-click (Settings > Privacy > Delete account). GDPR Art. 20 & 17 compliant.

5. **Customizable Rhythm:** "Tempo & Structure" settings let users define cycle length (days) and cycles-per-version. Unique to cycle-based personal OS. Marketing angle: "Your operating system, your timeline."

---

## Unknowns

1. **Supabase region (Frankfurt claim):** Code does not hardcode region; verify in Supabase project dashboard.
2. **PWA installability:** No manifest.json found; mobile support is via separate routes, not installable app.
3. **Google Gemini API pricing / terms:** Confirmed in use for Pulse reports; no cap or usage throttling visible in code.
4. **Vercel deployment regions:** Reverse-proxied PostHog at `/relay` suggests multiple regions; exact Vercel project config not visible.
5. **Subscription tiers:** StorageTab checks `subscription_plan === 'pro'`, but pricing tiers (free, pro, etc.) not documented in code.

---

## Evidence (File Paths)

| Feature | Primary File |
|---|---|
| Onboarding Flow | `src/components/onboarding/OnboardingFlow.tsx` |
| In-App Tour | `src/components/tour/TourProvider.tsx`, `src/components/tour/tours/` |
| Consent Modal | `src/components/consent/FirstRunConsentModal.tsx` |
| Privacy Settings | `src/components/settings/PrivacyTab.tsx` |
| General Settings | `src/components/settings/GeneralTab.tsx` |
| Appearance Settings | `src/components/settings/AppearanceTab.tsx` |
| Storage Info | `src/components/settings/StorageTab.tsx` |
| API Keys | `src/components/settings/ApiKeysTab.tsx` |
| Notifications | `src/components/settings/NotificationsTab.tsx` |
| Pulse/Insights | `src/components/settings/PulseTab.tsx` |
| Archives | `src/components/archives/ArchiveEditorView.tsx` & others |
| Consent Context | `src/contexts/ConsentContext.tsx` |
| PostHog Telemetry | `src/lib/telemetry/posthog.ts` |
| AI Summaries | `src/lib/aiSummary.ts` |
| i18n | `src/lib/i18n.ts`, `src/messages/*.json` |
| Supabase | `src/lib/supabase.ts` |
| Product Audit | `docs/product-audit.md` |
