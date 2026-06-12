---
phase: 01-token-foundation
plan: 01
subsystem: design-tokens
tags: [css, tokens, globals, value-equal, additive]
dependency_graph:
  requires: []
  provides: [Phase 1 value-equal token block (--color-ep-* + --shadow-ep-*)]
  affects: [src/app/globals.css]
tech_stack:
  added: []
  patterns: [CSS custom properties in @theme inline, shadow vars in .dark block]
key_files:
  created: []
  modified:
    - src/app/globals.css
decisions:
  - "Shadow shorthands placed in .dark block (not @theme inline) to avoid Tailwind v4 minting unexpected shadow-ep-* utilities (Pitfall 2 from research)"
  - "Alpha-variant tokens defined as 8-digit hex (#4487d61f, #4487d614, #77b7edcc) — byte-identical to ${CONSTANT}<suffix> template literals, no precision drift"
  - "Glow values tokenized at current rgba values per TOKEN-02 — no desaturation, no remap to --color-accent-subtle"
metrics:
  duration: 8
  completed: "2026-06-12"
  tasks_completed: 1
  tasks_total: 1
  files_changed: 1
---

# Phase 01 Plan 01: Token Foundation — CSS Variable Block Summary

**One-liner:** 52 value-equal `--color-ep-*` hex/rgba color vars + 2 `--shadow-ep-*` shadow shorthands added to `globals.css`, creating the contract for plan 01-02's component migration.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Add Phase 1 value-equal token block to globals.css | 289f2c1 | src/app/globals.css |

## Tokens Added (Complete List)

All tokens added to `src/app/globals.css`. Color tokens are inside the `@theme inline` block; shadow tokens are inside the `.dark` block.

### Color Tokens — inside `@theme inline`

#### Backgrounds
| Token | Value |
|-------|-------|
| `--color-ep-bg-base` | `#02030a` |
| `--color-ep-section-bg` | `#04060c` |
| `--color-ep-code-bg` | `#0d1117` |
| `--color-ep-callout-bg` | `#0a0a0a` |
| `--color-ep-fade-black` | `#000000` |

#### Foregrounds
| Token | Value |
|-------|-------|
| `--color-ep-fg-strong` | `#f4f6fb` |
| `--color-ep-fg-strong-white` | `#ffffff` |
| `--color-ep-fg` | `#aab3c5` |
| `--color-ep-fg-body` | `#d4d9e3` |
| `--color-ep-fg-muted` | `#a8b0c0` |
| `--color-ep-fg-muted-2` | `#8590a8` |
| `--color-ep-fg-subtle` | `#6f7889` |
| `--color-ep-fg-subtle-2` | `#5a6478` |

#### Accent
| Token | Value |
|-------|-------|
| `--color-ep-accent` | `#4487D6` |
| `--color-ep-accent-light` | `#77B7ED` |

#### Alpha Variants (8-digit hex — byte-identical to template literal concatenations)
| Token | Value | Source template |
|-------|-------|-----------------|
| `--color-ep-accent-alpha-12` | `#4487d61f` | `${ACCENT}1f` |
| `--color-ep-accent-alpha-08` | `#4487d614` | `${ACCENT}14` |
| `--color-ep-accent-light-alpha-80` | `#77b7edcc` | `${ACCENT_LIGHT}cc` |

#### White Overlays
| Token | Value |
|-------|-------|
| `--color-ep-white-strong` | `rgba(255, 255, 255, 0.92)` |
| `--color-ep-white` | `rgba(255, 255, 255, 0.55)` |
| `--color-ep-white-dim` | `rgba(255, 255, 255, 0.22)` |
| `--color-ep-white-track` | `rgba(255, 255, 255, 0.08)` |
| `--color-ep-active-highlight` | `rgba(255, 255, 255, 0.18)` |
| `--color-ep-separator` | `rgba(255, 255, 255, 0.20)` |
| `--color-ep-dot-glow` | `rgba(255, 255, 255, 0.6)` |
| `--color-ep-rule` | `rgba(255, 255, 255, 0.14)` |
| `--color-ep-hairline` | `rgba(255, 255, 255, 0.12)` |
| `--color-ep-divider` | `rgba(255, 255, 255, 0.15)` |
| `--color-ep-text-glow-white` | `rgba(255, 255, 255, 0.1)` |

#### UI Surfaces
| Token | Value |
|-------|-------|
| `--color-ep-pill-bg` | `rgba(255, 255, 255, 0.04)` |
| `--color-ep-pill-border` | `rgba(255, 255, 255, 0.10)` |
| `--color-ep-pill-btn-bg` | `rgba(255, 255, 255, 0.06)` |
| `--color-ep-frame-border` | `rgba(255, 255, 255, 0.08)` |
| `--color-ep-inset-top` | `rgba(255, 255, 255, 0.04)` |
| `--color-ep-grid-line` | `rgba(255, 255, 255, 0.10)` |

#### Shadows / Overlays
| Token | Value |
|-------|-------|
| `--color-ep-shadow-dark` | `rgba(0, 0, 0, 0.4)` |
| `--color-ep-nav-bg` | `rgba(10, 16, 32, 0.6)` |
| `--color-ep-nav-shadow` | `rgba(0, 0, 0, 0.5)` |
| `--color-ep-mobile-menu-bg` | `rgba(4, 6, 12, 0.95)` |

#### Ring / Radial Backgrounds (McpIntegrationSection)
| Token | Value |
|-------|-------|
| `--color-ep-ring-border-outer` | `rgba(119, 183, 237, 0.30)` |
| `--color-ep-ring-bg-outer` | `rgba(68, 135, 214, 0.18)` |
| `--color-ep-ring-border-inner` | `rgba(119, 183, 237, 0.22)` |
| `--color-ep-ring-bg-inner` | `rgba(56, 103, 214, 0.14)` |

#### Chart
| Token | Value |
|-------|-------|
| `--color-ep-chart-line` | `#3B82F6` |

#### Glow Family — TOKEN-02 (tokenized at current value, no desaturation)
| Token | Value |
|-------|-------|
| `--color-ep-glow-blue-40` | `rgba(30, 64, 175, 0.4)` |
| `--color-ep-glow-blue-30` | `rgba(30, 64, 175, 0.3)` |
| `--color-ep-glow-blue-25` | `rgba(30, 64, 175, 0.25)` |
| `--color-ep-glow-blue-03` | `rgba(30, 64, 175, 0.03)` |

#### Atmospheric Radials (Hero)
| Token | Value |
|-------|-------|
| `--color-ep-atmos-1` | `rgba(96, 165, 235, 0.05)` |
| `--color-ep-atmos-2` | `rgba(68, 135, 214, 0.02)` |
| `--color-ep-atmos-3` | `rgba(150, 200, 245, 0.028)` |
| `--color-ep-atmos-4` | `rgba(68, 135, 214, 0.01)` |
| `--color-ep-atmos-5` | `rgba(180, 215, 250, 0.02)` |
| `--color-ep-atmos-6` | `rgba(96, 165, 235, 0.008)` |

### Shadow Tokens — inside `.dark` block (NOT @theme inline)

| Token | Value |
|-------|-------|
| `--shadow-ep-glow-blue-20` | `0 0 40px -10px rgba(30, 64, 175, 0.2)` |
| `--shadow-ep-habit-bar` | `0 0 15px -3px rgba(30, 64, 175, 0.6)` |

**Total: 52 color vars + 2 shadow vars = 54 new CSS custom properties.**

## Verification Results

- Sentinel-token node check: PASSED (20 names present, 7 exact values verified including all alpha-variant and shadow tokens)
- `npx next build`: PASSED (1 pre-existing font warning for Special Gothic Expanded One — not introduced by this plan)
- `git diff src/app/globals.css`: PASSED — additive-only, zero `-` lines on pre-existing content

## Decisions Made

1. **Shadow vars in `.dark` (not `@theme inline`)** — Tailwind v4 `@theme inline` mints utilities from every entry; full shadow shorthand strings there risk generating unexpected `shadow-ep-*` utilities or failing silently. Placed in `.dark` block per Pitfall 2 from research.

2. **8-digit hex for alpha variants** — `#4487d61f`, `#4487d614`, `#77b7edcc` are byte-identical to the original `${CONSTANT}<suffix>` template literal concatenations. Rounded `rgba()` decimals (e.g. `0.122` vs `31/255 = 0.12157`) would introduce sub-pixel drift.

3. **Glow values at current value (no desaturation)** — TOKEN-02 requires tokenizing the glow rgba values at their existing values. The CLAUDE.md anti-pattern ban on `rgba(30,64,175,…)` applies to new code; this is a value-preserving refactor.

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None — this plan adds only CSS custom property definitions. No component wires these tokens yet (that is plan 01-02's task).

## Threat Flags

None — purely additive CSS custom property definitions. No new network surface, no auth paths, no file access, no schema changes.

## Self-Check: PASSED

- `src/app/globals.css` exists and contains the token block: FOUND
- Commit 289f2c1 exists: FOUND
- Sentinel-token node check exits 0: PASSED
- `next build` output: compiled successfully, all 11 static pages generated
