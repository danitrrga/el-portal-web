---
phase: 05-mobile-responsive-retrofit
reviewed: 2026-07-31T00:00:00Z
depth: standard
files_reviewed: 21
files_reviewed_list:
  - e2e/containment.spec.ts
  - e2e/touch-targets.spec.ts
  - src/app/changelog/page.tsx
  - src/app/features/page.tsx
  - src/app/globals.css
  - src/app/layout.tsx
  - src/app/manifesto/page.tsx
  - src/app/mcp/page.tsx
  - src/app/page.tsx
  - src/app/pricing/page.tsx
  - src/app/privacy/page.tsx
  - src/app/terms/page.tsx
  - src/components/ChangelogItem.tsx
  - src/components/CopyButton.tsx
  - src/components/Footer.tsx
  - src/components/Hero.tsx
  - src/components/MethodologyPreviewSection.tsx
  - src/components/MotionProvider.tsx
  - src/components/Navbar.tsx
  - src/components/ReadingLayout.tsx
  - src/components/SystemBlueprintSection.tsx
  - src/components/ui/button.tsx
findings:
  critical: 0
  warning: 5
  info: 8
  total: 13
status: issues_found
---

# Phase 05: Code Review Report

**Reviewed:** 2026-07-31T00:00:00Z
**Depth:** standard
**Files Reviewed:** 21
**Status:** issues_found

## Summary

This review supersedes an earlier round on the same file set (the prior
`05-REVIEW.md` and its `05-REVIEW-FIX.md` companion, plus gap-closure plans
`05-06`/`05-07`, are visible in the phase directory and appear to have already
landed fixes for a number of earlier-found issues — `min-h-viewport`/`dvh`
cascade guards, the `<main>`-inside-`<main>` landmark bug in `Hero.tsx`, the
Hero preview-bleed negative margin, the Button 44px-mobile/desktop-frozen size
ladder, and the FG_SUBTLE→FG_MUTED AA-contrast token cleanup on most sibling
pages all check out against current `HEAD`). `tsc --noEmit` is clean and
`eslint` was run against the full reviewed file set as a supplement to manual
reading.

Two classes of issues remain. First, the newest gap-closure artifact
(`e2e/containment.spec.ts`, added this phase to catch container-relative
overflow) has real gaps in its own safety-net logic: an over-broad
`KNOWN_UNFIXED` selector on `/privacy` that matches far more than the five
paragraphs it's documented to suppress, and a hard `.slice(0, 15)` cap that
silently drops overflow offenders beyond the worst 15 per route before they
ever reach the known-unfixed filter or the assertion. Both weaken the exact
regression protection this sweep exists to add. Second, the new
`.wordmark__fill` hover effect added to `globals.css` this phase (consumed by
the redesigned `Footer.tsx` brand watermark) uses `background-clip: text`
with a gradient — a pattern CLAUDE.md's anti-pattern list bans by name
("instant AI design tell") with no stated exception for decorative elements.
The remainder are smaller quality/consistency findings: two ESLint-confirmed
dead constants, one page (`changelog/page.tsx`) that was skipped by this
phase's otherwise-consistent token-migration pass, and a few pre-existing
anti-pattern instances surfaced while reading files that are in this review's
scope.

## Warnings

### WR-01: New `.wordmark__fill` hover effect uses banned `background-clip: text` + gradient

**File:** `src/app/globals.css:440-475` (consumed by `src/components/Footer.tsx:118-121`)
**Issue:** `globals.css` adds an entirely new `.wordmark` / `.wordmark__outline` /
`.wordmark__fill` block this phase (Footer brand-watermark redesign, replacing
the old italic-serif "Portal" watermark). `.wordmark__fill` sets
`background-image` to a stack of gradients and then:
```css
-webkit-background-clip: text;
background-clip: text;
```
CLAUDE.md's anti-pattern list is explicit and unconditional: "Never use
`background-clip: text` with a gradient on text (impeccable BAN 2 — instant AI
design tell)." This is not inherited debt — it's new code added in this
phase's Footer rework (`Footer.tsx:118-121` renders the two `wordmark__layer`
spans that consume the class). It sits on a decorative, `aria-hidden`
watermark rather than a heading, but the rule as documented doesn't carve out
an exception for decorative elements.
**Fix:** Replace the gradient-clip fill with a non-text-clip technique (e.g. an
SVG glyph shape with a gradient fill, or layered `text-shadow`/opacity blends
that don't rely on `background-clip: text`), or get explicit design-system
sign-off to add a scoped exception to `ANTI-PATTERNS.md` for this one
decorative, non-heading use.

### WR-02: `containment.spec.ts` `KNOWN_UNFIXED` selector for `/privacy` is far broader than the documented defect

**File:** `e2e/containment.spec.ts:69-75` (selector at line 71: `selector: "p.text-"`)
**Issue:** The comment says this suppresses "Five legal-copy paragraphs" that
overflow their box on `/privacy`. But the match is
`offender.selector.startsWith(k.selector)` against a `describe()` string of
the form `p.<class1>.<class2>.<class3>` — and `"p.text-"` matches *any* `<p>`
on `/privacy` whose first Tailwind class token begins with `text-`. Concrete
evidence from `src/app/privacy/page.tsx`:
- `<p className="text-xs text-[var(--color-ep-fg-subtle)]">Last updated 2026-04-28</p>` (privacy/page.tsx:167) → `describe()` = `"p.text-xs.text-[var(--color-ep-fg-subtle)]"`, starts with `"p.text-"`.
- Every eyebrow label, e.g. `<p className="text-[11px] uppercase tracking-[0.12em] ...">` (privacy/page.tsx:28, 103, 136, 202, 208, 218) → `describe()` starts with `"p.text-[11px]..."`, also matches.

None of these are among the "five legal-copy paragraphs" the entry was written
to suppress, but any future overflow regression on them would be silently
swallowed by this rule and never fail the suite — exactly the failure mode the
gap-closure sweep exists to prevent (see the file's own header comment: "never
silently dropped").
**Fix:** Scope the selector to the actual offending elements — either the full
3-class `describe()` string those five paragraphs actually produce (mirroring
the precision used in the `/features` and `/mcp` entries in the same array), or
match on `text.slice(0, N)` content instead of/in addition to the class prefix.

### WR-03: `containment.spec.ts` silently drops overflow offenders beyond the worst 15 per route

**File:** `e2e/containment.spec.ts:209-210`
```js
textOverflow: textOverflow.sort((a, b) => b.overflowBy - a.overflowBy).slice(0, 15),
clipEscape: clipEscape.sort((a, b) => b.offscreenBy - a.offscreenBy).slice(0, 15),
```
**Issue:** Both sweeps sort by magnitude and cap the result to the top 15
*before* the `KNOWN_UNFIXED` filtering and the final `expect(...).toEqual([])`
assertion run. Any real offender ranked 16th or lower by magnitude on a given
route is dropped at this line — it's never checked against `KNOWN_UNFIXED`,
never attached as a debug artifact, and never counted toward the assertion.
A route with, say, 20 genuine small-magnitude overflow defects and 15 larger
already-known ones would report green, because the 5 unknown small ones never
reach the assertion at all.
**Fix:** Either raise the cap well above any plausible defect count and only
use it for the `testInfo.attach()` payload size (evaluate the full, unsliced
array against `KNOWN_UNFIXED` and the assertion, and slice only for the JSON
attachment), or explicitly document that the sweep only guarantees coverage of
the 15 worst offenders per route per sweep.

### WR-04: `touch-targets.spec.ts`'s inline-link discriminator only checks the anchor's immediate parent

**File:** `e2e/touch-targets.spec.ts:94-104`
**Issue:** The fix here (matching on `parent.childNodes` text siblings instead
of `el.closest("p, li")`) correctly resolves the false-negative the comment
describes (Footer nav links wrongly exempted). But the replacement only
inspects the anchor's *direct* parent's child nodes. A link that is
genuinely inline in running prose but wrapped in an intermediate inline
element (e.g. `<p>Some text <span><a href="...">link</a></span> more text</p>`)
has a parent (`<span>`) with no sibling text nodes, so `inRunningText` is
`false` and the link is measured against the 44px AAA minimum even though
visually and semantically it's inline copy — the opposite failure mode from
the one this rewrite fixed. No such markup was found in the reviewed files
today, so this is currently latent rather than actively broken, but the
discriminator is fragile to any future paragraph copy that wraps an inline
link in a `<span>`/`<strong>`/`<em>` for styling.
**Fix:** Walk up through inline-only ancestors (or check `getComputedStyle(el).display`
context) rather than stopping at the immediate parent, or add a code comment
flagging the one-level limitation so a future author doesn't reintroduce the
bug this test was written to catch.

### WR-05: Inconsistent design-token migration — `changelog/page.tsx` was skipped

**File:** `src/app/changelog/page.tsx:5-9`
**Issue:** `src/app/pricing/page.tsx`, `src/app/manifesto/page.tsx`,
`src/app/features/page.tsx`, and `src/components/ChangelogItem.tsx` all
received this phase's AA-contrast/token cleanup pass — raw hex `FG_STRONG` /
`FG` / `FG_MUTED` / `FG_SUBTLE` constants were replaced with
`var(--color-ep-*)` tokens and `FG_SUBTLE` was removed with a detailed
explanatory comment (each of those files carries the identical "Foreground
ramp is intentionally THREE steps..." comment block). `src/app/changelog/page.tsx`
still declares raw hex constants (`SECTION_BG = "#04060c"`, `FG_STRONG =
"#f4f6fb"`, `FG = "#aab3c5"`, `FG_MUTED = "#8590a8"`, `ACCENT = "#4487D6"`)
and was not touched by the migration, even though it renders its H1/paragraph
via the exact same pattern as the migrated pages. This also leaves a dead
`FG_MUTED` constant behind (see IN-02) — the value nobody wired up because the
file never went through the cleanup pass applied to its siblings.
**Fix:** Run the same token-migration pass on `changelog/page.tsx` for
consistency, or document why it was deliberately excluded from this phase's
scope.

## Info

### IN-01: Dead constant — `ACCENT_LIGHT` unused in `manifesto/page.tsx`

**File:** `src/app/manifesto/page.tsx:26`
**Issue:** `const ACCENT_LIGHT = "#77B7ED";` is declared (confirmed via
`eslint`: `'ACCENT_LIGHT' is assigned a value but never used`). It was copied
from the shared palette boilerplate (present verbatim in `pricing/page.tsx`,
`features/page.tsx`, `ChangelogItem.tsx`, all of which do use it) but
`manifesto/page.tsx`'s `CardDecorator` hardcodes its own local
`rgba(119, 183, 237, 0.28)` instead of referencing the constant.
**Fix:** Remove the unused constant, or use it in `CardDecorator` in place of
the hardcoded rgba value for consistency with the token-migration comment
directly above it.

### IN-02: Dead constant — `FG_MUTED` unused in `changelog/page.tsx`

**File:** `src/app/changelog/page.tsx:8`
**Issue:** `const FG_MUTED = "#8590a8";` is declared but never referenced
(confirmed via `eslint`: `'FG_MUTED' is assigned a value but never used`).
Related to WR-05 — this is a symptom of the file not receiving the same
cleanup pass as its siblings.
**Fix:** Remove, or wire it up where a muted foreground tone is needed (the
version-tag row currently reuses a separate module-scoped `FG_MUTED` constant
defined in `ChangelogItem.tsx`, not this one).

### IN-03: `src/app/features/page.tsx` exports a component still named `MethodologyPage`

**File:** `src/app/features/page.tsx:875`
**Issue:** `export default function MethodologyPage() { ... }` — a holdover
from before the `/methodology` → `/features` route rename (commit
`d11d22e refactor: move /methodology route to /features`). The route, nav
labels, and footer links were all updated to "Features" this phase, but the
component/function name wasn't, which will surface confusingly in React
DevTools, error stack traces, and Sentry-style breadcrumbs.
**Fix:** Rename to `FeaturesPage` (or similar) for consistency with the
route.

### IN-04: `Footer.tsx` "Company" column has two links pointing to the same href

**File:** `src/components/Footer.tsx:16-22`
**Issue:**
```tsx
{
    title: "Company",
    links: [
        { label: "Manifesto", href: "/manifesto" },
        { label: "About", href: "/manifesto" },
    ],
},
```
"Manifesto" and "About" both link to `/manifesto`. Pre-existing (not touched
by this phase's diff), but present in a file under review — likely
unintentional duplication rather than a deliberate choice, since it renders
two identically-destined links under different labels.
**Fix:** Point "About" at a real about-flavored anchor (or remove one of the
two entries) if this wasn't intentional.

### IN-05: Dead CSS carrying a banned glow value — `.text-glow-hero`

**File:** `src/app/globals.css:191-194`
**Issue:**
```css
.text-glow-hero {
  text-shadow: 0 0 40px rgba(30, 64, 175, 0.35),
    0 0 12px rgba(255, 255, 255, 0.08);
}
```
This class is not referenced anywhere in `src/` (verified via repo-wide
grep). It also uses exactly the `rgba(30, 64, 175, …)` value CLAUDE.md bans
by name ("Never use `rgba(30, 64, 175, ...)` or `rgba(59, 130, 246, ...)` —
the neon blue-glow is banned"). Pre-existing, not touched by this phase, but
since it sits unused in a file under review, it's worth removing rather than
leaving as a landmine someone could re-attach to a heading later.
**Fix:** Delete the unused rule.

### IN-06: `SystemBlueprintSection.tsx`'s outer light-mode class is unreachable

**File:** `src/components/SystemBlueprintSection.tsx:22`
**Issue:** `<section className="bg-zinc-50 py-16 md:py-32 dark:bg-transparent">`.
`<html class="dark">` is hardcoded in `layout.tsx` for the whole site, so the
`dark:` variant always wins and `bg-zinc-50` never paints. Pre-existing (not
touched by this phase's diff), but it's dead styling for a light mode
CLAUDE.md explicitly says is out of scope ("Never design for light mode —
this site is dark-mode-only").
**Fix:** Drop `bg-zinc-50 dark:` entirely and set the intended dark
background directly (the section is otherwise given a per-card `BG` token via
`FeatureCard`'s inline `style`, so this outer class may be fully redundant).

### IN-07: New `--color-ep-glow-blue-*` tokens tokenize the banned glow value rather than fixing it

**File:** `src/app/globals.css:155-159`
**Issue:**
```css
/* Glow family — rgba(30, 64, 175, …) — TOKEN-02 — tokenized at current value, no desaturation */
--color-ep-glow-blue-40: rgba(30, 64, 175, 0.4);
--color-ep-glow-blue-30: rgba(30, 64, 175, 0.3);
--color-ep-glow-blue-25: rgba(30, 64, 175, 0.25);
--color-ep-glow-blue-03: rgba(30, 64, 175, 0.03);
```
These are new tokens added this phase. The comment is self-aware that this is
debt ("no desaturation"), and consuming components live outside this review's
file set, but adding first-class design-system tokens for a value the same
project's docs explicitly ban entrenches rather than resolves the
anti-pattern — future authors are now more likely to reach for
`--color-ep-glow-blue-40` precisely because it now looks sanctioned.
**Fix:** No action required for this phase if tracked in `deferred-items.md`
as stated; flagging so the debt is visible in this review too.

### IN-08: `src/app/mcp/page.tsx` mixes the `zinc-*` Tailwind scale with the site's OKLCH `--color-ep-*` tokens

**File:** `src/app/mcp/page.tsx:296` and throughout (e.g. `bg-zinc-950`,
`text-zinc-100`, `border-zinc-800/60`, `text-blue-400/85`, `text-amber-500/70`)
**Issue:** CLAUDE.md: "Never mix `zinc-*` and `slate-*` scales — the OKLCH
tokens replace both on landing surfaces." This phase touched `/mcp` only for
contrast (`zinc-500`/`zinc-600` → `zinc-400`) and a11y (`role="region"` on
`<pre>`, `aria-label` on nav) — it did not migrate the page off `zinc-*`
entirely, unlike `privacy`, `terms`, and the home page, which use
`var(--color-ep-*)` tokens throughout. Pre-existing, but the whole page is in
this review's scope and is the only reviewed route still on the old palette.
**Fix:** Out of scope for a mobile-retrofit phase, but worth tracking as a
follow-up token-migration item for `/mcp` specifically.

---

_Reviewed: 2026-07-31T00:00:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
