# Responsive Surface Inventory

> Generated 2026-07-30 by direct codebase scan. This is the **assignment map** for the
> mobile-audit fleet: one agent per LIVE surface. Regenerate after any structural change.
>
> Companion docs: [`AUDIT-BRIEF.md`](./AUDIT-BRIEF.md) (the agent contract) ·
> [`../codebase/design/RESPONSIVE.md`](../codebase/design/RESPONSIVE.md) (the rules being audited against).

---

## Scope decisions (locked with the user, 2026-07-30)

| Decision | Value |
|---|---|
| Minimum supported viewport | **360px** (iPhone SE 2/3, compact Android). Below this is out of scope. |
| First fleet run | **Audit only.** No agent writes to `src/` until findings are approved. |
| Desktop design | **Frozen.** The user explicitly likes the current desktop result. Fixes must be additive (mobile-first defaults + `md:`/`lg:` restoring today's desktop values), never a desktop redesign. |

---

## Dead code — DO NOT AUDIT

These components have **zero live consumers**. Auditing them wastes fleet budget and
risks "fixing" code that will never render. Confirmed by import-graph scan.

| Component | Note |
|---|---|
| `src/components/ui/container-scroll-animation.tsx` | Aceternity scroll-tilt card. Unused. Also has an SSR hydration mismatch (`isMobile` is `false` on the server) and an undebounced `resize` listener. |
| `src/components/DashboardPreview.tsx` | Unused. Highest `hover:` count in the repo (12). |
| `src/components/BoundedContainer.tsx` | Unused. |
| `src/components/CalloutCard.tsx` | Unused. |
| `src/components/MethodologyCard.tsx` | Unused — and the **only** consumer of `ui/accordion.tsx`. |
| `src/components/ui/accordion.tsx` | Dead transitively via `MethodologyCard`. |
| `src/components/ui/scroll-area.tsx` | Unused. |
| `src/components/ui/badge.tsx` | Unused. |
| `src/components/ui/separator.tsx` | Unused. |
| `src/components/ui/shiny-button.tsx` | Unused. Already marked retired in `COMPONENTS.md`. |
| `src/components/animations/*` (4 files) | `AnimationPlayers` is dead, and it is the sole consumer of `AsymptoticAnimation` / `CyclesAnimation`. `PerformanceMetric` has zero consumers. |
| `src/components/remotion/*` (2 files) | Dead transitively via the `animations/` tree. |

**Follow-up (not part of the responsive work):** deleting these also drops the
`remotion` + `@remotion/player` dependencies (~large) from the mobile bundle.
Track separately; do not bundle into a responsive PR.

---

## Live surfaces — fleet assignment

Breakpoint density = count of `sm:`/`md:`/`lg:`/`xl:` occurrences. Low density on a
large file is the strongest predictor of mobile breakage.

### Global (audit first — every finding here multiplies across all 8 pages)

| # | Surface | Files | Lines | BP uses | Why it's first |
|---|---|---|---|---|---|
| G1 | **App shell** | `src/app/layout.tsx`, `src/app/globals.css` | 56 + 423 | 0 | Owns `overflow-x-hidden`, `min-height: 100vh`, viewport meta, font loading, the CDN stylesheet, and every hover utility. |
| G2 | **Navbar** | `src/components/Navbar.tsx` | 114 | 4 | Fixed-position, on every page, mobile menu, touch targets. |
| G3 | **Footer + wordmark** | `Footer.tsx`, `ElPortalWordmark.tsx`, `PortalIcon.tsx`, `.wordmark*` in `globals.css` | 123 + 44 + 39 | 9 / 0 / 0 | `white-space: nowrap` + `clamp()` display type — the classic 360px overflow shape. |
| G4 | **ReadingLayout** | `src/components/ReadingLayout.tsx` | 42 | 1 | Wraps `/privacy` + `/terms`. Contains a fixed `w-[1200px]` decorative glow. |

### Pages

| # | Surface | File | Lines | BP uses | Risk |
|---|---|---|---|---|---|
| P1 | **Home** | `src/app/page.tsx` + 6 section components | 30 + ~1150 | 30 across sections | High — most complex composition, LCP page |
| P2 | **/changelog** | `src/app/changelog/page.tsx` + `ChangelogItem.tsx` | 945 + 163 | 4 + 8 | **Highest** — 945 lines, 4 breakpoint uses |
| P3 | **/mcp** | `src/app/mcp/page.tsx` | 552 | 4 | **High** — has `overflow-x-auto` code blocks with `pr-20` |
| P4 | **/pricing** | `src/app/pricing/page.tsx` | 484 | 3 | **High** — pricing tables are a known mobile failure mode; has a `whitespace-nowrap` absolute badge |
| P5 | **/features** | `src/app/features/page.tsx` | 961 | 46 | Low — already densely responsive; verify only |
| P6 | **/manifesto** | `src/app/manifesto/page.tsx` | 229 | 9 | Medium |
| P7 | **/privacy + /terms** | `privacy/page.tsx`, `terms/page.tsx` | 268 + 197 | 2 + 1 | Medium — long-form reading, recently reskinned |

### Home page sections (P1 sub-assignment — split if one agent is too coarse)

| Component | Lines | BP uses |
|---|---|---|
| `SystemBlueprintSection.tsx` | 511 | 5 |
| `hero/VCDSection.tsx` | 319 | 5 |
| `Hero.tsx` | 205 | 10 |
| `hero/McpIntegrationSection.tsx` | 124 | 2 |
| `MethodologyPreviewSection.tsx` | 114 | 3 |
| `CTASection.tsx` | 72 | 4 |
| `hero/HeroAppMockup.tsx` | 38 | 0 |

---

## Pre-seeded findings from the initial scan

These are already confirmed by reading the code. Fleet agents should **verify and
extend** them, not rediscover them.

| ID | Severity | Location | Finding |
|---|---|---|---|
| S-01 | **Blocker** | `src/app/layout.tsx:50` | `overflow-x-hidden` on `<body>` masks every horizontal overflow bug site-wide. It must come off (at least under test) or the audit is measuring a lie. This is why the site "feels" uncomfortable rather than visibly broken. |
| S-02 | High | `src/app/globals.css:211` | `body { min-height: 100vh }` — the iOS Safari address-bar bug. Wants `dvh`/`svh`. |
| S-03 | High | `src/components/ReadingLayout.tsx:14` | Decorative glow is a hard `w-[1200px]`, 3.3× the 360px floor. Overflow source on `/privacy` + `/terms`. |
| S-04 | High | `src/components/Navbar.tsx:69` | Hamburger `<button>` wraps a 20px icon with no padding — far under the 44px touch target. Also a raw `<button>`, which `CLAUDE.md` bans. |
| S-05 | High | `src/components/Navbar.tsx:88-100` | Mobile menu links are `py-2` on `text-sm` ≈ 34px tall — under the touch minimum, and `space-y-1` puts them close enough to mis-tap. |
| S-06 | Medium | `globals.css:230` `.card-glow:hover::before`, `globals.css:378,415` `.wordmark:hover` | Hand-written CSS `:hover` rules are **not** gated by `@media (hover: hover)`, so they latch on tap on touch devices. **Scope correction:** the ~40 `hover:` *utilities* in TSX are already safe — Tailwind v4 compiles `hover:` to `@media (hover: hover) { &:hover }` automatically (this was an opt-in `future` flag in v3, and is core behaviour in v4). Only the three hand-written rules above need wrapping. |
| S-07 | Medium | `src/app/layout.tsx:47` | Material Symbols loaded from the Google Fonts CDN — a render-blocking external stylesheet on mobile, and already banned for new work by `CLAUDE.md`. |
| S-08 | Medium | `src/app/layout.tsx` | No `export const viewport` — so no `viewportFit: 'cover'` and no `themeColor`. Blocks safe-area handling for the fixed navbar. |
| S-09 | Medium | `src/app/layout.tsx:5-30` | Four font families, nine weight files total (Inter ×6, Instrument Serif normal+italic, Special Gothic, JetBrains Mono ×2) on a site where Instrument Serif is documented as retired. Mobile payload + FOUT/CLS risk. |
| S-10 | Medium | `globals.css` `.glass-panel`, `Navbar` `backdrop-blur-xl` | Large-surface `backdrop-filter: blur(20px) saturate(1.5)` — a known low-end-mobile frame cost. |
| S-11 | Low | `SystemBlueprintSection.tsx` (many), `MethodologyPreviewSection.tsx:48`, `VCDSection.tsx:84,182` | `text-[10px]`/`text-[11px]`/`text-[12px]` fixed sizes — below comfortable mobile reading size and non-fluid. |
| S-12 | Low | `src/app/pricing/page.tsx:404` | Absolutely-positioned `whitespace-nowrap` badge at `left-1/2 -translate-x-1/2` — overflow candidate on narrow cards. |
| S-13 | **Blocker (env)** | `node_modules` | `npm run build` failed outright: `Cannot find module '../lightningcss.linux-x64-gnu.node'`. `package-lock.json` lists `lightningcss-linux-x64-gnu@1.31.1`, but npm had installed only `lightningcss-win32-x64-msvc` — the npm optional-dependency bug. **Repaired 2026-07-30** via `npm install lightningcss-linux-x64-gnu@1.31.1 --no-save`. If it recurs after a fresh clone, `rm -rf node_modules && npm ci`. Nothing could be verified until this was fixed. |
| S-14 | Medium | `src/components/CopyButton.tsx:25` | `h-7 w-7` = 28×28px. Passes WCAG 2.2 SC 2.5.8 (AA, 24px) but fails SC 2.5.5 (AAA, 44px) and is uncomfortable to tap. |
| S-15 | Medium | `globals.css:366` `.wordmark__layer` | `clamp(1.9rem, 8.6vw, 7.6rem)` — the preferred value is **pure `vw` with no `rem` term**, and max/min = 4×. Browsers do not scale `vw` on zoom, so this is a textbook WCAG 1.4.4 (Resize Text) anti-pattern. The accessible ceiling is `max ≤ 2.5 × min`. |
| S-16 | Medium | app root | Only `.wordmark` honours `prefers-reduced-motion`. Framer Motion's default is **not** `reducedMotion: "user"`, so every entrance/scroll animation ignores the OS setting. A root `<MotionConfig reducedMotion="user">` fixes all of it at once. |

---

## Harness-verified results — first run, 2026-07-30, `mobile-360`

Command: `npx playwright test --project=mobile-360`. **13 passed, 19 failed.**

### ✅ Confirmed by machine

| ID | Route | Evidence |
|---|---|---|
| **S-03 CONFIRMED** | `/privacy`, `/terms` | `div.pointer-events-none.absolute.top-0` — `width: 1200`, `left: -420`, `right: 780`, **overflows by 420px** at a 360px viewport. This is `ReadingLayout.tsx:14` exactly as predicted. |
| **NEW: F-changelog-overflow** | `/changelog` | `documentElement.scrollWidth = 388` vs `clientWidth = 361` — **27px of real page overflow**. Notably the per-element sweep found *nothing*, so the cause is not a plain oversized box. Assigned to the P2 agent. |
| **S-04 CONFIRMED** | all routes | Navbar hamburger measured **20×20px** — under the 24px WCAG AA floor, less than half the 44px target. |
| **S-14 CONFIRMED** | all routes | Wordmark link 98×24 (nav) and 98×26 (footer); "Sign Up" CTA **80×32**. All under 44px. |

### ⚠️ Overflow passes that must NOT be read as "fine"

`/`, `/features`, `/manifesto`, `/mcp`, `/pricing` passed the overflow check at 360px.
That is a genuine result — but the sweep only detects **geometric** overflow. It says
nothing about cramped layout, unreadable type, or mis-tapped controls, all of which are
what "uncomfortable on mobile" actually means. Do not let a green overflow check end a
page audit.

### 🛠 Known harness limitation

The `/changelog` case proves the element sweep can miss a real overflow (root
`scrollWidth` caught it; the per-element walk did not). Suspected causes: a text node
overflowing its inline container, or a negative-margin/`width:100%`+padding interaction —
neither produces an oversized `getBoundingClientRect`. **Always trust the root-level
assertion over an empty offender list.**

---

## Verified during harness bring-up (not from the code scan)

| ID | Severity | Finding |
|---|---|---|
| S-17 | **High** | `src/components/hero/HeroAppMockup.tsx:33` uses `priority`. **Confirmed deprecated in the installed Next 16.1.6** — `node_modules/next/dist/shared/lib/get-img-props.d.ts:25` reads `@deprecated Use 'preload' prop instead`. Next's own guidance further says to prefer `loading="eager"` + `fetchPriority="high"` over `preload` when the LCP element varies by viewport — which is precisely the responsive-retrofit case. |
| S-18 | **High — needs device confirmation** | Tailwind's `backdrop-blur-*` compiles to `backdrop-filter: var(--tw-backdrop-blur,)…` (verified in the built CSS). Safari is documented as silently no-op'ing `backdrop-filter` when the value comes from custom properties. If that holds, **the Navbar's glass effect has never rendered on any iPhone** — and neither DevTools device mode nor Lighthouse would reveal it. Must be checked on real hardware before acting. |
| S-19 | Low | `.glass-panel`'s compiled output emits only `-webkit-backdrop-filter`, not the unprefixed property. **Moot in practice** — `.glass-panel` is used solely by `PerformanceMetric.tsx`, which is dead code. |
| S-20 | — | `-webkit-overflow-scrolling` — grepped, **not present**. No action. |

---

### Already-verified NON-issues

Do not spend fleet budget re-checking these:

- **Grid stacking** — every `grid-cols-2..9` in the repo already carries a responsive
  prefix. No unprefixed multi-column grids exist.
- **Display type scaling** — no unprefixed `text-4xl`+ utilities.
- **`/features`** — 46 breakpoint uses across 961 lines. Verify, don't rebuild.
