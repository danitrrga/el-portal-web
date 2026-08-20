// Internal link only — locale-aware Link (see src/i18n/navigation.ts), never
// next/link.
import { Link } from "@/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
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

/**
 * Return type of `getTranslations("features")` — threaded through every
 * section helper below that needs a catalogue lookup. These are plain
 * functions, not Server Components, so `t` is fetched once in the page and
 * passed down rather than re-fetched per section (mirrors `mcp/page.tsx`'s
 * `Translator` convention).
 */
type Translator = Awaited<ReturnType<typeof getTranslations>>;

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
  name: string;
  duration: string;
  isDefault: boolean;
  role: string;
  bullets: string[];
};

function ScaleTextContent({
  scale,
  defaultLabel,
}: {
  scale: Scale;
  defaultLabel: string;
}) {
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
            <span style={{ color: FG_MUTED }}> · {defaultLabel}</span>
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

function TemporalHierarchySection({ t }: { t: Translator }) {
  const scales = t.raw("scales") as Scale[];
  const defaultLabel = t("temporalHierarchy.defaultLabel");

  return (
    <section>
      <SectionEyebrow num="01" label={t("temporalHierarchy.eyebrow")} />

      <div className="flex flex-col gap-10 md:gap-14">
        {/* Header — full content width */}
        <div className="max-w-2xl">
          <h2
            className="display text-balance leading-[1.1] text-[clamp(1.25rem,1.339vw+0.982rem,1.625rem)] md:text-[clamp(26px,2.6vw,34px)]"
            style={{
              color: FG_STRONG,
            }}
          >
            {t("temporalHierarchy.heading")}
          </h2>
        </div>

        {/* Clean typographic grid without card chrome — just text and layout */}
        <div className="grid gap-8 md:grid-cols-3 md:gap-12">
          <ScaleTextContent scale={scales[0]} defaultLabel={defaultLabel} />
          <ScaleTextContent scale={scales[1]} defaultLabel={defaultLabel} />
          <ScaleTextContent scale={scales[2]} defaultLabel={defaultLabel} />
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────
   02 — The Daily Score
   features-6: centered heading + visual + 3 micro-cards below.
   ──────────────────────────────────────────────────────────────────── */

type HabitChip = { name: string; weightLabel: string };
type WeightTier = { weightLabel: string; example: string; body: string };

// Weight numbers and the demo `done` state are illustrative UI data, not
// text — they cannot legitimately differ between locales, so they stay in
// code, index-aligned with the catalogue's `dailyScore.habitChips` array.
const HABIT_CHIP_META: { weight: number; done: boolean }[] = [
  { weight: 1, done: true },
  { weight: 4, done: true },
  { weight: 2, done: false },
];

// Multiplier digits (×1 / ×2 / ×4) are illustrative UI data, not text —
// index-aligned with the catalogue's `dailyScore.weightTiers` array.
const WEIGHT_TIER_MULTIPLIERS = ["1", "2", "4"];

function DailyScoreSection({ t }: { t: Translator }) {
  const habitChips = t.raw("dailyScore.habitChips") as HabitChip[];
  const weightTiers = t.raw("dailyScore.weightTiers") as WeightTier[];

  return (
    <section>
      <SectionEyebrow num="02" label={t("dailyScore.eyebrow")} />

      <div className="mx-auto max-w-2xl text-center">
        <h2
          className="display text-balance leading-[1.1] text-[clamp(1.25rem,1.339vw+0.982rem,1.625rem)] md:text-[clamp(26px,2.6vw,34px)]"
          style={{
            color: FG_STRONG,
          }}
        >
          {t("dailyScore.heading")}
        </h2>
        <p
          className="mt-5 text-[15px] leading-[1.65] md:text-base"
          style={{ color: FG }}
        >
          {t("dailyScore.body")}
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
            {habitChips.map((h, i) => {
              const meta = HABIT_CHIP_META[i];
              return (
                <div
                  key={h.name}
                  className="flex items-center justify-between gap-3 rounded-md border px-3.5 py-2.5"
                  style={{
                    background: meta.done
                      ? "rgba(119,183,237,0.04)"
                      : "rgba(255,255,255,0.012)",
                    borderColor: meta.done ? `${ACCENT}33` : RULE_STRONG,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden
                      className="size-2.5 rounded-sm border"
                      style={{
                        background: meta.done ? ACCENT : "transparent",
                        borderColor: meta.done ? ACCENT : FG_MUTED,
                      }}
                    />
                    <span
                      className="text-[13px] md:text-[14px]"
                      style={{
                        color: meta.done ? FG_STRONG : FG_MUTED,
                        textDecoration: meta.done ? "none" : "none",
                      }}
                    >
                      {h.name}
                    </span>
                  </div>
                  <span
                    className="font-mono text-[10px] uppercase tracking-[0.16em] tabular-nums"
                    style={{ color: FG_MUTED }}
                  >
                    {h.weightLabel} · {meta.weight}
                  </span>
                </div>
              );
            })}
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
              {t("dailyScore.scoreLabel")}
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
              {t("dailyScore.scoreSubtext")}
            </span>
          </div>
        </div>
      </div>

      {/* Three micro-cards — the weight scale */}
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {weightTiers.map((c, i) => (
          <div
            key={c.weightLabel}
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
                {c.weightLabel}
              </span>
              <span
                className="font-mono text-[20px] tabular-nums leading-none"
                style={{ color: FG_STRONG }}
              >
                ×{WEIGHT_TIER_MULTIPLIERS[i]}
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
              {c.example}
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

type PulseStep = { label: string; body: string };

function PulseLoopSection({ t }: { t: Translator }) {
  const morningSteps = t.raw("pulseLoop.morning.steps") as PulseStep[];
  const eveningSteps = t.raw("pulseLoop.evening.steps") as PulseStep[];

  return (
    <section>
      <SectionEyebrow num="03" label={t("pulseLoop.eyebrow")} />

      <div className="grid gap-10 md:grid-cols-[1fr_1.3fr] md:gap-14">
        {/* LEFT — intro */}
        <div className="md:sticky md:top-32 md:self-start">
          <h2
            className="display text-balance leading-[1.1] text-[clamp(1.25rem,1.339vw+0.982rem,1.625rem)] md:text-[clamp(26px,2.6vw,34px)]"
            style={{
              color: FG_STRONG,
            }}
          >
            {t("pulseLoop.heading")}
          </h2>
          <p
            className="mt-5 text-[15px] leading-[1.65] md:text-base"
            style={{ color: FG }}
          >
            {t("pulseLoop.body")}
          </p>
          <p
            className="mt-4 text-[14px] leading-[1.6]"
            style={{ color: FG_MUTED }}
          >
            {t("pulseLoop.subBody")}
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
                  {t("pulseLoop.morning.label")}
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
                {t("pulseLoop.morning.intro")}
              </p>
              <ul className="mt-4 space-y-2">
                {morningSteps.map((s) => (
                  <li
                    key={s.label}
                    className="grid grid-cols-[88px_1fr] gap-3 text-[13px] leading-[1.55]"
                  >
                    <span
                      className="font-mono text-[11px] uppercase tracking-[0.18em] pt-[2px]"
                      style={{ color: FG_MUTED }}
                    >
                      {s.label}
                    </span>
                    <span style={{ color: FG }}>{s.body}</span>
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
                  {t("pulseLoop.evening.label")}
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
                {t("pulseLoop.evening.intro")}
              </p>
              <ul className="mt-4 space-y-2">
                {eveningSteps.map((s) => (
                  <li
                    key={s.label}
                    className="grid grid-cols-[110px_1fr] gap-3 text-[13px] leading-[1.55]"
                  >
                    <span
                      className="font-mono text-[11px] uppercase tracking-[0.18em] pt-[2px]"
                      style={{ color: FG_MUTED }}
                    >
                      {s.label}
                    </span>
                    <span style={{ color: FG }}>{s.body}</span>
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
function HabitsAndGoalsSection({ t }: { t: Translator }) {
  const habitsBullets = t.raw("habitsAndGoals.habits.bullets") as string[];
  const goalsBullets = t.raw("habitsAndGoals.goals.bullets") as string[];

  return (
    <section>
      <SectionEyebrow num="04" label={t("habitsAndGoals.eyebrow")} />

      <div className="mb-10 max-w-2xl">
        <h2
          className="display text-balance leading-[1.1] text-[clamp(1.25rem,1.339vw+0.982rem,1.625rem)] md:text-[clamp(26px,2.6vw,34px)]"
          style={{
            color: FG_STRONG,
          }}
        >
          {t("habitsAndGoals.heading")}
        </h2>
        <p
          className="mt-5 text-[15px] leading-[1.65] md:text-base"
          style={{ color: FG }}
        >
          {t("habitsAndGoals.body")}
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
              {t("habitsAndGoals.habits.heading")}
            </h3>
            <span
              className="font-mono text-[10px] uppercase tracking-[0.22em]"
              style={{ color: FG_MUTED }}
            >
              {t("habitsAndGoals.habits.scopeLabel")}
            </span>
          </div>
          <p
            className="text-[14px] leading-[1.6] mb-4"
            style={{ color: FG }}
          >
            {t("habitsAndGoals.habits.body")}
          </p>
          <ul className="space-y-2.5">
            {habitsBullets.map((line) => (
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
              {t("habitsAndGoals.goals.heading")}
            </h3>
            <span
              className="font-mono text-[10px] uppercase tracking-[0.22em]"
              style={{ color: FG_MUTED }}
            >
              {t("habitsAndGoals.goals.scopeLabel")}
            </span>
          </div>
          <p
            className="text-[14px] leading-[1.6] mb-4"
            style={{ color: FG }}
          >
            {t("habitsAndGoals.goals.body")}
          </p>
          <ul className="space-y-2.5">
            {goalsBullets.map((line) => (
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
            {t("habitsAndGoals.carryOver.label")}
          </span>
          <p
            className="text-[13px] leading-[1.55] md:text-[14px]"
            style={{ color: FG }}
          >
            {t("habitsAndGoals.carryOver.body")}
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

type Detector = { name: string; body: string };

function TrendsInsightsSection({ t }: { t: Translator }) {
  const detectors = t.raw("trendsInsights.detectors") as Detector[];

  return (
    <section>
      <SectionEyebrow num="05" label={t("trendsInsights.eyebrow")} />

      <div className="mx-auto max-w-2xl text-center">
        <h2
          className="display text-balance leading-[1.1] text-[clamp(1.25rem,1.339vw+0.982rem,1.625rem)] md:text-[clamp(26px,2.6vw,34px)]"
          style={{
            color: FG_STRONG,
          }}
        >
          {t("trendsInsights.heading")}
        </h2>
        <p
          className="mt-5 text-[15px] leading-[1.65] md:text-base"
          style={{ color: FG }}
        >
          {t("trendsInsights.body")}
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
                {t("trendsInsights.insightCard.title")}
              </p>
              <span
                className="font-mono text-[13px] tabular-nums"
                style={{ color: FG_STRONG }}
              >
                {t("trendsInsights.insightCard.delta")}
              </span>
            </div>
            <p
              className="mt-1.5 text-[12px] leading-[1.5] md:text-[13px]"
              style={{ color: FG_MUTED }}
            >
              {t("trendsInsights.insightCard.body")}
            </p>
            <div className="mt-3 flex items-center gap-3">
              <span
                className="font-mono text-[9.5px] uppercase tracking-[0.18em] rounded px-1.5 py-[2px]"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  color: FG_STRONG,
                }}
              >
                {t("trendsInsights.insightCard.tag")}
              </span>
              <span
                className="font-mono text-[10px] tabular-nums"
                style={{ color: FG_MUTED }}
              >
                {t("trendsInsights.insightCard.lag")}
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
            {t("trendsInsights.detectorsLabel")}
          </span>
          <div
            aria-hidden
            className="h-px flex-1"
            style={{ background: RULE }}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {detectors.map((p) => (
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
                {t("trendsInsights.detectorEyebrow")}
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
  let t = await getTranslations("features");
  // `src/messages/es/features.json` sits at exactly `{}` until plan 07-13
  // translates it — the PENDING state `scripts/i18n-gates.mjs` Gate 2 already
  // models deliberately for a two-wave extraction/translation split. Falling
  // back to the English translator here (scoped to this page only, never
  // touching the shared i18n request config) is what lets `/es/features`
  // keep prerendering with temporarily-English copy in the interim, instead
  // of throwing MISSING_MESSAGE from a bare `t()`/`t.raw()` call. Once 07-13
  // fills the file, `t.has()` is true and this branch stops firing.
  if (!t.has("hero.heading")) {
    t = await getTranslations({ locale: "en", namespace: "features" });
  }

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
            {t("hero.heading")}
          </h1>
          <p
            className="mt-5 max-w-2xl text-[15px] leading-[1.6] md:text-base"
            style={{ color: FG }}
          >
            {t("hero.body")}
          </p>
        </header>

        {/* 5 method sections — hairline dividers between */}
        <div className="space-y-20 md:space-y-28">
          <TemporalHierarchySection t={t} />

          <div
            aria-hidden
            className="h-px"
            style={{ background: RULE }}
          />
          <DailyScoreSection t={t} />

          <div
            aria-hidden
            className="h-px"
            style={{ background: RULE }}
          />
          <PulseLoopSection t={t} />

          <div
            aria-hidden
            className="h-px"
            style={{ background: RULE }}
          />
          <HabitsAndGoalsSection t={t} />

          <div
            aria-hidden
            className="h-px"
            style={{ background: RULE }}
          />
          <TrendsInsightsSection t={t} />
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
            {t("closing.body")}
          </p>
          <Link
            href="/manifesto"
            className="group mt-4 inline-flex items-center gap-1.5 text-[14px] md:text-[15px] transition-colors min-h-11 md:min-h-0"
            style={{ color: ACCENT_LIGHT }}
          >
            {t("closing.cta")}
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
