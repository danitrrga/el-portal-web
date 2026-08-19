// Internal link only — locale-aware Link (see src/i18n/navigation.ts), never
// next/link.
import { Link } from "@/i18n/navigation";
import { setRequestLocale } from "next-intl/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, Sun, Moon } from "lucide-react";
import { buildPageMetadata } from "@/lib/seo";

const SECTION_BG = "var(--color-ep-section-bg)";
const FG_STRONG = "var(--color-ep-fg-strong)";
const FG = "var(--color-ep-fg)";
const FG_MUTED = "var(--color-ep-fg-muted-2)";
// Foreground ramp is intentionally THREE steps on this surface, not four.
// The AA contrast remediation in phase 05 pointed the old `FG_SUBTLE`
// (`#5a6478`, 3.40:1 on `#04060c`) at `--color-ep-fg-muted-2` (`#8590a8`,
// 6.32:1) — the exact value `FG_MUTED` already held. Keeping both names would
// be a constant that lies: every FG_SUBTLE-vs-FG_MUTED distinction rendered
// identically. `FG_SUBTLE` is therefore removed rather than left as a dead
// alias. Restoring a real fourth step needs a new AA-clearing token
// (`--color-ep-fg-subtle-2` = `#5a6478` does not clear AA) — a design decision,
// not a mechanical one.
// ACCENT / ACCENT_LIGHT deliberately stay raw hex. They are consumed as
// hex-alpha template literals (`${ACCENT}14`, `${ACCENT_LIGHT}4d`, ...), and
// `var(--color-ep-accent)14` is invalid CSS — the swap would silently drop the
// declaration. The project convention (01-02-PLAN.md) is a pre-baked alpha
// token per opacity; only `--color-ep-accent-alpha-12/-08` and
// `--color-ep-accent-light-alpha-80` exist today, and these files need five
// more (33, 66, 4d, 40, 59). Minting design tokens is a design decision, so
// this is logged as debt in deferred-items.md rather than guessed at here.
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
        style={{ color: FG_MUTED }}
      >
        {num}
      </span>
      <span
        aria-hidden
        className="font-mono text-[10px]"
        style={{ color: FG_MUTED }}
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
   Single-column flow: header + intro at top (full width), then an
   asymmetric 3-card definition grid (Version full-width row, Cycle +
   Day equal columns below). Layout itself encodes containment.
   ──────────────────────────────────────────────────────────────────── */

type Scale = {
  name: "Version" | "Cycle" | "Day";
  duration: string;
  isDefault: boolean;
  role: string;
  bullets: string[];
};

const SCALES: Scale[] = [
  {
    name: "Version",
    duration: "~90 days",
    isDefault: true,
    role: "The arc, representing who you're becoming.",
    bullets: [
      "Sets the direction.",
      "Contains its cycles.",
      "Months long, forming a multi-month identity arc.",
    ],
  },
  {
    name: "Cycle",
    duration: "~15 days",
    isDefault: true,
    role: "The sprint, defining what to work on now.",
    bullets: [
      "Inside a Version.",
      "Focused execution toward the arc.",
      "Weeks long, short enough to actually finish.",
    ],
  },
  {
    name: "Day",
    duration: "1 day",
    isDefault: false,
    role: "The reps, the only scale you actually live in.",
    bullets: [
      "Inside a Cycle.",
      "Atomic, with one set of habits and one score.",
      "Where everything compounds from.",
    ],
  },
];

function ScaleTextContent({ scale }: { scale: Scale }) {
  return (
    <div className="flex flex-col">
      {/* Scale Header */}
      <div className="flex items-baseline justify-between gap-3 border-b pb-3 mb-4" style={{ borderColor: RULE }}>
        <h3
          className="font-mono text-[11px] font-normal uppercase tracking-[0.22em]"
          style={{ color: FG_MUTED }}
        >
          {scale.name}
        </h3>
        <span className="font-mono text-xs">
          <span style={{ color: FG_STRONG }}>{scale.duration}</span>
          {scale.isDefault && (
            <span style={{ color: FG_MUTED }}> · default</span>
          )}
        </span>
      </div>
      
      {/* Role / Description */}
      <p
        className="text-[15px] font-medium leading-[1.5] mb-4"
        style={{ color: FG_STRONG }}
      >
        {scale.role}
      </p>

      {/* Bullets */}
      <ul className="space-y-2.5 text-[14px] leading-[1.6]" style={{ color: FG }}>
        {scale.bullets.map((b) => (
          <li key={b} className="flex items-start gap-2.5">
            <span aria-hidden style={{ color: FG_MUTED }}>
              —
            </span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TemporalHierarchySection() {
  return (
    <section>
      <SectionEyebrow num="01" label="Temporal Hierarchy" />

      <div className="flex flex-col gap-10 md:gap-14">
        {/* Header — full content width */}
        <div className="max-w-2xl">
          <h2
            className="display text-balance leading-[1.1] text-[clamp(1.25rem,1.339vw+0.982rem,1.625rem)] md:text-[clamp(26px,2.6vw,34px)]"
            style={{
              color: FG_STRONG,
            }}
          >
            Version, Cycle, Day.
          </h2>
        </div>

        {/* Clean typographic grid without card chrome — just text and layout */}
        <div className="grid gap-8 md:grid-cols-3 md:gap-12">
          <ScaleTextContent scale={SCALES[0]} />
          <ScaleTextContent scale={SCALES[1]} />
          <ScaleTextContent scale={SCALES[2]} />
        </div>
      </div>
    </section>
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
          className="display text-balance leading-[1.1] text-[clamp(1.25rem,1.339vw+0.982rem,1.625rem)] md:text-[clamp(26px,2.6vw,34px)]"
          style={{
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
          number, not a streak count or a vibe, representing the share of the
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
                      borderColor: h.done ? ACCENT : FG_MUTED,
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
              style={{ color: FG_MUTED }}
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
              className="display mt-2 leading-none tabular-nums text-[clamp(2rem,5.357vw+0.929rem,3.5rem)] md:text-[clamp(56px,7vw,88px)]"
              style={{
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
              style={{ color: FG_MUTED }}
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
            className="display text-balance leading-[1.1] text-[clamp(1.25rem,1.339vw+0.982rem,1.625rem)] md:text-[clamp(26px,2.6vw,34px)]"
            style={{
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
                style={{ color: FG_MUTED }}
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
                    v: "What's actually present, selected from a bank of named emotions.",
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
                style={{ color: FG_MUTED }}
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
          className="display text-balance leading-[1.1] text-[clamp(1.25rem,1.339vw+0.982rem,1.625rem)] md:text-[clamp(26px,2.6vw,34px)]"
          style={{
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

      <div className="grid gap-10 md:grid-cols-2 md:gap-14">
        {/* HABITS */}
        <div className="flex flex-col">
          <div className="flex items-baseline justify-between border-b pb-3 mb-4" style={{ borderColor: RULE }}>
            <h3
              className="display leading-none text-[clamp(1.063rem,0.67vw+0.929rem,1.25rem)] md:text-[20px]"
              style={{ color: FG_STRONG }}
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
            className="text-[14px] leading-[1.6] mb-4"
            style={{ color: FG }}
          >
            Weighted recurring actions. They feed the daily score and the
            consistency layer beneath it.
          </p>
          <ul className="space-y-2.5">
            {[
              "Three weight tiers: LOW (1), MEDIUM (2), and HIGH (4).",
              "Recurrence configured per habit, not assumed.",
              "Don't auto-carry between cycles, remaining deliberate by design.",
            ].map((line) => (
              <li
                key={line}
                className="flex items-start gap-2.5 text-[13px] leading-[1.55] md:text-[14px]"
                style={{ color: FG }}
              >
                <span
                  aria-hidden
                  className="mt-[8px] h-px w-2.5 shrink-0"
                  style={{ background: FG_MUTED }}
                />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* GOALS */}
        <div className="flex flex-col">
          <div className="flex items-baseline justify-between border-b pb-3 mb-4" style={{ borderColor: RULE }}>
            <h3
              className="display leading-none text-[clamp(1.063rem,0.67vw+0.929rem,1.25rem)] md:text-[20px]"
              style={{ color: FG_STRONG }}
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
            className="text-[14px] leading-[1.6] mb-4"
            style={{ color: FG }}
          >
            Outcomes you commit to inside a 15-day window. Two kinds, each
            with its own definition of done.
          </p>
          <ul className="space-y-2.5">
            {[
              "task_project, with bounded scope, finished or not.",
              "consistency_metric, representing a rate you hold across the cycle.",
              "Carry across cycles via lineage, keeping the same goal across multiple cycles.",
            ].map((line) => (
              <li
                key={line}
                className="flex items-start gap-2.5 text-[13px] leading-[1.55] md:text-[14px]"
                style={{ color: FG }}
              >
                <span
                  aria-hidden
                  className="mt-[8px] h-px w-2.5 shrink-0"
                  style={{ background: FG_MUTED }}
                />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Carry-over callout */}
      <div
        className="mt-10 border-l-2 pl-4 py-1"
        style={{
          borderColor: `${ACCENT}66`,
        }}
      >
        <div className="flex flex-col gap-1.5 md:flex-row md:items-baseline md:gap-3">
          <span
            className="font-mono text-[10px] uppercase tracking-[0.22em] font-medium shrink-0"
            style={{ color: ACCENT_LIGHT }}
          >
            Carry-over
          </span>
          <p
            className="text-[13px] leading-[1.55] md:text-[14px]"
            style={{ color: FG }}
          >
            Goals can travel across cycles via a lineage link, keeping the same
            journey across multiple sprints. Habits start fresh each cycle, by
            choice.
          </p>
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
          className="display text-balance leading-[1.1] text-[clamp(1.25rem,1.339vw+0.982rem,1.625rem)] md:text-[clamp(26px,2.6vw,34px)]"
          style={{
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
          repeating signals across your habits, vitals, and feelings,
          writing them up plainly.
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
                style={{ color: FG_MUTED }}
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
              <h3
                className="mt-2 text-[14px] font-semibold leading-[1.25] md:text-[15px]"
                style={{ color: FG_STRONG }}
              >
                {p.name}
              </h3>
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
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildPageMetadata(locale, "features");
}

export default async function MethodologyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div
      className="relative min-h-viewport w-full"
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
            className="display text-balance leading-[1.05] text-[clamp(1.625rem,3.571vw+0.911rem,2.625rem)] md:text-[clamp(42px,4.2vw,58px)]"
            style={{
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
            reads, organizes, and surfaces signal, leaving you to stay focused on
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
            The method is the floor, and the convictions underneath it are
            what make it worth running.
          </p>
          <Link
            href="/manifesto"
            className="group mt-4 inline-flex items-center gap-1.5 text-[14px] md:text-[15px] transition-colors min-h-11 md:min-h-0"
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
