# El Portal — Intelligence & Analytics Features

## Overview

El Portal's intelligence layer is built around **real-time pattern detection, AI-powered summaries, and multi-dimensional correlation analysis**. The system reads daily pulse data, habit completion logs, and cycle performance to surface actionable insights. This is where the "Companion that reads and analyzes while you focus" metaphor comes to life.

---

## Feature Inventory

### 1. **Trends** (Pro Feature)
**What it does:** Central analytics hub for pulse data visualization and pattern detection.

**In-app labels:**
- Navigation: `nav.trends`
- Page title: "Trends" (subtitle: "Pulse Analytics")
- Locked message: "Trends is a Pro feature"

**Data used:**
- Daily pulse check-ins (mood, energy, stress, performance, motivation, connectedness, sleep quality, activities, emotions)
- Habit completion logs + streaks
- Cycle and version performance data
- All-time vital baselines for comparative scoring

**User benefit:** Transforms scattered daily check-ins into visual patterns and actionable intelligence. Habit, mood, and energy trends become visible across weeks, cycles, and versions.

**Tabs within Trends (5):**
- **Wellbeing** → 6-vital composite score (mood, energy, stress, performance, motivation, connectedness); includes radar chart comparison to previous period
- **Performance** → Daily score trends, habit reliability table, day-of-week heatmap, year-long score calendar
- **Cycles** → Cross-cycle trajectory (score trend line), energy timeline across cycles, cycle report cards, goal journey tracker, energy curve by cycle position, recurring friction detection, identity evolution timeline
- **Insights** → AI-detected behavioral patterns (burnout, habit regression, weekday blind spots, etc.) + AI-generated narrative summary
- **Reports** → Customizable period-based reports (weekly, monthly, per-cycle, per-version) with selectable sections and optional visualization for sharing

**Evidence:**
- `src/components/trends/` (40+ components)
- `src/messages/en.json` lines 1164–1463 (complete Trends vocabulary)
- `src/lib/insightPipeline.ts`, `patternDetection.ts`, `scoreUtils.ts`

**Table-stakes feature:** Yes. Direct differentiator vs. other habit trackers.

---

### 2. **Insights** (Sub-feature of Trends, Pro + Tier 2 opt-in)
**What it does:** Automated behavioral pattern detection on pulse + habit data. Runs daily and on-demand.

**In-app labels:**
- Tab: `trends.tabs.insights` ("Insights")
- Section: `insightsTab.sectionTitle`
- Generic refresh: "New insights available"

**Patterns detected (5 rules):**
1. **Burnout** — Energy drops >20% over 3 days vs. 14-day baseline
2. **Regression** — Habit with 7+ max streak drops to 0 for 3+ days
3. **Weekday blind spot** — Habit <20% completion on one DOW while >50% overall
4. **Correlation spikes** — Habit or mood factor correlates with wellbeing (±10+ points)
5. **Emotional drift** — Reflection sentiment trending down across 2+ reports

**Data used:**
- Pulse check-ins (14-day minimum to unlock patterns; 20 days for correlations; 56 days for day-of-week analysis)
- Habit stats (current streak, max streak, consistency %)
- Reflection text (optional sentiment analysis)

**AI model:** Google Gemini 2.5 Flash (via Vercel AI SDK)
- Used for: Narrative summary generation + reflection sentiment scoring (0–100 valence scale)
- Privacy: Structured data only (no free-form prose, photos, or journal entries sent to AI)
- Frequency: Configurable (every 2 weeks / monthly / per-cycle / quarterly)

**User benefit:** Surfaces hidden patterns before the user notices them. "You skip the gym every Friday" = actionable without manual log review.

**Evidence:**
- `src/lib/patternDetection.ts` (5 detection functions)
- `src/lib/insightPipeline.ts` (pipeline orchestration)
- `src/components/trends/tabs/InsightsTab.tsx` (UI with threshold visualization)
- `src/lib/aiSummary.ts` lines 1–90 (Gemini narrative generation + sentiment)
- `src/messages/en.json` lines 1453–1459 (Insights UI vocabulary + correlation labels)
- `src/lib/research/researchService.ts` (Bucket B consent: "Contribute AI reports to research")

**Table-stakes feature:** Differentiator. Pattern detection at this granularity is rare.

---

### 3. **Narrative Summaries** (AI-Powered)
**What it does:** Factual, non-advisory summaries of period performance (weekly, monthly, per-cycle, per-version).

**In-app labels:**
- Reports tab: "AI-powered summaries"
- Narrative section header: `insightsTab.narrative.title` ("Narrative")
- Pro gate: Narrative text blurred unless upgraded

**Data sent to Gemini:**
- Period start/end dates
- Number of check-in days completed
- Mood label (qualitative: "rough", "low", "okay", "good", "great")
- Insight categories + polarity + strength + numeric lift
- Selected vitals (mood, energy, stress, etc.) with values

**Data NOT sent:**
- User names, emails, or identifiers
- Free-form reflection text (blocked by `FORBIDDEN_INPUT_KEYS` scan)
- Photos, slides, journal content

**Model:** `google("gemini-2.5-flash")` with strict temperature (0.3) and 2048-token limit
**Language:** Supports EN, ES, FR, PT, ZH
**Tone:** Scientific, analytical. NO motivational language. NO advice. NO "you should" or "consider" phrasing.

**Example output:** "Strong cycle. Mood averaged 72%. Energy at 68% with mild stress (45%), indicating recovery phase within normal range."

**User benefit:** Removes subjective spin. Lets users see objective data story without life-coach language.

**Evidence:**
- `src/lib/aiSummary.ts` lines 46–90 (`generateReportSummary()`)
- System prompt: lines 28–40 (enforces scientific tone, blocks coaching language)
- `src/components/trends/NarrativeSection.tsx` (blur + Upgrade CTA)
- `src/components/trends/tabs/ReportsTab.tsx` lines 255–267 (narrative generation)
- `src/lib/research/templates.ts` (research consent tracking for Bucket B corpus)

**Table-stakes feature:** Differentiator for data-driven users.

---

### 4. **Reflection Sentiment Analysis** (Pro + Tier 2)
**What it does:** Analyzes cycle-end debrief reflection text for emotional valence (0–100 scale: 0=very negative, 50=neutral, 100=very positive).

**In-app labels:**
- Settings: `settings.pulseInsights.sentimentLabel` ("Reflection sentiment")
- Settings description: "Analyze your reflection text for emotional patterns. Sends reflection to AI."

**Data used:**
- Debrief reflection text (free-form prose, up to 500 chars sent)

**Model:** `google("gemini-2.5-flash")` with temperature 0.1 (deterministic), 10-token limit

**Output:** Single number (0–100) clamped to valid range; silently fails if model errors

**User benefit:** Tracks emotional trajectory across cycles. Complement to mood data. Shows if writing becomes more negative/positive over time.

**Evidence:**
- `src/lib/aiSummary.ts` lines 96–123 (`analyzeReflectionSentiment()`)
- `src/messages/en.json` lines 803–805 (settings vocabulary)

**Table-stakes feature:** Nice-to-have differentiator.

---

### 5. **The Lab** (Strategic Planning + Configuration)
**What it does:** Workspace for version/cycle creation and configuration. Not strictly "intelligence" but **strategic input that drives insights**.

**In-app labels:**
- Navigation: `nav.lab` ("The Lab")
- Page title: `lab.pageTitle` ("The Lab")
- Subtitle: `lab.pageSubtitle` ("Strategic planning & configuration")

**Key inputs that feed insights:**
- **Cycle priorities** (3–5 focus areas per cycle) → Used in Reports as "Focus Priorities" callout
- **Frictions/Problems** → Tracked across cycles; recurring frictions detected and visualized
- **Identity traits + skills** → Tracked across cycles; shown in "Identity Evolution" timeline
- **Mantras** → Displayed in reports for context

**In-app vocabulary:**
- Strategize section: `lab.strategize` ("STRATEGIZE")
- Add cycle: `lab.addCycle` ("ADD CYCLE")
- Cycle settings: `lab.cycleSettings` ("Cycle Settings")
- Tabs: strategy, identity, mantras, goals, habits

**Data fed to insights/reports:**
- Current cycle goals (count for debrief stats)
- Priorities (first 3 shown in reports)
- Mantras (first mantra optionally shown in reports)
- Skill/trait selections (timeline in Cycles analytics tab)

**User benefit:** Makes hidden context visible to the analytics engine. "What was I focused on during that weak cycle?" becomes answerable by looking at Labs configuration alongside Trends data.

**Evidence:**
- `src/components/lab/` (5 components: CycleCard, CycleGoalsPanel, CycleList, HabitSelectorModal, VersionBar)
- `src/messages/en.json` lines 201–280 (complete Lab vocabulary)
- `src/components/trends/tabs/ReportsTab.tsx` lines 295–296 (priorities + mantra display)

**Table-stakes feature:** Essential scaffolding, not a direct insight feature, but enables context-aware intelligence.

---

### 6. **Daily Pulse Check-ins** (Free, but fuels Trends)
**What it does:** Structured morning/evening data collection on vitals and mood.

**In-app labels:**
- Navigation: `nav.pulse` ("Pulse")
- Page title: `pulse.page.title` ("Daily Pulse")
- Morning: `pulse.checkin.morningTitle` ("Morning Check-in")
- Evening: `pulse.checkin.eveningTitle` ("Evening Check-in")

**Fields collected:**
- **Morning:** mood, sleep quality, focus intent
- **Evening:** mood, energy, stress, performance, motivation, connectedness, activities, feelings (select from 25 emotion words)
- **Optional:** Free-form reflection

**User benefit:** Creates the dataset that powers Trends. Without pulse data, no analytics are possible.

**Locking model:** Trends fully locked behind Pro; Pulse itself is free but historically part of the Pro paywall in earlier versions.

**Evidence:**
- `src/messages/en.json` lines 1043–1162 (complete Pulse vocabulary: check-in form + page)
- `src/components/trends/tabs/WellbeingTab.tsx` (vitals from pulse data)

**Table-stakes feature:** Core data collection. Essential to the platform.

---

### 7. **Correlations & Causality Detection** (Within Insights)
**What it does:** Multi-target correlation analysis. Identifies which habits, activities, or mood factors correlate most strongly with wellbeing trajectories.

**In-app labels:**
- "What makes you shine" (positive correlations)
- "What makes you down" (negative correlations)
- Strength: Strong / Moderate / Low

**Computation:**
- Runs on ≥20 days of data (both pulse + habit logs must overlap)
- Uses `computeMultiTargetCorrelations()` to build correlation matrices
- Filters to ±10+ point wellbeing shifts

**UI:**
- `CorrelationInsightCard` component
- Grid of 2-column insight cards with icon + headline + effect size

**Example:** "MEDITATION → Stress −31%" (strong correlation; 31% lift when habit present)

**User benefit:** Moves from "I feel bad" to "Activity X makes me feel Y by Z%". Data-driven self-knowledge.

**Evidence:**
- `src/lib/correlationEngine.ts` (multi-target correlation)
- `src/components/trends/CorrelationInsightCard.tsx`
- `src/messages/en.json` lines 1453–1459 (correlation vocabulary)

**Table-stakes feature:** Differentiator for quantified self users.

---

### 8. **Habit Reliability & Consistency Tracking**
**What it does:** Monitors habit completion rates, streaks, and patterns across time.

**In-app labels:**
- Performance tab: "Habit Reliability"
- Subtitle: "How dependable each habit is in the current window"
- Columns: Name, Category, Weight, Consistency %, Current Streak, Max Streak, Trend (↑/→/↓)

**Metrics:**
- **Consistency:** % of days habit completed (0–100)
- **Current Streak:** Consecutive days completed ending today
- **Max Streak:** Longest consecutive streak ever
- **Trend:** 3-day slope (improving/stable/declining)
- **Day-of-Week Heatmap:** Completion % by habit × day of week (Monday–Sunday grid)

**Data used:**
- Habit logs (daily completion records)
- Habit weights (1, 2, 4 corresponding to Low, Medium, High impact)

**User benefit:** Identifies which habits stick and which ones need support. "I'm great at Exercise but terrible at Reading on Wednesdays" becomes visible.

**Evidence:**
- `src/components/trends/HabitReliabilityTable.tsx`
- `src/components/trends/DowHeatmap.tsx`
- `src/messages/en.json` lines 1225–1248 (Performance tab vocabulary)

**Table-stakes feature:** Standard in habit trackers, but well-implemented here.

---

### 9. **Cycle & Version Retrospectives**
**What it does:** Snapshot performance summary when a cycle completes. Feeds into debrief UI and Archives.

**In-app labels:**
- Debrief: `debrief.title` ("Cycle Debrief")
- Cycle Report Cards: "Perfect days", "Strongest habit", "Weakest habit", "Goals", "Frictions"
- Archives: `archives.tabDebriefHistory` ("Debrief History")

**Data captured at cycle end:**
- Average daily score
- Perfect day count
- Best habit (highest consistency)
- Worst habit (lowest consistency or high weight + low completion)
- Top streaks
- Completed goals count
- User's free-form reflection

**Storage:** Archives → Debrief History (searchable, readonly for historical cycles)

**User benefit:** Closure. Marks a psychological boundary between cycles. Data becomes permanent history, not transient daily logs.

**Evidence:**
- `src/components/debrief/` (debrief UI)
- `src/messages/en.json` lines 1017–1042 (Debrief vocabulary)
- `src/messages/en.json` lines 479–482 (Archives debrief history)

**Table-stakes feature:** Essential for the temporal structure philosophy.

---

### 10. **Research Data Contribution** (Opt-in, Tier 2)
**What it does:** Allows users to contribute anonymized report inputs and outputs to a research corpus for model training.

**In-app labels:**
- Consent: `welcomeConsent.research.label` ("Contribute AI reports to research")
- Help text: "When El Portal generates a report for you, save the inputs and output to help us train better insight models. Pseudonymous, deletable anytime."
- Settings: `settings.pulseInsights.aiNarrativesDesc` ("Generate narrative summaries of your data. Sends structured analytics to AI.")

**Data collected (Bucket B):**
- Pseudonym: HMAC-SHA256(userId, RESEARCH_PSEUDO_SALT) — rotated quarterly
- Prompt template name + version
- Model ID
- Input snapshot (structured: period dates, vitals, mood label, insight metadata)
- Generated text (AI output)
- Consent version (traces back to exact user agreement)

**Data NOT collected:**
- User ID, email, or identifying information
- Photos, slides, reflection text, journal content (active scan blocks `FORBIDDEN_INPUT_KEYS`)
- Free-form prose

**Privacy guarantees:**
- EU-hosted corpus storage
- Pseudonym rotation makes old hashes unlinkable
- User can delete all contributed rows anytime
- Completely voluntary; defaults to OFF

**User benefit:** Contributes to model improvement. Part of the "Companion" philosophy: users help the system get smarter.

**Evidence:**
- `src/lib/research/researchService.ts` (pseudonymization, consent tracking, forbidden-key scanning)
- `src/lib/research/templates.ts` (corpus metadata: template + version + model)
- `src/messages/en.json` lines 90–104 (Consent flow vocabulary)
- Privacy page (mentioned in CLAUDE.md: "EU-hosted, no content, no cookies")

**Table-stakes feature:** Trust-builder. Differentiator for users who care about privacy + ethical AI.

---

### 11. **MCP Tools** (API for External Integrations)
**What it does:** Exposes El Portal data to external systems (Claude Code, other AI agents, custom tools).

**Available tools:**
1. `portal_snapshot` — Current state (version, cycle, habits with streaks, goals, daily score)
   - Optional includes: pulse_today, archives, identity, mantras
2. `portal_review` — Cycle performance review (daily scores, habit stats, goal progress, days remaining)
   - Optional includes: insights, pulse_history, debrief_stats
3. `portal_search` — Search archives, mantras, goals by keyword
4. `portal_habits` — List all habits with stats + history
5. `portal_history` — Fetch historical data (daily scores, habit logs, pulse check-ins)
6. `portal_cycles` — List all cycles with metadata
7. `portal_pulse` — Get pulse check-in history (last N days)

**User benefit:** Enables custom workflows like "Generate a weekly report in my email" or "Coach me based on my last cycle data" via Claude Code or other AI agents.

**Evidence:**
- `src/mcp/tools/snapshot.ts`, `review.ts`, `search.ts`, `habits.ts`, `history.ts`, `cycles.ts`, `pulse.ts`
- `src/messages/en.json` lines 856–879 (API settings vocabulary)

**Table-stakes feature:** Differentiator for power users who want to build on top of El Portal.

---

## How the "Companion Reads & Analyzes" Story Maps to Real Features

1. **Companion reads:** Daily Pulse check-ins capture granular data on mood, energy, activities, and focus. The app doesn't require narrative journaling — just structured vitals.

2. **Companion analyzes:** Trends tab synthesizes pulse data + habit logs into visual patterns:
   - Wellbeing score (6-vital composite)
   - Habit reliability (consistency %, day-of-week patterns)
   - Cycle trajectories (score trends across versions)
   - Correlations (activity X lifts mood Y by Z%)

3. **Companion surfaces insights:** Automated pattern detection identifies:
   - Burnout signals (energy drops)
   - Habit regressions (streaks breaking)
   - Weekday blind spots (Friday gym skip)
   - Emotion drift (reflection sentiment declining)

4. **Companion narrates:** AI-powered summaries translate data into plain English without coaching or advice. "Your mood averaged 72% with mild stress."

5. **Companion personalizes:** Intelligence features are configurable:
   - Insight frequency (every 2 weeks / monthly / quarterly / per-cycle)
   - Report periods (weekly / monthly / per-cycle / per-version)
   - Data window (last N days / cycle / 3–6 months / all-time)
   - Sections shown in reports (wellbeing / performance / insights / cycle context)

---

## Marketing-Ready Highlights (Top 3–5)

### 1. **Pattern Detection Without the Manual Work**
"El Portal automatically finds correlations you'd never notice: which activities lift your mood, which days sabotage your habits, when burnout is creeping in. 5 behavioral patterns, updated daily."

### 2. **Bias-Free Analytics**
"No motivational language. No coaching. Just data. Your insights are generated by Google Gemini but sandboxed: only structured analytics are sent to the AI, never your journal entries or photos."

### 3. **Cross-Cycle Evolution Tracking**
"See how your habits, mood, and identity traits evolve across cycles and versions. Identity Evolution timeline shows what strengths you've built and what frictions keep returning."

### 4. **Customizable Reports for Any Period**
"Build reports for any time window (week / month / cycle / version). Toggle sections (Wellbeing / Performance / Insights / Goals). Export or share as printable HTML."

### 5. **Research Partnership Opt-In**
"Help train better insight models. Contribute your anonymized report data to our research corpus. You control what you share, and you can delete it anytime. (EU-hosted, no personal data.)"

---

## Unknowns

1. **Export/sharing format** — Reports tab mentions printable output but I didn't find evidence of PDF export or email delivery in the codebase. May be backend-only or planned feature.

2. **Email digest frequency** — Settings mention email digest (weekly / per-cycle / monthly / bimonthly / quarterly) but I didn't locate the email template code or cron job. May be in a backend-only section.

3. **Advanced correlations** — I saw the correlation detection function but didn't find threshold documentation. How many data points trigger a "strong" vs. "moderate" correlation in the UI?

4. **Narrative trigger** — Insights narrative is generated on-demand and cached, but I didn't find whether it's automatically triggered after reports run or only on user refresh. Likely on-demand with caching.

5. **Sentiment scoring thresholds** — Reflection sentiment is scored 0–100, but I didn't find where the UI uses this score (e.g., does it show in Debrief? In Archives?). May be stored but not yet exposed.

---

## Evidence (File Paths)

### Core Intelligence Features
- `src/components/trends/` (40+ components) — Entire Trends UI
- `src/lib/insightPipeline.ts` — Pattern detection orchestration
- `src/lib/patternDetection.ts` — 5 behavioral rule detectors
- `src/lib/correlationEngine.ts` — Multi-target correlation analysis
- `src/lib/aiSummary.ts` — Gemini narrative + sentiment generation
- `src/lib/research/researchService.ts` — Anonymized research corpus writer
- `src/lib/research/templates.ts` — Research metadata constants

### Analytics & Visualization
- `src/components/trends/InsightCard.tsx` — Pattern card component
- `src/components/trends/NarrativeSection.tsx` — AI narrative display + Pro gate
- `src/components/trends/tabs/InsightsTab.tsx` — Insights UI with thresholds
- `src/components/trends/tabs/ReportsTab.tsx` — Report generator with config
- `src/components/trends/HabitReliabilityTable.tsx` — Habit stats grid
- `src/components/trends/DowHeatmap.tsx` — Day-of-week completion matrix
- `src/components/trends/CorrelationInsightCard.tsx` — Correlation display
- `src/components/trends/IdentityEvolutionTimeline.tsx` — Traits/skills evolution

### Lab & Data Input
- `src/components/lab/CycleCard.tsx` — Cycle creation UI
- `src/components/lab/CycleGoalsPanel.tsx` — Goal + subtask management
- `src/components/lab/` (5 components) — Full Lab workspace

### MCP Tools (External API)
- `src/mcp/tools/snapshot.ts` — Current state export
- `src/mcp/tools/review.ts` — Cycle review data
- `src/mcp/tools/search.ts` — Archives search
- `src/mcp/tools/habits.ts`, `cycles.ts`, `pulse.ts`, `history.ts` — Data retrieval tools

### Vocabulary & i18n
- `src/messages/en.json` lines 1–1804 (all in-app labels)
  - Lines 1164–1463: Trends feature vocabulary
  - Lines 1043–1162: Pulse feature vocabulary
  - Lines 90–104: Research consent vocabulary
  - Lines 856–879: API keys settings vocabulary
  - Lines 775–855: Pulse & Insights settings vocabulary
  - Lines 201–280: Lab vocabulary

### Documentation
- `docs/features.md` — High-level feature overview
- `docs/privacy.md` (mentioned in CLAUDE.md) — Privacy & research data handling

---

## Summary

El Portal's intelligence layer is **real, feature-rich, and differentiating**. It goes beyond simple analytics:

✅ **Automated pattern detection** (5 behavioral rules)
✅ **AI-powered narrative summaries** (Google Gemini 2.5 Flash, privacy-first)
✅ **Multi-dimensional correlations** (which habits lift mood, which days sabotage progress)
✅ **Cross-cycle evolution tracking** (identity, frictions, skills over time)
✅ **Customizable reports** (any period, any section mix)
✅ **Research partnership** (opt-in, pseudonymous data contribution)
✅ **API exposure** (7 MCP tools for external integrations)

The "Companion that reads and analyzes while you focus" metaphor is **grounded in real code**. Daily pulse → Pattern detection → Correlation analysis → AI narrative = a complete intelligence pipeline, not vaporware.
