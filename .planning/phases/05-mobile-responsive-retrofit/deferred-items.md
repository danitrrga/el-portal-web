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
