# Phase 2: Features Page - Context

**Gathered:** 2026-06-13
**Status:** Ready for planning

<domain>
## Phase Boundary

A new `/features` route for the marketing site that truthfully describes El Portal's **shipped** features in the brand voice, using the locked hybrid layout (hero intro → highlight grid → deep-dive rows → closing CTA), linked from the nav and footer, driving visitors onward to app signup / pricing.

This is the marketing site only — no app functionality. Content must be traceable to the real app and must not overstate (no PWA claim, no shipped Calendar/Todoist, biometrics + focus timer are "planned").

</domain>

<decisions>
## Implementation Decisions

### Visual Frame — "Architect / Technical Drawing"
- **D-01:** The page's structural skeleton is **drawn hairlines, not stacked cards.** Two vertical rules sit at the page margins and frame all content between them; horizontal hairlines separate each section. (User's explicit direction — "like an architect designing something, technical design.")
- **D-02:** **Restraint on boxes** — the layout breathes in an open grid; avoid a wall of bordered cards.
- **D-03:** **Mono font as accent only** — technical-drawing annotations (eyebrows, labels, coordinates, metrics). Display stays Special Gothic, body stays Inter. Do not set body copy in mono.
- **D-04:** The new page uses the `--color-ep-*` OKLCH tokens and (per CLAUDE.md for new work) **Phosphor Light icons at strokeWidth 1.5** — it does NOT copy the hardcoded-hex constant pattern or `lucide-react` icons used by older pages (methodology, etc.).

### Highlight Grid (the "bento")
- **D-05:** The locked "bento grid" (FEAT-03) is realized as an **open line-ruled grid with NO cards** — cells divided purely by hairline rules, no borders or card backgrounds. This is how the bento requirement reconciles with the no-boxes direction. (User selected this explicitly over hybrid/flat-card variants.)

### Feature Emphasis / Content Architecture
- **D-06:** **Two deep-dive rows: Pulse and Trends / Insights** — the headline differentiators.
- **D-07:** Everything else lives in the line-ruled grid as shorter highlights: Version→Cycle→Day (kept **brief** — it is already deep-covered on the home `VCDSection` and `/methodology`, so do NOT re-explain it at length here), Goals, Lab, Archives, Cinema, the daily flow (morning boot → evening shutdown), configurable tempo, privacy/3-bucket consent, multilingual. Final cell selection and ordering is Claude's discretion, grounded in `features.md`.

### Deep-dive Visuals
- **D-08:** Deep-dive rows use **line-style visuals**, reusing the existing line/curve animations: Trends → correlation/line chart; Pulse → typographic line treatment. The box-and-bracket mockups (`SystemBlueprintSection` `MockupFrame`, `DashboardPreview`) are **NOT reused** — they clash with the line aesthetic. (FEAT-07 per-feature bespoke mockups remain deferred to v2.)

### Hero & CTA
- **D-09:** Hero leads with a **feature-overview intro** ("here's what El Portal does"), in the brand voice — straightforward framing, not the "system reads, you decide" angle for this page.
- **D-10:** Closing CTA = **primary "Open El Portal" → app signup (`APP_URL`)**, with a **secondary link → `/pricing`**. (Mirrors and extends the existing `CTASection` pattern.)

### Navigation Wiring
- **D-11:** Add a **Features** link to `Navbar` `navLinks` (currently Manifesto / Changelog / Methodology / Pricing), and fix the `Footer` Product-column "Features" link, which currently points to `/` → repoint to `/features`. (Satisfies FEAT-01 / QUAL-01.)

### Claude's Discretion
- Exact selection, grouping, and ordering of grid highlight cells (grounded in `features.md`).
- Hero headline/subhead copy wording (brand voice).
- Whether V→C→D appears as one grid cell or a slim intro band — kept brief either way.
- Per-feature icon choices (Phosphor Light).
- "You already know the style I like" — aesthetic detail delegated to Claude within the brand system + the line-frame above.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### App feature content source (authoritative — truthfulness depends on these)
- `C:\Users\20252128\dev\Projects\el-portal\docs\features.md` — **PRIMARY** source for all feature copy, vocabulary, and the "Planned vs shipped" boundary. User-referenced during discussion. Every feature claim must trace here.
- `C:\Users\20252128\dev\Projects\el-portal\docs\vision.md` — positioning / "why it exists" (cross-referenced by `features.md`).
- `C:\Users\20252128\dev\Projects\el-portal\docs\design-system.md` — app design tokens (cross-referenced by `features.md`); for vocabulary only — does NOT govern marketing-site styling.
- `.planning/research/SUMMARY.md` — research synthesis + truthfulness guardrails (no PWA, no shipped Calendar/Todoist, verify hosting region).
- `.planning/research/app-features/01-vision-core-model.md` … `04-onboarding-data-platform.md` — grounded investigations behind the summary.

### Brand & design system
- `.impeccable.md` — brand brief, "The Companion" metaphor (observatory framing rejected).
- `CLAUDE.md` — conventions + anti-patterns (no raw `<button>`, no gradient-clipped text, no pure black, no `zinc`/`slate` mixing, no `transition: all`, Phosphor Light for new icons).
- `src/app/globals.css` — `--color-ep-*` OKLCH token palette (post-Phase-1 migration).

### Requirements & scope
- `.planning/ROADMAP.md` §"Phase 2: Features Page" — goal + success criteria.
- `.planning/REQUIREMENTS.md` — FEAT-01…FEAT-06, QUAL-01.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/CTASection.tsx` — closing-CTA pattern (brand `Button` + `APP_URL`, atmospheric backdrop). Adapt for signup-primary + pricing-secondary (D-10).
- `src/components/animations/AsymptoticAnimation.tsx`, `src/components/animations/CyclesAnimation.tsx` — line/curve visuals that fit the blueprint aesthetic; candidates for the Trends/Pulse deep-dive rows and Goals highlight (D-08).
- `src/components/ui/button.tsx` (`brand` / `brand-link` variants — required for hero/nav CTAs), `shiny-button.tsx`, `animated-group.tsx` (staggered entrance), `separator.tsx`.
- `src/components/BoundedContainer.tsx` — `max-w-5xl px-6 md:px-8` layout wrapper.
- `src/components/Navbar.tsx` (`navLinks` array) and `src/components/Footer.tsx` (`footerColumns` Product "Features" href) — the two wiring touch-points (D-11).
- Page composition pattern: each `src/app/{route}/page.tsx` imports `Navbar` + `Footer` and composes sections; export `metadata` (title + description) for FEAT-05.

### Established Patterns
- **Section eyebrow:** mono number · label + flex hairline (`methodology/page.tsx` `SectionEyebrow`) — aligns directly with the mono-annotation / technical-drawing direction (D-03). Reuse/adapt this vocabulary.
- **Entrance motion:** Framer Motion, easing `cubic-bezier(0.22, 1, 0.36, 1)`, ~0.5s, `staggerChildren` ~0.08, `whileInView` once (see `Footer.tsx` variants). GPU-composited transform/opacity only; no perpetual decorative motion (FEAT-06).
- **Token caution:** older pages (methodology, etc.) define hardcoded-hex `SCREAMING_SNAKE` constants at the top — the new page must NOT copy that; use `--color-ep-*` tokens (D-04).

### Integration Points
- New route file: `src/app/features/page.tsx` (RSC; `metadata` export). Client islands only where motion requires `"use client"`.
- `Navbar.navLinks` + `Footer` Product column updated to include `/features`.

</code_context>

<specifics>
## Specific Ideas

- **The defining motif (user's own words):** "I really like having longitudinal and vertical lines in the background, like an architect designing something — technical design. Two vertical ones at the margins with the content in between, and then horizontal lines that separate sections."
- "Clean design, not overusing boxes" + mono font used sparingly.
- "You already know the style I like" — trust delegated to Claude for aesthetic detail within the brand + line-frame.
- Narrative material surfaced from `features.md` worth using: morning boot → evening shutdown daily flow, the weekly review rhythm, the 6-screen cinematic onboarding ("You are not static" → "Patterns emerge"), Cinema's 5 slides.

</specifics>

<deferred>
## Deferred Ideas

- **Custom bespoke per-feature mockups / line schematics** — this is FEAT-07, already deferred to v2. The "Custom line schematics" visual option was offered and not chosen for v1.
- **Planned (not shipped) app features** — biometric integrations (Apple Health, Aura/Garmin/Whoop) and the Focus workstation timer. May be shown as "coming" or omitted; must NOT be claimed as shipped.

None of the above are scope creep for this phase — they are correctly out of scope and noted so they aren't lost.

</deferred>

---

*Phase: 2-features-page*
*Context gathered: 2026-06-13*
