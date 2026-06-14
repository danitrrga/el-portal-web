# Brand Brief

> Brand personality, audience, and the principles that override default taste.
> Read this before any design work. Generic output is a failure; the context
> below is what makes the work unmistakably El Portal.

---

## Users

**Who:** Individuals — athletes, students, founders, high performers — who treat
their own life like a system worth running. They already use Linear, Arc,
Raycast, Things, Superhuman. Not teams. Not enterprise.

**Context of use:** Late evening, at a laptop, dark room, planning the next
sprint or reviewing the one that just ended. Also first-thing morning, scanning
the day's execution unit. The site is visited cold — usually after a
word-of-mouth referral or a YouTube video — and the visit decides whether they
click "Get Started."

**Job to be done:** Convince a skeptical, taste-sensitive person in under 20
seconds that this is not another productivity template or AI slop. The product
has real mechanics and an analytics system that tracks biometric and functional
data so the system understands the user. The landing page must show those
mechanics and the quiet control they give you.

---

## 🔒 Brand philosophy — three words

**Disciplined · Atmospheric · Intentional**

- **Disciplined** — the system has rules and they're visible. Grid, hierarchy,
  rhythm are not decoration — they're the product's worldview made visual. Like
  Linear's restraint, but with a reason beyond taste: you run your life with
  structure, and the tool reflects that back.
- **Atmospheric** — every screen has depth. Not flat surfaces floating in void —
  layers of space you could fall into. The hero breathes. Light comes from
  somewhere. Subtle color shifts create the feeling of moving through strata.
- **Intentional** — nothing is accidental or decorative. Every element earns its
  place. If you can't explain why it's there, it doesn't ship. This is the
  filter that kills AI-slop: generated design can't justify itself.

**Brand metaphor — The Companion.** A system that reads and analyzes while the
user focuses on important work. It structures the journey and surfaces
personalized data and insights. Not a tool the user wields from outside — a
partner working alongside, holding the meta-work (tracking, analyzing,
structuring) so the user is free to live. The companion learns over time; the
user does the work. (The "observatory" framing was rejected 2026-05-26.)

**Emotional goal:** The reader feels recognized and elevated — "this is how I
already think about my life, but no one built software for it until now." Not
impressed by flashiness. Quietly convinced by the precision.

---

## 🔒 Anti-words

Never use in copy or design directives:

> modern, elegant, sleek, unleash, elevate, next-gen, revolutionary,
> game-changing, powerful, beautiful, immersive, seamless, cutting-edge,
> supercharge, unlock, empower.

**Copy rules:** No exclamation marks anywhere. No em-dashes substituting commas.

---

## Aesthetic direction

**Archetype:** Disciplined atmospheric-tech. The target sits at the intersection
of these references — each contributes one extractable rule:

| Reference | The rule to extract |
|-----------|---------------------|
| **Linear** | **Hierarchy through restraint.** One level louder, two levels quieter. Never shout. |
| **Raycast** | **Structure is legibility.** Geometric precision and consistent spacing replace decorative separation. |
| **Resend** | **Negative space is a statement.** Generous padding says "we don't need to fill this." |
| **Stripe Press** | **Typographic contrast is the primary tool.** Weight, style, and size do what color and borders cannot. |
| **21st.dev / Tailark** | **Texture must be structural.** Dot grids and lines connect or frame real content — never ambient noise. |
| **Nothing.tech** | **Own your look.** If it could belong to another product, it's not done yet. |

---

## 🔒 Design principles

1. **Nothing without reason.** Every element justifies its existence. If you can't explain why it's there, remove it.
2. **Mechanics are the content.** Show real units (Version, Cycle, Day) with real numbers (90, 15, 1). The product structure is more compelling than any metaphor about it.
3. **Atmosphere lives at the edges.** Hero and CTA get environmental depth. The middle is clean instruments. Don't mix them.
4. **One accent per surface.** Blue is the 10%. Still. Always.
5. **Stillness is the default.** The page is quiet when you're not interacting. Only the hero breathes.
6. **Depth over decoration.** Background gradients, tonal shifts, and light direction create interest — not borders, not badges, not chrome.
7. **The changelog is honest.** No micro-versions, no hype copy. Clustered updates under major versions, plain language.

---

## The atmospheric sandwich

Hero and CTA are environmental (gradients, light, depth). The middle sections
are clean and structural (cards, grids, hairlines). The contrast makes both
halves stronger.

| Zone | Feel | What lives here |
|------|------|-----------------|
| **Hero** | Open, atmospheric, breathing | Branded graphic, one H1, one CTA |
| **System** | Precise, structured, dense-but-clear | Bento grid, Version/Cycle/Day mechanics |
| **Evidence** | Calm, editorial | Features, analytics preview, how it works |
| **CTA** | Atmospheric again — depth returns | Closing statement, Special Gothic heading, button |
| **Footer** | Minimal, grounded | Links, nothing decorative |

---

## 🔒 Solo-dev constraint

One-person project. The system must be achievable with:

- **CSS and Tailwind only** for atmospheric effects (gradients, masks, blend modes). No WebGL, Three.js, or custom shaders.
- **Static or CSS-animated hero graphic.** "Breathing" is a CSS animation on a gradient, not a canvas particle system.
- **No asset pipeline.** Branded graphics are built from code (CSS gradients, SVG geometry) or a single authored image.
- **No tokens beyond `globals.css`.** That file is the system.
- **Atmospheric depth = 2–3 background gradient layers**, not complex compositing. If a section's atmosphere takes more than 3 divs, simplify.

The test: can you ship a section in one sitting? If not, the design is too ambitious.

---

## Changelog philosophy

Major versions only — v1, v2, v3. No decimals, no codenames. `v2.0.47` is noise.
Inside each version: 3–6 named initiatives with 1–2 sentence descriptions, not
commit lists. Dates per version, not per initiative. Reads like a project
history, not a git log. Dedicated page, not a modal.
