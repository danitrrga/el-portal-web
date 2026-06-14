---
phase: quick-260614-edt
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/components/ReadingLayout.tsx
  - src/app/privacy/page.tsx
  - src/app/terms/page.tsx
autonomous: false
requirements: [QUICK-260614-EDT]

must_haves:
  truths:
    - "Both /privacy and /terms render with no zinc-* or slate-* utility classes"
    - "The shared ReadingLayout contains no rgba(30,64,175,...) neon-blue and no purple orb"
    - "H1 on each page uses the .display utility (Special Gothic Expanded One, uppercase)"
    - "The privacy 'Last updated' date is no longer font-mono"
    - "All neutral colors and hairlines on both pages reference --color-ep-* tokens, not raw zinc or white/10 hex"
    - "next build succeeds and tsc --noEmit passes"
  artifacts:
    - path: "src/components/ReadingLayout.tsx"
      provides: "Brand-token-compliant reading shell (ep-accent tint, no purple, ep grid token)"
      contains: "--color-ep-accent-alpha"
    - path: "src/app/privacy/page.tsx"
      provides: "Privacy page reskinned to ep tokens + .display headings, no font-mono date"
      contains: "--color-ep-fg-strong"
    - path: "src/app/terms/page.tsx"
      provides: "Terms page reskinned to ep tokens + .display headings"
      contains: "--color-ep-fg-strong"
  key_links:
    - from: "src/app/privacy/page.tsx"
      to: "src/components/ReadingLayout.tsx"
      via: "import ReadingLayout"
      pattern: "import ReadingLayout"
    - from: "src/app/terms/page.tsx"
      to: "src/components/ReadingLayout.tsx"
      via: "import ReadingLayout"
      pattern: "import ReadingLayout"
---

<objective>
Pure reskin of `/privacy`, `/terms`, and the shared `ReadingLayout` shell so all three
read as El Portal under the ink-blue brand system. Swap legacy `zinc-*` styling to the
real `--color-ep-*` tokens, apply the `.display` utility to headings per the type scale,
and remove banned patterns (neon-blue rgba glow, purple orb, `font-mono` on a date,
raw hardcoded neutral hex).

Purpose: privacy + terms are the last surfaces still on the legacy zinc palette; they
break the brand and carry banned AI-slop patterns.
Output: 3 modified files, no copy/structure/content changes, build green.

CRITICAL — this is a PURE RESKIN. Do NOT change copy, section order, component
structure (Bucket / ProviderRow / RightRow / Hairline on privacy; prose sections on
terms), or any legal content. Every changed line must trace to exactly one of: token
swap, typography fix, or banned-pattern removal. Reference: Raycast privacy/terms —
calm, editorial, restrained. Do NOT add visual noise, decoration, or new elements.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/quick/260614-edt-redesign-privacy-and-terms-pages-to-fit-/260614-edt-CONTEXT.md
@.planning/codebase/design/TOKENS.md
@.planning/codebase/design/TYPOGRAPHY.md
@.planning/codebase/design/ANTI-PATTERNS.md
@CLAUDE.md

<token_mapping>
<!-- Canonical mapping table. Ground truth: src/app/globals.css @theme inline.
     Apply these substitutions; pick the closest semantic token. No raw hex in components. -->

Neutrals:
- bg-zinc-950                  -> bg-[var(--color-ep-bg-base)]
- text-zinc-100 (headings)     -> text-[var(--color-ep-fg-strong)]
- text-zinc-400 (body/lede)    -> text-[var(--color-ep-fg-body)]
- text-zinc-500 (eyebrow/meta) -> text-[var(--color-ep-fg-muted)]
- text-zinc-600 (quietest meta -> text-[var(--color-ep-fg-subtle)]
                e.g. date, Bucket meta line)
- text-zinc-300 (link rest)    -> text-[var(--color-ep-fg-body)]
- hover:text-zinc-100 (link)   -> hover:text-[var(--color-ep-fg-strong)]

Borders / hairlines:
- border-white/10              -> border-[var(--color-ep-hairline)]
- border-b border-white/10     -> border-b border-[var(--color-ep-hairline)]

Link underline decoration (privacy + terms <a>):
- decoration-zinc-600          -> decoration-[var(--color-ep-fg-subtle)]
- hover:decoration-zinc-400    -> hover:decoration-[var(--color-ep-fg-muted)]
  (keep existing underline underline-offset-4 + transition-colors duration-300 as-is)

Page-wrapper grid overlay (privacy + terms top of file):
- the rgba(255,255,255,0.02) grid lines are subtle WHITE overlays, already on-brand —
  leave them. They are NOT zinc/blue/purple. Do not touch the maskImage #000 stops
  (those are mask alpha gradients, not a background color).

Headings -> .display utility:
- privacy H1 ("Your data, fully visible."): add `display` class, KEEP existing size
  classes (text-5xl sm:text-6xl). REMOVE font-medium (.display is single-weight 400).
  Keep text-balance.
- terms H1 ("Terms of Service"): add `display`, KEEP text-3xl md:text-4xl,
  REMOVE font-semibold. Keep tracking-tight is redundant with .display letter-spacing —
  drop tracking-tight to avoid conflict.
- H2s: see typography_decision below.

font-mono date (privacy line ~167):
- `font-mono text-xs text-zinc-600` -> `text-xs text-[var(--color-ep-fg-subtle)]`
  (drop font-mono entirely; JetBrains Mono is code/metrics only). Terms date is already
  plain text-sm text-zinc-500 -> text-sm text-[var(--color-ep-fg-muted)].
</token_mapping>

<typography_decision>
<!-- TYPOGRAPHY.md says "Apply .display to every H1 and H2." But CONTEXT grants
     discretion: all-caps display on every small legal-doc H2 may read too heavy.
     RESOLUTION for this reading-page context: -->

- H1 on both pages: ALWAYS .display (uppercase, weight 400). Non-negotiable.
- H2 section headings: apply .display. These are genuine section headings in the
  type scale (text-2xl on privacy, text-xl on terms). Follow the design system —
  .display on H2 is the documented rule. KEEP existing size classes; REMOVE
  font-semibold / font-medium (single-weight 400). Keep tracking-tight only where
  it does not fight .display letter-spacing — prefer removing it on .display headings.
- Eyebrow labels (text-[11px] uppercase tracking-[0.12em] ... font-medium): these are
  caption/meta per the type scale, NOT headings. Do NOT apply .display. Only swap their
  color token (zinc-500 -> ep-fg-muted). Leave font-medium and tracking as-is.

If after applying .display to terms' thirteen text-xl H2s the page reads visually too
heavy/shouty for a legal document (genuine readability regression, not preference),
note it in the SUMMARY as a discretion call but STILL ship .display — the design
system rule wins where the docs are explicit, and TYPOGRAPHY.md is explicit.
</typography_decision>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Bring ReadingLayout into brand-token compliance</name>
  <files>src/components/ReadingLayout.tsx</files>
  <action>
Reskin the shared shell. Blast radius is verified-limited to /privacy + /terms (grep
confirmed no other code importer). Make exactly these changes, nothing else:

1. Radial blue gradient (line ~14): replace the banned `rgba(30,64,175,0.15)` stop and
   the `rgba(2,6,23,0)` fade stop. Use the restrained accent tint:
   `bg-[radial-gradient(circle_at_50%_0%,_var(--color-ep-accent-alpha-12)_0%,_transparent_70%)]`.
   Keep the positioning/size classes (top-0 left-1/2 -translate-x-1/2 w-[1200px]
   h-[700px]) and the opacity. This keeps the home-hero echo but with the desaturated
   on-brand accent instead of neon blue.
2. Secondary purple orb (line ~16-17): REMOVE the entire purple orb div. Purple
   (`rgba(88,28,135,...)`) is off-brand for the ink-blue system (CONTEXT decision).
   Delete the comment too. Do not replace it with another orb — keeping it calm is
   the goal (Raycast reference).
3. Film-grain overlay (line ~20-25): leave untouched — already subtle, on-brand,
   uses a data-URI SVG (no color hex to swap).
4. Faint grid overlay (line ~35): the grid lines use `#80808008` (gray hex). Swap to
   the ep grid token: `bg-[linear-gradient(to_right,var(--color-ep-grid-line)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-ep-grid-line)_1px,transparent_1px)]`.
   Keep bg-[size:40px_40px] and the maskImage (mask alpha, not a color).

Do NOT change the container max-w-3xl / px / z-index structure or the component API.
No `transition: all`. No text-shadow. No new elements.
  </action>
  <verify>
After edit, grep the file for banned tokens — all must return zero matches:
`grep -nE "rgba\(30,? ?64,? ?175|rgba\(88,? ?28,? ?135|rgba\(59,? ?130,? ?246|#80808008|zinc-|slate-" src/components/ReadingLayout.tsx`
And confirm the accent tint is present:
`grep -n "color-ep-accent-alpha" src/components/ReadingLayout.tsx`
  </verify>
  <done>
ReadingLayout uses --color-ep-accent-alpha-12 for the top radial, has no purple orb,
no rgba(30,64,175)/rgba(88,28,135), grid uses --color-ep-grid-line. Film grain and
container structure unchanged.
  </done>
</task>

<task type="auto">
  <name>Task 2: Reskin /privacy and /terms to ep tokens + .display headings</name>
  <files>src/app/privacy/page.tsx, src/app/terms/page.tsx</files>
  <action>
Apply the token_mapping and typography_decision tables (in <context>) to BOTH page
files. Mechanical, surgical substitution only — no copy, structure, or section changes.

privacy/page.tsx:
- Wrapper: bg-zinc-950 -> bg-[var(--color-ep-bg-base)].
- H1 (line ~31): add `display`, remove `font-medium`, keep size + text-balance, swap
  text-zinc-100 -> text-[var(--color-ep-fg-strong)].
- All eyebrow `<p>` (text-[11px] uppercase ...): text-zinc-500 -> text-[var(--color-ep-fg-muted)].
  Do NOT add .display to these.
- All H2s (Bucket title, "Where your data lives", "Your rights"): add `display`,
  remove font-semibold, drop tracking-tight, swap text-zinc-100 -> ep-fg-strong.
- Body/lede `<p>` text-zinc-400 -> text-[var(--color-ep-fg-body)].
- List item text-zinc-400 -> text-[var(--color-ep-fg-body)].
- Bucket meta line text-zinc-600 -> text-[var(--color-ep-fg-subtle)].
- ProviderRow/RightRow: name text-zinc-100 -> ep-fg-strong; purpose/description
  text-zinc-400 -> ep-fg-body; region/action text-zinc-500 -> ep-fg-muted;
  border-white/10 -> border-[var(--color-ep-hairline)].
- Hairline(): border-white/10 -> border-[var(--color-ep-hairline)].
- Footer date (line ~167): `font-mono text-xs text-zinc-600` ->
  `text-xs text-[var(--color-ep-fg-subtle)]` (drop font-mono).
- Footer "Reach us" line text-zinc-500 -> ep-fg-muted; link: text-zinc-300 -> ep-fg-body,
  hover:text-zinc-100 -> hover:text-[var(--color-ep-fg-strong)],
  decoration-zinc-600 -> decoration-[var(--color-ep-fg-subtle)],
  hover:decoration-zinc-400 -> hover:decoration-[var(--color-ep-fg-muted)].
  Keep underline underline-offset-4 + transition-colors duration-300.

terms/page.tsx:
- Wrapper: bg-zinc-950 -> bg-[var(--color-ep-bg-base)].
- H1 (line ~29): add `display`, remove font-semibold, drop tracking-tight, keep
  text-3xl md:text-4xl + mb-3, swap text-zinc-100 -> ep-fg-strong.
- Date `<p>` (line ~32): text-sm text-zinc-500 -> text-sm text-[var(--color-ep-fg-muted)].
- Every H2 (text-xl font-semibold text-zinc-100): add `display`, remove font-semibold,
  swap text-zinc-100 -> ep-fg-strong. Keep mb-4.
- Every body `<p>` text-zinc-400 -> text-[var(--color-ep-fg-body)].
- Every `<ul>`/`<li>` text-zinc-400 -> text-[var(--color-ep-fg-body)].
- Contact link (line ~183): same link mapping as privacy footer link above.

Leave the two page-wrapper grid-overlay divs (rgba(255,255,255,0.02) + maskImage)
untouched on both files — white overlay is on-brand, mask stops are alpha not color.
No new imports, no Phosphor migration, no spacing changes unless a swap visibly breaks
layout (it should not).
  </action>
  <verify>
Build + types green:
`npx tsc --noEmit && npm run build`
No banned neutral/mono patterns remain in either page:
`grep -nE "zinc-|slate-|font-mono|#0a0a0a|bg-black|rgba\(30,? ?64,? ?175|rgba\(88,? ?28,? ?135" src/app/privacy/page.tsx src/app/terms/page.tsx`
must return zero matches.
Headings carry .display:
`grep -c "display" src/app/privacy/page.tsx` and `grep -c "display" src/app/terms/page.tsx`
each return a count matching H1+H2 count (privacy: 1 H1 + 5 H2 = 6; terms: 1 H1 + 13 H2 = 14).
ep tokens present:
`grep -c "color-ep-fg-strong" src/app/privacy/page.tsx src/app/terms/page.tsx` non-zero each.
  </verify>
  <done>
Both pages: zero zinc-*/slate-*/font-mono/pure-black/neon-rgba; H1+all H2 use .display
with single weight (no font-semibold/medium on .display elements); all neutrals + links
+ hairlines reference --color-ep-* tokens; copy, structure, sections, and legal content
byte-identical except for class attributes. `tsc --noEmit` and `npm run build` pass.
  </done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <what-built>
Privacy, terms, and the shared ReadingLayout reskinned to the ink-blue brand: ep tokens
replace zinc-*, .display on all headings, neon-blue glow + purple orb removed from the
shell, font-mono dropped from the privacy date. No copy/structure/content changed.
  </what-built>
  <how-to-verify>
1. Run `npm run dev` and open http://localhost:3000/privacy and http://localhost:3000/terms.
2. Confirm both pages read calm and editorial (Raycast reference): headings are the
   uppercase Special Gothic Expanded One display face; body is blue-tinted neutral, not
   gray; the top glow behind the hero is a subtle desaturated cobalt, NOT bright neon
   blue; there is NO purple haze on the right side anymore.
3. Confirm the privacy "Last updated 2026-04-28" line is NOT monospace.
4. Eyeball that NO copy, section, provider, right, or legal clause changed vs. before —
   only the visual styling moved.
5. If the all-caps .display on the many terms H2s reads too heavy for a legal doc, say so
   now — otherwise approve.
  </how-to-verify>
  <resume-signal>Type "approved" or describe what reads wrong.</resume-signal>
</task>

</tasks>

<verification>
- `npx tsc --noEmit` passes (no test suite exists — STATE.md confirms verification is
  tsc/ESLint/next build + manual review).
- `npm run build` succeeds.
- Combined grep across all three files returns zero matches:
  `grep -rnE "zinc-|slate-|font-mono|#0a0a0a|bg-black|rgba\(30,? ?64,? ?175|rgba\(88,? ?28,? ?135|rgba\(59,? ?130,? ?246" src/app/privacy/page.tsx src/app/terms/page.tsx src/components/ReadingLayout.tsx`
- No `transition: all`, no `background-clip: text`, no `text-shadow` introduced.
- `git diff` shows ONLY className/style attribute changes — no copy, JSX structure, or
  component-signature changes.
</verification>

<success_criteria>
- /privacy and /terms render unmistakably as El Portal (ink-blue): ep tokens, .display
  headings, calm/restrained layout matching the Raycast editorial reference.
- ReadingLayout free of neon-blue rgba and the purple orb; uses --color-ep-accent-alpha
  + --color-ep-grid-line.
- Zero zinc-*/slate-*, zero font-mono date, zero pure black, zero raw banned hex across
  the three files.
- Build + types green. Diff is attribute-only (pure reskin verified).
</success_criteria>

<output>
Create `.planning/quick/260614-edt-redesign-privacy-and-terms-pages-to-fit-/260614-edt-SUMMARY.md` when done.
</output>
