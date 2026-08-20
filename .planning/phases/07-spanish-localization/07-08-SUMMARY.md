---
phase: 07-spanish-localization
plan: 08
subsystem: i18n
tags: [next-intl, i18n, mcp, api-docs, spanish, containment]

# Dependency graph
requires:
  - phase: 07-spanish-localization
    provides: "next-intl routing/namespace scaffolding (07-03), Spanish register CI gate (07-03), GLOSSARY.md and SPANISH-VOICE.md (07-02/07-04), containment KU-2/KU-2-es suppression (07-03)"
provides:
  - "mcp namespace (en/es) covering /mcp: hero, TOC, all five sections, all 12 tool descriptions, CTA, CopyButton labels"
  - "Precedent for translating a technical-documentation surface without touching code: description-only extraction from a Tool data structure, t.rich() for inline-styled prose fragments, ICU-placeholder aria-labels"
  - "KU-2 re-measured on /es/mcp and confirmed not-worse (documented, not assumed)"
affects: [07-16]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Tool.description removed from the TS data structure entirely and looked up by name (tools.read.<name> / tools.write.<name>) so an identifier can never be accidentally translated; Tool.params/returns stay hardcoded English in both locales as literal API-shape documentation"
    - "t.rich() for prose with embedded inline-styled spans/InlineCode, avoiding string concatenation around a translated fragment"
    - "ICU-placeholder aria-label (mcp.codeSampleLabel, {label} placeholder) replacing template-literal concatenation around translated text"
    - "CopyButton default label sourced from useTranslations inside the component body (not a default parameter, which cannot call a hook)"

key-files:
  created:
    - src/messages/en/mcp.json
    - src/messages/es/mcp.json
    - .planning/phases/07-spanish-localization/TRANSLATION-FLAGS.07-08.md
    - src/messages/glossary-additions/07-08.md
  modified:
    - src/app/[locale]/mcp/page.tsx
    - src/components/CopyButton.tsx

key-decisions:
  - "Tool.description extracted to the catalogue; Tool.params/returns deliberately left as hardcoded English data in both locales -- the plan's <interfaces> block names only name+description as the translate/never-translate boundary and Task 1's action text says 'move only description'; params are literal TypeScript-shaped type signatures (quoted enum values an integration must match verbatim) and returns describe the literal wire response shape, both closer to code than to prose"
  - "Literal snake_case tokens embedded inside translatable description prose (done_today, pulse_today in portal_snapshot's description) left untranslated even though not wrapped in CodeBlock/InlineCode -- they are the exact enum values the params field lists as quoted literals, so translating them would describe API values that don't exist"
  - "The external Settings link (process.env.NEXT_PUBLIC_APP_URL) stayed on next/link rather than @/i18n/navigation's Link -- it is an absolute external URL to the separate app repo, not an internal marketing-site route, and src/i18n/navigation.ts's own doc comment reserves next/link for exactly that case. No internal Link exists on this page."
  - "Fixed a NEW containment offender the Spanish translation surfaced: ToolRow's read/write role badge was a fixed w-8 (32px) box sized for English 'write'; Spanish 'escritura' (9 chars) overflowed it by 22px at every viewport including desktop-1440 -- width-independent, not a KU-2 twin, so it could not be suppressed. Widened to w-16 in both locales (cosmetic extra whitespace for English, no visual regression)."

patterns-established:
  - "Description-only extraction from a mixed code/prose data array: keep identifiers and type-shaped fields in code, look up only the prose field by a stable key (the identifier itself)"

requirements-completed: [I18N-01, I18N-07]

# Metrics
duration: ~50min
completed: 2026-08-20
---

# Phase 7 Plan 08: /mcp API Reference Translation Summary

**Translated El Portal's MCP API reference page (564 lines, 12 tools, 5 code samples) into Spanish with zero characters of code touched, keeping tool identifiers/params/JSON payloads byte-identical between locales while re-measuring (not assuming) the inherited KU-2 containment defect.**

## Performance

- **Duration:** ~50 min
- **Started:** 2026-08-20T08:15:00Z (approx.)
- **Completed:** 2026-08-20T08:35:00Z
- **Tasks:** 3/3 completed
- **Files modified:** 6 (2 created new content in existing empty stubs, 2 code files edited, 2 register files created)

## Accomplishments

- `/mcp` and `/es/mcp` both render fully in their respective languages (hero, TOC, five sections, all 12 tool descriptions, CTA) while all five code/config template literals (`STDIO_CONFIG`, `HTTP_CONFIG`, `EXAMPLE_SNAPSHOT`, `EXAMPLE_LOG_HABIT`, `EXAMPLE_MORNING`) and every tool `name`/`params`/`returns` stayed literal English in both locales — verified by diffing rendered `<pre><code>` text content between the two routes (all 5 blocks byte-identical).
- Two accessibility strings that an extraction pass would normally miss were caught and moved to the catalogue: the TOC `<nav aria-label>` and `CopyButton`'s default-parameter `"Copy"`/`"Copied"` state (a default parameter cannot call a hook, so the catalogue lookup moved inside the component body).
- The code-sample `aria-label` was converted from string concatenation (`` `${label} — code sample` ``) to the ICU message `mcp.codeSampleLabel` with a `{label}` placeholder, present with matching placeholder in both catalogues.
- KU-2 (12 prose paragraphs overflowing their box at phone widths, Phase 5 finding) was re-measured directly on `/es/mcp` rather than assumed to carry over: **44px @320px / 4px @360px / 0px @390px / 0px @430px**, against the confirmed-unchanged English baseline of **66px @320px / 26px @360px / 0px @390px+**. Spanish is *better* than English at every width here — the 07-03 mirrored suppression stands unmodified, no paragraph needed shortening.
- Caught and fixed one genuinely NEW containment offender the Spanish text introduced (not a KU-2 twin, no English counterpart): the tool-reference role badge's fixed 32px box overflowed by 22px under "escritura" at every viewport including desktop-1440. Fixed at source by widening the badge.

## Task Commits

Each task was committed atomically:

1. **Task 1: Extract /mcp prose into the catalogue, leaving all code literal** - `99771d2` (feat)
2. **Task 2: Write the Spanish MCP copy and re-measure KU-2** - `9594b41` (feat)
3. **Task 3: Wordplay check — record what did not survive into Spanish** - `058364a` (docs)

**Plan metadata:** (this commit)

## Files Created/Modified

- `src/messages/en/mcp.json` - English `mcp` catalogue: hero, toc, sections (capabilities/gettingStarted/toolReference/examples/permissions), cta, tools.read/write (12 descriptions keyed by tool name), copyButton (71 keys total)
- `src/messages/es/mcp.json` - Spanish mirror, key-identical (71 keys, matching placeholder and rich-tag sets)
- `src/app/[locale]/mcp/page.tsx` - Converted to `getTranslations("mcp")`, `t.rich()` for the two inline-styled Getting Started paragraphs, `Tool.description` removed from the data structure (looked up by name instead), `CodeBlock`/`ToolRow` threaded a `t` prop, TOC items keyed by translation path, role-badge box widened `w-8`→`w-16`
- `src/components/CopyButton.tsx` - `label` default changed from the literal `"Copy"` to `undefined` with an in-body `useTranslations` fallback; `"Copied"` aria-label state also catalogue-sourced; raw `<button>` element and the `label` override behavior both unchanged (Phase 5 decision preserved)
- `.planning/phases/07-spanish-localization/TRANSLATION-FLAGS.07-08.md` - Per-plan wordplay register, zero rows (rationale: API reference prose, not brand-voice copy)
- `src/messages/glossary-additions/07-08.md` - Empty; every product noun resolved directly through `GLOSSARY.md`

## Decisions Made

See `key-decisions` in frontmatter. Summarized:

1. **`params`/`returns` stayed hardcoded English in both locales**, not moved to the catalogue. The plan's `<interfaces>` TRANSLATE list names only `name`/`description`/headings/`Para` prose/`tocItems`/`CodeBlock` label/`CopyButton` text; Task 1's action text says "move only `description` into the catalogue." `params` are literal TypeScript-shaped type signatures containing quoted enum values (`"pulse_today" | "archives" | "identity" | "mantras"`) that must match the real API contract; `returns` describes the literal wire response shape. Both read as documentation-of-code rather than marketing/UI prose, and translating either risks describing an API surface that doesn't actually exist in Spanish. This is stated as a design decision, not silently applied — see the doc comment on the `Tool` interface in `page.tsx`.
2. **Literal snake_case enum tokens inside a translatable `description` field stayed untranslated.** `portal_snapshot`'s description says "Optional sections: pulse_today, archives, identity, mantras" — `pulse_today` and `done_today` are unambiguous by their snake_case syntax (not real English words) and match the params' literal enum values verbatim, so they were left as-is even though the surrounding prose (and the plain-English words "archives"/"identity"/"mantras" in that same sentence) was translated normally. This required manual judgment beyond the plan's literal instruction scope; flagged here per Rule 2/CLAUDE.md documentation discipline rather than silently applied.
3. **The external Settings `Link` stayed on `next/link`**, not `@/i18n/navigation`. It targets `${NEXT_PUBLIC_APP_URL}/settings` — the separate app repo, not an internal marketing-site route — and `src/i18n/navigation.ts`'s own doc comment explicitly reserves `next/link` for exactly this case ("Absolute external URLs (APP_URL) stay on `next/link`"). The plan's "swap internal Link imports" instruction doesn't apply because there is no internal `Link` on this page.
4. **Widened the ToolRow role-badge box (`w-8`→`w-16`) in both locales** to fix a new Spanish-only overflow. See Deviations below.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed a new containment overflow introduced by Spanish translation length**
- **Found during:** Task 2 (write the Spanish MCP copy and re-measure KU-2), during the Playwright verification pass
- **Issue:** `ToolRow`'s read/write role badge (`span.text-[10px].font-mono.font-medium`) is a fixed `w-8` (32px) box sized to fit English "write" (5 chars). Spanish "escritura" (9 chars) needs ~54px, overflowing the box by 22px at every one of the 7 launchable viewports (320px through 1440px) — a width-independent layout defect, not a responsive one, and not a KU-2 twin (different selector, different DOM location, no English counterpart at any width). Per the plan's explicit instruction for this exact scenario ("A NEW offender appears in Spanish that has no English counterpart: fix it at source. It does not inherit KU status, and it must not be suppressed"), this had to be fixed rather than left or suppressed.
- **Fix:** Widened the badge's container from `w-8` to `w-16` (64px) in `src/app/[locale]/mcp/page.tsx`. Applied unconditionally to both locales (no locale-conditional class) since the extra whitespace around English "read"/"write" is purely cosmetic and does not affect alignment, layout, or the rendered-English-text-diffs-clean requirement.
- **Files modified:** `src/app/[locale]/mcp/page.tsx`
- **Verification:** Re-ran `npm run build` (clean) and `npx playwright test containment.spec.ts a11y.spec.ts touch-targets.spec.ts -g "mcp"` — all 7 non-`touch-iphone` viewport projects passed with zero unsuppressed offenders on both `/mcp` and `/es/mcp`; only the pre-confirmed `touch-iphone` WebKit-launch failures (environmental, unrelated) remained.
- **Committed in:** `9594b41` (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 bug fix, Rule 1)
**Impact on plan:** Necessary for correctness — an unfixed 22px overflow on a visible UI element at every viewport, including desktop, is a real defect the plan's own decision tree required fixing at source. No scope creep; the fix stayed inside the plan's own `files_modified` list (`page.tsx`).

## Issues Encountered

- The `p.text-sm.text-zinc-400.leading-5` KU-2 selector's containment suppression in `e2e/containment.spec.ts` matches on selector prefix + route, not on magnitude, so the Playwright spec alone would not have revealed whether Spanish made KU-2 *worse* — the plan correctly anticipated this and required a direct re-measurement, which was done with a standalone Playwright-driven script against the production build (see the `overflowBy` numbers recorded above and in the Task 2 commit message). Resolved by measuring directly rather than relying on the pass/fail of the suppressed spec alone.
- Mid-draft, one JSON edit accidentally altered English source wording ("in key settings" → "in the key's settings") while solving an unrelated Spanish register concern (avoiding a stray `su`). Caught immediately by re-reading the diff before verification and reverted to the exact original English before any commit; the English catalogue that shipped is byte-identical to the pre-extraction source (confirmed by direct string-content checks against the original `page.tsx`, not just visual review).

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- `mcp` namespace fully enforced by Gate 2 (`npm run i18n:gates`: 0 failures, 0 warnings) — no remaining warning state for this namespace.
- `/mcp` and `/es/mcp` both prerender statically in `npm run build`.
- KU-2 numbers for `/es/mcp` are now on record (44px/4px/0px/0px @ 320/360/390/430) for plan 07-16's final verification pass to reference, rather than that plan having to re-derive them from scratch.
- No blockers for downstream wave-3/4 plans. The `params`/`returns`-stay-in-code decision (see Decisions Made #1) is worth flagging to 07-16 or the design owner as a precedent other technical-surface plans (if any remain) may want to follow consistently.

---
*Phase: 07-spanish-localization*
*Completed: 2026-08-20*

## Self-Check: PASSED

All files claimed as created/modified exist on disk; all three task commit hashes (99771d2, 9594b41, 058364a) verified present in `git log`.
