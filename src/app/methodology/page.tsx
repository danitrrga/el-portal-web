import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, Sun, Moon } from "lucide-react";

const SECTION_BG = "#04060c";
const FG_STRONG = "#f4f6fb";
const FG = "#aab3c5";
const FG_MUTED = "#8590a8";
const FG_SUBTLE = "#5a6478";
const ACCENT = "#4487D6";
const ACCENT_LIGHT = "#77B7ED";
const RULE = "rgba(255,255,255,0.06)";
const RULE_STRONG = "rgba(255,255,255,0.14)";

/* ────────────────────────────────────────────────────────────────────
   Section eyebrow — same vocabulary as changelog version pills /
   manifesto ActLabel.
   ──────────────────────────────────────────────────────────────────── */
function SectionEyebrow({ num, label }: { num: string; label: string }) {
  return (
    <div className="mb-8 flex items-center gap-3 md:mb-10">
      <span
        className="font-mono text-[11px] tabular-nums"
        style={{ color: FG_SUBTLE }}
      >
        {num}
      </span>
      <span
        aria-hidden
        className="font-mono text-[10px]"
        style={{ color: FG_SUBTLE }}
      >
        ·
      </span>
      <span
        className="font-mono text-[11px] uppercase tracking-[0.22em]"
        style={{ color: FG_MUTED }}
      >
        {label}
      </span>
      <div
        aria-hidden
        className="ml-1 h-px flex-1"
        style={{ background: RULE }}
      />
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────
   01 — Temporal Hierarchy
   features-9: asymmetric split (concept left, diagram right) +
   full-width anchor metric below.
   ──────────────────────────────────────────────────────────────────── */
function TemporalHierarchySection() {
  return (
    <section>
      <SectionEyebrow num="01" label="Temporal Hierarchy" />

      <div className="grid items-start gap-10 md:grid-cols-[1fr_1.1fr] md:gap-14">
        {/* LEFT — concept */}
        <div>
          <h2
            className="display text-balance leading-[1.1]"
            style={{
              fontSize: "clamp(26px, 2.6vw, 34px)",
              color: FG_STRONG,
            }}
          >
            Version, Cycle, Day.
          </h2>
          <p
            className="mt-5 text-[15px] leading-[1.65] md:text-base"
            style={{ color: FG }}
          >
            Three time scales the entire system is built on. A Version
            sets the direction. A Cycle moves you toward it. A Day is the
            unit of execution.
          </p>
          <ul className="mt-6 space-y-3">
            {[
              { k: "Version", v: "90 days. The arc — who you're becoming." },
              { k: "Cycle", v: "15 days. The sprint — what to work on now." },
              { k: "Day", v: "1 day. The reps — the only scale you live in." },
            ].map((row) => (
              <li
                key={row.k}
                className="grid grid-cols-[80px_1fr] gap-3 text-[14px] leading-[1.55] md:text-[15px]"
              >
                <span
                  className="font-mono text-[12px] uppercase tracking-[0.16em] pt-[2px]"
                  style={{ color: FG_MUTED }}
                >
                  {row.k}
                </span>
                <span style={{ color: FG }}>{row.v}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT — strata diagram (matches hero VCD language, editorial variant) */}
        <div className="relative">
          <TemporalStrataDiagram />
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────
   TemporalStrataDiagram — static editorial variant of the hero's
   VCDSection. Three horizontal strata sharing a single dashed NOW
   line. Monotone (no accent), no glow on today dot, no animation.
   ──────────────────────────────────────────────────────────────────── */

const STRATA_TRACK = "rgba(255,255,255,0.06)";
const STRATA_PAST = "rgba(255,255,255,0.20)";
const STRATA_ACTIVE = "rgba(255,255,255,0.35)";
const STRATA_NOW = "rgba(255,255,255,0.28)";

function TemporalStrataDiagram() {
  const TODAY_DAY_OF_VERSION = 42;
  const TOTAL_DAYS = 90;
  const TOTAL_CYCLES = 6;
  const ACTIVE_CYCLE_IDX = 2; // 0-indexed → cycle 3 of 6
  const NOW_PCT = (TODAY_DAY_OF_VERSION / TOTAL_DAYS) * 100;

  return (
    <div className="relative w-full">
      <NowLine leftPct={NOW_PCT} />

      <div className="flex flex-col gap-7">
        <Stratum
          label="VERSION"
          count="90 days"
          rightMeta={`Day ${TODAY_DAY_OF_VERSION} of ${TOTAL_DAYS}`}
        >
          <VersionTrack progressPct={NOW_PCT} />
        </Stratum>

        <Stratum label="CYCLES" count={`${TOTAL_CYCLES} × 15 days`}>
          <CycleBlocks totalCycles={TOTAL_CYCLES} activeIdx={ACTIVE_CYCLE_IDX} />
        </Stratum>

        <Stratum label="DAYS" count="1 day each">
          <DayDots total={TOTAL_DAYS} todayIdx={TODAY_DAY_OF_VERSION - 1} />
        </Stratum>
      </div>
    </div>
  );
}

function Stratum({
  label,
  count,
  rightMeta,
  children,
}: {
  label: string;
  count: string;
  rightMeta?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2.5 flex items-baseline justify-between gap-3">
        <div className="flex items-baseline gap-2.5">
          <span
            className="font-mono text-[10px] uppercase tracking-[0.22em]"
            style={{ color: FG_MUTED }}
          >
            {label}
          </span>
          <span
            aria-hidden
            className="font-mono text-[10px]"
            style={{ color: FG_SUBTLE }}
          >
            ·
          </span>
          <span
            className="font-mono text-[10px] tabular-nums"
            style={{ color: FG_SUBTLE }}
          >
            {count}
          </span>
        </div>
        {rightMeta ? (
          <span
            className="font-mono text-[10px] tabular-nums"
            style={{ color: FG_MUTED }}
          >
            {rightMeta}
          </span>
        ) : null}
      </div>
      {children}
    </div>
  );
}

function NowLine({ leftPct }: { leftPct: number }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute top-6 bottom-2"
      style={{
        left: `${leftPct}%`,
        width: 1,
        transform: "translateX(-50%)",
        background:
          "repeating-linear-gradient(to bottom, " +
          STRATA_NOW +
          " 0 3px, transparent 3px 6px)",
      }}
    />
  );
}

function VersionTrack({ progressPct }: { progressPct: number }) {
  return (
    <div className="relative h-2">
      <div
        className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full"
        style={{ background: STRATA_TRACK }}
      />
      <div
        className="absolute top-1/2 h-[3px] -translate-y-1/2 rounded-full"
        style={{
          left: 0,
          width: `${progressPct}%`,
          background: STRATA_PAST,
        }}
      />
    </div>
  );
}

function CycleBlocks({
  totalCycles,
  activeIdx,
}: {
  totalCycles: number;
  activeIdx: number;
}) {
  return (
    <div
      className="grid h-2 gap-px"
      style={{
        gridTemplateColumns: `repeat(${totalCycles}, minmax(0, 1fr))`,
      }}
    >
      {Array.from({ length: totalCycles }).map((_, i) => {
        const isActive = i === activeIdx;
        const isPast = i < activeIdx;
        return (
          <div
            key={i}
            className="h-full"
            style={{
              background: isActive
                ? STRATA_ACTIVE
                : isPast
                  ? STRATA_PAST
                  : STRATA_TRACK,
              borderRadius: 2,
            }}
          />
        );
      })}
    </div>
  );
}

function DayDots({
  total,
  todayIdx,
}: {
  total: number;
  todayIdx: number;
}) {
  return (
    <div className="relative h-2.5 w-full">
      {Array.from({ length: total }).map((_, i) => {
        const dayPct = ((i + 0.5) / total) * 100;
        const isToday = i === todayIdx;
        const isPast = i < todayIdx;
        const size = isToday ? 9 : 2;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${dayPct}%`,
              top: "50%",
              width: size,
              height: size,
              transform: "translate(-50%, -50%)",
              borderRadius: "50%",
              background: isToday
                ? FG_STRONG
                : isPast
                  ? STRATA_PAST
                  : STRATA_TRACK,
            }}
          />
        );
      })}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────
   02 — The Daily Score
   features-6: centered heading + visual + 3 micro-cards below.
   ──────────────────────────────────────────────────────────────────── */
function DailyScoreSection() {
  return (
    <section>
      <SectionEyebrow num="02" label="The Daily Score" />

      <div className="mx-auto max-w-2xl text-center">
        <h2
          className="display text-balance leading-[1.1]"
          style={{
            fontSize: "clamp(26px, 2.6vw, 34px)",
            color: FG_STRONG,
          }}
        >
          One number, honestly weighted.
        </h2>
        <p
          className="mt-5 text-[15px] leading-[1.65] md:text-base"
          style={{ color: FG }}
        >
          Every habit carries a weight. Your day rolls up into a single
          number — not a streak count, not a vibe — the share of the
          weight you actually moved.
        </p>
      </div>

      {/* Visual — habit chips → arrow → score */}
      <div
        className="mt-10 rounded-xl border p-6 md:p-10"
        style={{
          background: "rgba(255,255,255,0.015)",
          borderColor: RULE_STRONG,
        }}
      >
        <div className="grid items-center gap-8 md:grid-cols-[1fr_auto_auto]">
          {/* Habit chips column */}
          <div className="space-y-2.5">
            {[
              { name: "Stretch 5 min", w: "LOW", weight: 1, done: true },
              { name: "Deep work 90m", w: "HIGH", weight: 4, done: true },
              { name: "Read 20 pages", w: "MED", weight: 2, done: false },
            ].map((h) => (
              <div
                key={h.name}
                className="flex items-center justify-between gap-3 rounded-md border px-3.5 py-2.5"
                style={{
                  background: h.done
                    ? "rgba(119,183,237,0.04)"
                    : "rgba(255,255,255,0.012)",
                  borderColor: h.done ? `${ACCENT}33` : RULE_STRONG,
                }}
              >
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className="size-2.5 rounded-sm border"
                    style={{
                      background: h.done ? ACCENT : "transparent",
                      borderColor: h.done ? ACCENT : FG_SUBTLE,
                    }}
                  />
                  <span
                    className="text-[13px] md:text-[14px]"
                    style={{
                      color: h.done ? FG_STRONG : FG_MUTED,
                      textDecoration: h.done ? "none" : "none",
                    }}
                  >
                    {h.name}
                  </span>
                </div>
                <span
                  className="font-mono text-[10px] uppercase tracking-[0.16em] tabular-nums"
                  style={{ color: FG_MUTED }}
                >
                  {h.w} · {h.weight}
                </span>
              </div>
            ))}
          </div>

          {/* Arrow */}
          <div
            aria-hidden
            className="hidden items-center justify-center md:flex"
          >
            <ArrowRight
              size={20}
              strokeWidth={1.5}
              style={{ color: FG_SUBTLE }}
            />
          </div>

          {/* Score */}
          <div className="flex flex-col items-center md:items-start">
            <span
              className="font-mono text-[10px] uppercase tracking-[0.22em]"
              style={{ color: FG_MUTED }}
            >
              Daily Score
            </span>
            <span
              className="display mt-2 leading-none tabular-nums"
              style={{
                fontSize: "clamp(56px, 7vw, 88px)",
                color: FG_STRONG,
              }}
            >
              71
            </span>
            <span
              className="mt-2 font-mono text-[11px] tabular-nums"
              style={{ color: FG_MUTED }}
            >
              5 of 7 weight
            </span>
          </div>
        </div>

        {/* Formula */}
        <div
          className="mt-8 border-t pt-5 text-center"
          style={{ borderColor: RULE_STRONG }}
        >
          <code
            className="font-mono text-[12px] md:text-[13px]"
            style={{ color: FG_MUTED }}
          >
            score = round(completedWeight / totalWeight × 100)
          </code>
        </div>
      </div>

      {/* Three micro-cards — the weight scale */}
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          {
            w: "LOW",
            n: "1",
            ex: "5-minute stretch · 1-glass of water",
            body: "Frictionless. Cheap to maintain, easy to lose.",
          },
          {
            w: "MEDIUM",
            n: "2",
            ex: "20-minute read · 30-minute walk",
            body: "Repeatable. The middle of the habit stack.",
          },
          {
            w: "HIGH",
            n: "4",
            ex: "90-minute deep work · long training session",
            body: "Costly. The work that actually moves the cycle.",
          },
        ].map((c) => (
          <div
            key={c.w}
            className="rounded-lg border p-5"
            style={{
              background: "rgba(255,255,255,0.015)",
              borderColor: RULE_STRONG,
            }}
          >
            <div className="flex items-baseline justify-between">
              <span
                className="font-mono text-[11px] uppercase tracking-[0.22em]"
                style={{ color: FG_MUTED }}
              >
                {c.w}
              </span>
              <span
                className="font-mono text-[20px] tabular-nums leading-none"
                style={{ color: FG_STRONG }}
              >
                ×{c.n}
              </span>
            </div>
            <p
              className="mt-3 text-[13px] leading-[1.55]"
              style={{ color: FG }}
            >
              {c.body}
            </p>
            <p
              className="mt-2 font-mono text-[11px]"
              style={{ color: FG_SUBTLE }}
            >
              {c.ex}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────
   03 — The Pulse Loop
   QA-1: left intro + right collapsible accordion (native <details>).
   ──────────────────────────────────────────────────────────────────── */
function PulseLoopSection() {
  return (
    <section>
      <SectionEyebrow num="03" label="The Pulse Loop" />

      <div className="grid gap-10 md:grid-cols-[1fr_1.3fr] md:gap-14">
        {/* LEFT — intro */}
        <div className="md:sticky md:top-32 md:self-start">
          <h2
            className="display text-balance leading-[1.1]"
            style={{
              fontSize: "clamp(26px, 2.6vw, 34px)",
              color: FG_STRONG,
            }}
          >
            Twice a day.
          </h2>
          <p
            className="mt-5 text-[15px] leading-[1.65] md:text-base"
            style={{ color: FG }}
          >
            Morning frames intent. Evening logs reality. The gap between
            the two is where the signal lives.
          </p>
          <p
            className="mt-4 text-[14px] leading-[1.6]"
            style={{ color: FG_MUTED }}
          >
            Two short check-ins build the dataset the rest of the system
            reads from.
          </p>
        </div>

        {/* RIGHT — accordion */}
        <div className="space-y-3">
          {/* MORNING */}
          <details
            className="group rounded-lg border [&_summary::-webkit-details-marker]:hidden"
            style={{
              background: "rgba(255,255,255,0.015)",
              borderColor: RULE_STRONG,
            }}
            open
          >
            <summary className="flex min-h-[56px] cursor-pointer items-center justify-between gap-4 px-5 py-4">
              <div className="flex items-center gap-3">
                <Sun
                  size={16}
                  strokeWidth={1.5}
                  style={{ color: ACCENT_LIGHT }}
                />
                <span
                  className="text-[14px] font-semibold md:text-[15px]"
                  style={{ color: FG_STRONG }}
                >
                  Morning check-in
                </span>
              </div>
              <span
                aria-hidden
                className="font-mono text-[18px] leading-none transition-transform duration-200 group-open:rotate-45"
                style={{ color: FG_SUBTLE }}
              >
                +
              </span>
            </summary>
            <div
              className="border-t px-5 pb-5 pt-4"
              style={{ borderColor: RULE_STRONG }}
            >
              <p
                className="text-[13px] leading-[1.6] md:text-[14px]"
                style={{ color: FG }}
              >
                Four short steps. Each one calibrates the day before the
                day begins.
              </p>
              <ul className="mt-4 space-y-2">
                {[
                  {
                    k: "Mood",
                    v: "Where you are right now, on a calm scale.",
                  },
                  {
                    k: "Sleep",
                    v: "Quality of the night that just ended.",
                  },
                  {
                    k: "Feelings",
                    v: "What's actually present — pick from a bank of named emotions.",
                  },
                  {
                    k: "Focus",
                    v: "The one thing you want today to be about.",
                  },
                ].map((s) => (
                  <li
                    key={s.k}
                    className="grid grid-cols-[88px_1fr] gap-3 text-[13px] leading-[1.55]"
                  >
                    <span
                      className="font-mono text-[11px] uppercase tracking-[0.18em] pt-[2px]"
                      style={{ color: FG_MUTED }}
                    >
                      {s.k}
                    </span>
                    <span style={{ color: FG }}>{s.v}</span>
                  </li>
                ))}
              </ul>
            </div>
          </details>

          {/* EVENING */}
          <details
            className="group rounded-lg border [&_summary::-webkit-details-marker]:hidden"
            style={{
              background: "rgba(255,255,255,0.015)",
              borderColor: RULE_STRONG,
            }}
          >
            <summary className="flex min-h-[56px] cursor-pointer items-center justify-between gap-4 px-5 py-4">
              <div className="flex items-center gap-3">
                <Moon
                  size={16}
                  strokeWidth={1.5}
                  style={{ color: ACCENT_LIGHT }}
                />
                <span
                  className="text-[14px] font-semibold md:text-[15px]"
                  style={{ color: FG_STRONG }}
                >
                  Evening check-in
                </span>
              </div>
              <span
                aria-hidden
                className="font-mono text-[18px] leading-none transition-transform duration-200 group-open:rotate-45"
                style={{ color: FG_SUBTLE }}
              >
                +
              </span>
            </summary>
            <div
              className="border-t px-5 pb-5 pt-4"
              style={{ borderColor: RULE_STRONG }}
            >
              <p
                className="text-[13px] leading-[1.6] md:text-[14px]"
                style={{ color: FG }}
              >
                Eight short steps. The evening pass is denser because the
                evening has the data.
              </p>
              <ul className="mt-4 space-y-2">
                {[
                  { k: "Mood", v: "Where you landed after the day's work." },
                  { k: "Productivity", v: "How much of the day actually compounded." },
                  { k: "Stress", v: "Load you carried, not the load you planned." },
                  { k: "Motivation", v: "Pull toward the work, or against it." },
                  { k: "Energy", v: "Biological state at sundown." },
                  { k: "Connectedness", v: "Time spent in the people who matter." },
                  { k: "Feelings", v: "Named emotions from the same bank as morning." },
                  { k: "Activities", v: "What you actually did — for the trend layer to read." },
                ].map((s) => (
                  <li
                    key={s.k}
                    className="grid grid-cols-[110px_1fr] gap-3 text-[13px] leading-[1.55]"
                  >
                    <span
                      className="font-mono text-[11px] uppercase tracking-[0.18em] pt-[2px]"
                      style={{ color: FG_MUTED }}
                    >
                      {s.k}
                    </span>
                    <span style={{ color: FG }}>{s.v}</span>
                  </li>
                ))}
              </ul>
            </div>
          </details>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────
   04 — Habits & Goals
   features-5: two parallel concepts side-by-side + carry-over anchor.
   ──────────────────────────────────────────────────────────────────── */
function HabitsAndGoalsSection() {
  return (
    <section>
      <SectionEyebrow num="04" label="Habits & Goals" />

      <div className="mb-10 max-w-2xl">
        <h2
          className="display text-balance leading-[1.1]"
          style={{
            fontSize: "clamp(26px, 2.6vw, 34px)",
            color: FG_STRONG,
          }}
        >
          Two primitives. Different time scales.
        </h2>
        <p
          className="mt-5 text-[15px] leading-[1.65] md:text-base"
          style={{ color: FG }}
        >
          Habits are the daily atoms. Goals are the cycle-scoped
          outcomes. Together they cover both ends of the practice.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {/* HABITS */}
        <div
          className="rounded-xl border p-6 md:p-7"
          style={{
            background: "rgba(255,255,255,0.015)",
            borderColor: RULE_STRONG,
          }}
        >
          <div className="flex items-baseline justify-between">
            <h3
              className="display leading-none"
              style={{ fontSize: "20px", color: FG_STRONG }}
            >
              Habits
            </h3>
            <span
              className="font-mono text-[10px] uppercase tracking-[0.22em]"
              style={{ color: FG_MUTED }}
            >
              Daily
            </span>
          </div>
          <p
            className="mt-4 text-[14px] leading-[1.6]"
            style={{ color: FG }}
          >
            Weighted recurring actions. They feed the daily score and the
            consistency layer beneath it.
          </p>
          <ul className="mt-5 space-y-2.5">
            {[
              "Three weight tiers — LOW (1), MEDIUM (2), HIGH (4).",
              "Recurrence configured per habit, not assumed.",
              "Don't auto-carry between cycles — deliberate by design.",
            ].map((line) => (
              <li
                key={line}
                className="flex items-start gap-2.5 text-[13px] leading-[1.55] md:text-[14px]"
                style={{ color: FG }}
              >
                <span
                  aria-hidden
                  className="mt-[8px] h-px w-2.5 shrink-0"
                  style={{ background: FG_SUBTLE }}
                />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* GOALS */}
        <div
          className="rounded-xl border p-6 md:p-7"
          style={{
            background: "rgba(255,255,255,0.015)",
            borderColor: RULE_STRONG,
          }}
        >
          <div className="flex items-baseline justify-between">
            <h3
              className="display leading-none"
              style={{ fontSize: "20px", color: FG_STRONG }}
            >
              Goals
            </h3>
            <span
              className="font-mono text-[10px] uppercase tracking-[0.22em]"
              style={{ color: FG_MUTED }}
            >
              Cycle
            </span>
          </div>
          <p
            className="mt-4 text-[14px] leading-[1.6]"
            style={{ color: FG }}
          >
            Outcomes you commit to inside a 15-day window. Two kinds, each
            with its own definition of done.
          </p>
          <ul className="mt-5 space-y-2.5">
            {[
              "task_project — bounded scope, finished or not.",
              "consistency_metric — a rate you hold across the cycle.",
              "Carry across cycles via lineage — same goal, multiple cycles.",
            ].map((line) => (
              <li
                key={line}
                className="flex items-start gap-2.5 text-[13px] leading-[1.55] md:text-[14px]"
                style={{ color: FG }}
              >
                <span
                  aria-hidden
                  className="mt-[8px] h-px w-2.5 shrink-0"
                  style={{ background: FG_SUBTLE }}
                />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Carry-over anchor */}
      <div
        className="mt-8 rounded-lg border px-5 py-4"
        style={{
          background: "rgba(119,183,237,0.04)",
          borderColor: `${ACCENT}33`,
        }}
      >
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
          <span
            className="font-mono text-[10px] uppercase tracking-[0.22em]"
            style={{ color: ACCENT_LIGHT }}
          >
            Carry-over
          </span>
          <span
            className="text-[13px] leading-[1.55] md:text-[14px]"
            style={{ color: FG }}
          >
            Goals can travel across cycles via a lineage link — same
            journey, multiple sprints. Habits start fresh each cycle, by
            choice.
          </span>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────
   05 — Trends & Insights
   features-6: centered heading + visual + 4 micro-cards (one per
   pattern detector).
   ──────────────────────────────────────────────────────────────────── */
function TrendsInsightsSection() {
  return (
    <section>
      <SectionEyebrow num="05" label="Trends & Insights" />

      <div className="mx-auto max-w-2xl text-center">
        <h2
          className="display text-balance leading-[1.1]"
          style={{
            fontSize: "clamp(26px, 2.6vw, 34px)",
            color: FG_STRONG,
          }}
        >
          The system reads the data you generate.
        </h2>
        <p
          className="mt-5 text-[15px] leading-[1.65] md:text-base"
          style={{ color: FG }}
        >
          A correlation engine and a set of pattern detectors look for
          repeating signals across your habits, vitals, and feelings —
          then write them up plainly.
        </p>
      </div>

      {/* Visual — single annotated insight card */}
      <div
        className="mx-auto mt-10 max-w-2xl rounded-xl border p-6 md:p-7"
        style={{
          background: "rgba(255,255,255,0.015)",
          borderColor: RULE_STRONG,
        }}
      >
        <div className="flex items-start gap-3">
          <span
            aria-hidden
            className="mt-[6px] size-2.5 shrink-0 rounded-full"
            style={{ background: FG_STRONG }}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline justify-between gap-3">
              <p
                className="text-[14px] font-semibold leading-[1.3] md:text-[15px]"
                style={{ color: FG_STRONG }}
              >
                Sleep quality → next-day mood
              </p>
              <span
                className="font-mono text-[13px] tabular-nums"
                style={{ color: FG_STRONG }}
              >
                ↑ 24%
              </span>
            </div>
            <p
              className="mt-1.5 text-[12px] leading-[1.5] md:text-[13px]"
              style={{ color: FG_MUTED }}
            >
              Nights you sleep above your median predict a higher mood
              the morning after. Strong, repeated across the last two
              cycles.
            </p>
            <div className="mt-3 flex items-center gap-3">
              <span
                className="font-mono text-[9.5px] uppercase tracking-[0.18em] rounded px-1.5 py-[2px]"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  color: FG_STRONG,
                }}
              >
                Correlation
              </span>
              <span
                className="font-mono text-[10px] tabular-nums"
                style={{ color: FG_SUBTLE }}
              >
                lag · 1 day
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Pattern detectors — 4 micro-cards */}
      <div className="mt-8">
        <div className="mb-4 flex items-center gap-3">
          <span
            className="font-mono text-[10px] uppercase tracking-[0.22em]"
            style={{ color: FG_MUTED }}
          >
            Pattern detectors
          </span>
          <div
            aria-hidden
            className="h-px flex-1"
            style={{ background: RULE }}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              name: "Burnout",
              body: "Energy drops sharply over three days against a two-week baseline.",
            },
            {
              name: "Regression",
              body: "A habit you held for a week or more has dropped to zero for three days running.",
            },
            {
              name: "Weekday Blind Spot",
              body: "A habit you nail most days collapses on a single day of the week.",
            },
            {
              name: "Sleep Lag",
              body: "A night of low sleep predicts a measurable drop in next-day performance.",
            },
          ].map((p) => (
            <div
              key={p.name}
              className="rounded-lg border p-5"
              style={{
                background: "rgba(255,255,255,0.015)",
                borderColor: RULE_STRONG,
              }}
            >
              <span
                className="font-mono text-[10px] uppercase tracking-[0.22em]"
                style={{ color: FG_MUTED }}
              >
                Detector
              </span>
              <h4
                className="mt-2 text-[14px] font-semibold leading-[1.25] md:text-[15px]"
                style={{ color: FG_STRONG }}
              >
                {p.name}
              </h4>
              <p
                className="mt-2 text-[12px] leading-[1.55] md:text-[13px]"
                style={{ color: FG }}
              >
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────
   Page
   ──────────────────────────────────────────────────────────────────── */
export default function MethodologyPage() {
  return (
    <div
      className="relative min-h-screen w-full"
      style={{ background: SECTION_BG }}
    >
      {/* Atmospheric top-light radial — matches changelog / manifesto */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[700px]"
        style={{
          background: `radial-gradient(ellipse 60% 80% at 50% 0%, ${ACCENT}14, transparent 65%)`,
        }}
      />

      <Navbar />

      <main className="relative z-10 mx-auto w-full max-w-5xl px-6 pt-28 pb-24 md:pt-36 md:px-8">
        {/* Hero */}
        <header className="mb-14 md:mb-20">
          <h1
            className="display text-balance leading-[1.05]"
            style={{
              fontSize: "clamp(42px, 4.2vw, 58px)",
              color: FG_STRONG,
            }}
          >
            How El Portal works.
          </h1>
          <p
            className="mt-5 max-w-2xl text-[15px] leading-[1.6] md:text-base"
            style={{ color: FG }}
          >
            A method, not a vibe. Five mechanics, layered. The system
            reads, organizes, and surfaces signal — you stay focused on
            the work that earns it.
          </p>
        </header>

        {/* 5 method sections — hairline dividers between */}
        <div className="space-y-20 md:space-y-28">
          <TemporalHierarchySection />

          <div
            aria-hidden
            className="h-px"
            style={{ background: RULE }}
          />
          <DailyScoreSection />

          <div
            aria-hidden
            className="h-px"
            style={{ background: RULE }}
          />
          <PulseLoopSection />

          <div
            aria-hidden
            className="h-px"
            style={{ background: RULE }}
          />
          <HabitsAndGoalsSection />

          <div
            aria-hidden
            className="h-px"
            style={{ background: RULE }}
          />
          <TrendsInsightsSection />
        </div>

        {/* Closing — subtle link back to manifesto */}
        <footer
          className="mt-24 border-t pt-10 md:mt-32"
          style={{ borderColor: RULE_STRONG }}
        >
          <p
            className="max-w-2xl text-[14px] leading-[1.65] md:text-[15px]"
            style={{ color: FG_MUTED }}
          >
            The method is the floor — the convictions underneath it are
            what make it worth running.
          </p>
          <Link
            href="/manifesto"
            className="group mt-4 inline-flex items-center gap-1.5 text-[14px] md:text-[15px] transition-colors"
            style={{ color: ACCENT_LIGHT }}
          >
            Read the manifesto
            <ArrowRight
              size={15}
              strokeWidth={1.5}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Link>
        </footer>
      </main>

      <Footer />
    </div>
  );
}
