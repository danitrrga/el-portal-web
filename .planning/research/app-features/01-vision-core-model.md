# El Portal — Vision & Core Model

## One-line positioning

**The gateway between your current self and your future self** — a personal operating system for high-performers that replaces Notion and runs your life through structured identity design, not task management.

---

## The Version → Cycle → Day framework

From the product's own words:

**Version:** The macro chapter. Who you're going to be this season. Has a number, a title, a persona description, and ambitious goals. The default is 90 days, but configurable by the operator. Example from docs: "Version 42: Internet Kid, I always bring a camera with me and record everything I'm doing."

**Cycle:** The tactical sprint inside a version. Every cycle you set focus priorities, problems to solve, CCH (Creencias, Características, Habilidades—Beliefs, Characteristics, Skills), mantras, learning focus, habits, and goals. The default is 6 cycles of 15 days each within a 90-day version, but both are configurable. The system calculates cycle length automatically.

**Day:** The execution unit. Do the habits, check in. One per calendar day; not configurable.

**Philosophy:** "The horizon has three scales. A Version is configurable. A Cycle is configurable. A Day is one. Strip any of them away and planning collapses into either daydreaming or grind."

---

## Goals

**Two types of goals exist:**

1. **Project Goals:** Progress bar based on completed subtasks out of total subtasks. The more structure you add (subtasks), the clearer the path.
2. **Consistency Goals:** Linked to a habit. Progress follows an asymptotic curve where consistency over time matters more than raw streak length.

Goals live in the **Goals room** as a grid view of all active goals. Goals are also visible in the **Lab** when configuring a cycle, and appear on the **Dashboard** under the cycle.

---

## Core feature vocabulary

All feature/section names are capitalized and tied to specific app rooms:

| Feature | Definition |
|---------|-----------|
| **Dashboard** | The daily HUD. Shows current version and cycle, days remaining, today's habits with checkboxes, weekly performance chart, focus priorities, active mantras, and CCH. Morning boot and evening shutdown happen here. |
| **Lab** | Where versions and cycles are created and configured. The version bar sits at the top, cycles below. Where you set priorities, frictions, learning focus, identity items (CCH), mantras, habits, and goals. |
| **Goals** | Grid view of all active goals (Project and Consistency types). Expandable cards showing progress, subtasks, and goal intelligence. |
| **Trends** | The analytics page. Performance charts over cycle and version timescales, wellbeing score composites, habit reliability tables, heatmaps, mood calendars, and correlation analysis. |
| **Archives** | Static knowledge that persists across cycles: routines (boot, shutdown, deep work), the 5-year vision, the mantra bank, and study notes. |
| **Cinema** | Full-screen visualization mode. A carousel of 5 slides (Me, Her, Purpose, Social, Material), each with an image and text. Editable directly on the slide. |
| **Database** | Raw table view of all entities in Supabase. Browse versions, cycles, habits, goals, and logs. Developer-facing. |
| **Pulse** | The daily check-in. No numeric scores for subjective feelings, just words. Tracks mood, energy, sleep quality, and a freeform reflection. Feeds data into the trends engine. Accessible via floating action button on the dashboard. |
| **Habits** | Daily behavioral rituals. Can be linked to consistency goals. Tracked with checkboxes on the dashboard and visualized in Trends with streak and reliability metrics. |
| **Mantras** | Active guiding principles for the current cycle. Visible on the dashboard morning boot. Persist in the mantra bank in Archives. |
| **CCH** | Creencias (Beliefs), Características (Characteristics), Habilidades (Skills). Identity items set at the cycle level. Visible on the dashboard. |
| **Focus Priorities** | Problems to solve or strategic focuses for the current cycle. Set at cycle configuration. Visible on the dashboard. |

---

## Marketing-ready feature highlights

1. **Identity-First Planning** — Instead of task lists, design who you want to become. Versions define your 90-day chapter, cycles execute the 15-day sprints, days deliver the daily habits that compound into that identity.

2. **The Temporal System (Version → Cycle → Day)** — Three nested time containers, all configurable, that prevent planning from collapsing into either daydreaming or grind. Everything lives inside a time boundary.

3. **Pulse Check-ins** — Daily reflection without numeric scoring. Mood, energy, sleep, and freeform notes feed into the system's pattern detection engine, surfacing correlations and ripples humans miss.

4. **Goal Intelligence** — Two goal types (Project Goals with subtasks, Consistency Goals linked to habits) with automated analytics showing progress momentum, habit reliability, and multi-cycle patterns.

5. **Trends Analytics** — Interactive visualizations that read your data and surface what's working. Habit reliability tables, mood calendars, correlation analysis, and cycle-vs-version performance comparisons. You get the insights; you make the decision.

6. **Morning Boot → Evening Shutdown Ritual** — Designed to disappear between two moments: open the portal for your morning session (identity, mantras, focus), close it after logging habits and pulse in the evening. Invisible in between while you do the work it supports.

---

## Core promises (from manifesto)

- **Identity comes first.** The system organizes around who you want to become, not around tasks.
- **Track what your memory can't hold.** Capture honestly so the trends engine can surface patterns you'd miss.
- **The system reads. You decide.** El Portal weighs the signals; the verdict is yours. A companion, not a coach.
- **Friction is signal.** When the same obstacle keeps showing up, that's data.
- **Repetition wins.** The system handles the boring parts of practice so you can focus on the relevant work.
- **The right tool disappears.** Check it at boot. Check it at shutdown. Invisible in between.

---

## What El Portal is NOT

(From the docs — important for marketing clarity)

- Not a meditation app. No soft-focus gradient clouds, no generic illustrations, no pre-packaged self-help advice.
- Not an active coach. The system does not lecture, offer unprompted advice, or pretend to know your life.
- Not an infinite feed. No scrollable backlogs, no endless task lists, no digital hoarding.
- Not gamification. No dopamine loops, no forced social features, no checking boxes for points.

---

## Evidence

- **C:/Users/20252128/dev/Projects/el-portal/docs/vision.md** — Complete manifesto, positioning ("The gateway between your current self and your future self"), what it is/isn't, how it feels, the long game.
- **C:/Users/20252128/dev/Projects/el-portal/docs/features.md** — Temporal system definitions, all room names and descriptions, daily flow, Pulse mechanics, cycle transitions, onboarding structure.
- **C:/Users/20252128/dev/Projects/el-portal/README.md** — Architecture overview, tech stack, key feature summary, project structure confirming route names (dashboard, lab, goals, trends, archives, cinema, database).
- **C:/Users/20252128/dev/Projects/el-portal/src/app/(portal)/** — Route structure confirms all room names: `/dashboard`, `/lab`, `/goals`, `/trends`, `/archives`, `/cinema`, `/database`.
- **C:/Users/20252128/dev/Projects/el-portal/src/components/goal/** — GoalCard.tsx and GoalBadges.tsx confirm goal types and component structure.
- **C:/Users/20252128/dev/Projects/el-portal/src/app/(portal)/dashboard/page.tsx** — Dashboard component confirms Pulse, habits, performance chart, version/cycle display.

---

## Unknowns / Ambiguities

- **"Her" in Cinema** — The Cinema room shows 5 slides: Me, Her, Purpose, Social, Material. The "Her" reference is in the code but not explained in vision.md or features.md. This appears to be person-specific or metaphorical; needs clarification for marketing.
- **Onboarding specifics** — The docs mention a 6-screen cinematic onboarding flow (v5) and a guided tour, but the actual messaging/copy is not in the docs provided. The exact positioning language for each screen isn't defined.
- **Planned Integrations (v7)** — Calendar and Todoist sync, and a focus workstation timer, are mentioned as "Planned" but not yet shipped. Marketing should note the roadmap carefully.
- **5-year vision** — Mentioned as persisting in Archives, but not described. Unclear if this is a user-defined document or a system-generated insight.
