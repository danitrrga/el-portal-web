---
phase: quick-260614-edt
plan: 01
subsystem: legal-pages
tags: [reskin, tokens, typography, brand]
dependency_graph:
  requires: []
  provides: [brand-compliant-reading-layout, ep-token-privacy-page, ep-token-terms-page]
  affects: [/privacy, /terms]
tech_stack:
  added: []
  patterns: [ep-token-system, display-utility, reading-layout-shell]
key_files:
  created: []
  modified:
    - src/components/ReadingLayout.tsx
    - src/app/privacy/page.tsx
    - src/app/terms/page.tsx
decisions:
  - "H2 headings on terms use .display per TYPOGRAPHY.md rule; visual heaviness on legal H2s noted but design system wins"
  - "Purple orb removed entirely (no replacement) to match Raycast calm/editorial reference"
  - "Bucket component's single H2 definition covers all 3 bucket instances — grep -c display counts source lines (4 in privacy), not rendered instances"
metrics:
  duration: "~20 min"
  completed: "2026-06-14"
---

# Quick Task 260614-edt: Reskin Privacy + Terms Pages to Ink-Blue Brand System

**One-liner:** Pure token-swap + typography reskin of ReadingLayout shell, /privacy, and /terms — banned neon-blue/purple glow removed, all zinc-* replaced with --color-ep-* tokens, .display applied to H1+H2, font-mono dropped from privacy date.

## Tasks Completed

| # | Task | Commit | Files |
|---|------|--------|-------|
| 1 | Bring ReadingLayout into brand-token compliance | a677d2d | src/components/ReadingLayout.tsx |
| 2 | Reskin /privacy and /terms to ep tokens + .display headings | e756cad | src/app/privacy/page.tsx, src/app/terms/page.tsx |

## What Changed

### Task 1 — ReadingLayout (a677d2d)

Three surgical changes to the shared reading shell:

1. **Radial gradient:** `rgba(30,64,175,0.15)` neon-blue replaced with `var(--color-ep-accent-alpha-12)` (the desaturated brand accent at 12% alpha). Positioning and opacity class unchanged.
2. **Purple orb removed:** The `rgba(88,28,135,0.08)` orb div deleted entirely. No replacement — aligns with the Raycast calm/restrained reference.
3. **Grid lines:** Hardcoded `#80808008` hex swapped to `var(--color-ep-grid-line)` token. `bg-[size:40px_40px]` and maskImage unchanged.

### Task 2 — /privacy + /terms (e756cad)

Mechanical token swap across both page files. No copy, section order, component signatures, or legal content changed.

**privacy/page.tsx:**
- `bg-zinc-950` wrapper → `bg-[var(--color-ep-bg-base)]`
- H1: added `display` class, removed `font-medium` and `tracking-tight`
- All H2s (Bucket ×3, "Where your data lives", "Take it all back"): added `display`, removed `font-semibold` and `tracking-tight`
- All `text-zinc-400` body/lede/list → `text-[var(--color-ep-fg-body)]`
- All `text-zinc-500` eyebrows → `text-[var(--color-ep-fg-muted)]` (font-medium and tracking preserved)
- `text-zinc-600` Bucket meta / footer date → `text-[var(--color-ep-fg-subtle)]`
- `text-zinc-100` → `text-[var(--color-ep-fg-strong)]`
- `text-zinc-300` links → `text-[var(--color-ep-fg-body)]`
- `hover:text-zinc-100` → `hover:text-[var(--color-ep-fg-strong)]`
- `border-white/10` → `border-[var(--color-ep-hairline)]` (Hairline, ProviderRow, RightRow)
- `decoration-zinc-600` → `decoration-[var(--color-ep-fg-subtle)]`
- `hover:decoration-zinc-400` → `hover:decoration-[var(--color-ep-fg-muted)]`
- Footer date: `font-mono text-xs text-zinc-600` → `text-xs text-[var(--color-ep-fg-subtle)]` (font-mono dropped)

**terms/page.tsx:**
- `bg-zinc-950` wrapper → `bg-[var(--color-ep-bg-base)]`
- H1: added `display`, removed `font-semibold` and `tracking-tight`
- All 13 H2s: added `display`, removed `font-semibold`
- All `text-zinc-400` body/list → `text-[var(--color-ep-fg-body)]`
- `text-zinc-500` date → `text-[var(--color-ep-fg-muted)]`
- Contact link: same mapping as privacy footer link

## Verification Results

```
tsc --noEmit: PASS (no output)
npm run build: PASS — 11 static pages generated

grep banned tokens (privacy + terms): CLEAN — zero matches
grep banned tokens (ReadingLayout): CLEAN — zero matches for all banned patterns

display count:
  privacy: 4 source lines (H1 line 31, H2 lines 106 + 139 + 203 in Bucket component)
  terms: 15 source lines (1 H1 + 13 H2 + 1 prose "display your content")

ep-fg-strong count: privacy=7, terms=15
```

## Deviations from Plan

None — plan executed exactly as written. Token mapping from CONTEXT.md applied verbatim.

## Discretion Call: .display on Terms H2s

Per TYPOGRAPHY.md rule and the plan's explicit instruction ("design system rule wins"), `.display` (Special Gothic Expanded One, uppercase) was applied to all 13 H2s on /terms. The all-caps treatment on short legal section headings reads with some visual weight at `text-xl`. Shipped per spec. The human-verify checkpoint (Task 3) is the correct gate to evaluate whether this is acceptable or needs discretion override.

## Known Stubs

None. These pages have no data dependencies — all content is static legal text.

## Threat Flags

None. No new network endpoints, auth paths, file access, or schema changes introduced. Pure styling reskin.

## Self-Check

Files exist:
- [x] src/components/ReadingLayout.tsx — FOUND
- [x] src/app/privacy/page.tsx — FOUND
- [x] src/app/terms/page.tsx — FOUND

Commits exist:
- [x] a677d2d — FOUND
- [x] e756cad — FOUND

## Self-Check: PASSED

---

## Awaiting: Task 3 — Checkpoint: Human Verify

Task 3 is a `checkpoint:human-verify`. The auto tasks are complete. The human must now:

1. Run `npm run dev` and open http://localhost:3000/privacy and http://localhost:3000/terms
2. Confirm headings are uppercase Special Gothic Expanded One; body is blue-tinted neutral; top glow is subtle desaturated cobalt, NOT bright neon; NO purple haze on right side
3. Confirm privacy "Last updated 2026-04-28" is NOT monospace
4. Confirm no copy, section, provider, or legal clause changed
5. Evaluate whether all-caps .display on terms H2s reads too heavy for a legal doc

**Resume signal:** Type "approved" or describe what reads wrong.
