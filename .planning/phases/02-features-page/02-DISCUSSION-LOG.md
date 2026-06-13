# Phase 2: Features Page - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-13
**Phase:** 2-features-page
**Areas discussed:** Visual frame / aesthetic, Bento style, Feature emphasis, Deep-dive visuals, Hero angle, CTA target

---

## Area Selection (gray-area picker)

Offered as multiSelect: Feature emphasis, Deep-dive visuals, Home-page overlap, Hero angle & CTA.

**User's choice (free text):** Did not pick from the list. Instead gave a design direction: *"You already know the style I like. Make sure that you do a clean design not overusing boxes, and mono font. I really like having longitudinal and vertical lines in the background (like an architect designing something, technical design). Two vertical ones at the margins (with the content in between), and then horizontal lines that will separate sections."*
**Notes:** Treated as a locked design decision (the architect/blueprint line-frame). Drove the rest of the discussion.

---

## Bento style (reconciling locked "bento grid" with "don't overuse boxes")

| Option | Description | Selected |
|--------|-------------|----------|
| Line-ruled grid (no cards) | Open grid divided purely by hairline rules — no borders/backgrounds | ✓ |
| Mostly open, 1 framed cell | Open grid, one hero cell gets a subtle border for emphasis | |
| Flat borderless cards | Distinct cells, flat/borderless, separated by bg tint + rules | |

**User's choice:** Line-ruled grid (no cards).
**Notes:** Presented with ASCII previews. Most faithful to the technical-drawing look.

---

## Feature emphasis (which features earn deep-dive rows)

| Option | Description | Selected |
|--------|-------------|----------|
| Version → Cycle → Day | Identity-first temporal core model (already covered on home + /methodology) | |
| Pulse | Daily check-in in words not numbers | ✓ |
| Trends / Insights | Correlation engine + Gemini AI narratives | ✓ |
| Goals | Project + consistency goals, asymptotic curves | |

**User's choice:** Pulse, Trends / Insights.
**Notes:** Deliberately excluded V→C→D to avoid a third retelling (home VCDSection + /methodology already cover it). Remaining features go in the line-ruled grid.

---

## Deep-dive visuals

| Option | Description | Selected |
|--------|-------------|----------|
| Line-style visuals | Text + existing line/curve animations (Trends → correlation chart, Pulse → typographic) | ✓ |
| Text-only + mono | Pure typography + mono annotations, no graphics | |
| Custom line schematics | Bespoke line-drawn room recreations (edges toward v2 FEAT-07) | |

**User's choice:** Line-style visuals.

---

## Hero angle

| Option | Description | Selected |
|--------|-------------|----------|
| The system reads, you decide | Lead with the Companion stance | |
| Feature overview intro | Straightforward "here's everything El Portal does" | ✓ |
| You decide | Defer copy to Claude | |

**User's choice:** Feature overview intro.

---

## CTA target

| Option | Description | Selected |
|--------|-------------|----------|
| Signup primary + pricing secondary | Primary "Open El Portal" → APP_URL, secondary → /pricing | ✓ |
| /pricing only | Single internal CTA | |
| App signup only | Single CTA to APP_URL | |

**User's choice:** Signup primary + pricing secondary.

---

## Mid-discussion canonical reference

User interrupted to point at `C:\Users\20252128\dev\Projects\el-portal\docs\features.md` (the app repo's own feature doc). Read and adopted as the **primary authoritative content source**, superseding inference. Confirmed Pulse + Trends as strong deep-dives and clarified the shipped-vs-planned boundary (biometrics + focus timer = planned; no Calendar/Todoist mentioned).

---

## Claude's Discretion

- Exact selection, grouping, and ordering of grid highlight cells (grounded in `features.md`).
- Hero headline/subhead copy wording.
- Whether V→C→D is one grid cell or a slim intro band (kept brief regardless).
- Per-feature icon choices (Phosphor Light).
- General aesthetic detail within the brand + line-frame ("you already know the style I like").

## Deferred Ideas

- Custom bespoke per-feature mockups / line schematics → v2 (FEAT-07).
- Planned app features (biometric integrations, Focus workstation timer) — show as "coming" or omit; never claim as shipped.
