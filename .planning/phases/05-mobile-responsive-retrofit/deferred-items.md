# Deferred Items — Phase 05 mobile-responsive-retrofit

Out-of-scope discoveries logged during plan execution but not fixed (per executor
scope-boundary rules). Not blockers for the plans that found them.

## From 05-03

- **`touch-iphone` (WebKit) Playwright project cannot launch in this sandbox.**
  `npx playwright install webkit` succeeds (binary downloads fine), but launching it fails
  host-dependency validation: `Host system is missing dependencies to run browsers` —
  requires `sudo apt-get install libicu74 libxml2 libflite1` or
  `sudo npx playwright install-deps`, both of which need root and are outside a
  code-fixing plan's scope. All 8 routes fail identically with the same host-dependency
  error (not a per-route overflow finding), confirming this is an environment gap, not a
  regression from any 05-03 code change. The other 7 projects in the matrix
  (`reflow-320`, `mobile-360`, `mobile-390`, `mobile-430`, `tablet-768`, `laptop-1024`,
  `desktop-1440` — 56 tests total) all pass. Whoever next has sudo on this box should run
  `sudo npx playwright install-deps` once, after which `npm run audit:overflow` should
  cover all 8 projects.

## From code review fix pass (WR-06)

- **`ACCENT` / `ACCENT_LIGHT` remain raw hex in `features/page.tsx`,
  `manifesto/page.tsx` and `pricing/page.tsx` — blocked on five missing alpha tokens.**
  Code review WR-06 asked for the half-finished hex→token migration to be completed.
  `SECTION_BG`, `FG_STRONG`, `FG` and `FG_MUTED` were migrated (value-identical, verified
  zero computed-colour change across 5114 elements on 5 routes × 2 widths).
  `ACCENT` / `ACCENT_LIGHT` could not be: these three files consume them as hex-alpha
  template literals — `${ACCENT}1f`, `${ACCENT}14`, `${ACCENT}33`, `${ACCENT}66`,
  `${ACCENT_LIGHT}4d`, `${ACCENT_LIGHT}40`, `${ACCENT_LIGHT}59` — and
  `var(--color-ep-accent)14` is invalid CSS, so a naive swap silently drops the
  declaration (this is the "template-literal alpha trap" already documented in
  `01-02-PLAN.md`). The convention is one pre-baked alpha token per opacity;
  `globals.css` currently defines only `--color-ep-accent-alpha-12` (`1f`),
  `--color-ep-accent-alpha-08` (`14`) and `--color-ep-accent-light-alpha-80` (`cc`).
  Completing the migration needs five new tokens (accent at `33` and `66`;
  accent-light at `40`, `4d` and `59`) added to `@theme inline` **and** to
  `.planning/codebase/design/TOKENS.md`. Minting design tokens is a design-owner
  decision, so it is logged rather than guessed. `ChangelogItem.tsx` had no
  concatenation sites and was fully migrated.

- **`--color-ep-fg-subtle-2` (`#5a6478`) is now a dead token** — zero references in
  `src/` after WR-05 collapsed `FG_SUBTLE` into `FG_MUTED`. Not deleted, because it is
  still a documented rung of the foreground ramp in
  `.planning/codebase/design/TOKENS.md` and is the natural starting point if the design
  owner decides to restore a real fourth step (it would need to move to an AA-clearing
  value — `#5a6478` is 3.40:1 on `#04060c`, below the 4.5:1 floor).

## From code review fix pass (WR-08) — NOT fixed, needs design-owner sign-off

- **No `brand` CTA on the site is a pill; every one renders at `border-radius: 8px`.**
  `buttonVariants.variant.brand` sets `rounded-full`, but `size.sm | lg | xs | icon-xs`
  each set `rounded-md`. `cn()` is `twMerge(clsx(...))` and cva emits variant before
  size, so `tailwind-merge` resolves the `rounded-*` conflict to the last class —
  `rounded-md`. Verified on the production build (`getComputedStyle().borderRadius`),
  all 8 `[data-slot=button]` elements on `/` at both 1440x900 and 390x844: **`8px`**,
  including `heroCta` (`brand`/`lg`) and `navSignUp` (`brand`/`sm`). CLAUDE.md specifies
  "Primary CTA: shadcn `Button` `brand` variant (**pill**, white-alpha border/bg)".

  The one-line fix is to drop the redundant `rounded-md` from the four size variants in
  `src/components/ui/button.tsx:29-33` — it duplicates the base `rounded-md` on line 8,
  so removing it is a no-op for `default`/`outline`/`secondary`/`ghost` and restores
  `rounded-full` for `brand`.

  **Deliberately not applied in this pass.** It is pre-existing (predates phase 05) and
  it would change the rendered radius of the hero CTA and the nav Sign Up button from
  8px to a full pill **at every width, desktop included** — which is exactly the
  frozen-desktop change RESP-08 forbids, and it alters the most visible element on the
  site. Reconciling "CLAUDE.md says pill" against "the approved desktop design ships
  8px" is a design-owner decision, not a mechanical code-review fix. Whoever owns the
  design should either apply the one-liner above or correct the CLAUDE.md claim.

## From 05-06 containment sweep

`e2e/containment.spec.ts` (plan 05-06) adds a container-relative check that measures
elements against their own box (Sweep A) and against the viewport while naming the
clipping ancestor that hides the escape (Sweep B) — the exact complement of
`overflow.spec.ts`'s `documentElement.scrollWidth`-only check. Run against the
unmodified, unfixed `src/` tree, it reproduces GAP-01 and GAP-02 exactly (see
05-06-SUMMARY.md for the full RED run) and additionally surfaces four out-of-fence
defects, none of which are GAP-01, GAP-02 or GAP-03. All four are suppressed in
`containment.spec.ts`'s `KNOWN_UNFIXED` array (never silently — every suppression is
still pushed onto `testInfo.annotations` on every run) and logged here so they are not
lost.

### KU-1 — `/features` "Connectedness" badge overflows its own box (Sweep A)

- **Route:** `/features`
- **Selector:** `span.font-mono.text-[11px].uppercase`
- **Fires at:** all 7 launchable Chromium viewports, **including desktop-1440** — this
  is not a phone-only defect, it is width-independent.
- **Magnitude:** `scrollWidth: 117` vs `clientWidth: 110`, `overflowBy: 7`.
- **Why out of fence:** not part of GAP-01 (Hero H1), GAP-02 (dashboard preview bleed)
  or GAP-03 (the harness gap itself, which this plan closes). It is a genuine, small,
  pre-existing label-overflow bug on the Features page bento grid.

### KU-2 — `/mcp` prose paragraphs overflow their box at phone widths (Sweep A)

- **Route:** `/mcp`
- **Selector:** `p.text-sm.text-zinc-400.leading-5` (×12 paragraphs)
- **Fires at:** `reflow-320` and `mobile-360` only; zero offenders at `mobile-390` and
  wider.
- **Magnitude:** max `overflowBy` 66px at 320px, 26px at 360px.
- **Why out of fence:** unrelated component (`/mcp` code-block prose), not the Hero.

### KU-3 — `/privacy` legal-copy paragraphs overflow their box at phone widths (Sweep A)

- **Route:** `/privacy`
- **Selector prefix:** `p.text-` (×5 paragraphs — `p.text-sm.font-semibold…` and
  `p.text-xs…` variants)
- **Fires at:** `reflow-320`, `mobile-360` and `mobile-390`; zero at `mobile-430`.
- **Magnitude:** max `overflowBy` 73px at 320px, 33px at 360px, 3px at 390px.
- **Why out of fence:** pre-existing legal-copy layout issue, unrelated to the Hero
  gaps this phase's gap-closure plans (05-06/05-07) target.

### KU-4 — `/pricing` comparison table clipped by its `overflow-hidden` wrapper (Sweep B) — NEW FINDING

- **Route:** `/pricing`
- **Clipper:** `div.rounded-xl.border.overflow-hidden`
- **Selectors:** `table.w-full.text-left.border-collapse` plus 14 descendants
  (`thead`, `tbody`, `tr.border-b`, `tr.transition-colors` ×N, `th.px-5.py-4.text-[11px]`,
  `td.px-5.py-3.5.text-center` ×N) — 15 total, the sweep's reporting cap.
- **Fires at:** `reflow-320`, `mobile-360` and `mobile-390`; zero at `mobile-430`.
- **Magnitude:** `offscreenBy` up to 77px at 320px, 37px at 360px, 7px at 390px.
- **Why out of fence:** not GAP-01, GAP-02 or GAP-03 — it is a **newly discovered
  defect of the exact class GAP-03 exists to catch**: a comparison table clipped by an
  `overflow-hidden` wrapper, invisible to `overflow.spec.ts`'s
  `documentElement.scrollWidth` check, found by the new sweep on its first run against
  unmodified `src/`.
- **Needs a design-owner decision:** either make the wrapper `overflow-x-auto` with
  `data-reflow-exempt` (self-scrolling table, per RESPONSIVE.md's sanctioned 2-D-layout
  pattern), or restructure the pricing comparison table for mobile (e.g. a stacked/card
  layout below `sm:`). Out of this gap-closure phase's fence — 05-06/05-07 exist to
  close the harness gap and the two named Hero gaps, not to redesign `/pricing`.
