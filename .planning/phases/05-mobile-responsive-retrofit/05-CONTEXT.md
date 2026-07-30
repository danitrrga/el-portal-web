# Phase 5: Mobile Responsive Retrofit - Context

**Gathered:** 2026-07-30
**Status:** Ready for planning
**Source:** Foundation express path — the committed foundation docs (commits `5b0cc91`, `d1dfce1`) serve as the PRD

<domain>
## Phase Boundary

Make all 8 routes comfortable on phones (320–430px) **without changing the approved
desktop design**. The user is explicitly happy with the current desktop look; the
discomfort is mobile-only.

**In scope:** horizontal overflow, touch target sizing, the viewport export, `svh`,
hover gating, reduced-motion, mobile type legibility, and the `overflow-x-hidden`
removal that makes all of it verifiable.

**Out of scope:** deleting the dead component tree; any desktop restyle; the security
headers (Phase 6); Lighthouse/CWV budget work; visual-regression snapshots.
</domain>

<decisions>
## Implementation Decisions

### Locked — scope
- **Minimum viewport: 360px.** Design correctness is judged at 360. 320px is checked
  too, but only for the WCAG 1.4.10 reflow assertion.
- **The desktop design at ≥768px is frozen.** Every change is additive: a mobile-first
  default plus `md:`/`lg:` restoring today's value. A diff that alters desktop rendering
  is a defect regardless of how it looks.
- **Audit before fix.** The first fleet run is read-only; findings are approved before
  any `src/` edit. (The user chose this explicitly.)

### Locked — technical
- **`overflow-x-hidden` comes off `<body>`** (`src/app/layout.tsx:50`). It clips overflow
  rather than preventing it. Until it is gone, the site cannot be honestly verified.
  Where clipping is genuinely wanted, use `overflow-x: clip` on a specific wrapper —
  never `hidden` on `body` (it also silently breaks `position: sticky`).
- **`svh`, not `dvh`,** for full-height. `dvh` re-resolves during scroll, and because
  address-bar collapse is not a user input, those shifts are charged fully to CLS.
- **Do NOT adopt `viewport-fit=cover`.** Default `auto` letterboxes into the safe area
  automatically. Opting in would require `pt-safe`/`px-safe`/`pb-safe` plumbing across
  Navbar, Footer, and the mobile menu for no visual gain.
- **Add the `viewport` export anyway** — for `themeColor: '#02030a'` and
  `colorScheme: 'dark'`. Mobile browser chrome currently renders light against a
  near-black page.
- **Never** set `maximumScale: 1` or `userScalable: false` (blocks pinch-zoom, WCAG 1.4.4).
- **Touch target: 44px** (SC 2.5.5 AAA), not the 24px SC 2.5.8 AA floor. Grow the hit
  area via padding or an `::after` overlay; do not necessarily grow the visual box.
- **Gate motion with CSS, never by rendering different trees.** JS `window.innerWidth`
  branching causes hydration mismatch, ships both trees, and shifts layout.

### Locked — corrections established this session
- **Tailwind v4 auto-gates `hover:`** behind `@media (hover: hover)`. The ~40 `hover:`
  utilities in TSX are already touch-safe. Only hand-written `:hover` in `globals.css`
  (`.card-glow`, `.wordmark` ×2) latches on tap. Do not "fix" the utilities.
- **All grids already stack** — every `grid-cols-2..9` in the repo carries a responsive
  prefix. There are no unprefixed multi-column grids and no unprefixed `text-4xl`+.
- **`/features` is already responsive** (46 breakpoint uses across 961 lines). Verify it;
  do not rebuild it.

### Claude's Discretion
- Whether to split the P1 home-page audit into per-section agents.
- The exact fluid-type clamp values, provided each satisfies `max ≤ 2.5 × min` and
  includes a `+ Nrem` term.
- Whether `MotionConfig` lands in a new client wrapper or an existing one.
- How to localize the `/changelog` 27px overflow that the element sweep could not.
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### The responsive contract
- `.planning/codebase/design/RESPONSIVE.md` — breakpoints, container-query footguns,
  fluid-type rules, viewport units, safe-area decision, touch targets, hover gating,
  mobile motion, reflow, and the responsive anti-pattern table

### Findings and assignment
- `.planning/responsive/SURFACES.md` — surface inventory, the import-graph-verified
  dead-code exclusion list, 20 findings (S-01…S-20), harness-verified results, and
  the already-verified non-issues
- `.planning/responsive/AUDIT-BRIEF.md` — agent contract, evidence standard, finding
  schema, severity rubric, harness caveats, 3-wave sequencing

### Existing design system (still binding)
- `.planning/codebase/design/ANTI-PATTERNS.md` — permanent bans
- `.planning/codebase/design/MOTION.md`, `TYPOGRAPHY.md`, `TOKENS.md`
- `CLAUDE.md` — project-wide constraints

### Code ground truth
- `src/app/globals.css` — `@theme inline`, `.display`, `.glass-panel`, `.card-glow`, `.wordmark`
- `src/app/layout.tsx` — fonts, `<body>` classes, missing `viewport` export
- `playwright.config.ts`, `e2e/` — the harness that proves each fix
</canonical_refs>

<specifics>
## Specific Ideas

Machine-confirmed at `mobile-360` (`npx playwright test --project=mobile-360`,
13 passed / 19 failed):

| Finding | Evidence |
|---|---|
| `ReadingLayout.tsx:14` | `width: 1200`, `left: -420`, `right: 780` — overflows **420px**. Hits `/privacy` and `/terms`. |
| `/changelog` | `documentElement.scrollWidth 388` vs `clientWidth 361` — **27px**. Element sweep found nothing; cause is not a plain oversized box. |
| Navbar hamburger | **20×20px** — under even the 24px AA floor. Also a raw `<button>`, which `CLAUDE.md` bans. |
| Wordmark links | 98×24 (nav), 98×26 (footer) |
| "Sign Up" CTA | **80×32** |
| `CopyButton.tsx:25` | `h-7 w-7` = 28×28 |

Overflow **passes** at 360 on `/`, `/features`, `/manifesto`, `/mcp`, `/pricing` — but
that only means geometric cleanliness, not comfort.

Also verified: `priority` on `HeroAppMockup.tsx:33` is deprecated in the installed
Next 16.1.6 (`get-img-props.d.ts:25`). Tailwind's `backdrop-blur-*` compiles to
`backdrop-filter: var(--tw-backdrop-blur,)…`, and Safari is documented to no-op
`backdrop-filter` fed from custom properties — needs real-device confirmation before action.
</specifics>

<deferred>
## Deferred Ideas

- Deleting the dead component tree (~1/3 of `src/components/`) and dropping the
  `remotion` dependencies — tracked separately, must not ride along in a responsive PR.
- `priority` → `loading="eager"` + `fetchPriority="high"` on `HeroAppMockup` unless it
  blocks a success criterion.
- Reducing `backdrop-filter` radius under `(pointer: coarse)` — pending device confirmation.
- The `.wordmark__layer` clamp rewrite (pure-`vw`, 4× ratio) — do it when the footer is
  next touched.
- Font payload reduction (4 families, 9 weight files; Instrument Serif is documented
  as retired).
- Lighthouse CI, CWV budgets, visual-regression snapshots.
</deferred>

---

*Phase: 05-mobile-responsive-retrofit*
*Context gathered: 2026-07-30 via foundation express path*
