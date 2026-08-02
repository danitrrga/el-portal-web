# Phase 7: Spanish Localization - Pattern Map

**Mapped:** 2026-08-02
**Files analyzed:** 26 (8 routes, 10 shared/section components, 4 e2e harnesses, 4 new infra files)
**Analogs found:** 17 / 26 (9 are greenfield — no next-intl/SEO/i18n code exists in this repo today)

**Ground-truth method:** every line number below was read directly by this
agent in this pass (not carried from `07-REVIEWS.md`, `07-CONTEXT.md`, or any
`07-NN-PLAN.md`). Where my reading independently confirms a fact already
flagged in `07-REVIEWS.md`, I say so — that is corroboration, not citation.

---

## Zero-Analog Reality Check (read first)

This repo has **no i18n, no SEO abstraction layer, and no data-extraction
layer today**:

- `grep -r next-intl package.json` → absent. `next.config.ts` → 4 lines, empty
  `NextConfig` object. No `middleware.ts`, no `proxy.ts`, no `src/i18n/`.
- `src/messages/` does not exist. `src/lib/` contains only `utils.ts` (the
  shadcn `cn()` helper) — no `seo.ts`.
- Every page/component string is inline JSX or a module-level plain-object
  array (`PRINCIPLES`, `SCALES`, `ACTS`, `readTools`, `navLinks`,
  `footerColumns`). **None of these arrays are a "register" or "content
  model" with a `description` prop contract** — they are just local component
  state shaped for `.map()`.
- `src/app/layout.tsx` loads all 4 fonts with `subsets: ["latin"]` only (line
  8, 15, 21, 27 below) — **no `latin-ext` subset**. This is load-bearing for
  the 07-05 glyph-coverage concern: Google Fonts' `latin` subset for Special
  Gothic Expanded One and Inter does NOT guarantee `Á É Í Ó Ú Ñ á é í ó ú ñ`.
  Verify glyph coverage empirically (`document.fonts.check`) rather than
  assuming `latin-ext` is unnecessary — this repo has never loaded it.

Consequently, the infra files (`app/proxy.ts`, `src/i18n/routing.ts`,
`src/i18n/request.ts`, `src/lib/seo.ts`, `sitemap.ts`, `robots.ts`) have **no
in-repo analog** — planner must build these from `07-RESEARCH.md` §§3–4 and
the next-intl docs cited there, not from an existing file. This is stated
explicitly in "No Analog Found" below so it isn't silently assumed to exist.

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `app/proxy.ts` (new) | middleware/routing | request-response | *(none)* | no analog — greenfield |
| `src/i18n/routing.ts` (new) | config | config | `next.config.ts` (shape only, not content) | no analog — greenfield |
| `src/i18n/request.ts` (new) | config | config | *(none)* | no analog — greenfield |
| `src/lib/seo.ts` (new) | utility | transform | `src/app/layout.tsx` `metadata` export (lines 33–37) | partial — only the `Metadata` shape exists, not a per-route generator |
| `src/app/[locale]/sitemap.ts` (new) | route (special file) | batch | `e2e/support/pages.ts` `ROUTES` (lines 4–13) | partial — same 8-path list, different consumer |
| `src/app/[locale]/robots.ts` (new) | route (special file) | request-response | *(none)* | no analog — greenfield |
| `src/messages/{en,es}/*.json` (new, ~10 namespaces) | data / config | batch | *(none — no JSON message files exist)* | no analog — greenfield structure, but keys are 1:1 lifts of the JSX below |
| `src/components/LanguageSwitcher.tsx` (new) | component | event-driven | `src/components/Navbar.tsx` (nav-link array + active-state pattern, lines 12–17, 56–69) | role-match |
| `src/app/[locale]/layout.tsx` (moved from `src/app/layout.tsx`) | provider/layout | request-response | `src/app/layout.tsx` (itself, 63 lines — see excerpt below) | exact (same file, extended) |
| `src/app/[locale]/page.tsx` (moved) | route | request-response | `src/app/page.tsx` (itself, 30 lines) | exact |
| `src/app/[locale]/features/page.tsx` (moved) | route | CRUD (static content render) | `src/app/features/page.tsx` (itself, 970 lines) | exact |
| `src/app/[locale]/manifesto/page.tsx` (moved) | route | request-response | `src/app/manifesto/page.tsx` (itself, 244 lines) | exact |
| `src/app/[locale]/changelog/page.tsx` (moved) | route | batch (list render) | `src/app/changelog/page.tsx` (itself, 944 lines) | exact |
| `src/app/[locale]/mcp/page.tsx` (moved) | route | request-response | `src/app/mcp/page.tsx` (itself, 564 lines) | exact |
| `src/app/[locale]/pricing/page.tsx` (moved) | route (client) | request-response | `src/app/pricing/page.tsx` (itself, `"use client"` at line 1) | exact |
| `src/app/[locale]/privacy/page.tsx` (moved) | route | request-response | `src/app/privacy/page.tsx` (itself, 268 lines) | exact |
| `src/app/[locale]/terms/page.tsx` (moved) | route | request-response | `src/app/terms/page.tsx` (itself, 197 lines) | exact |
| `src/components/Navbar.tsx` (modified — extract strings, mount switcher) | component | event-driven | itself | exact |
| `src/components/Footer.tsx` (modified — extract strings, mount switcher) | component | event-driven | itself | exact |
| `src/components/CTASection.tsx` (modified) | component | request-response | itself (71 lines, confirmed) | exact |
| `src/components/Hero.tsx` (modified) | component | event-driven | itself (204 lines, confirmed) | exact |
| `src/components/hero/VCDSection.tsx` (modified) | component | transform (data-viz labels) | itself (319 lines, confirmed) | exact |
| `src/components/SystemBlueprintSection.tsx` (modified) | component | transform | itself (511 lines, confirmed) | exact |
| `src/components/MethodologyPreviewSection.tsx` (modified) | component | CRUD (map over array) | itself (121 lines, confirmed) | exact |
| `src/components/ChangelogItem.tsx` (modified) | component | transform | itself (168 lines, confirmed) | exact |
| `e2e/support/pages.ts` (modified — `ROUTES` → `EN_ROUTES`/`ES_ROUTES`) | test-fixture | batch | itself (63 lines, confirmed) | exact |
| `e2e/containment.spec.ts`, `touch-targets.spec.ts`, `a11y.spec.ts` (modified — iterate both locales) | test | batch | `e2e/touch-targets.spec.ts` (confirmed pattern below) | exact |
| `.claude/skills/el-portal-changelog/SKILL.md` (modified — add translation step) | config/skill doc | event-driven (sync) | itself | exact |

---

## Pattern Assignments

### `src/app/layout.tsx` → `src/app/[locale]/layout.tsx`

**This IS the analog** (63 lines total, read in full):

**Font-loading pattern (lines 1–31)** — all four fonts pinned to `subsets: ["latin"]`:
```typescript
import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Instrument_Serif, Special_Gothic_Expanded_One } from "next/font/google";
import { MotionProvider } from "@/components/MotionProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "900"],
});
// ...same subsets:["latin"] on jetbrainsMono, instrumentSerif, specialGothicExpandedOne
```
No `latin-ext` anywhere in this file. If accented uppercase glyphs (Special
Gothic Expanded One `.display` on H1/H2) are missing, this is the file where
`subsets` gains `"latin-ext"` — do not add a fallback font per CLAUDE.md
("never re-introduce the italic Instrument Serif payoff word convention").

**Metadata pattern (lines 33–37)** — single static object, no per-locale/per-route generation exists yet:
```typescript
export const metadata: Metadata = {
  title: "El Portal - The personal OS",
  description: "El Portal is a mobile-first personal operating system. ...",
};
```
This is the ONLY metadata precedent in the repo. `src/lib/seo.ts` and per-route
`generateMetadata`/`alternates.languages` have no analog — build from
`07-RESEARCH.md` §3.2 / §4 and next-intl's `getTranslations` + metadata docs.

**Root shell pattern (lines 46–63)**:
```tsx
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} ${instrumentSerif.variable} ${specialGothicExpandedOne.variable} bg-[#02030a] text-slate-300 font-sans antialiased selection:bg-primary/30 selection:text-white`}>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
```
`lang="en"` (line 52) is hardcoded — this is the exact spot that becomes
`lang={locale}`, and `RootLayout` gains `params: Promise<{ locale: string }>`
+ `setRequestLocale(locale)` per `07-RESEARCH.md` §3.2. `className="dark"` on
`<html>` must survive unchanged (CLAUDE.md: dark-mode-only, non-negotiable).

---

### `e2e/support/pages.ts` (test-fixture, batch) — the harness backbone

**Read in full, 63 lines. This IS the analog** for `EN_ROUTES`/`ES_ROUTES`:

**Route list (lines 4–13)**:
```typescript
export const ROUTES = [
  "/",
  "/features",
  "/manifesto",
  "/changelog",
  "/mcp",
  "/pricing",
  "/privacy",
  "/terms",
] as const;
```
8 flat paths, no locale prefix today. `EN_ROUTES` is this array unchanged;
`ES_ROUTES` is the same 8 paths with `/es` prefixed (except `/es` for `/` —
confirm against `localePrefix: "as-needed"` semantics, since `/` itself is the
negotiation point per D-nothing-changes-at-`/`).

**Settle helpers (lines 26–63)** — `unclipViewport`, `settle`, `gotoSettled` —
locale-agnostic, reusable as-is; extending to `ES_ROUTES` is a data change
only, not a rewrite (confirms `07-CONTEXT.md`'s own claim under "Reusable
Assets").

---

### `e2e/touch-targets.spec.ts` — the switcher's hard constraint

**Confirmed by direct read (120+ lines inspected):**

**Loop + viewport skip (lines 42–49)**:
```typescript
for (const route of ROUTES) {
  test(`touch targets >= ${AAA_TARGET}px: ${route}`, async ({ page }, testInfo) => {
    const width = page.viewportSize()?.width ?? 0;
    test.skip(width >= 768, "AAA touch target applies below the md: breakpoint; >=768px is the frozen desktop design");
```
Extending this loop to `ES_ROUTES` is mechanical — swap `ROUTES` for
`[...EN_ROUTES, ...ES_ROUTES.map(...)]` or run two `for` blocks.

**The inline-text exemption (lines 94–104)** — the ONLY way an anchor skips the size check:
```typescript
if (el.tagName === "A") {
  const parent = el.parentElement;
  const inRunningText =
    !!parent &&
    Array.from(parent.childNodes).some(
      (n) =>
        n.nodeType === Node.TEXT_NODE &&
        (n.textContent ?? "").trim().length > 0,
    );
  if (inRunningText) continue;
}
```
A wrapper `<div>`/`<span>` around two `<Link>`s with only an `aria-hidden`
separator between them does **not** satisfy this — there is no real text
node. The switcher is NOT exempt.

**The actual pass condition (line 108)**:
```typescript
if (r.width >= min && r.height >= min) continue;
```
Both dimensions, confirmed — `min-h-11` alone (height only) is insufficient.
`"EN"`/`"ES"` at 13–15px font renders ~20–24px wide. **Fix mechanic:**
horizontal padding per link (`px-3` or similar) on each switcher `<Link>`, not
`min-w` on a flex-wrapping parent (a flex child's `min-w` doesn't force intrinsic
content width the way padding does).

---

### `src/components/Navbar.tsx` (component, event-driven) — LanguageSwitcher's host + closest analog

**Read in full, 135 lines. This is the best analog for `LanguageSwitcher.tsx`** — same "small array of links, active-state highlighting, responsive visibility" shape.

**Data + active-state pattern (lines 12–17, 56–69)**:
```typescript
const navLinks = [
    { href: "/manifesto", label: "Manifesto" },
    { href: "/changelog", label: "Changelog" },
    { href: "/features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
];
// ...
{navLinks.map((link) => (
    <Link
        key={link.href}
        className={[
            "transition-colors duration-300",
            pathname === link.href
                ? "text-[var(--color-ep-fg-strong)]"
                : "text-[var(--color-ep-fg)] hover:text-[var(--color-ep-fg-strong)]",
        ].join(" ")}
        href={link.href}
    >
        {link.label}
    </Link>
))}
```
`LanguageSwitcher` swaps `pathname === link.href` for "is this the active
locale" and reuses the `usePathname()` import (line 5) — needed anyway to
implement D-12 (switching preserves route) via next-intl's locale-aware
`usePathname`/`Link` from `createNavigation`.

**Desktop-only visibility precedent (line 55)**: `hidden md:flex` on the nav
links wrapper — the mount point for D-11's "nav on desktop" placement. Insert
the switcher inside the "Right Actions" div (lines 73–100), which already
mixes `hidden sm:inline-flex` (line 74, Log in button) and unconditional
buttons — precedent for conditionally-hidden CTAs living beside always-visible
ones in that flex row.

**Mobile-menu 44px precedent (lines 104–132)** — the existing height-only
fix, confirmed **insufficient by itself** for the switcher (see
`touch-targets.spec.ts` above), but the correct base to extend:
```tsx
<Link
    className={[
        "flex min-h-11 items-center text-sm font-medium transition-colors duration-300",
        ...
    ].join(" ")}
```

---

### `src/components/Footer.tsx` (component, event-driven) — second switcher mount point

**Read in full, 127 lines.**

**Data-array pattern (lines 7–30)** — `footerColumns`, an array of `{title, links: [{label, href}]}`:
```typescript
const footerColumns = [
    { title: "Product", links: [
        { label: "Features", href: "/features" },
        { label: "Changelog", href: "/changelog" },
        { label: "MCP Integration", href: "/mcp" },
    ]},
    { title: "Company", links: [
        { label: "Manifesto", href: "/manifesto" },
        { label: "About", href: "/manifesto" },
    ]},
    { title: "Legal", links: [
        { label: "Privacy", href: "/privacy" },
        { label: "Terms", href: "/terms" },
    ]},
];
```
This is the extraction target for the `common` namespace's footer nav labels.
Note "About" and "Manifesto" both point at `/manifesto` (line 20) — a single
translation key must not accidentally collapse these two distinct English
labels into one Spanish string unless that's an intentional content decision.

**The corrected touch-target discriminator, in the maintainers' own words
(lines 88–92, comment immediately above the link className)**:
```tsx
// Below md: the anchor becomes a full-width 44px row so the
// tap target meets the AAA contract. `md:inline md:min-h-0`
// restores the original inline anchor on the frozen desktop
// design (align-items/min-height are inert on inline boxes).
className="flex min-h-11 items-center text-sm text-zinc-400 hover:text-zinc-100 transition-colors duration-300 md:inline md:min-h-0"
```
This pattern works for these links because the link *text itself*
("Features", "Changelog", "MCP Integration") is wide enough to clear 44px
once it's a full-width row. `"EN"`/`"ES"` is not — reuse the `flex min-h-11
items-center` shape but add explicit horizontal padding, per the
`touch-targets.spec.ts` finding above.

**Bottom-bar mount point (lines 104–123)** — D-11 "footer on all viewports"
lands between the copyright `<p>` (line 105) and the wordmark `motion.div`
(line 110), inside the existing `flex flex-col gap-10 sm:flex-row
sm:items-center sm:justify-between sm:gap-6` container (line 104) — a 3-way
`justify-between` becomes the natural slot, or the switcher nests beside the
copyright text.

**Note:** `text-zinc-400`/`hover:text-zinc-100` (lines 72, 80, 92, 105) are
raw Tailwind `zinc-*` classes still in this file — CLAUDE.md forbids mixing
`zinc-*`/`slate-*` with the OKLCH tokens on landing surfaces, but this is a
**pre-existing debt in the file being modified, not something this phase
introduces.** Do not silently "fix" it as a side-effect of string extraction
— flag as scope-creep risk if a plan proposes touching it.

---

### `src/components/CTASection.tsx` (component, request-response) — the corrected structure

**Read in full, 71 lines (confirmed — corroborates `07-REVIEWS.md`'s finding
that earlier plans cited "over 100 lines" and "append at :102", both wrong).**

Copy is **inline JSX**, not a register object. The four real strings, exact locations:

```tsx
// H2 — line 43
Start your first Version.

// Body — lines 50–52
Open El Portal, draft a 90-day arc, run your first Cycle. The
system tracks, analyzes, and surfaces patterns — you focus on
the work.

// Button label — line 58
<span className="text-nowrap">Open El Portal</span>

// Eyebrow-role span — lines 61–66
<span className="text-[11px] font-medium uppercase tracking-[0.18em]" style={{ color: FG_MUTED }}>
  Set up in under 10 minutes
</span>
```
There is no 5th CTA and no secondary link — the only `<Link>` in the file
targets `APP_URL` (line 57, `process.env.NEXT_PUBLIC_APP_URL`, line 9). Any
plan asserting a `/mcp` or `/pricing` secondary CTA in this file is wrong;
there isn't one. "Open El Portal" (line 58) is glossary-adjacent (matches
Navbar/Hero's identical button text) — route it through `common`, not a
one-off `home`/`cta` key, to avoid a 4th independent occurrence of the same
string.

---

### `src/components/hero/VCDSection.tsx` (component, transform/data-viz) — no register, inline JSX confirmed

**Read in full, 319 lines.** Confirms `07-REVIEWS.md`: no register object, no
`description` prop. Two distinct string sites:

**Section heading (inline JSX, lines 29–37)**:
```tsx
<h2 className="display text-balance ..." style={{ color: FG_STRONG }}>
  Three horizons. One hierarchy.
</h2>
<p className="mt-4 ..." style={{ color: FG }}>
  Versions plan identity. Cycles run focus. Days carry the score.
</p>
```

**Captions grid — 3 `<Caption>` calls (lines 44–58), each with `label`/`body` passed as JSX props to a local component, NOT read from an array**:
```tsx
<Caption icon={Compass} label="Version" body="Identity arc. The phase you're committing to." />
<Caption icon={Repeat} label="Cycle" body="Focus sprint. Six fit inside a Version." />
<Caption icon={Sun} label="Day" body="Atomic unit. Weighted habits roll into one number." />
```
These sit in `grid gap-8 sm:grid-cols-3 sm:gap-10` (line 43) — a 3-column
grid, no 4th item exists and no 4th item should be added (that was a stale
plan claim per `07-REVIEWS.md`; the phase scope is translation, not content
addition). `BandLabel` (lines 167–189) repeats the identical `label` strings
("Version"/"Cycle"/"Day") a second time inside `LayeredStrata` (line 146,
154, 158) — **4 total occurrences of each of the 3 labels across the file**
(Caption ×3 + BandLabel ×3 = 6 label props, 3 distinct strings). Extract once
into `home.json` (`vcd.version.label`, etc.) and reference from both call
sites — do not duplicate the translated string inline at each call site.

**Extraction mechanic for this file and `Hero.tsx` (per `07-REVIEWS.md`'s own
correction, independently confirmed here):** grep for JSX text nodes
(`>[A-Z][a-z]`) and quoted string literals passed as `label=`/`body=`/`title=`
props; there is no register/content object to enumerate against.

---

### `src/components/Hero.tsx` (component, event-driven) — confirmed inline JSX

**Read in full, 204 lines.**

**Announcement pill (lines 80–110)** — only inline copy, `href="/pricing"` confirmed (line 81); no other href in the pill:
```tsx
<Link href="/pricing" className="group mx-auto flex w-fit items-center gap-4 rounded-full border p-1 pl-4 ...">
  <span className="text-sm" style={{ color: "var(--color-ep-fg)" }}>
    <span style={{ color: "var(--color-ep-accent-light)" }} className="font-medium">Early access</span>
    <span style={{ color: "var(--color-ep-separator)" }}> · </span>
    Launching soon · First 30 signups get Pro for life
  </span>
  ...
</Link>
```
"Early access" and the launch copy are two separately-styled inline text runs
inside one `<span>` — extract as two keys or one key with embedded markup
depending on the ICU/rich-text approach next-intl's `t.rich()` supports (see
`07-RESEARCH.md` §5, ICU MessageFormat).

**H1 (lines 113–120, frozen clamp, do not touch the className)**:
```tsx
<h1 className="display mt-8 max-w-4xl mx-auto text-balance lg:mt-16 text-[clamp(1.625rem,3.571vw+0.911rem,2.625rem)] md:text-[clamp(42px,4.2vw,58px)]" style={{ color: "var(--color-ep-fg-strong)" }}>
  The final operating system for high-performers.
</h1>
```

**Sub-copy (lines 123–128) and two CTAs (lines 146–161)**:
```tsx
<p className="mx-auto mt-8 max-w-2xl text-balance text-lg leading-[1.55]" style={{ color: "var(--color-ep-fg)" }}>
  Versions plan a 90-day identity. Cycles run a 15-day focus. Track habits, goals, biometrics... The system analyzes the trends the eye misses.
</p>
...
<Link href={APP_URL}><span className="text-nowrap">Open El Portal</span></Link>
<Link href="/features"><span className="text-nowrap">Read the methodology</span></Link>
```
Second CTA targets `/features` (line 158), NOT `/mcp` — confirms
`07-REVIEWS.md`'s "only `href='/pricing'` found" caveat generalizes: this
file's only hrefs are `/pricing` (pill), `APP_URL` (primary CTA), and
`/features` (secondary CTA). No `/mcp` link exists in `Hero.tsx`.

---

### `src/components/SystemBlueprintSection.tsx` (component, transform) — props ARE real here, but only at the top

**Read lines 1–70 and 160–200 of 511 total.** Confirms `07-REVIEWS.md`: the
`title=`/`description=` prop pattern is real, but only for the 2 top-level
`CardHeading` calls — the mockup internals (LabMockup, TrendsMockup) are
separate inline-string territory.

**The 2 real prop-based strings (lines 28–32, 48–52)**:
```tsx
<CardHeading icon={FlaskConical} title="The Lab" description="Where you design, execute, and iterate on your self-development system." />
...
<CardHeading icon={LineChart} title="Trends" description="A correlation engine and AI model, evaluate your daily logs and biometric data to find patterns that were hidden." />
```
"Trends" (line 50) must stay **English** per the locked glossary (D-01 table:
`Trends` kept English in the app's `es.json`) — this is the one string in
this file that is NOT translated even though it sits in a `title=` prop.

**Inside `LabMockup` (mockup internals, confirmed lines 172–199) — a genuine
inline data array, no props**:
```tsx
{[
  { title: "Sub-22 5k race in 30 days", pct: 13 },
  { title: "Marketing site v2", pct: 33 },
  { title: "Hit 100 paying customers", pct: 0 },
  { title: "Read 12 books this version", pct: 9 },
].map((g) => (...))}
```
This is fictional demo data (goal titles inside a mockup screenshot-style
UI), not site copy — confirm with the register decision-maker whether mockup
placeholder text is in scope for translation at all (it reads as "sample
user data", similar in kind to the dead `DashboardPreview.tsx` below) before
spending glossary effort on it.

**Dead code — exclude from scope:** `src/components/DashboardPreview.tsx`
(256 lines) is **not imported anywhere** (`grep -rn DashboardPreview src`
returns only its own definition). It also contains the banned
`animate-pulse` and `rgba(30,64,135,...)` patterns per CLAUDE.md's
anti-pattern list. Do not translate it; flag it for deletion in a
housekeeping note if any plan stumbles onto it.

---

### `src/components/MethodologyPreviewSection.tsx` (component, CRUD/map) — the one confirmed-accurate register

**Read in full, 121 lines.** This is the cleanest extraction target in the
whole component set — genuinely `.map()`-driven, confirming
`07-REVIEWS.md`'s "Task 2 confirmed accurate" finding independently.

**`PRINCIPLES` array (lines 19–35), 3 items**:
```typescript
const PRINCIPLES = [
  { num: "01", title: "Identity drives behavior.", body: "You decide who you want to become. Cycles align around that direction, focusing on the skills and habits your future identity requires. Days keep you consistent." },
  { num: "02", title: "Data collection is essential", body: "You can't improve what you don't understand. Track the parts of your life that matter, and build a clearer picture of how you think, work, and live." },
  { num: "03", title: "The system works for you.", body: "You do the work. The system analyzes patterns, weighs signals, and surfaces what matters most. A curated tool designed to support your growth, not demand your attention." },
];
```

**Render site (line 80)**: `{PRINCIPLES.map((p) => (...))}` — straightforward
1:1 lift into `home.json` as `methodology.principles[0..2].title/.body`.

**Two more strings outside the array** — eyebrow (line 59: `Features`) and
CTA link text (line 113: `Read the full methodology`, wrapping `/features`,
confirmed the only href in this file besides the parent grid). Use this
plan's structure (array + 2 standalone strings, all cited with exact lines)
as the **template for how to write the corrected 07-06/07-07 extraction
steps** — this is the one file the reviewer found zero discrepancies in.

---

### `src/components/ChangelogItem.tsx` + `src/app/changelog/page.tsx` — count discrepancy independently reconfirmed

**Read `ChangelogItem.tsx` in full (168 lines).**

**`NOTE_ICONS` map (lines 4–9) — confirmed, 4 keys**:
```typescript
const NOTE_ICONS = {
  lock: Lock,
  rocket: Rocket,
  info: Info,
  pen: PenLine,
} as const;
```

**Hardcoded `"Note:"` label (line 159)**:
```tsx
<strong className="font-semibold not-italic" style={{ color: FG }}>
  Note:
</strong>{" "}
{entry.note.text}
```
This is a hardcoded label sitting outside the `entry` data — it needs its own
translation key (`changelog.noteLabel` or similar in `common`/`changelog`
namespace); it is not part of the `ChangelogEntry` type (lines 14–23) and
would otherwise be missed since it's not data-driven.

**Independently reconfirmed count discrepancy** (ran fresh, not copied from
`07-REVIEWS.md`):
```
$ grep -c "version:" src/app/changelog/page.tsx   → 33
$ grep -n "note:" src/app/changelog/page.tsx      → 7 matches (lines 242, 437, 495, 707, 818, 860, 873)
```
**33 entries, not 35.** This independently reconfirms the reviewer's finding
via a fresh grep in this pass. Any plan (07-12, 07-14) still asserting 35 —
including hard `if (e.length !== 35)` CI assertions — will fail its own gate
and must be corrected to 33 before Wave 3 proceeds. The 7-note count is
independently confirmed correct.

---

### `src/app/features/page.tsx` (route, 970 lines) — `SCALES` confirmed

**Read lines 82–117 directly.**

**`SCALES` array (starts line 82), 3 items, each with `name`/`duration`/`role`/`bullets[]`**:
```typescript
const SCALES: Scale[] = [
  { name: "Version", duration: "~90 days", isDefault: true, role: "The arc, representing who you're becoming.", bullets: [...] },
  { name: "Cycle", duration: "~15 days", isDefault: true, role: "The sprint, defining what to work on now.", bullets: [...] },
  { name: "Day", duration: "1 day", isDefault: false, role: "The reps, the only scale you actually live in.", bullets: [...] },
];
```
`name` values ("Version", "Cycle", "Day") are product-vocabulary glossary
terms per D-01's table — translate via the glossary lookup (`Versiones`,
`Ciclo`, `Día`), NOT authored fresh. `duration`/`role`/`bullets` are prose,
translate directly. Section functions confirmed present at
`TemporalHierarchySection` (line 160), `DailyScoreSection` (193),
`PulseLoopSection` (377), `HabitsAndGoalsSection` (567),
`TrendsInsightsSection` (715), root export `MethodologyPage` (869) — 7
section functions total including `ScaleTextContent` (118) and the eyebrow
helper `SectionEyebrow` (36).

---

### `src/app/mcp/page.tsx` (route, 564 lines) — a genuine data-array with technical/product content

**Read lines 1–30.** Confirms a `Tool[]` array (`readTools`, starting line
14) with `name`/`description`/`params`/`returns` — a 4th distinct data-array
shape not seen elsewhere in this component set:
```typescript
interface Tool {
  name: string;
  description: string;
  params: string;
  returns: string;
}
const readTools: Tool[] = [
  { name: "portal_snapshot", description: "Full dashboard state. ...", params: '...', returns: "..." },
  ...
];
```
`name` values (`portal_snapshot`, `portal_review`, ...) and the `params`
type-signature strings are **API identifiers and code, not prose** — per
CLAUDE.md's "do not translate code" convention and `07-RESEARCH.md`'s note
that `/mcp` "contains code blocks; do not translate code," only `description`
and `returns` (the English-prose portions) are translation targets; `name`
and `params` stay verbatim in both locales.

---

### `src/app/manifesto/page.tsx` (route, 244 lines) — the register proof surface

**Read lines 1–95 and 185–244 in full.**

**Data model confirmed: `PRINCIPLES: Principle[]` (7 items, lines 37–87) and
`ACTS` (3 items, lines 89–93)**, grouped by `act` filter at render time (line
226: `PRINCIPLES.filter((p) => p.act === act.name)`) — NOT a flat map, a
filtered nested render. Each `Principle` has `num`/`act`/`title`/`body`.

**The exact H1 hook CONTEXT.md cites, confirmed verbatim at line 211**:
```tsx
<h1 className="display text-balance leading-[1.05] ..." style={{ color: FG_STRONG }}>
  A method for becoming yourself.
</h1>
```
This is the literal string that becomes
`Un método para llegar a ser quien eres.` per D-06/§7 — confirmed this is
inline JSX (header, lines 204–221), not part of the `PRINCIPLES` array, so it
needs its own `manifesto.hero.headline` key separate from the 7 principles.

---

## Shared Patterns

### Color tokens — apply to every touched file
**Source:** `src/app/globals.css` `@theme inline` block (referenced, not
re-read here — already ground truth per CLAUDE.md). Every file above already
uses `var(--color-ep-*)` tokens or (in `Footer.tsx`) legacy `zinc-*` classes.
**Rule for this phase:** do not touch color/token usage while extracting
strings — string extraction and token migration are separate concerns; mixing
them turns a mechanical PR into a risky one.

### Touch-target compliance — apply to `LanguageSwitcher.tsx` and any modified nav/footer link
**Source:** `e2e/touch-targets.spec.ts` lines 42–49 (loop + `test.skip` at
`>=768`), lines 94–104 (inline-text exemption, does NOT apply to icon/short-text
switchers), line 108 (`r.width >= min && r.height >= min`, both dimensions
required).
```typescript
if (r.width >= min && r.height >= min) continue;
```
**Apply to:** `LanguageSwitcher.tsx` — the single highest-risk file in the
phase per `07-REVIEWS.md`'s independently-reconfirmed finding. `min-h-11`
alone is the Footer's existing (working) pattern for full-word labels
("Features", "Changelog") but is insufficient for 2-letter "EN"/"ES" labels;
add horizontal padding (`px-3` or equivalent) to guarantee width ≥44px too.

### Route list as single source of truth
**Source:** `e2e/support/pages.ts` lines 4–13 (`ROUTES`).
**Apply to:** `sitemap.ts`, `EN_ROUTES`/`ES_ROUTES` split, and any
`generateStaticParams` enumeration — all four should derive from (or be kept
manually in sync with) this same 8-path list rather than re-typing it.

### Glossary-gated product nouns
**Source:** D-01 table in `07-CONTEXT.md` (lines 55–74) — NOT independently
verifiable against the app repo per this agent's scope restriction (the
sibling repo `/home/danitrrga/dev/Projects/el-portal` was correctly not
read). Flagging per the phase's own instruction: treat every `07-02`-derived
glossary claim as **provisionally locked, pending the glossary file this
phase itself produces** — do not hand-author alternate translations for
`Trends`, `Dashboard`, `Cinema`, `Pulse` (kept English) or
`Versions/Cycle/Day/Habits/Goals/Score/Archives` (translated) anywhere in the
files above; every occurrence of these nouns was independently located in
this pass: `SystemBlueprintSection.tsx:50` (`Trends`), `features/page.tsx:82-116`
(`Version`/`Cycle`/`Day`), `VCDSection.tsx:46,51,56,146,154,158`
(`Version`/`Cycle`/`Day` ×2 each).

### Dead code — do not translate
**Source:** `src/components/DashboardPreview.tsx` (256 lines, confirmed
zero imports via `grep -rn DashboardPreview src`). Exclude from every
string-inventory and glossary-application pass in this phase.

---

## No Analog Found

Files with no close match in the codebase — planner must build from
`07-RESEARCH.md` and next-intl's documented API surface, not from an existing
file:

| File | Role | Data Flow | Reason |
|---|---|---|---|
| `app/proxy.ts` | middleware | request-response | No `middleware.ts`/`proxy.ts` exists; Next 16 renamed convention, greenfield per §3.1 |
| `src/i18n/routing.ts` | config | config | No i18n config of any kind exists; `defineRouting` is a next-intl API, not an existing pattern |
| `src/i18n/request.ts` | config | config | Same — `getRequestConfig` has no precedent |
| `src/i18n/navigation.ts` (if used) | provider | request-response | `createNavigation`'s locale-aware `Link`/`usePathname` has no precedent; closest partial is `Navbar.tsx`'s plain `usePathname` (line 5, 21) |
| `src/lib/seo.ts` | utility | transform | `src/lib/` has only `utils.ts`; only precedent is the single static `metadata` object in `layout.tsx:33-37`, which is not a generator |
| `src/app/[locale]/sitemap.ts` | route (special file) | batch | No sitemap file exists in the repo today |
| `src/app/[locale]/robots.ts` | route (special file) | request-response | No robots file exists |
| `src/messages/{en,es}/*.json` | data | batch | No JSON message files exist; keys are 1:1 lifts of the JSX/arrays documented above, not modeled on an existing catalogue |
| Glossary snapshot file (path TBD, "Claude's Discretion" per `07-CONTEXT.md`) | data | batch | Sourced from the sibling app repo, which this agent was correctly barred from reading; no in-repo precedent |

---

## Metadata

**Analog search scope:** `src/app/`, `src/components/`, `src/components/hero/`,
`e2e/`, `e2e/support/`, root config files (`package.json`, `next.config.ts`,
`src/app/layout.tsx`).
**Files read in full this pass:** `CTASection.tsx` (71), `Navbar.tsx` (135),
`Footer.tsx` (127), `VCDSection.tsx` (319), `Hero.tsx` (204),
`MethodologyPreviewSection.tsx` (121), `ChangelogItem.tsx` (168),
`ElPortalWordmark.tsx` (44), `ReadingLayout.tsx` (42), `src/app/layout.tsx`
(63), `src/app/page.tsx` (30), `e2e/support/pages.ts` (63).
**Files read in targeted (non-overlapping) ranges:**
`SystemBlueprintSection.tsx` (1–70, 160–200 of 511),
`src/app/manifesto/page.tsx` (1–95, 185–244 of 244 — full coverage via two
reads), `src/app/features/page.tsx` (82–117 of 970, plus a `grep` for
section-function line numbers), `src/app/changelog/page.tsx` (grep only, for
`version:`/`note:` counts), `src/app/mcp/page.tsx` (1–30 of 564),
`src/app/pricing/page.tsx` (1–20 of 506), `e2e/touch-targets.spec.ts` (1–120
of unknown total), `e2e/containment.spec.ts` (1–40), `e2e/a11y.spec.ts`
(1–50).
**Files confirmed absent / dead code:** `src/messages/`, `src/lib/seo.ts`,
`app/proxy.ts`, `middleware.ts`, `src/i18n/`; `src/components/
DashboardPreview.tsx` confirmed unimported.
**Pattern extraction date:** 2026-08-02
