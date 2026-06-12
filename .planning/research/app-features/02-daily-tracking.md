# El Portal — Daily Tracking & Execution Features

## Feature Inventory

### Pulse (Daily Check-in System)

**What it does:** The app's core daily ritual. Users complete two optional check-ins — a morning check-in and an evening check-in — to track mood, energy, sleep quality, focus areas, and activities. No numeric scores for subjective feelings; instead, Pulse captures words and qualitative data to feed the trends engine for pattern detection.

**In-app labels:**
- "Pulse" (nav label)
- "Morning Check-in" vs "Evening Check-in" (mode labels)
- Morning subtitle: "Start your day with intention"
- Evening subtitle: "Reflect on how your day went"

**User interaction:**
- Accessible via the floating action button (FAB) labeled "Morning check-in" or "Evening check-in"
- Multi-step modal flow (4 steps for morning, 8 for evening)
- Each step asks a single question with custom UI per question type

**Morning check-in steps:**
1. "How are you feeling?" — numeric mood scale (1–10)
2. "How did you rest?" — numeric sleep scale
3. "What describes your mood?" — select up to 5 feeling pills (e.g., "Energized", "Calm", "Focused", "Grateful", "Motivated", etc.)
4. "What are you focusing on today?" — select from focus categories (Sports, Work, Social, Study, Creative, Rest, Family, Health, Spiritual, Learning, Recovery)

**Evening check-in steps:**
1. "How are you feeling?" — numeric mood scale
2. "How productive were you?" — numeric productivity slider
3. "How stressed are you?" — numeric stress slider
4. "How motivated are you?" — numeric motivation slider
5. "How's your energy?" — numeric energy slider (labels: Drained, Low, Moderate, Energized, Supercharged)
6. "How connected did you feel?" — numeric connectedness slider
7. "What describes your mood?" — feeling pills (same pool as morning)
8. "What did you do today?" — activity tags (freeform text input, multi-add)

**File evidence:**
- `src/components/pulse/PulseCheckinModal.tsx` — main modal logic
- `src/lib/pulseConstants.ts` — step definitions (MORNING_STEPS, EVENING_STEPS), feeling bank (29 total feelings across positive/neutral/negative), focus options
- `src/messages/en.json` lines 1043–1167 — all Pulse labels and strings

**Table-stakes vs differentiator:** Core differentiator. This is THE daily ritual—the evening shutdown and morning boot that frame the day. No competitor app has this word-based, multi-dimensional feeling capture + activity logging + AI-powered trend analysis combo.

---

### Habit Tracker (Daily Execution)

**What it does:** A checkbox list of habits defined in the current cycle, visible on the dashboard. Users check off completed habits each day. Progress feeds into goal scoring, streak tracking, and cycle debrief analytics.

**In-app labels:**
- "HABIT TRACKER" (dashboard section header)
- "No habits defined for this cycle." (empty state)
- "No habits recorded for this day." (day inspector empty state)

**User interaction:**
- Displayed on the dashboard as a checklist
- Each habit is a clickable checkbox
- Daily progress is tracked and can be inspected via the Day Inspector
- Habits are created and configured in the Lab during cycle planning

**Connected features:**
- Linked to consistency goals (progress follows an asymptotic curve where consistency over time matters more than raw streak length)
- Feeds into daily score calculation
- Generates "Best Habits" and "Needs Work" rankings at cycle debrief
- Streak tracking: "Current Streak" and "Best Streak" labels visible on dashboard for each habit

**File evidence:**
- `src/messages/en.json` lines 151–199 (dashboard section with habit tracker labels)
- `docs/features.md` lines 27–28 (Dashboard description: "Shows the current version and cycle, days remaining, today's habits with checkboxes, the weekly performance chart, focus priorities, active mantras, and CCH.")
- Cycle configuration supports habit setup; habit types and metrics defined in lab

**Table-stakes vs differentiator:** Table-stakes. Standard habit tracking, but integrated into the temporal system (Version/Cycle/Day) and tied to cycle-wide debrief analytics. Differentiator is the cycle-contextual replay, not the daily checkbox.

---

### Day Inspector

**What it does:** Detailed view of a single day's execution. Click on a data point in the performance charts (dashboard progress chart or trends) to inspect that day's recorded habits, Pulse check-ins, and performance metrics.

**In-app labels:**
- "DAY INSPECTOR" (section header when inspecting a day)
- "Today" (button to jump back to today)
- "Click a data point to inspect that day" (hint text on charts)
- "No habits recorded for this day." (empty state if no habits logged)

**User interaction:**
- Users click on a data point in the progress chart or trends timeline
- Modal/panel opens showing that day's details: habit completion, Pulse moods/feelings/activities, daily score
- Includes snapshot of metrics for that day

**File evidence:**
- `src/messages/en.json` lines 194–197 (Day Inspector labels)
- `docs/features.md` line 28 (Dashboard includes "the weekly performance chart"); lines 34–35 (Trends page mentions performance charts and "heatmaps, mood calendars")

**Table-stakes vs differentiator:** Table-stakes inspection feature. Enables data exploration but not central to daily use.

---

### Cycle Debrief & Reflection

**What it does:** When a cycle ends (15 days by default), users complete a structured debrief. First, the system snapshots performance (avg daily score, perfect days count, goals completed, best/worst habits, streaks). Then users write a reflection answering "What worked? What didn't? What will you carry forward?" The reflection is saved and can be reviewed later.

**In-app labels:**
- "Cycle Debrief" (title)
- "Review your cycle performance before moving forward." (subtitle)
- "Average Daily Score" / "Perfect Days" / "Total Days" / "Goals Done" / "Best Habits" / "Needs Work" / "Streak Highlights" (debrief metrics)
- "Reflection" (section header)
- "What worked? What didn't? What will you carry forward?" (reflection prompt)
- "Your reflection has been saved to this cycle." (success message)
- "Debrief History" (archive view)

**User interaction:**
- Triggered automatically when cycle end date is reached
- Two-step flow: stats review → reflection writing
- Users can edit their reflection anytime
- Past debriefs are stored in the Archives under "Debrief History"

**File evidence:**
- `src/messages/en.json` lines 1017–1041 (debrief section)
- `docs/features.md` lines 71–76 (Cycle Transitions describe the debrief flow)
- Reflection text is sent to AI for sentiment analysis if user opts in (lines 803, 1408 in en.json)

**Table-stakes vs differentiator:** Core differentiator. The debrief ritual—forced reflection at the end of a sprint—is central to El Portal's identity. It closes the loop between ambition (version/cycle planning) and reality (daily execution and mood patterns).

---

### Dashboard (Daily HUD)

**What it does:** The home screen shown every time the user opens El Portal. A unified view of the day's execution: active version and cycle, days remaining, today's habit checklist, weekly performance chart, focus priorities, active mantras, and identity items (CCH: Creencias/Características/Habilidades).

**In-app labels:**
- "Dashboard" (nav)
- "HABIT TRACKER" / "CYCLE PROGRESS" / "CYCLE GOALS" / "Focus and Friction" / "Current Mantras" / "WEEK" / "30 DAYS" / "CYCLE" (section headers)
- "Daily Score" / "Deep Work" (metric labels)
- "Morning check-in" / "Evening check-in" (call-to-action links to Pulse)

**User interaction:**
- Always the landing page after login
- Users see at a glance: today's habits (with checkboxes), active priorities, mantras, goals, and performance trends
- Click habit checkbox to log completion
- Click "Morning/Evening check-in" to open Pulse modal
- Click data point on charts to open Day Inspector

**File evidence:**
- `src/messages/en.json` lines 151–199 (dashboard labels)
- `docs/features.md` lines 27–28 (Dashboard room description)

**Table-stakes vs differentiator:** Table-stakes. Standard dashboard, but optimized for the temporal system (version/cycle/day) and designed to disappear between two moments: morning boot and evening shutdown.

---

### Deep Work (Planned Feature)

**What it does:** A keyboard-triggered timer for active work sessions (Pomodoro or countdown). Silences notifications during focus blocks. Logs total focus hours per day.

**In-app labels:**
- "Deep Work" (dashboard metric)

**Status:** Planned for V7; not yet implemented.

**File evidence:**
- `docs/features.md` lines 100–101 (Planned: Focus workstation)
- `src/messages/en.json` line 178 (Deep Work label on dashboard)

**Table-stakes vs differentiator:** Planned differentiator. Focus time logging ties into the Pulse system to correlate deep work with mood, energy, and productivity metrics.

---

### Trends & Analytics (Daily Pattern Detection)

**What it does:** The analytics page that emerges after the first cycle. Displays performance charts over cycle and version timescales, wellbeing score composites, habit reliability tables, heatmaps, mood calendars, and correlation analysis. All fed by Pulse data and habit logs.

**In-app labels:**
- "Trends" (nav) / "Analytics" (alt name)
- "Pulse Trends" (section) — "Mood, sleep & emotion patterns"
- "Habit Consistency" (chart type)
- "Mood Delta" (morning to evening mood change)
- "Cycle Digest" (AI-generated summary on cycle end)

**User interaction:**
- Click data points to drill into Day Inspector
- Charts are interactive and filterable
- AI-generated insights (if opted in): sentiment analysis on reflections, driver attribution (which habits correlate with mood swings)

**File evidence:**
- `src/messages/en.json` lines 420–1215 (extensive trends/analytics labels)
- `docs/features.md` lines 38–39 (Trends room: "performance charts over cycle and version timescales, wellbeing score composites, habit reliability tables, heatmaps, mood calendars, and correlation analysis")

**Table-stakes vs differentiator:** Core differentiator. AI-powered pattern detection from Pulse + habit data is the secret sauce. Competitors have dashboards; El Portal has self-knowledge.

---

## Marketing-Ready Highlights

1. **Morning Pulse → Evening Pulse ritual** — Start your day with intention, end it with reflection. Two 2-minute check-ins (mood, sleep, focus, activities, stress, energy, feelings) feed an AI engine that finds patterns you can't see alone.

2. **Habit execution meets psychological check-in** — Don't just log whether you did the thing. Log how you *felt* doing it. Correlate habit streaks with energy, mood, and focus to know which routines actually serve you.

3. **Cycle debrief closes the loop** — Every 15 days, pause. Review your daily performance, write a reflection on what worked, and carry insights into your next sprint. No data gets forgotten.

4. **Wellbeing dashboard, not task dashboard** — The daily view isn't a to-do list. It's a mood calendar, a consistency heatmap, and your mantras. You see how you *felt* last week, not just what you did.

5. **AI finds correlations you don't** — Mood delta (morning to evening), habit-mood drivers, sentiment patterns in your reflections. The app reads your life so you can focus on living it.

---

## Unknowns

- **Exact UI of habit checkboxes on dashboard** — unclear if inline or in a modal; whether they're drag-reorderable
- **Activity tagging autocomplete** — whether the freeform activity input has suggestion/history
- **Offline sync for Pulse** — whether check-ins are cached if offline
- **Mobile app vs web only** — codebase has mobile components (BottomTabBar, PulseFAB, MobileHeader), suggesting mobile exists, but unclear if feature parity
- **"Learning Focus" vs "Skills Focus"** — en.json uses both terms; unclear if they're synonyms or separate
- **Deep Work timer defaults** — Pomodoro duration, notification silencing scope (which apps?)

---

## Evidence

**Files Read:**
- `C:/Users/20252128/dev/Projects/el-portal/docs/features.md` — feature descriptions and room overviews
- `C:/Users/20252128/dev/Projects/el-portal/src/messages/en.json` — all user-facing labels and strings (1400+ lines)
- `C:/Users/20252128/dev/Projects/el-portal/src/lib/pulseConstants.ts` — Pulse check-in step definitions, feeling bank, focus options
- `C:/Users/20252128/dev/Projects/el-portal/src/components/pulse/PulseCheckinModal.tsx` — Pulse modal logic (80 lines read)
- `C:/Users/20252128/dev/Projects/el-portal/src/components/pulse/FeelingPills.tsx` — feeling selection UI
- `C:/Users/20252128/dev/Projects/el-portal/src/components/pulse/FocusTags.tsx` — focus category selection UI
- `C:/Users/20252128/dev/Projects/el-portal/src/components/pulse/ActivityInput.tsx` — activity tag input

**Pulse Constants:**
- Morning steps: mood, sleep, feelings, focus (4 steps)
- Evening steps: mood, productivity, stress, motivation, energy, connectedness, feelings, activities (8 steps)
- 29 total feeling words (10 positive, 5 neutral, 14 negative)
- 11 focus categories (sports, work, social, study, creative, rest, family, health, spiritual, learning, recovery)
- 5-level energy scale: Drained, Low, Moderate, Energized, Supercharged
