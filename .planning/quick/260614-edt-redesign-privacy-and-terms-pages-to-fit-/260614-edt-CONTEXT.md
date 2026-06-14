# Quick Task 260614-edt: Redesign privacy and terms pages to fit the new ink-blue brand system — Context

**Gathered:** 2026-06-14
**Status:** Ready for planning

<domain>
## Task Boundary

Redesign `/privacy` (`src/app/privacy/page.tsx`) and `/terms` (`src/app/terms/page.tsx`)
so they read as unmistakably El Portal under the new ink-blue brand system, and bring
the shared `src/components/ReadingLayout.tsx` shell into brand-token compliance.

These are static marketing legal pages. No content/policy rewrite — visual + token
rebrand only.
</domain>

<decisions>
## Implementation Decisions (LOCKED — do not revisit)

### Scope: Pure reskin
- Keep ALL existing copy, section order, and component structure on both pages
  (privacy: Bucket / ProviderRow / RightRow / Hairline; terms: prose sections).
- Do NOT restructure the terms page to match the privacy page. Do NOT add or remove
  sections, providers, rights, or legal clauses.
- The redesign is purely: swap legacy styling → brand tokens, fix typography, remove
  banned patterns.

### Token migration: use the real `--color-ep-*` tokens
- Replace the legacy `zinc-*` scale with the actual built tokens in
  `src/app/globals.css` (the `--color-ep-*` family). The OKLCH `--color-bg-base` /
  `--color-fg-*` names listed in CLAUDE.md's color table were never built — TOKENS.md
  and globals.css are ground truth. Map roughly:
  - `bg-zinc-950` → `bg-[var(--color-ep-bg-base)]`
  - `text-zinc-100` (headings/strong) → `text-[var(--color-ep-fg-strong)]`
  - `text-zinc-400` (body) → `text-[var(--color-ep-fg-body)]` or `--color-ep-fg`
  - `text-zinc-500/600` (eyebrows/meta) → `text-[var(--color-ep-fg-muted)]` / `--color-ep-fg-subtle`
  - `border-white/10` → `border-[var(--color-ep-hairline)]`
  - link colors → strong/muted ep tokens, accent on hover where appropriate
- Read TOKENS.md + globals.css before mapping; pick the closest semantic token, do not
  invent new tokens or use raw hex in components.

### Typography
- Apply the `.display` utility (Special Gothic Expanded One, uppercase) to the H1 on
  each page, and to H2 section headings per the design system's heading hierarchy.
  Verify against TYPOGRAPHY.md how `.display` is meant to scale for sub-hero H2s — if
  all-caps display on every small H2 reads too heavy for a legal doc, follow the design
  docs' guidance rather than blanket-applying it.
- Drop the `font-mono` on the privacy "Last updated" date (privacy/page.tsx line ~167).
  The user explicitly does NOT want monospace overused. Use a normal small muted text
  style. JetBrains Mono is reserved for code/metrics only — a date is neither.

### Shared ReadingLayout: fix to brand tokens
- `ReadingLayout.tsx` is used ONLY by `/privacy` and `/terms` (verified) — safe to edit
  with blast radius limited to these two pages.
- Replace the banned `rgba(30,64,175,...)` neon-blue radial gradient and the
  `rgba(88,28,135,...)` purple orb with restrained `--color-ep-accent-alpha-*` tints
  (or remove the purple orb entirely — purple is off-brand for the ink-blue system).
- Keep the film-grain + faint grid overlays (they're already subtle and on-brand) but
  swap any hardcoded blue/purple hex for ep tokens.

### Anti-patterns to eliminate (from CLAUDE.md / ANTI-PATTERNS.md)
- No `rgba(30,64,175,...)` / `rgba(59,130,246,...)` neon blue-glow.
- No pure black (`#000`, `#0a0a0a`, literal black).
- No `zinc-*` / `slate-*` on these surfaces.
- No raw hex in components — use tokens.
- No `text-shadow` glows on headings/badges.
- No `transition: all` — keep the existing `transition-colors`.
- No `background-clip: text` gradient text.

### Claude's Discretion
- Exact token-for-token mapping (pick closest semantic ep token).
- Whether to keep all-caps `.display` on every small H2 vs. only H1 + larger headings —
  defer to TYPOGRAPHY.md; legal-doc readability wins where the docs are silent.
- Spacing/rhythm tweaks only if a token swap leaves something visually broken; otherwise
  leave layout untouched.
</decisions>

<specifics>
## Specific Ideas

- **Reference / inspiration: Raycast privacy & terms pages.** Clean, editorial,
  restrained, generously spaced legal documents — calm typographic hierarchy, no
  decoration competing with the text. The redesign should feel that composed: quiet,
  premium, readable. This reinforces "keep it simple" — do not add visual noise.
- Keep the redesign genuinely simple. Do not over-engineer. Every changed line should
  trace to: token swap, typography fix, or banned-pattern removal.
</specifics>

<canonical_refs>
## Canonical References

- `.planning/codebase/design/README.md` — design system index + LOCKED/CURRENT/DEBT convention
- `.planning/codebase/design/TOKENS.md` — real `--color-ep-*` tokens (ground truth)
- `.planning/codebase/design/TYPOGRAPHY.md` — `.display` usage + heading hierarchy
- `.planning/codebase/design/ANTI-PATTERNS.md` — banned patterns
- `.planning/codebase/design/BRAND.md` — brand personality + anti-words
- `src/app/globals.css` — code ground truth for tokens + `.display` / `.wordmark` utilities
- `./CLAUDE.md` — project conventions, color table, anti-pattern list
</canonical_refs>
