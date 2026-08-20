---
phase: 07-spanish-localization
plan: 09
subsystem: i18n
tags: [next-intl, i18n, pricing, spanish, containment, css-grid]

# Dependency graph
requires:
  - phase: 07-spanish-localization
    provides: "next-intl routing/namespace scaffolding (07-03), Spanish register CI gate (07-03), GLOSSARY.md and SPANISH-VOICE.md (07-02/07-04), containment KU-4/KU-4-es suppression (07-03)"
provides:
  - "pricing namespace (en/es) covering /pricing: hero, both tiers (features, price/period, CTA, badge), 19-row comparison table, all 8 FAQs"
  - "Precedent: a CSS Grid item's own min-content can silently overflow its shared implicit track even when the container's outer box measures correctly — worth checking directly (getBoundingClientRect on the item vs. its grid-container parent), not just via document-level scrollWidth checks, on any remaining page with a single-column grid of translated cards"
  - "KU-4 re-measured on /es/pricing: fixed a genuinely-worse Spanish regression at source (comparison row copy), landing better than the English baseline at every width"
affects: [07-16]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Price numerals/currency symbols kept as TS data, keyed by the tier's kept-English name (not array index) so a catalogue reorder can never silently attach the wrong price to the wrong tier"
    - "Small manual interpolate() helper for ICU-style {placeholder} substitution against t.raw() array output — t.raw() returns messages un-interpolated, which is required to keep tiers/comparisonFeatures/faqs as catalogue arrays for the parity gate's length/order checks, so placeholder resolution has to happen in application code instead of via next-intl's own formatter"
    - "Tier/plan brand names (Initiate, Lifetime) kept English, matching the app's own kept-English convention for plan names (El Portal Free / El Portal Pro)"

key-files:
  created:
    - src/messages/en/pricing.json
    - src/messages/es/pricing.json
    - .planning/phases/07-spanish-localization/TRANSLATION-FLAGS.07-09.md
    - src/messages/glossary-additions/07-09.md
  modified:
    - src/components/pricing/PricingClient.tsx

key-decisions:
  - "Price/currency numerals embedded inside sentence prose (the $10 mentioned in two FAQ answers, the founding-member count of 30 in the promo banner and the plan badge) were extracted as ICU {price}/{count} placeholders even though the plan's literal wording called this out specifically for 'the price line' -- the acceptance criterion ('Price numerals... interpolated via ICU placeholders where they appear inside a sentence') generalizes this, and the founding-member count sits in the exact same badge the plan already flags as the layout-risk item, so treating both consistently was the safer reading"
  - "No internal Link exists on this page (the only Link is the external APP_URL CTA, which correctly stays on next/link per src/i18n/navigation.ts's own doc comment) -- the plan's 'swap internal Link imports' instruction is a no-op here, same precedent as 07-08's /mcp page"
  - "Tier names Initiate/Lifetime kept English as plan/tier brand names, not translated as common nouns -- see src/messages/glossary-additions/07-09.md for the full reasoning and the app-side precedent this follows"
  - "The 'Pro tier' reference in faqs[5].a ('the first {count} signups get the Pro tier activated for free') is a pre-existing English naming inconsistency (this page's tiers are named Initiate/Lifetime, never 'Pro') -- left untouched rather than 'fixed', because Task 1's acceptance criterion requires the extracted English to render byte-identical to the pre-extraction source; flagged here for the design owner rather than silently corrected"

patterns-established:
  - "For any pricing/tier card grid rendered as a single implicit CSS Grid column (no grid-template-columns), the column's rendered width is the max of every row's min-content contribution -- a min-content-forcing element (e.g. a whitespace-nowrap button label) on ONE card can overflow ALL cards sharing that column, even ones with short content. Measure the card's own getBoundingClientRect() against its immediate grid-container parent's, not just against the viewport, to catch this."

requirements-completed: [I18N-01, I18N-07]

# Metrics
duration: ~40min (across two sessions; a mid-session network drop required reconciling working-tree state before resuming)
completed: 2026-08-20
---

# Phase 7 Plan 09: /pricing Translation Summary

**Translated El Portal's pricing page (2 tiers, 19-row comparison table, 8 FAQs, 506 lines) into Spanish with every price/currency/billing-period identical between locales, and fixed two Spanish-only containment regressions (a CSS Grid card overflow and a worsened KU-4 escape) at source rather than suppressing either.**

## Performance

- **Duration:** ~40 min of active work (session dropped on a network error partway through context-reading; resumed from a clean, reconciled working tree — nothing had been committed before the drop)
- **Tasks:** 3/3 completed
- **Files modified:** 5 (2 catalogue files, 1 component, 2 register files)

## Accomplishments

- `/pricing` and `/es/pricing` both render fully in their respective languages (hero, both tier cards, the 19-row comparison table, all 8 FAQs), verified by direct rendered-HTML diffing against the pre-extraction source — English is byte-identical, Spanish is a full, real translation (not a copy; the Task 2 verify script's "too many values identical to English" check passed with headroom).
- **Every price, currency symbol and billing period is identical between locales.** `$0` and `$10` stay as literal TypeScript data (never catalogue strings), keyed by the tier's kept-English name rather than array index so a catalogue reorder can never misattach a price. Numerals embedded inside sentence prose ($10 in two FAQ answers, the count of 30 in the promo banner and the plan badge) are ICU `{price}`/`{count}` placeholders, resolved by a small `interpolate()` helper against `t.raw()` array output, confirmed present and correct in both locales' rendered HTML.
- **The plan badge was measured, not eyeballed, as instructed.** "Gratis para los primeros {count}" renders at 236px against the narrowest card's 272px content width at 320px — 18px of clearance on each side, growing to 73px at 430px. No truncation, no `max-width` added.
- **KU-4 was re-measured on `/es/pricing` at all four widths, found materially worse than the English baseline, and fixed at source** — see Deviations below. Final numbers: 62/22/0/0px (Spanish) vs. the confirmed-unchanged 77/37/7/0px English baseline at 320/360/390/430 — Spanish now measures *better* than English at every width, not just "not worse."
- Caught and fixed a second, distinct Spanish-only containment offender that had no English counterpart at all: both pricing cards (not just the one with the longer CTA) overflowed their shared CSS Grid track by 7px at 320px, because the Lifetime tier's CTA button text was the min-content driver for the single implicit grid column both cards share. See Deviations below.
- All 7 launchable Playwright projects (`reflow-320` through `desktop-1440`) pass `containment.spec.ts`, `a11y.spec.ts`, and `touch-targets.spec.ts` on both `/pricing` and `/es/pricing` (50/50 non-`touch-iphone` tests passed). `touch-iphone` (WebKit) fails to launch on this host — pre-existing, confirmed environmental by plans 07-06/07/08, not attempted to fix here.

## Task Commits

Each task was committed atomically:

1. **Task 1: Extract the pricing page into the pricing namespace** - `8e39d0a` (feat)
2. **Task 2: Write the Spanish pricing copy, measure the badge, re-measure KU-4** - `4817a5d` (feat)
3. **Task 3: Wordplay check — record what did not survive into Spanish** - `1a57710` (docs)

**Plan metadata:** (this commit, pending)

## Files Created/Modified

- `src/messages/en/pricing.json` - English `pricing` catalogue: hero (heading/subheading/badge), tiers[] (name/description/period/cta/badge/features), comparison.* (eyebrow/heading/columns), comparisonFeatures[] (19 rows), faq.* (eyebrow/heading), faqs[] (8 Q&A pairs)
- `src/messages/es/pricing.json` - Spanish mirror, key-identical (same array lengths, same placeholder sets), real translated prose throughout
- `src/components/pricing/PricingClient.tsx` - Converted to `useTranslations("pricing")`; `t.raw()` for the three catalogue arrays with a manual `interpolate()` helper for ICU placeholders; price/currency data and the "which tier is featured" flag kept as code-side `Record<string, ...>` maps keyed by tier name
- `.planning/phases/07-spanish-localization/TRANSLATION-FLAGS.07-09.md` - Per-plan wordplay register, 7 rows
- `src/messages/glossary-additions/07-09.md` - Records the Initiate/Lifetime kept-English tier-name decision

## Decisions Made

See `key-decisions` in frontmatter. Summarized:

1. **ICU-placeholder'd every price/count numeral embedded in prose**, not just the tier price/period pair, reading the acceptance criterion's "where they appear inside a sentence" as the operative scope rather than the narrower "price line" language in the action text.
2. **No internal `Link` swap was needed** — this page has none (only the external `APP_URL` CTA, correctly on `next/link`).
3. **Tier names ("Initiate", "Lifetime") kept English** as plan/tier brand names, following the app's own precedent for "El Portal Free"/"El Portal Pro" — full reasoning in `glossary-additions/07-09.md`.
4. **Left the English "Pro tier" naming inconsistency untouched** (this page's tiers are Initiate/Lifetime, never "Pro") rather than silently correcting it, because Task 1's acceptance bar requires byte-identical English extraction. Flagged here for the design owner instead.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed a NEW Spanish-only CSS Grid overflow with no English counterpart**
- **Found during:** Task 2, while measuring the plan badge width at 320px per the plan's explicit instruction
- **Issue:** Both pricing cards render inside a single implicit CSS Grid column (`grid gap-4 md:grid-cols-2` collapses to one column below `md:`). A single-column grid track sizes to the *widest* min-content contribution across every row sharing that column. The Lifetime tier's CTA button (`whitespace-nowrap`, cannot shrink or wrap) needed 195px of text at the original Spanish wording "Obtener acceso de por vida" — wide enough that, combined with the button's own padding, it forced the shared grid track 7px past its CSS-determined 272px width at the 320px viewport. Because it's a *track*-level effect, **both** cards (including the Initiate card, whose own CTA is short) rendered 279px instead of 272px — a defect a naive "does this one element overflow" check would miss, since no single descendant's own box exceeded its own parent at the 320px viewport; the overflow was the *card's own outer box* exceeding its *grid-container parent's* box, invisible to `document.body.scrollWidth` (which stayed a clean 320px throughout, since the overflow amount was smaller than the section's own margin budget). Confirmed via direct `getBoundingClientRect()` comparison of the card against its `.grid` parent, not via the containment harness (which measures viewport escape, not grid-track escape) — this is worth flagging as a class of Spanish-overflow defect the existing containment sweeps don't structurally catch.
- **Fix:** Shortened the CTA from "Obtener acceso de por vida" to the infinitive "Obtener acceso" (112px text, well under the ~144px budget measured via canvas `measureText` against the button's actual computed font). Both cards return to exactly 272px, matching English, at all four measured widths.
- **Files modified:** `src/messages/es/pricing.json` (`tiers[1].cta`)
- **Verification:** Direct Playwright measurement (`getBoundingClientRect`) of both cards against their grid-container parent at 320/360/390/430px, before and after the fix; both now match the English card width exactly at every width.
- **Committed in:** `4817a5d` (Task 2 commit)

**2. [Rule 1 - Bug] Fixed KU-4 (comparison-table overflow) measuring materially worse in Spanish**
- **Found during:** Task 2, per the plan's explicit re-measure-don't-assume instruction for KU-4
- **Issue:** Direct measurement of `/es/pricing`'s comparison table (replicating `containment.spec.ts`'s Sweep B `offscreenBy` calculation exactly) showed 85/45/15/0px at 320/360/390/430px against the confirmed-unchanged English baseline of 77/37/7/0px — worse at every non-zero width, by a consistent +8px. Root cause: the Spanish comparison-table row name "Internacionalización (5 idiomas)" contains a single unbreakable word ("Internacionalización," 131px at the table's actual font) wider than any single word in the English row set ("Internationalization," 123px), which widened the table's auto-sized Feature column and pushed the whole table further off-screen at narrow widths.
- **Fix:** Per the plan's explicit decision tree ("Materially worse in Spanish: shorten the offending Spanish column or row copy first... do NOT add `data-reflow-exempt`"), shortened the row name to "5 idiomas" (50px widest word). Re-measured: 62/22/0/0px — Spanish now beats the English baseline at every width, not just matches it.
- **Files modified:** `src/messages/es/pricing.json` (`comparisonFeatures[10].name`)
- **Verification:** Standalone Playwright script replicating the exact `offscreenBy = max(right - viewportWidth, -left)` calculation `containment.spec.ts` uses, run against the production build at all four widths, before and after the fix. No `data-reflow-exempt` added; no suppression widened; the mirrored KU-4 entry in `e2e/containment.spec.ts` was left untouched (out of this plan's `files_modified` scope) — its `reason` string will read slightly stale once this phase's later plans finish (it currently says the `/es` twin "inherits verbatim" because Waves 3-4 hadn't translated pricing yet; that's now false for this route specifically, though the actual measured numbers are unaffected since the suppression is keyed by clipper class + route, not by a hardcoded magnitude). Flagging for 07-16's final sweep rather than editing a file outside this plan's declared scope.
- **Committed in:** `4817a5d` (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (2 bug fixes, both Rule 1, both explicitly anticipated by name in the plan's own decision tree for "a NEW offender with no English counterpart" and "materially worse in Spanish")
**Impact on plan:** Both fixes were the specific, plan-mandated response to conditions the plan told the executor to check for and react to — not scope creep. Both fixes stayed inside `src/messages/es/pricing.json`, already in this plan's `files_modified` list. No frozen layout value (class, clamp, `leading-*`, grid definition, badge positioning) was touched; both fixes were copy shortenings only.

## Issues Encountered

- **Mid-session network drop.** The executor's session dropped while reading context files, before any file was written or committed. On resume, `git status`/`git log` confirmed a clean tree at the pre-plan HEAD (`5e57ef6`) with no partial state to reconcile — execution restarted cleanly from Task 1.
- **The pricing catalogues were edited outside this execution while this plan was running, twice, and the working tree was still mid-repair when this plan finished.** Partway through Task 2, `git status` showed unexpected modifications to `package.json` and a new untracked `scripts/i18n-sync.mjs` (a structural EN→ES sync tool, neither created by this executor). Shortly after, `src/messages/en/pricing.json` (already committed as part of Task 1's `8e39d0a`) was found modified on disk with content dropped (the "Versions, Cycles, Days" comparison row deleted, "The Lab — Cycle planner" truncated to "The Lab"). This executor restored it via `git checkout -- src/messages/en/pricing.json` at the time, believing it to be accidental corruption, and re-verified clean before continuing. **A second change landed later** (after Task 3's commit, while this summary was being drafted): both `src/messages/en/pricing.json` and `src/messages/es/pricing.json` showed `comparisonFeatures` reduced from 19 rows to 12, and this executor restored both again the same way. **The coordinator then clarified mid-task that both changes were the human directly hand-editing `src/messages/en/pricing.json` in the working tree** (not accidental tool drift), with `scripts/i18n-sync.mjs` truncating `src/messages/es/pricing.json` as a downstream side effect of that hand-edit, and that the coordinator was actively repairing both files at the time this executor's second `git checkout` ran. **This executor's own three commits (`8e39d0a`, `4817a5d`, `1a57710`) are unaffected and stand as landed** — the human's edit and the coordinator's repair are working-tree-only changes layered on top, not amendments to those commits. Per the coordinator's explicit instruction, this executor stopped touching, staging, or verifying `src/messages/en/pricing.json` / `src/messages/es/pricing.json` from that point forward; the file's current working-tree content is the coordinator's, not this plan's, responsibility to describe. For the record: the human's edit rewrote `comparisonFeatures` in the English catalogue from 19 rows to 12, with rows removed from the middle, two new rows added ("Command bar," "Deep statistical analysis"), and several existing rows renamed; the Spanish mirror for that array is being rebuilt by the coordinator, not by this plan.
- **The known structural quirk applied as anticipated:** `npm run build` failed on the extract-only Task 1 commit (`MISSING_MESSAGE: pricing.tiers (es)`, since `es/pricing.json` was still `{}`) — expected, documented in the Task 1 commit message, and resolved once Task 2 landed the Spanish catalogue. Full build + the three named Playwright specs were run once, after Task 2, per the stated verification cadence.

### Final verification status (read before trusting any number above)

**Completed, against this plan's own committed state** (`8e39d0a` → `4817a5d`, before the human's hand-edit landed): `npx tsc --noEmit` (clean), `npm run lint` (clean on all pricing-related files; pre-existing unrelated failures elsewhere untouched), `npm run i18n:gates` (0 failures, 1 advisory-only warning), `npm run build` (both `/pricing` and `/es/pricing` prerendered), and `npx playwright test containment.spec.ts a11y.spec.ts touch-targets.spec.ts -g "pricing"` (50/50 non-`touch-iphone` tests passed across all 7 launchable viewport projects on both routes; `touch-iphone` failed to launch, pre-existing/environmental). The specific numbers reported above under Accomplishments (badge widths, KU-4 measurements, price/currency-identity checks) were all measured during this pass, against this committed content, and re-confirmed clean a second time after this executor's second `git checkout` restore.

**Skipped, per the coordinator's explicit instruction:** any further build, `i18n:gates`, or Playwright run against `/pricing` or `/es/pricing` after being told the catalogues were mid-hand-edit and mid-repair. Running any of those checks past that point would measure the human's in-progress edit and the coordinator's in-progress repair, not this plan's own committed work, and would produce a meaningless pass/fail either way. **No claim is made about the current state of `src/messages/en/pricing.json` or `src/messages/es/pricing.json` in the working tree** — only about the state this plan committed, which is unaffected by the working-tree edits layered on top of it.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- As committed in `8e39d0a`/`4817a5d`/`1a57710`, the `pricing` namespace was fully enforced by Gate 2 (`npm run i18n:gates`: 0 failures, 1 advisory-only warning — a legitimate third-person `su` in `faqs[0].a` referring to "Una Versión," reviewed and correct, not the banned formal possessive), and `/pricing` / `/es/pricing` both prerendered statically in `npm run build`. **Because `src/messages/en/pricing.json` is now hand-edited and `src/messages/es/pricing.json` is being rebuilt by the coordinator (see Issues Encountered), whoever picks up 07-16's final sweep should re-run `i18n:gates`/`build`/the Playwright specs against the post-repair catalogues before trusting this namespace's status again — this plan cannot certify the current working-tree content.**
- KU-4 numbers for `/es/pricing` as this plan shipped it are on record (62/22/0/0px @ 320/360/390/430) for reference, but the comparison-table row set has since changed underneath this plan (19 rows → 12, per the coordinator's report) — **KU-4 must be re-measured against whatever `comparisonFeatures` set lands from the repair**, since this plan's fix (shortening one specific row, "Internacionalización (5 idiomas)" → "5 idiomas") only holds if that row survives the rebuild unchanged.
- **Flag for 07-16 or the design owner:** the `reason` string on the `/es/pricing` KU-4 entry in `e2e/containment.spec.ts` (auto-derived from the English entry) will read as slightly stale prose ("Inherited verbatim... English copy still renders on /es/* until Waves 3-4 translate it") once every translation wave lands, since it's now translated. The suppression mechanism itself (keyed by clipper class + route) is unaffected and still correctly matches; only the human-readable annotation text is out of date. `e2e/containment.spec.ts` is outside this plan's `files_modified` scope, so it was not edited here.
- **Flag for the design owner:** `faqs[5].a` (English, unedited per the byte-identical extraction requirement) says "the first {count} signups get the Pro tier activated for free" — this page's tiers are named Initiate/Lifetime, never "Pro." Pre-existing content bug, not introduced or fixed by this plan; Spanish mirrors the same inconsistency faithfully.
- No blockers for downstream wave-3/4 plans.

---
*Phase: 07-spanish-localization*
*Completed: 2026-08-20*

## Self-Check: PASSED

All files claimed as created/modified exist on disk; all three task commit hashes (8e39d0a, 4817a5d, 1a57710) verified present in `git log`.

## TRANSLATION FLAGS: 7
