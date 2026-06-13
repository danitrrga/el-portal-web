"use client";

import { motion } from "framer-motion";

// ── Canonical entrance variants (Footer.tsx lines 32–50) ─────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

// ── Pulse visual: typographic word-cloud on hairline rules ───────────────────
function PulseVisual() {
  const rows: Array<{ label: string; words: string[] }> = [
    {
      label: "Mood",
      words: ["calm", "focused", "restless", "curious", "grateful"],
    },
    {
      label: "Energy",
      words: ["sharp", "steady", "low", "charged", "drained"],
    },
    {
      label: "Sleep",
      words: ["deep", "broken", "solid", "light", "restorative"],
    },
    {
      label: "Reflection",
      words: ["made progress", "stayed reactive", "found rhythm", "lost momentum"],
    },
  ];

  return (
    <div
      className="rounded-xl border p-6 md:p-7"
      style={{
        background: "rgba(255,255,255,0.015)",
        borderColor: "var(--color-ep-rule)",
      }}
    >
      <div className="space-y-0">
        {rows.map((row, i) => (
          <div
            key={row.label}
            className="grid grid-cols-[72px_1fr] items-start gap-4 py-4"
            style={{
              borderTop:
                i > 0
                  ? "1px solid var(--color-ep-hairline)"
                  : "none",
            }}
          >
            <span
              className="font-mono text-[10px] uppercase tracking-[0.22em] pt-[3px]"
              style={{ color: "var(--color-ep-fg-muted)" }}
            >
              {row.label}
            </span>
            <div className="flex flex-wrap gap-2">
              {row.words.map((word) => (
                <span
                  key={word}
                  className="font-mono text-[12px] md:text-[13px]"
                  style={{ color: "var(--color-ep-fg)" }}
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div
        className="mt-5 border-l-2 pl-4 py-1"
        style={{ borderColor: "var(--color-ep-accent-light-alpha-80)" }}
      >
        <span
          className="font-mono text-[10px] uppercase tracking-[0.22em]"
          style={{ color: "var(--color-ep-accent-light)" }}
        >
          No numeric scores
        </span>
        <p
          className="mt-1 text-[13px] leading-[1.55] md:text-[14px]"
          style={{ color: "var(--color-ep-fg)" }}
        >
          Words capture nuance that numbers erase. Every check-in feeds the
          trends engine for pattern detection over time.
        </p>
      </div>
    </div>
  );
}

// ── Trends visual: static inline SVG line / correlation chart ────────────────
function TrendsVisual() {
  return (
    <div className="space-y-4">
      {/* Line chart */}
      <div
        className="rounded-xl border p-5 md:p-6"
        style={{
          background: "rgba(255,255,255,0.015)",
          borderColor: "var(--color-ep-rule)",
        }}
      >
        <div className="mb-3 flex items-center justify-between">
          <span
            className="font-mono text-[10px] uppercase tracking-[0.22em]"
            style={{ color: "var(--color-ep-fg-muted)" }}
          >
            Performance over cycles
          </span>
          <span
            className="font-mono text-[11px] tabular-nums"
            style={{ color: "var(--color-ep-fg-subtle)" }}
          >
            v.current
          </span>
        </div>

        {/* Axis-ruled SVG chart */}
        <svg
          viewBox="0 0 240 100"
          className="w-full"
          aria-hidden
          style={{ overflow: "visible" }}
        >
          {/* Horizontal grid lines */}
          {[20, 40, 60, 80].map((y) => (
            <line
              key={y}
              x1="28"
              y1={y}
              x2="232"
              y2={y}
              stroke="var(--color-ep-hairline)"
              strokeWidth="0.5"
            />
          ))}

          {/* Y-axis */}
          <line
            x1="28"
            y1="10"
            x2="28"
            y2="88"
            stroke="var(--color-ep-hairline)"
            strokeWidth="0.5"
          />
          {/* X-axis */}
          <line
            x1="28"
            y1="88"
            x2="232"
            y2="88"
            stroke="var(--color-ep-hairline)"
            strokeWidth="0.5"
          />

          {/* Habit reliability trend — smooth upward curve */}
          <path
            d="M 28 75 C 60 72, 90 65, 120 52 S 180 32, 232 20"
            fill="none"
            stroke="var(--color-ep-chart-line)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Wellbeing composite — secondary line */}
          <path
            d="M 28 80 C 55 76, 90 70, 130 60 S 185 48, 232 40"
            fill="none"
            stroke="var(--color-ep-accent)"
            strokeWidth="1"
            strokeLinecap="round"
            strokeDasharray="3 2"
          />

          {/* Data point markers on primary line */}
          {[
            { cx: 28, cy: 75 },
            { cx: 80, cy: 62 },
            { cx: 130, cy: 48 },
            { cx: 180, cy: 30 },
            { cx: 232, cy: 20 },
          ].map((pt) => (
            <circle
              key={`${pt.cx}-${pt.cy}`}
              cx={pt.cx}
              cy={pt.cy}
              r="2"
              fill="var(--color-ep-chart-line)"
            />
          ))}

          {/* Cycle labels */}
          {["C1", "C2", "C3", "C4", "C5"].map((label, i) => (
            <text
              key={label}
              x={28 + i * 51}
              y="98"
              textAnchor="middle"
              fontSize="6"
              fill="var(--color-ep-fg-subtle-2)"
              fontFamily="monospace"
            >
              {label}
            </text>
          ))}
        </svg>

        {/* Legend */}
        <div className="mt-3 flex gap-5">
          <div className="flex items-center gap-1.5">
            <div
              className="h-px w-5"
              style={{ background: "var(--color-ep-chart-line)" }}
            />
            <span
              className="font-mono text-[10px]"
              style={{ color: "var(--color-ep-fg-subtle)" }}
            >
              Habit reliability
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div
              className="h-px w-5"
              style={{
                background: "var(--color-ep-accent)",
                borderTop: "1px dashed var(--color-ep-accent)",
              }}
            />
            <span
              className="font-mono text-[10px]"
              style={{ color: "var(--color-ep-fg-subtle)" }}
            >
              Wellbeing composite
            </span>
          </div>
        </div>
      </div>

      {/* Correlation insight card */}
      <div
        className="rounded-lg border p-5"
        style={{
          background: "rgba(255,255,255,0.015)",
          borderColor: "var(--color-ep-rule)",
        }}
      >
        <div className="flex items-start gap-3">
          <span
            aria-hidden
            className="mt-[6px] size-2 shrink-0 rounded-full"
            style={{ background: "var(--color-ep-fg-strong)" }}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline justify-between gap-3">
              <p
                className="text-[13px] font-semibold leading-[1.3] md:text-[14px]"
                style={{ color: "var(--color-ep-fg-strong)" }}
              >
                Sleep quality → next-day mood
              </p>
              <span
                className="font-mono text-[12px] tabular-nums shrink-0"
                style={{ color: "var(--color-ep-fg-strong)" }}
              >
                ↑ 24%
              </span>
            </div>
            <p
              className="mt-1.5 text-[11px] leading-[1.5] md:text-[12px]"
              style={{ color: "var(--color-ep-fg-muted)" }}
            >
              Nights above your median sleep predict a higher mood the morning
              after. Strong signal across the last two cycles.
            </p>
            <div className="mt-2.5 flex items-center gap-3">
              <span
                className="font-mono text-[9px] uppercase tracking-[0.18em] rounded px-1.5 py-[2px]"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  color: "var(--color-ep-fg-strong)",
                }}
              >
                Correlation
              </span>
              <span
                className="font-mono text-[10px] tabular-nums"
                style={{ color: "var(--color-ep-fg-subtle)" }}
              >
                lag · 1 day
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Section eyebrow ──────────────────────────────────────────────────────────
function SectionEyebrow({ num, label }: { num: string; label: string }) {
  return (
    <div className="mb-8 flex items-center gap-3 md:mb-10">
      <span
        className="font-mono text-[11px] tabular-nums"
        style={{ color: "var(--color-ep-fg-subtle-2)" }}
      >
        {num}
      </span>
      <span
        aria-hidden
        className="font-mono text-[10px]"
        style={{ color: "var(--color-ep-fg-subtle-2)" }}
      >
        ·
      </span>
      <span
        className="font-mono text-[11px] uppercase tracking-[0.22em]"
        style={{ color: "var(--color-ep-fg-muted)" }}
      >
        {label}
      </span>
      <div
        aria-hidden
        className="ml-1 h-px flex-1"
        style={{ background: "var(--color-ep-rule)" }}
      />
    </div>
  );
}

// ── DeepDiveRow: reusable asymmetric two-column row ──────────────────────────
interface DeepDiveRowProps {
  eyebrowNum: string;
  eyebrowLabel: string;
  heading: string;
  body: string;
  accent?: string;
  accentBody?: string;
  visual: React.ReactNode;
}

function DeepDiveRow({
  eyebrowNum,
  eyebrowLabel,
  heading,
  body,
  accent,
  accentBody,
  visual,
}: DeepDiveRowProps) {
  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
    >
      <SectionEyebrow num={eyebrowNum} label={eyebrowLabel} />

      <div className="grid gap-10 md:grid-cols-[1fr_1.3fr] md:gap-14">
        {/* LEFT — sticky intro */}
        <motion.div
          variants={itemVariants}
          className="md:sticky md:top-32 md:self-start"
        >
          <h2
            className="display text-balance leading-[1.1]"
            style={{
              fontSize: "clamp(26px, 2.6vw, 34px)",
              color: "var(--color-ep-fg-strong)",
            }}
          >
            {heading}
          </h2>
          <p
            className="mt-5 text-[15px] leading-[1.65] md:text-base"
            style={{ color: "var(--color-ep-fg)" }}
          >
            {body}
          </p>
          {accent && accentBody && (
            <div
              className="mt-6 border-l-2 pl-4 py-1"
              style={{ borderColor: "var(--color-ep-accent-light-alpha-80)" }}
            >
              <span
                className="font-mono text-[10px] uppercase tracking-[0.22em]"
                style={{ color: "var(--color-ep-accent-light)" }}
              >
                {accent}
              </span>
              <p
                className="mt-1 text-[13px] leading-[1.55] md:text-[14px]"
                style={{ color: "var(--color-ep-fg)" }}
              >
                {accentBody}
              </p>
            </div>
          )}
        </motion.div>

        {/* RIGHT — visual */}
        <motion.div variants={itemVariants}>{visual}</motion.div>
      </div>
    </motion.section>
  );
}

// ── Default export: Pulse + Trends rows ─────────────────────────────────────
export default function DeepDiveRows() {
  return (
    <div className="space-y-20 md:space-y-28">
      {/* D-06 Row 1: Pulse */}
      <DeepDiveRow
        eyebrowNum="03"
        eyebrowLabel="Pulse"
        heading="Words, not numbers."
        body="The daily check-in captures mood, energy, sleep quality, and a freeform reflection — all in plain language. No numeric scores. No reductive sliders. Language carries the nuance that drives pattern detection."
        accent="Feeds the trends engine"
        accentBody="Every check-in you log is a data point the system reads across cycles, building the signal layer that surfaces meaningful correlations."
        visual={<PulseVisual />}
      />

      {/* D-06 Row 2: Trends */}
      <DeepDiveRow
        eyebrowNum="04"
        eyebrowLabel="Trends & Insights"
        heading="The system reads what you generate."
        body="Performance charts across cycles and versions, wellbeing composites, habit reliability tables, heatmaps, mood calendars, and correlation analysis — all derived from the data you already logged."
        accent="Pro · AI Insights"
        accentBody="Pattern detection and narrative summaries are available as an opt-in Pro feature, surfacing the most significant correlations in plain language."
        visual={<TrendsVisual />}
      />
    </div>
  );
}
