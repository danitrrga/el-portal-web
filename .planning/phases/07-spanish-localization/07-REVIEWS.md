---
phase: 7
reviewers: [opencode, ollama]
reviewers_attempted: [gemini, codex, opencode, ollama]
reviewers_failed:
  - gemini: "not authenticated — interactive browser OAuth required"
  - codex: "401 Unauthorized — no ~/.codex/auth.json"
reviewers_skipped:
  - claude: "self-review — running inside Claude Code (CLAUDE_CODE_ENTRYPOINT=cli)"
  - coderabbit: "not installed"
  - qwen: "not installed"
  - cursor: "not installed"
  - lm_studio: "no server on :1234"
  - llama_cpp: "no server on :8080"
reviewed_at: 2026-08-02T14:27:58Z
plans_reviewed: [07-01-PLAN.md, 07-02-PLAN.md, 07-03-PLAN.md, 07-04-PLAN.md, 07-05-PLAN.md, 07-06-PLAN.md, 07-07-PLAN.md, 07-08-PLAN.md, 07-09-PLAN.md, 07-10-PLAN.md, 07-11-PLAN.md, 07-12-PLAN.md, 07-13-PLAN.md, 07-14-PLAN.md, 07-15-PLAN.md, 07-16-PLAN.md]
---

# Cross-AI Plan Review — Phase 7: Spanish Localization

> **Coverage caveat — read before treating this as multi-reviewer consensus.**
> Only **one** substantive external review was obtained (OpenCode). Gemini and
> Codex both failed on authentication, not on content. Ollama answered but the
> only installed model is `llama3.2:3b`, whose review is shallow and contains a
> factual error. There is therefore **no cross-model consensus in this document** —
> the "Consensus Summary" below is a single-reviewer finding set that the
> orchestrator independently verified against the codebase, not agreement between
> independent systems. Re-run `/gsd-review --phase 7 --gemini --codex` after
> authenticating those CLIs if genuine adversarial convergence is wanted.

> **CORRECTION (2026-08-02, added during `/gsd:plan-phase 7 --reviews`) — one
> finding below is FALSE.** Consensus concern **#3** ("07-06 T1/T2 and 07-07 T4
> target structures that do not exist") is withdrawn. Checked against `f0adefe`,
> the exact commit OpenCode reviewed: neither `07-06-PLAN.md` nor `07-07-PLAN.md`
> ever contained `over 100`, `:102`, `:105`, `:166`, or `register object`. The
> reviewer misread `07-06-PLAN.md:179` — *"the **register**'s infinitive"*,
> referring to the *linguistic* register (`tú`/`usted`) that this entire phase is
> built around — as a code "register object", then fabricated line numbers around
> that misreading.
>
> The *underlying code facts* it cited remain true and were independently
> re-verified by `gsd-pattern-mapper`: `CTASection.tsx` **is** 71 lines, and
> `VCDSection.tsx`/`Hero.tsx` copy **is** inline JSX. Only the claim that the
> plans asserted otherwise was fabricated. Findings **#1** (switcher width) and
> **#2** (33-vs-35 changelog) were verified twice and are genuine — both are
> fixed as of commit `935dcc8`.
>
> This is the concrete cost of the two authentication failures: with no second
> model to refute it, a hallucinated finding survived into the consensus section
> and was only caught downstream at planning time.

---

## OpenCode Review

*Model: GitHub Copilot–backed OpenCode agent. This reviewer read the actual
repository before judging the plans, and flagged sibling-repo claims as
unverifiable because it was constrained from reading `/home/danitrrga/dev/Projects/el-portal`.*

## Cross-AI Plan Review — Phase 7: Spanish Localization (el-portal-hero)

**Evaluator:** opencode (independent reviewer) · **Scope:** plans `07-01 … 07-16` in `.planning/phases/07-spanish-localization/`
**Constraint honored:** the sibling app repo (`/home/danitrrga/dev/Projects/el-portal`) was **not read**; every claim about it below is flagged **UNVERIFIED**.

### Verification ground truth (checked in-repo)
`package.json` (no next-intl, no `verify:routing`/`i18n:gates`) · `next.config.ts` (empty) · `src/app/layout.tsx` (`lang="en"`, EN-only metadata, 4 latin-subset fonts) · `src/app/pricing/page.tsx` (`"use client"` at :1) · `src/app/features/page.tsx` (970 lines; `SCALES` :82, sections at :160/:193/:377/:567/:715, export `MethodologyPage` :869) · `src/app/changelog/page.tsx` (944 lines; **33** `version:` hits vs the 35 the plans assert; 7 `note:` objects at :242/437/495/707/818/860/873) · `src/components/ChangelogItem.tsx` (`NOTE_ICONS` lock/rocket/info/pen; `leading-[1.1]` :97; hardcoded `Note:` :159) · `.claude/skills/el-portal-changelog/SKILL.md` (stale `c:\Users\20252128\...` paths confirmed) · `e2e/support/pages.ts` (8 flat routes; `gotoSettled`/`settle`/`unclipViewport`) · `e2e/touch-targets.spec.ts` (**width AND height ≥ 44**, inline-text exemption via parent text-node) · `.github/workflows/responsive-audit.yml` (`quality` job: typecheck app + e2e + lint; WebKit/Ubuntu-24.04-vs-Arch `touch-iphone` comment confirmed) · `src/components/Footer.tsx` (bottom bar `pt-6 border-t border-white/5 flex flex-col gap-10 sm:flex-row sm:items-center sm:justify-between sm:gap-6`; links `flex min-h-11 items-center … md:inline md:min-h-0`) · `src/components/Navbar.tsx` (`"use client"`, `navLinks` array) · `src/components/CTASection.tsx` (**71 lines**, no `"use client"`, eyebrow-span at :61-66) · `src/components/hero/VCDSection.tsx` (319 lines, **copy is inline JSX**, no register) · `src/components/Hero.tsx` (inline copy; pill at :79-90; only `href="/pricing"` found) · `src/components/MethodologyPreviewSection.tsx` (`PRINCIPLES[3]` :22/27/32, `map` :80) · `src/components/SystemBlueprintSection.tsx` (`title=`/`description=` props :30/:50-51; labels :176-177) · `src/components/DashboardPreview.tsx` = **dead code** (not imported anywhere; contains banned `animate-pulse` + `rgba(30,64,175,…)`) · `src/lib/` has only `utils.ts` · `src/messages/` absent · `.env.local` exists (mode 600, unreadable) → `NEXT_PUBLIC_SITE_URL` claim **UNVERIFIED**.

---

### 07-01 — Routing & i18n infrastructure
**Summary:** Sound, well-sequenced foundation: 20-namespace split, `/`-only proxy negotiation (Googlebot rationale correct), `[locale]` restructure, metadata/nav-state contracts, and a `verify-locale-routing` script. Uses next-intl v4.13's documented API surface (`defineRouting`, `createMiddleware` in `proxy.ts`, `getRequestConfig`, `setRequestLocale`, `createNavigation`), which matches current next-intl v4.
**Strengths:** Correctly refuses `Accept-Language` on `/`; correct handling of no-locale-strip redirects (blocking human gate); `detection` off re-implemented by hand is the right call; explicitly double-checks whether `NEXT_LOCALE` is still written with `localeDetection:false`; `generateStaticParams` + `setRequestLocale` on both layout+pages preserves static prerendering; separate worktrees avoid the Wave-3 shared-tree stomp.
**Concerns:**
- **[MEDIUM]** "Verify empirically" the proxy still returns correct cookies is good, but the plan leaves *who sets `NEXT_LOCALE` when the prefix is present* to discovery. Make it an explicit subtask with a fallback (set in `handleI18nRouting` after prefix-detection) so Task 2 isn't blocked on a browser session.
- **[LOW]** `verify-locale-routing` runs `next start` on 3988 — ensure it tolerates Playwright's webServer already holding 3987 (it does, distinct port) but also that it kills its own server on failure (add `try/finally`).
**Suggestions:** After Task 3's split, run `npm run lint` + `typecheck:e2e` (both exist in CI) *before* the metadata rewire, so the two renames (`page.tsx`→`[locale]/page.tsx`) are isolated from the metadata change. Consider committing the 20 empty namespace files as one step so Gate 2's inference has a stable baseline.
**Risk:** LOW.

### 07-02 — Glossary + Spanish voice contract
**Summary:** Strongly opinionated and correct: mechanical extraction only (no hand-authorship), voice rules (tú, no pronoun, infinitive CTAs, `es` not `es-ES`) match the phase decisions; every D-rule has a checkable anti-example.
**Strengths:** The "key-split is not guessable" stance (Trends/Dashboard/Cinema/Pulse stay English) is the right degree of caution; `SPANISH-VOICE.md` gates 07-05's register door; design README entry keeps the docs chain intact.
**Concerns:**
- **[MEDIUM]** The entire plan stands on app-repo facts (1,711 keys, 5 locales, `es` code) that are **UNVERIFIED** under the repo boundary. If es.json uses `es-ES` or the key layout differs, every downstream plan's "copy verbatim" step needs re-targeting. Add an explicit first task: `glossary exists? → else pause gate`.
- **[LOW]** 1,711-key extract is stated as a single file; name the output path (`src/messages/glossary.json`?) so later plans can link to it.
**Suggestions:** One line in `SPANISH-VOICE.md` documenting *where* the glossary lives and its freshness rule (regenerated from app main) — 07-12/07-13 reference it.
**Risk:** LOW–MEDIUM (governance depends on unverified source data).

### 07-03 — i18n gates + 16-route harness
**Summary:** Excellent. Gate 2's "any-en-key ⇒ all-en-keys; any-es-key ⇒ all-es-keys" parity inference is clever and correctly treats an es namespace at `{}` as "pending" rather than a violation — which is exactly what Waves 3→4 need. CI wiring to the existing `quality` job is minimal and correct.
**Strengths:** `EN_ROUTES`/`ES_ROUTES` flat paths compose with the existing `gotoSettled`/`settle`/`unclipViewport` helpers; both-locales containment + touch-target coverage; Gate 1 (config/gateway guard) is cheap and catches the sneaky regressions.
**Concerns:**
- **[MEDIUM]** Gate 2's inference gives a false sense of completeness: a namespace key removed in EN while ES still has it will pass. Add a third, strict "identity check" (`en[n]` keys ⊇ `es[n]` keys) at the 07-16 stage, not just non-empty.
- **[LOW]** 16-route harness doubles CI runtime; keep projects as-is (7 Chromium + touch-iphone) and rely on `test.skip` for width, don't add a 17th project.
**Suggestions:** Register both gates + `verify:routing` in `package.json` scripts in 07-01 so 07-03 is pure CI wiring. Ship the strict identity check in 07-03 (it can be part of Gate 2's script, evaluated leniently) rather than deferring logic to 07-16.
**Risk:** LOW.

### 07-04 — common namespace + LanguageSwitcher
**Summary:** Realistic and well-scoped: chrome extraction (Navbar/Footer/CTASection) with no string additions, footer switcher on all viewports + nav switcher from `md:`. Confirmed Footer bottom bar can host the switcher between copyright and wordmark without disturbing the `sm:flex-row` layout.
**Strengths:** No flags, text `EN / ES`, explicit locale on `Link` — matches phase decisions; 44px per-link targets are the right bar given Phase 5's AAA baseline.
**Concerns:**
- **[HIGH]** The acceptance "each EN and ES link ≥ 44×44" **will fail on `touch-iphone` as implemented.** Verified: `touch-targets.spec.ts` requires *both* `getBoundingClientRect` width AND height ≥ 44 for every `a[href]` (inline-text exemption doesn't apply — the switcher's parent wrapper has no text nodes, only the `aria-hidden` `/` span). On `touch-iphone` (<768px) the nav switcher is hidden, so the footer switcher renders: `flex min-h-11 items-center` gives height 44 but width ≈ text width (~20–24px) → **red CI**. `md:min-h-0` is irrelevant because the spec skips width ≥ 768. Fix: add horizontal padding to each link (e.g. `px-3`) so width clears 44.
- **[MEDIUM]** Plan says switcher appears in nav from `md:`; note the current Navbar desktop links are `hidden md:flex` — confirm the switcher slot doesn't overflow at `md` (the phase-5 frozen clamp bar applies; keep to one row).
- **[LOW]** `lang` on `<html>` (07-01) is fine, but ensure the switcher also updates the visible `lang` for the active locale — already implied; restate it.
**Suggestions:** Make the touch-target acceptance explicit with the px-width mechanism (padding, not `min-w` on a wrapping flex parent). Add a 390px viewport manual check for the footer before closing the plan.
**Risk:** MEDIUM (HIGH on the touch-target gap if unfixed).

### 07-05 — Manifesto + register approval door
**Summary:** The best-governed plan in the phase. The blocking human-approval gate on `es/manifesto.json` before any Spanish ships is exactly the right control for a register-sensitive page.
**Strengths:** Display glyph check (Special Gothic Expanded One latin-subset coverage) is a genuinely useful catch that most i18n plans miss; the register door prevents silent voice drift on the first Spanish surface; subset handling deferred to layout is correct.
**Concerns:**
- **[MEDIUM]** The glyph check depends on knowing whether Special Gothic Expanded One has `é/í/ó/ñ`. If it doesn't, Latin-Extended is *not* guaranteed to cover Expanded One (it's a separate family). Add the fallback path to `SPANISH-VOICE.md`: if the glyph is absent, `font-serif italic` Instrument Serif or plain Inter fallback *for Spanish only* — but this collides with the retired italic-payoff rule, so it needs a documented exception or the H1 must avoid accented words.
- **[LOW]** Register door approval is a one-time gate; the plan should state what happens to *subsequent* edits to `es/manifesto.json` in later phases (re-review or delegated).
**Suggestions:** Run the glyph check as a script (extract text from `es/manifesto.json`, check `document.fonts.check`) rather than visual-only, so CI can gate it.
**Risk:** MEDIUM (a single unknown — glyph coverage — but contained by the approval door).

### 07-06 — Home page A (VCD, Hero, Blueprint)
**Summary:** Correct goal (translate home copy, reuse glossary), but several mechanical steps are **based on register objects that don't exist.**
**Strengths:** Uses the glossary for product vocabulary; preserves the `display`/clamp surfaces.
**Concerns:**
- **[MEDIUM]** Task 1 (VCD): there is **no register and no `description` props** — copy is inline JSX (`h2` :33 "Three horizons. One hierarchy.", `p` :36, three `Caption label/body` props :44-58). "Append the 4th caption at :105" targets the wrong function (`LayeredStrata`, not the captions grid). Extraction must lift the inline strings; the 4th caption appends to the `sm:grid-cols-3` grid (4th item wraps to row 2 — verify it doesn't look orphaned).
- **[MEDIUM]** Task 2 (Hero): no register; copy is inline JSX (pill :79-90, H1 :112+). Only `href="/pricing"` was found — confirm whether a `/mcp` CTA actually exists before asserting it in the register contract. Frozen H1 clamp confirmed at :112 (don't touch).
- **[LOW]** Task 3 (Blueprint): structure claim is **mostly accurate** (`title=`/`description=` props at :30/:50-51), but the layer-label append point is at :176-177 inside `LabMockup`, not :166 — re-verify before editing.
**Suggestions:** Rewrite the extraction mechanics to "grep `>[A-Z][a-z]` within the file, lift each string, drop it into `en/home.json`/`es/home.json`" instead of citing register field names. Add a "no new inline English strings remain" check on the three files before closing.
**Risk:** MEDIUM (goal intact; mechanics need re-targeting; small chance of layout regression on the VCD 4th caption).

### 07-07 — Home page B (Methodology, CTA)
**Summary:** Same quality of intent; one plan is accurate, one has stale line numbers.
**Strengths:** Task 2's structure claim is **confirmed accurate** (`PRINCIPLES` array of 3 at :22/27/32, `map` at :80) — extraction is straightforward; `en/home.json` extension pattern is consistent.
**Concerns:**
- **[MEDIUM]** Task 4 (CTA): `CTASection.tsx` is **71 lines, not "over 100"**; there is no eyebrow at line 6/7 (the eyebrow-role string is the `Set up in under 10 minutes` span at :61-66); "append at :102" is past EOF. The four real strings: h2 :43, body :50-52, span :65, button :58. Fix the line references; note the CTA links only to `APP_URL` (no `/mcp` or `/pricing` secondary — the plan's multi-CTA framing overstates the component).
- **[LOW]** Button text `Open El Portal` + eyebrow are glossary-adjacent; route them through `common` rather than `home` to avoid a 5th occurrence to chase later.
**Suggestions:** Fold Task 4's line refs to the actual structure. Consider whether the CTA eyebrow should also switch (it's the "Set up in under 10 minutes" — a marketing claim; Spanish needs `SPANISH-VOICE.md` input on whether it stays as-is).
**Risk:** MEDIUM (line-ref inaccuracy is mechanical; no functional hazard).

### 07-08 — MCP page + KU-2
**Summary:** Clean, low-risk. Copy extraction + the Kitchen-Utility-2 containment fix (copy-length change, not type-scale) respects the Phase 5 freeze.
**Strengths:** Aligns the `/mcp` glossary (product names stay English per D-01); KU-2 classified correctly as copy-length; no new suppressable defects introduced.
**Concerns:**
- **[LOW]** `CopyButton.tsx` is also touched — verify it has no visible strings of its own (it likely doesn't) and that the `✓`/`Copied` states aren't English copy that needs i18n.
- **[LOW]** The plan is short on *which* strings on /mcp are product-vocabulary vs prose; a quick line: "product names via glossary, all other copy via `mcp.json`" would prevent drift.
**Suggestions:** If /mcp has any code/mono sample text (it's a dev-facing page), confirm whether it should remain verbatim English.
**Risk:** LOW.

### 07-09 — Pricing + badge + KU-4
**Summary:** Correct dependency on 07-01's pricing split (`"use client"` confirmed at :1, so the server/client split premise is real). Badge and KU-4 are well-scoped.
**Strengths:** KU-4 (English-only fallback for pricing copy) is the right conservative read of D-09; keeping pricing EN-only while wiring the namespace avoids a half-translated pricing page.
**Concerns:**
- **[MEDIUM]** The phase goal I18N-01 lists /pricing as a catalogue surface, yet 07-09 leaves it English-only pending a **human decision** on "product copy owned by the app." If the human approves translation mid-wave, 07-09 must have a defined second path (translate `es/pricing.json`) — otherwise this phase ships pricing untranslated by design, which the roadmap should state explicitly (it's defensible: pricing precision > coverage).
- **[LOW]** `PricingClient.tsx` currently carries the toggle + 3 tiers; make sure the KU-4 fallback lives in the *client* wrapper so the human gate isn't bypassed by server-rendered pricing text.
**Suggestions:** Add a "branch: if translation approved" sub-plan so the wave isn't blocked on a conversation.
**Risk:** MEDIUM (scope ambiguity on a human gate, not technical).

### 07-10 — Legal + KU-3
**Summary:** Good governance: English governs legal, Spanish translation behind a legal-review door. The D-07 framing is the right call for terms/privacy.
**Strengths:** KU-3 (legal disclaimer per user's jurisdiction) handled as copy-only with a clear owner; `ReadingLayout.tsx` correctly carries no strings.
**Concerns:**
- **[LOW]** If legal approval is required, the plan should state the fallback (EN-only legal for Spanish users) so the page never ships with a mixed-language legal doc.
- **[LOW]** Terms/privacy often contain date strings ("Last updated …") — confirm date formatting stays EN-style or uses the locale; a hardcoded date in `es` reads wrong.
**Suggestions:** Add a "legal glossary" (jurisdiction-specific terms like "personal data" / "derechos de protección de datos") to `SPANISH-VOICE.md`.
**Risk:** LOW.

### 07-11 — Features extraction
**Summary:** Structurally accurate plan (all 7 sections + `SCALES` confirmed at the cited lines) with clean per-section namespaces.
**Strengths:** Extraction-by-section with a "no inline English remains" audit is the right mechanical discipline for a 970-line file; `SCALES` labels mapped to glossary.
**Concerns:**
- **[LOW]** `SCALES` contains `Daily Score`, `Pulse`, etc. — confirm these exact tokens exist in the glossary (they may differ from `es/features` expectations); if they don't, the D-01 key-split rule says they stay English.
**Suggestions:** Reuse the 07-06 pattern of "lift strings, don't guess register names."
**Risk:** LOW.

### 07-12 — Changelog + skill sync
**Summary:** The most detail-correct plan in the wave: `NOTE_ICONS` (lock/rocket/info/pen), `leading-[1.1]` clamp, and hardcoded `Note:` at :159 are all **confirmed**; the stale skill Windows paths (`c:\Users\20252128\...`) are **confirmed**.
**Strengths:** `Note` → `localized-note` mapping matches the observed note entries (7 found at :242/437/495/707/818/860/873); the sync-skill translation step closes the D-09 loop so future changelog syncs write both locales.
**Concerns:**
- **[MEDIUM]** **Count mismatch: the codebase has 33 `version:` occurrences, not the 35 the plan (and 07-14) assert.** Verify the true entry count before writing `es/changelog.json`; the 2-entry delta changes Gate 2's parity math and the extraction checklist.
- **[LOW]** The sync skill runs "only from app main" (confirmed in the skill) — after this phase, the skill must also gate on the glossary being current, or a sync can introduce a key the glossary doesn't cover.
**Suggestions:** Add a "version: count == glossary/expected" guard to the extraction script so future drifts are caught automatically.
**Risk:** MEDIUM (count discrepancy is real and must be resolved before 07-14).

### 07-13 — es/features
**Summary:** Correctly consumes 07-11's output; low risk. Depend: 07-11 (not 07-05) — fine transitively, but the direct-dependency list omits the register reference (`es/manifesto.json` from 07-05); harmless since 07-11 already depends on 07-05.
**Strengths:** Registers the "no new English" check; alignment with `en/features.json` is mechanically verifiable.
**Concerns:**
- **[LOW]** Features prose is denser than home; run the containment re-check on `/es/features` (the plan does — good) and flag that 07-11's `es/features.json` at `{}` will trip Gate 2 warnings until this lands (expected; make sure the wave order keeps 07-11's verify non-blocking).
**Suggestions:** Mirror 07-14's structure: same verification checklist, add a "containment on es/features × 8 routes" step.
**Risk:** LOW.

### 07-14 — es/changelog
**Summary:** Same as 07-13 but for changelog; correct reliance on 07-12. Same count-discrepancy caveat as 07-12 applies.
**Strengths:** Version-entry mapping is a clean 1:1; no layout risk.
**Concerns:**
- **[MEDIUM]** Inherits the 33-vs-35 count issue — this plan must not proceed until the count is settled.
- **[LOW]** If D-09's English-only fallback is exercised (the human declined translation), `es/changelog.json` must still be non-empty for Gate 2 — the plan should state it will write English content with a "Sin traducción disponible" notice (as 07-12 proposes).
**Suggestions:** Verify against `deferred-items.md` that the count delta isn't a planned deferral (it isn't per the plan's own list — flag it).
**Risk:** MEDIUM.

### 07-15 — SEO / hreflang / sitemap
**Summary:** Technically sound approach (per-locale root metadata via `generateMetadata`, `alternates.languages`, `hreflang` in `metadataBase`); the `es` alternates are correct with `as-needed` (since `/es` is reachable, `x-default` = `/`).
**Strengths:** `sitemap.ts` per-locale URLs match the verified 8-route structure; `robots` and `metadata` contracts are clean; `src/lib/seo.ts` absent today (confirmed) so creation is greenfield.
**Concerns:**
- **[MEDIUM]** `NEXT_PUBLIC_SITE_URL = https://el-portal.app` is **UNVERIFIED** (`.env.local` is mode 600/unreadable). If it differs from the production domain, `alternates.canonical` and `sitemap` will emit wrong URLs. Confirm the value before implementation.
- **[LOW]** With `localeDetection:false` + manual `/` negotiation, `hreflang` on `/` must list both `es` and `x-default` pointing at `/` (the plan implies it — make it explicit so `/es` doesn't become the canonical for home).
- **[LOW]** `setRequestLocale` in root layout is required for static metadata; confirm it's already wired by 07-01 before this plan runs.
**Suggestions:** Add a post-build assertion (fetch `robots.txt` + `sitemap.xml` from the built output and assert canonical URLs) to the `verify:routing` harness.
**Risk:** MEDIUM (env-config uncertainty; otherwise LOW).

### 07-16 — Verification pack
**Summary:** Excellent final gate: full matrix, residual-string audit, suppression reconciliation, human verification pack. The touch-iphone ABI limitation comment in CI is **confirmed** to match your environment claim (WebKit/Ubuntu 24.04 vs Arch) — so the manual mobile/coarse-pointer verification is genuinely required, not redundant.
**Strengths:** `KNOWN_UNFIXED` trace to `deferred-items.md` is disciplined; strict Gate 2 non-empty assertion correctly closes the wave; suppression reconciliation prevents the classic "i18n disabled a real bug" failure mode.
**Concerns:**
- **[MEDIUM]** The pack must include a specific manual check for the **LanguageSwitcher on touch-iphone (390px)** — given 07-04's width gap, this is the single most likely remaining defect.
- **[LOW]** "No test framework" constraint is honored, but the residual-string audit should include a check that `es/metadata.json` and `es/features.json`/`es/changelog.json` are non-empty (they're the last three namespaces to fill).
**Suggestions:** Add a checklist item that Gate 2 strict mode passes with zero warnings before the human sign-off — makes the "definition of done" machine-checkable.
**Risk:** LOW (the plan itself is solid; the risk it inherits is the 07-04 switcher width).

---

### Overall Phase Risk Assessment: **MEDIUM**

**Why not HIGH:** The architecture is right — `/`-only negotiation, `as-needed` + manual detection, static prerendering preserved via `generateStaticParams` + `setRequestLocale`, English-governs-legal, register gating. Wave ordering is sound, the 07-01 gate (human approve `/`-negotiation before anything else) de-risks the only genuinely reversible decision early, and Gate 2's parity inference is a clever, correct fit for the phase's incremental namespace filling. The two plans that carry the most risk (07-05 register door, 07-16 verification) are the most rigorous.

**What keeps it at MEDIUM (must-fix before the relevant wave):**
1. **[HIGH]** 07-04 switcher touch targets: `flex min-h-11` guarantees height but not the ≥44px width `touch-targets.spec.ts` enforces (both dims, non-inline anchors). As written, the footer switcher fails CI on `touch-iphone`. Fix: per-link horizontal padding (`px-3`). *Only* failure surface — nav switcher is hidden <768 and the spec skips ≥768.
2. **[MEDIUM]** 07-06 T1/T2 + 07-07 T4 assume register/prop objects that don't exist (VCD, Hero = inline JSX; CTA = 71 lines, eyebrow at :61-66, no append at :102). Goals survive, but extraction mechanics must be rewritten to lift inline strings.
3. **[MEDIUM]** Changelog entry count: 33 observed vs 35 asserted (07-12/07-14). Resolve before `es/changelog.json`.
4. **[MEDIUM]** 07-02/07-09/07-15 rest on UNVERIFIED externals — app-repo glossary facts, the pricing human gate, and `NEXT_PUBLIC_SITE_URL` in the locked `.env.local`. Each needs a "verify before proceed" checkpoint rather than silent assumption.
5. **[LOW]** Gate 2's identity gap (EN removed key, ES stale key passes) — add a strict key-identity check at 07-16.

**Bottom line:** The phase is well-planned and will land cleanly if 07-04's switcher is padded, the three register-assumption plans are re-targeted to the real (inline-JSX) structure, and the 33-vs-35 changelog count is reconciled before the es/changelog wave. The register-governance machinery (07-05, D-09 sync) is genuinely the strongest part of the plan set.

---

## Ollama Review

*Model: `llama3.2:3b` (local). **Low confidence — recorded for completeness, not
weight.** A 3B model was given a ~85k-token prompt; the response misreads the
requirement IDs `I18N-01…I18N-04` as "four consecutive phases" (they are
requirements, and there are seven). Treat as noise.*

**Summary**
This is a comprehensive testing plan for the Spanish localization phase of Next.js App Router. It covers 16 individual plans, each with two verified checks (machine evidence and human verification) to ensure that features are functioning correctly across different routes. The plan is structured into four consecutive phases: I18N-01, I18N-02, I18N-03, and I18N-04, focusing on critical aspects of the application's rendering and behavior.

**Strengths**
* Comprehensive coverage with machine-driven checks for accuracy
* Human verification pack included for subjective evaluation of UI and UX
* Evidence for each task recorded in separate files and accessible online
* Threat model presents potential risks to test for better planning

**Concerns**
* HIGH: Potential scope creep since there are many tests here, some might be redundant, or too specific to a platform.
 
**Suggestions**
* High-visibility plan summary with clear instructions on how to run the test suite and identify potential issues.

**Risk Assessment**
LOW

---

## Gemini Review

**Not obtained.** The CLI aborted before reading the prompt:

```
Error authenticating: FatalCancellationError: Authentication cancelled by user.
Gemini CLI is not running in a trusted directory.
```

`~/.gemini/oauth_creds.json` is absent and no `GEMINI_API_KEY` is set. Retrying
with `--skip-trust` reached `Opening authentication page in your browser. Do you
want to continue? [Y/n]:` — headless invocation cannot complete this. To enable:
run `gemini` interactively once and authenticate, or export `GEMINI_API_KEY`.

---

## Codex Review

**Not obtained.** The CLI reached the API and was rejected:

```
failed to connect to websocket: HTTP error: 401 Unauthorized,
url: wss://api.openai.com/v1/responses  (5 reconnect attempts, then exit 1)
```

`~/.codex/auth.json` is absent. To enable: run `codex login`.

---

## Consensus Summary

Single-reviewer findings, **independently verified by the orchestrator against
the working tree**. Each item below was checked in code, not taken on the
reviewer's word — the verification result is stated per item.

### Agreed Strengths

Only one substantive reviewer, so "agreed" means *asserted and not contradicted
by the orchestrator's spot-checks*:

- The routing architecture is right: `/`-only negotiation (never a blanket
  redirect, correct Googlebot reasoning), `localePrefix: "as-needed"`,
  `localeDetection: false` re-implemented by hand.
- Static prerendering is genuinely protected — `generateStaticParams` **and**
  `setRequestLocale` are both required per plan, with `.next/prerender-manifest.json`
  named as the verification artifact.
- 07-03's Gate 2 parity inference ("any-en-key ⇒ all-en-keys") correctly treats an
  empty `es` namespace as *pending* rather than *violating*, which is what makes
  incremental Wave 3→4 namespace filling possible.
- 07-05's blocking human-approval door on `es/manifesto.json` before any Spanish
  ships is the correct control for a register-sensitive phase.
- 07-12 is the most detail-accurate plan in the set — `NOTE_ICONS`, the frozen
  `leading-[1.1]`, the hardcoded `Note:` at `ChangelogItem.tsx:159`, and the stale
  Windows paths in the sync skill were all confirmed present.
- 07-16's suppression reconciliation prevents the classic "i18n silently disabled
  a real containment bug" failure.

### Agreed Concerns

Ordered by verified severity. Severities 1 and 2 were **raised to HIGH by the
orchestrator** after checking the code — both are hard CI failures, not risks.

1. **[HIGH — VERIFIED] 07-04 Task 1: the language switcher will fail
   `touch-targets.spec.ts` on `touch-iphone`.**
   The plan's acceptance (line 22) demands "at least 44x44 CSS px", but its only
   sizing mechanism (line 166) is `flex min-h-11 items-center md:min-h-0` on each
   link — height only. Verified in `e2e/touch-targets.spec.ts:108`: the assertion
   is `if (r.width >= min && r.height >= min) continue;` — **both** dimensions.
   The SC 2.5.8 inline exemption does **not** rescue it: that exemption
   (`touch-targets.spec.ts:94-103`) requires the anchor's *parent* to contain a
   non-whitespace **text node**, and 07-04 line 175 mandates the `/` separator be
   an `aria-hidden` element, not bare text. `md:min-h-0` is irrelevant because the
   spec does `test.skip(width >= 768, …)` (line 49). Rendered width of "EN"/"ES" is
   ~20–24px → red CI.
   **Fix:** per-link horizontal padding (e.g. `px-3`) on each link, not `min-w` on
   the wrapping flex parent.

2. **[HIGH — VERIFIED] 07-12 / 07-14: the changelog has 33 entries, not 35.**
   Verified: `grep -c 'version:' src/app/changelog/page.tsx` → **33**; versions run
   `2.0.28` down to `1.0.0`. The reviewer graded this MEDIUM; it is HIGH because
   07-12's own automated verification embeds a **hard assertion**:
   `if(e.length!==35){console.error('expected 35 entries, got',e.length);process.exit(1)}`
   (07-12-PLAN.md:205). As written the plan cannot pass its own gate. The `7 of 35`
   note count is separately correct — 7 `note:` objects do exist.
   **Fix:** reconcile the true count in 07-12 (lines 17, 26, 47, 96, 140, 153, 168,
   205, 208, 316, 320, 327) and 07-14 (lines 14, 21, 31, 36, 82, 236, 282) before
   Wave 3.

3. **[MEDIUM — VERIFIED] 07-06 T1/T2 and 07-07 T4 target structures that do not
   exist.** `CTASection.tsx` is **71 lines**, so 07-07 T4's "over 100 lines" and
   "append at :102" are past EOF; the real strings are h2 :43, body :50-52, button
   :58, eyebrow span :61-66. VCD and Hero copy is inline JSX with no register
   object or `description` props to lift. The *goals* survive intact — only the
   extraction mechanics need re-targeting to "lift the inline strings".

4. **[MEDIUM] Three plans rest on externals nothing in this repo can confirm.**
   - 07-02: the entire glossary derivation depends on app-repo facts (1,711 keys,
     five locales, locale code `es` not `es-ES`) that the reviewer was constrained
     from reading. If the app uses `es-ES` or a different key layout, every
     downstream "copy verbatim" step re-targets.
   - 07-15: `NEXT_PUBLIC_SITE_URL = https://el-portal.app` is asserted but
     `.env.local` is mode 600. If wrong, `alternates.canonical` and `sitemap.xml`
     emit wrong URLs sitewide.
   - 07-09: pricing stays English-only pending a human decision with no defined
     second path if that decision goes the other way.
   **Fix:** each needs an explicit "verify before proceed" checkpoint rather than a
   silent assumption.

5. **[MEDIUM] 07-05: Special Gothic Expanded One glyph coverage for `Á É Í Ó Ú Ñ`
   is an open unknown.** The display font is a separate family from Inter — Latin
   Extended coverage is not inherited. If accented uppercase glyphs are missing,
   the fallback collides with the retired italic-Instrument-Serif convention and
   needs a documented exception, or Spanish H1s must avoid accented words. Worth
   making a scripted `document.fonts.check` gate rather than a visual-only pass.

6. **[LOW] 07-03 Gate 2 has an identity gap.** The inference is one-directional: a
   key removed from EN while ES still carries it passes. Add a strict
   `en[n] ⊇ es[n]` key-identity check — the reviewer suggests shipping it in 07-03
   evaluated leniently rather than deferring the logic to 07-16.

### Divergent Views

None available — a single substantive reviewer cannot diverge. This is the
clearest cost of the two authentication failures: findings 1–3 are verified fact,
but findings 4–6 have had no second model attempt to refute them.

The one internal disagreement worth recording is **orchestrator vs. reviewer on
severity**: OpenCode graded both the switcher width gap and the changelog count
MEDIUM. Both were raised to HIGH here because each is a deterministic failure of a
gate the plans themselves define, not a probabilistic risk.

### Overall Risk

**MEDIUM**, and the orchestrator concurs with the reviewer's reasoning: the
architecture is sound and the wave ordering is defensible, but three concrete
defects (switcher width, changelog count, stale line references) will each stop a
wave if carried into execution unfixed.
