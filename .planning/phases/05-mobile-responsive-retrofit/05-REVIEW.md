---
phase: 05-mobile-responsive-retrofit
reviewed: 2026-07-31T00:00:00Z
depth: standard
files_reviewed: 21
files_reviewed_list:
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
  critical: 2
  warning: 8
  info: 9
  total: 19
status: issues_found
---

# Phase 05: Code Review Report

**Reviewed:** 2026-07-31
**Depth:** standard (with empirical verification — production build, CSS-output inspection, Playwright DOM probes at 320/390/767/768/1440)
**Files Reviewed:** 21
**Status:** issues_found

## Summary

The mechanical parts of this retrofit hold up under adversarial checking. I built the site
(`npx next build`), inspected the emitted CSS, and probed the live production server with
Playwright at 320/390/767/768/1440 px. The `md:`-guarded restorations in `button.tsx`,
`Navbar`, `Footer`, `Hero`, `ReadingLayout` and the `/changelog` H1 all restore the original
desktop values exactly (`.md\:h-9`, `.md\:size-9`, `.md\:w-\[1200px\]`,
`.md\:text-\[clamp\(48px\,6vw\,80px\)\]` are all emitted after the base utilities inside
`@media (min-width:48rem)`). The `@supports` split in `globals.css` survives minification —
both the `vh` floor and the `svh` override are present in the shipped bundle. `overflow-x-clip`
on `ReadingLayout` computes to `overflow-x: clip / overflow-y: visible` and does not clip the
two `position: fixed` overlays. The `<main>` nesting fix, the `nav` landmark naming, and the
heading-order fixes are all correct, and the axe suite passes on all 7 launchable projects.

What does not hold up is the **enforcement layer**. The suite written to guarantee the 44 px
touch-target contract cannot see the two largest populations of undersized targets on the
site. I measured them directly at 390×844: seven Footer navigation links render at **17 px
tall on all 8 routes**, and the eight `/pricing` FAQ disclosure controls render at **20 px
tall** — and `touch-targets.spec.ts` reports green on both. That is a false-green guard on
the phase's headline deliverable, so it is the primary blocker.

Secondary concerns: the `min-h-viewport` utility is built in a way that makes it impossible
to override with any Tailwind `min-h-*` utility (verified empirically), `svh` is the wrong
unit for a `min-height` page floor, the "desktop is unchanged" claim in `05-05-SUMMARY.md`
is materially false (≈20 colour declarations changed at all widths), and the mobile menu
this phase rewrote still ships without `aria-expanded` or keyboard dismissal.

---

## Narrative Findings (AI reviewer)

## Critical Issues

### CR-01: AAA touch-target suite exempts every link inside `<li>` — 7 sub-44px targets per route go unmeasured

**Severity:** BLOCKER
**File:** `e2e/touch-targets.spec.ts:56` (defect) · `src/components/Footer.tsx:83-94` (affected targets)

**Issue:**
```ts
// SC 2.5.8 "inline" exception: a link inside a sentence is sized by
// the line-height of the surrounding text, not by the author.
if (el.tagName === "A" && el.closest("p, li")) continue;
```

The comment describes the *inline* exception, but the code implements "any anchor with a
`<p>` or `<li>` ancestor". WCAG 2.2 SC 2.5.8's inline exception applies to targets **in a
sentence or block of text**. A standalone navigation link that happens to sit in a `<ul><li>`
is author-sized and is expressly *not* the inline case.

`Footer.tsx` renders every product/company/legal link as `<li><Link/></li>`, so all of them
are exempted. Measured on the production build at 390×844, on **all 8 routes**:

```
A  57x17  "Features"          A  73x17  "Changelog"    A 105x17  "MCP Integration"
A  65x17  "Manifesto"         A  39x17  "About"        A  49x17  "Privacy"
A  41x17  "Terms"
```

17 px is 39 % of the 44 px target that `RESPONSIVE.md:219` records as "**Our target**", and
`npm run audit:targets` passes anyway. (These do clear the SC 2.5.8 *hard floor* via the
spacing exception — `space-y-3` gives 29 px centre-to-centre ≥ 24 px — so this is not a WCAG
failure. It is a silent failure of this phase's own contract plus a guard that certifies it.)

The same over-broad exemption also hides the `/mcp` sticky-TOC anchors (`page.tsx:534-542`,
also `<li><a>`).

**Fix:** narrow the exemption to anchors that are genuinely inline in running text, and give
the footer links a real hit area.

```ts
// e2e/touch-targets.spec.ts — only exempt anchors surrounded by text
if (el.tagName === "A") {
  const p = el.parentElement;
  const hasSiblingText =
    !!p &&
    Array.from(p.childNodes).some(
      (n) => n.nodeType === Node.TEXT_NODE && (n.textContent ?? "").trim().length > 0,
    );
  if (hasSiblingText) continue;
}
```

```tsx
// src/components/Footer.tsx:86-91 — same pattern already used for the brand link
<Link
  href={link.href}
  className="flex min-h-11 items-center text-sm text-zinc-400 hover:text-zinc-100 transition-colors duration-300 md:inline md:min-h-0"
>
```

---

### CR-02: `<summary>` is absent from the target selector; `/pricing` FAQ controls are 20px tall

**Severity:** BLOCKER
**File:** `e2e/touch-targets.spec.ts:43-45` (defect) · `src/app/pricing/page.tsx:348-357` (affected targets)

**Issue:** the probe collects
`'a[href], button, [role="button"], input, select, textarea, [tabindex]:not([tabindex="-1"])'`.
`<summary>` matches none of these, yet `<details>/<summary>` is the primary interactive
control on 3 of 8 routes: `/features` (2), `/pricing` (8 FAQ items), `/mcp` (12 tool rows).
The suite has never measured any of them.

Measured at 390×844 on the production build:

| Route | `<summary>` height | Status |
|---|---|---|
| `/mcp` (`ToolRow`, `py-3`) | 44 px ×12 | passes — by luck, not by test |
| `/features` (`min-h-[56px]`) | 56 px ×2 | passes |
| `/pricing` (FAQ) | **20 px ×6, 40 px ×2** | **fails the 44 px contract** |

`/pricing` puts the padding on the `<details>` (`px-5 py-4`) rather than on the `<summary>`,
so the tappable box is only the 20 px text line box. On the highest-intent page of a
marketing site, the FAQ disclosures are less than half the committed target size and the
guard is structurally blind to it.

**Fix:**

```ts
// e2e/touch-targets.spec.ts:43
const targets = document.querySelectorAll<HTMLElement>(
  'a[href], button, summary, [role="button"], input, select, textarea, [tabindex]:not([tabindex="-1"])',
);
```

```tsx
// src/app/pricing/page.tsx — move padding onto the summary so the hit area is the control
<details
  key={faq.q}
  className="group rounded-lg border transition-colors"
  style={{ background: "rgba(255,255,255,0.015)", borderColor: BORDER }}
>
  <summary className="flex min-h-11 items-center justify-between px-5 py-4 text-sm font-medium list-none cursor-pointer md:min-h-0"
           style={{ color: FG_STRONG }}>
```

(and drop the now-duplicated `px-5 py-4` from the `<details>`, moving it onto the body `<p>`).

---

## Warnings

### WR-01: `min-h-viewport` cannot be overridden by any Tailwind `min-h-*` utility

**Severity:** WARNING
**File:** `src/app/globals.css:355-363`

**Issue:** the `@utility min-h-viewport` body lands inside `@layer utilities` (offset 19761 in
the built stylesheet, inside the layer that starts at 13017), while the hand-written
`@supports` override lands **unlayered** at offset 102313. Unlayered declarations outrank
every layered one regardless of source order or specificity, so the `svh` value permanently
wins over any other `min-height` utility on the same element.

Verified in the browser against the production build at 1440×900:

```
'min-h-viewport + min-h-0':          '900px'   ← expected 0px
'min-h-viewport + md:min-h-0 @1440': '900px'   ← expected 0px
'min-h-viewport + min-h-11':         '900px'   ← expected 44px
```

Nothing in the current tree combines them, so this is latent rather than live — but it is
exactly the kind of trap the next contributor walks into, and it silently defeats the
`md:min-h-0` idiom this phase established everywhere else. The same split also means
`md:min-h-viewport` / `hover:min-h-viewport` would silently resolve to `100vh` only.

**Fix:** keep both halves in the same origin so normal cascade rules apply.

```css
@layer utilities {
  .min-h-viewport { min-height: 100vh; }
  @supports (min-height: 100dvh) {
    .min-h-viewport { min-height: 100dvh; }
  }
}
```

(If the `@utility` at-rule is preferred for variant support, put the `@supports` block inside
`@layer utilities` rather than at file top level.)

---

### WR-02: `svh` is the wrong unit for a `min-height` page floor, and the justifying comment is wrong

**Severity:** WARNING
**File:** `src/app/globals.css:216-225` and `349-363`

**Issue:** both comments justify the change as stopping iOS Safari's address bar from
*clipping* full-height sections. `min-height` cannot clip anything — it is a floor, not a
constraint. `height: 100vh` clips; `min-height: 100vh` only ever makes an element taller.

The real effect of the swap is the opposite of "safer": `svh` is the **smallest** viewport
height, so the floor is now *lower* than the visual viewport whenever the mobile URL bar is
retracted. `html` paints `#02030a` (globals.css:207-209) while `/changelog`, `/features`,
`/manifesto` and `/pricing` paint `#04060c` on the `min-h-viewport` root — a short page in
that set would expose a strip of the wrong background below the fold. Every page is currently
long enough that the floor never binds, so this is latent, but the unit choice is wrong for
the stated goal.

**Fix:** use `dvh` — it tracks the visual viewport in both directions, which is what a
"fill the screen" floor actually wants.

```css
@supports (min-height: 100dvh) {
  body { min-height: 100dvh; }
}
```

Also correct the comments: the `@supports` wrapper is defended on minifier grounds (fine),
but the `svh` choice itself should be defended on "don't create phantom scroll when the URL
bar is showing" grounds, not on clipping.

---

### WR-03: Desktop rendering is *not* unchanged — ~20 colour declarations changed at all widths

**Severity:** WARNING
**Files:** `src/components/Footer.tsx:72,80,101` · `src/app/mcp/page.tsx:221,232,256,259,262,265,298,310,334,351,390,394,440,443,452,458,461,485,501,529,538` · `src/app/features/page.tsx:10` · `src/app/manifesto/page.tsx:8` · `src/app/pricing/page.tsx:14` · `src/components/ChangelogItem.tsx:28` · `src/components/MethodologyPreviewSection.tsx:9`

**Issue:** the hard constraint for this phase was "desktop at ≥768 px is byte-for-byte
unchanged", and `05-05-SUMMARY.md:271` certifies it with:

> heading-order/landmark/contrast fixes are tag/attribute/token-only, verified zero className
> or style diffs beyond the token swap itself

That claim is false. `text-zinc-500` → `text-zinc-400` (Footer ×3, `/mcp` ×14) and
`text-zinc-600` → `text-zinc-400` (`/mcp` ×7) are unguarded `className` changes that render
identically at 390 px and 1440 px. The `FG_SUBTLE` constant swap is a larger visual delta than
its diff footprint suggests: `#5a6478` → `var(--color-ep-fg-muted-2)` = `#8590a8` lifts
relative luminance from 0.126 to 0.278 (contrast on `#04060c` goes 3.40:1 → 6.32:1) across
eyebrow numerals, bullet dashes, accordion `+` markers, the arrow glyph, and every "· default"
/ "lag · 1 day" microlabel on `/features`, `/manifesto`, `/pricing`, `/changelog` and the home
methodology preview.

Every one of these is a *justified* WCAG AA fix and I am not asking for them to be reverted.
The defect is that the phase's own verification artifact asserts they don't exist, which
means the next reviewer comparing desktop screenshots will chase a phantom regression.

**Fix:** amend `05-05-SUMMARY.md`'s RESP-08 row to state the exception explicitly, e.g.
"RESP-08 upheld for all layout/sizing changes; 20 colour declarations changed at all widths as
required by WCAG AA contrast remediation — enumerated below" with the list. Alternatively,
scope the contrast lifts behind a breakpoint if desktop parity genuinely outranks AA — but
that would ship a knowingly-failing desktop, so amending the claim is the correct fix.

---

### WR-04: Mobile menu has no `aria-expanded`, no `aria-controls`, and no keyboard dismissal

**Severity:** WARNING
**File:** `src/components/Navbar.tsx:69-81` (toggle) and `87-114` (panel)

**Issue:** this phase rewrote the hamburger from a raw `<button>` into `Button size="icon"`
(good — it fixes the CLAUDE.md "never use raw `<button>`" violation and gets it to 44×44), and
reworked the panel's spacing. It did not close the state-communication gap. Probed on the
production build at 390×844:

```
{ type: null, ariaExpanded: null, ariaControls: null, rect: 44x44 }
Escape pressed → menu still open: true
```

A screen-reader user gets "Toggle menu, button" with no indication of whether the menu is
currently open, and a keyboard user has no way to dismiss it without tabbing through every
link. axe does not flag either (the a11y suite passes), so nothing else in the harness will
catch this.

**Fix:**

```tsx
<Button
  variant="brand-link"
  size="icon"
  type="button"
  className="md:hidden"
  aria-label="Toggle menu"
  aria-expanded={mobileMenuOpen}
  aria-controls="mobile-nav"
  onClick={() => setMobileMenuOpen((o) => !o)}
>

{/* panel */}
<div id="mobile-nav" className="md:hidden ...">
```

and add an Escape handler:

```tsx
useEffect(() => {
  if (!mobileMenuOpen) return;
  const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobileMenuOpen(false);
  document.addEventListener("keydown", onKey);
  return () => document.removeEventListener("keydown", onKey);
}, [mobileMenuOpen]);
```

(`setMobileMenuOpen(!mobileMenuOpen)` → `setMobileMenuOpen((o) => !o)` is also the correct
functional-update form; the current version reads stale state under React 19 batching.)

---

### WR-05: `FG_SUBTLE` now renders identically to `FG_MUTED` — the foreground ramp collapsed from 4 steps to 3

**Severity:** WARNING
**Files:** `src/components/MethodologyPreviewSection.tsx:8-9` · `src/app/features/page.tsx:9-10` · `src/app/manifesto/page.tsx:7-8` · `src/app/pricing/page.tsx:13-14` · `src/components/ChangelogItem.tsx:27-28`

**Issue:** the contrast remediation pointed `FG_SUBTLE` at `--color-ep-fg-muted-2` (`#8590a8`),
which is the exact value `FG_MUTED` already holds. In `MethodologyPreviewSection.tsx` the two
constants are now byte-identical strings:

```ts
const FG_MUTED  = "var(--color-ep-fg-muted-2)";
const FG_SUBTLE = "var(--color-ep-fg-muted-2)";
```

and in the other four files `FG_MUTED = "#8590a8"` resolves to the same pixel. Every
`FG_SUBTLE` vs `FG_MUTED` distinction in those files is now dead — the eyebrow numeral and the
eyebrow label render the same colour, the "·" separator and the label render the same colour,
etc. The design system's four-step foreground ramp is silently three steps on five surfaces,
and the constants actively lie about the intent.

**Fix:** either pick a real fourth step that clears AA (e.g. add
`--color-ep-fg-subtle-aa: #79839a` — 5.0:1 on `#04060c`) and point `FG_SUBTLE` at it, or delete
`FG_SUBTLE` from these five files and use `FG_MUTED` at every call site so the flattening is
explicit rather than accidental.

---

### WR-06: Colour constants are now half-migrated — tokens and raw hex in the same six-line block

**Severity:** WARNING
**Files:** `src/app/features/page.tsx:6-14` · `src/app/manifesto/page.tsx:4-10` · `src/app/pricing/page.tsx:10-18` · `src/components/ChangelogItem.tsx:25-30`

**Issue:** CLAUDE.md is explicit: "Never use raw hex in components — use the OKLCH tokens."
This phase converted exactly one constant per file to a token and left the rest as raw hex:

```ts
const SECTION_BG  = "#04060c";                        // raw hex
const FG_STRONG   = "#f4f6fb";                        // raw hex
const FG          = "#aab3c5";                        // raw hex
const FG_MUTED    = "#8590a8";                        // raw hex
const FG_SUBTLE   = "var(--color-ep-fg-muted-2)";     // token  ← this phase
const ACCENT      = "#4487D6";                        // raw hex
const ACCENT_LIGHT = "#77B7ED";                       // raw hex
```

The result is worse than either endpoint: a reader can no longer tell whether a value is
token-backed by looking at it, and a future token retune will move one of the seven. Tokens
for every one of these already exist (`--color-ep-section-bg`, `--color-ep-fg-strong`,
`--color-ep-fg`, `--color-ep-fg-muted-2`, `--color-ep-accent`, `--color-ep-accent-light`), and
`MethodologyPreviewSection.tsx` / `SystemBlueprintSection.tsx` / `CTASection.tsx` already use
them exclusively — so the pattern is proven, just not applied.

Side effect: `--color-ep-fg-subtle-2` (`#5a6478`) now has **zero references** anywhere in
`src/` (grep-verified) — it is a dead token in `@theme inline`.

**Fix:** finish the swap in these four files and delete `--color-ep-fg-subtle-2` from
`globals.css:108`, or explicitly log the remaining hex as deferred debt.

---

### WR-07: `<pre tabIndex={0}>` adds five unlabeled focus stops per `/mcp` visit

**Severity:** WARNING
**File:** `src/app/mcp/page.tsx:177-181`

**Issue:** `tabIndex={0}` satisfies axe's `scrollable-region-focusable`, but a focusable
element with no role and no accessible name announces as nothing. Probed:

```
[ {tab:'0', role:null, label:null} × 5 ]
```

A screen-reader user tabbing `/mcp` hits five stops that say only "blank" / the raw code text.
The global focus ring (`globals.css:250-254`) also now paints a 2 px outline with `border-radius: 6px`
on a `rounded-lg` (8 px) `<pre>`, so the ring corner does not match the element corner.

**Fix:** name the region so the focus stop is meaningful.

```tsx
function CodeBlock({ code, label }: { code: string; label: string }) {
  return (
    <div className="relative group">
      <pre
        tabIndex={0}
        role="region"
        aria-label={`${label} — code sample`}
        className="rounded-lg ... overflow-x-auto"
      >
```

---

### WR-08: The `brand` variant's pill radius is always destroyed by the size variants

**Severity:** WARNING (pre-existing, but this phase rewrote every one of these size strings)
**File:** `src/components/ui/button.tsx:22-23, 27-36`

**Issue:** `variant.brand` sets `rounded-full`; `size.sm|lg|xs|icon-xs` all set `rounded-md`.
`cn()` is `twMerge(clsx(...))` (`src/lib/utils.ts`), and cva emits variant before size, so
`tailwind-merge` resolves the `rounded-*` conflict to the **last** class — `rounded-md` — for
every brand button on the site. Measured on the production build:

```
heroCta   (variant=brand size=lg) borderRadius: "8px"
navSignUp (variant=brand size=sm) borderRadius: "8px"
```

CLAUDE.md specifies "Primary CTA: shadcn `Button` `brand` variant (**pill**, white-alpha
border/bg…)". No brand CTA on the site is a pill. This predates phase 05, but the phase
rewrote all eight size strings without noticing, and the `md:` guard work makes these strings
harder to reason about, not easier.

**Fix:** drop `rounded-md` from the size variants (it duplicates the base `rounded-md` on
line 8 anyway, so removing it is a no-op for non-brand variants and restores the pill for
`brand`):

```ts
size: {
  default:   "h-11 md:h-9 px-4 py-2 has-[>svg]:px-3",
  xs:        "h-11 md:h-6 gap-1 px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
  sm:        "h-11 md:h-8 gap-1.5 px-3 has-[>svg]:px-2.5",
  lg:        "h-11 md:h-10 px-6 has-[>svg]:px-4",
  ...
}
```

Verify with the existing Playwright harness that `borderRadius` becomes `9999px` for brand
CTAs and stays `8px` for `default`/`outline`/`secondary`.

---

## Info

### IN-01: Two unused module constants (eslint warnings)

**File:** `src/app/changelog/page.tsx:8` · `src/app/manifesto/page.tsx:10`

`npx eslint src e2e` reports:

```
src/app/changelog/page.tsx   8:7  'FG_MUTED' is assigned a value but never used
src/app/manifesto/page.tsx  10:7  'ACCENT_LIGHT' is assigned a value but never used
```

Pre-existing, but both files are in this phase's diff and both constant blocks were edited.
Delete them.

---

### IN-02: `hsl(var(--muted))` produces an invalid gradient — the overlay computes to `background-image: none`

**File:** `src/components/SystemBlueprintSection.tsx:36, 56`

```tsx
<div className="absolute inset-0 [background:radial-gradient(125%_125%_at_50%_0%,transparent_40%,hsl(var(--muted)),white_125%)]"></div>
```

`--muted` is `#18181b` (a hex, `globals.css:302`), so `hsl(#18181b)` is invalid, the gradient
is invalid, and the whole declaration is dropped. Verified in the browser:
`getComputedStyle(el).backgroundImage === "none"` for both instances. Pre-existing dead
decoration — and fortunate, since the `white 125%` stop would have washed out the mockups.
Delete the two `<div>`s or rewrite them against a real token.

---

### IN-03: Ternary with identical branches

**File:** `src/app/features/page.tsx:243`

```tsx
textDecoration: h.done ? "none" : "none",
```

Dead conditional — the not-done habit chip presumably wanted `line-through`. Either implement
it or drop the property.

---

### IN-04: `.text-glow-hero` is unreferenced dead CSS that violates a documented ban

**File:** `src/app/globals.css:190-194`

`grep -rn "text-glow-hero" src/` returns only the definition. It also uses `text-shadow`,
which CLAUDE.md bans outright ("Never use `text-shadow` glows on headings or badges") and
uses `rgba(30, 64, 175, …)`, the banned neon blue. Safe to delete.

---

### IN-05: Tailwind is scanning `.planning/**/*.md` and shipping invalid utilities

**File:** build output (`.next/static/chunks/*.css`)

The production stylesheet contains classes minted from planning prose:

```css
.md\:w-\[NNNpx\]{width:NNNpx}
.md\:text-\[clamp\(\.\.\.\)\]{font-size:clamp(...)}
.md\:text-\[\.\.\.\]{color:...}
```

These come from `RESPONSIVE.md:347`, `05-03-SUMMARY.md:21,23` and `AUDIT-BRIEF.md:62`. Harmless
(browsers drop the invalid declarations) but they are shipped bytes and they pollute any future
CSS diff. Add a `@source not "../../.planning";` directive to `globals.css` or scope the content
sources explicitly.

---

### IN-06: `touch-targets.spec.ts` hidden-element filtering diverges from `overflow.spec.ts`

**File:** `e2e/touch-targets.spec.ts:49, 34-41` (and its dependency `e2e/support/pages.ts:12-30`)

Three smaller issues in the same probe:

1. `overflow.spec.ts:59-60` skips `cs.opacity === "0"`; `touch-targets.spec.ts:49` does not.
   A Framer entrance variant caught mid-flight would be measured. `gotoSettled` makes this
   unlikely, not impossible — the two sibling specs should agree.
2. `describe()` joins Tailwind class names with `.`, which yields un-runnable selectors for
   anything containing `:` or `[` (i.e. most of this codebase). It is only a label, but
   `md:hidden.text-[var(--x)]` is not usefully greppable. Prefer `outerHTML.slice(0, 120)`.
3. `e2e/support/pages.ts:12-14` still opens with "`src/app/layout.tsx` puts `overflow-x-hidden`
   on `<body>`" — this phase removed that class (`layout.tsx:57`). The helper is deliberately
   retained as a regression guard (its own closing paragraph says so), but the opening
   statement is now false and will mislead the next reader.

---

### IN-07: Container padding recipe is inconsistent across the reading pages

**File:** `src/app/changelog/page.tsx:902` and `src/app/manifesto/page.tsx:186` (`lg:px-8`) vs `src/app/features/page.tsx:876` (`md:px-8`)

CLAUDE.md's canonical container is `max-w-5xl px-6 md:px-8`. `/features` follows it; `/changelog`
and `/manifesto` use `lg:px-8`, so the three pages have different gutters between 768 px and
1024 px. Pre-existing, but all three files are in this diff.

---

### IN-08: `Button` renders `<button>` with no `type`, defaulting to `submit`

**File:** `src/components/ui/button.tsx:55-65`

Verified: the Navbar hamburger has `type: null`. Harmless today (no `<form>` on this site), but
this phase promoted the hamburger *into* the shared primitive, so the default now applies to
every future consumer. Add `type={asChild ? undefined : (props.type ?? "button")}`.

---

### IN-09: `themeColor` duplicates `--color-ep-bg-base` as a literal with no link back to the token

**File:** `src/app/layout.tsx:42`

```ts
themeColor: "#02030a",
```

This is unavoidable — Next.js viewport metadata cannot read CSS custom properties — but it is
the third independent copy of `#02030a` (`globals.css:94`, `globals.css:208`,
`layout.tsx:57 bg-[#02030a]`, plus this). A retune of `--color-ep-bg-base` will silently leave
the browser chrome on the old colour. At minimum add a trailing comment naming the token, as
`RESPONSIVE.md:203` already does.

---

## Verification performed

| Check | Method | Result |
|---|---|---|
| Production build | `npx next build` | ✓ compiles, 11 static routes |
| Desktop restoration completeness | parsed `@media (min-width:48rem)` block in emitted CSS | ✓ `md:h-9/8/10/6`, `md:size-9/8/10/7/6`, `md:min-h-0`, `md:inline-block`, `md:w-[1200px]`, `md:text-[clamp(48px,6vw,80px)]` all present, all after the base utilities |
| `@supports` survives minification | grep of `.next/static/chunks/*.css` | ✓ both `body` rules and both `.min-h-viewport` rules present |
| `min-h-viewport` resolves | live DOM at 390×844 on `/`, `/pricing`, `/terms` | ✓ `844px` |
| Mobile clamp validity | emitted `.text-\[clamp\(2rem\,3\.92vw\+1\.12rem\,3rem\)\]` | ✓ Tailwind inserted the required spaces around `+` |
| `overflow-x-clip` side effects | computed styles + `fixed` overlay rects on `/privacy` @1440 | ✓ `clip`/`visible`, both fixed overlays still painted |
| Responsive suite (mobile) | `--project=reflow-320 --project=mobile-390` | ✓ 64/64 pass |
| Responsive suite (desktop) | `--project=tablet-768 --project=laptop-1024 --project=desktop-1440` | ✓ 72 pass, 24 skipped |
| `touch-iphone` project | attempted | ✗ cannot launch (missing host deps — already logged in `deferred-items.md`); it is the **only** project that emulates `hover: none` / `pointer: coarse`, so all `@media (hover: hover)` work in this phase is currently unverified by CI |
| Touch-target ground truth | direct `getBoundingClientRect` sweep at 390×844, all 8 routes | ✗ see CR-01, CR-02 |
| Lint | `npx eslint src e2e` | 2 warnings (IN-01) |
| e2e typecheck | `npx tsc -p tsconfig.e2e.json` | ✓ clean |

---

_Reviewed: 2026-07-31_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
