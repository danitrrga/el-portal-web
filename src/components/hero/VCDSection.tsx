"use client";

import { Compass, Repeat, Sun } from "lucide-react";

const SECTION_BG = "#04060c";
const FG_STRONG = "#f4f6fb";
const FG = "#aab3c5";
const FG_MUTED = "#8590a8";
const ACCENT = "#4487D6";
const ACCENT_LIGHT = "#77B7ED";

const ACTIVE_CYCLE = 2; // 0-indexed: cycle 3 of 6
const TODAY = 11; // 0-indexed: day 12 of 15
const CYCLE_LENGTH = 15;
const CYCLES_PER_VERSION = 6;

export default function VCDSection() {
  const dayOfVersion = ACTIVE_CYCLE * CYCLE_LENGTH + (TODAY + 1);

  return (
    <section style={{ background: SECTION_BG }} className="py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center mb-12 sm:mb-16">
          <h2
            className="display text-balance"
            style={{ fontSize: "clamp(28px, 3.2vw, 40px)", color: FG_STRONG }}
          >
            Three horizons. One hierarchy.
          </h2>
          <p className="mt-4 text-base leading-[1.6]" style={{ color: FG }}>
            Versions plan identity. Cycles run focus. Days carry the score.
          </p>
        </div>

        <LayeredStrata dayOfVersion={dayOfVersion} />

        {/* Captions */}
        <div className="mt-12 sm:mt-16 grid gap-8 sm:grid-cols-3 sm:gap-10 max-w-3xl mx-auto">
          <Caption
            icon={Compass}
            label="Version"
            body="Identity arc. The phase you're committing to."
          />
          <Caption
            icon={Repeat}
            label="Cycle"
            body="Focus sprint. Six fit inside a Version."
          />
          <Caption
            icon={Sun}
            label="Day"
            body="Atomic unit. Weighted habits roll into one number."
          />
        </div>
      </div>
    </section>
  );
}

/* ─── Caption ───────────────────────────────────────────────────── */
function Caption({
  icon: Icon,
  label,
  body,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number; style?: React.CSSProperties }>;
  label: string;
  body: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <Icon
          className="size-3.5 flex-shrink-0"
          strokeWidth={1.5}
          style={{ color: FG_MUTED }}
        />
        <span
          className="text-[11px] font-medium uppercase tracking-[0.18em]"
          style={{ color: FG_STRONG }}
        >
          {label}
        </span>
      </div>
      <p
        className="mt-4 text-sm leading-[1.6] text-balance"
        style={{ color: FG }}
      >
        {body}
      </p>
    </div>
  );
}

/* ─── Layered strata — 3 horizons sharing one NOW ───────────────── */
function LayeredStrata({ dayOfVersion }: { dayOfVersion: number }) {
  const totalDays = CYCLES_PER_VERSION * CYCLE_LENGTH; // 90
  const nowPct = ((dayOfVersion - 0.5) / totalDays) * 100;
  const activeStartPct = (ACTIVE_CYCLE * CYCLE_LENGTH) / totalDays * 100;
  const activeEndPct = ((ACTIVE_CYCLE + 1) * CYCLE_LENGTH) / totalDays * 100;

  // Geometry constants for laying out the single NOW line across all strata
  const LABEL_COL = 88; // px width of left label column
  const COL_GAP = 24; // px gap between label and stratum columns

  return (
    <div className="relative mx-auto max-w-3xl py-14">
      {/* Atmosphere — top-light, matches MCP's `50% 0%` origin + ~18% opacity */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 65% 90% at 50% 0%, ${ACCENT}1f, transparent 65%)`,
        }}
      />

      {/* Single continuous NOW line — spans all 3 strata, anchors into the atmosphere */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          left: `calc(${LABEL_COL}px + ${COL_GAP}px + (100% - ${LABEL_COL}px - ${COL_GAP}px) * ${nowPct / 100})`,
          top: 32,
          bottom: 32,
          width: 1,
          transform: "translateX(-50%)",
          background: `repeating-linear-gradient(to bottom, ${ACCENT_LIGHT}66 0 3px, transparent 3px 7px)`,
        }}
      />

      {/* 3 strata stacked, with shared geometry */}
      <div
        className="grid items-center"
        style={{
          gridTemplateColumns: `${LABEL_COL}px 1fr`,
          columnGap: `${COL_GAP}px`,
          rowGap: 48,
        }}
      >
        {/* VERSION */}
        <BandLabel icon={Compass} label="Version" />
        <VersionStratum
          activeStartPct={activeStartPct}
          activeEndPct={activeEndPct}
          nowPct={nowPct}
        />

        {/* CYCLE */}
        <BandLabel icon={Repeat} label="Cycle" />
        <CycleStratum />

        {/* DAY */}
        <BandLabel icon={Sun} label="Day" />
        <DayStratum nowPct={nowPct} totalDays={totalDays} />
      </div>

    </div>
  );
}

/* ─── Band label — just icon + name, no meta ────────────────────── */
function BandLabel({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number; style?: React.CSSProperties }>;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon
        className="size-3.5 flex-shrink-0"
        strokeWidth={1.5}
        style={{ color: FG_MUTED }}
      />
      <span
        className="text-[11px] font-medium uppercase tracking-[0.18em]"
        style={{ color: FG_STRONG }}
      >
        {label}
      </span>
    </div>
  );
}

/* ─── Tier 1 — Version: solid bar with cycle ticks, active band, fill ── */
function VersionStratum({
  nowPct,
  activeStartPct,
  activeEndPct,
}: {
  nowPct: number;
  activeStartPct: number;
  activeEndPct: number;
}) {
  return (
    <div className="relative h-3">
      {/* Track */}
      <div
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[5px] rounded-full"
        style={{ background: "rgba(255,255,255,0.06)" }}
      />
      {/* Cycle boundary ticks (5 inner ticks for 6 segments) */}
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="absolute top-0 bottom-0 w-px"
          style={{
            left: `${(i / 6) * 100}%`,
            background: "rgba(255,255,255,0.15)",
          }}
        />
      ))}
      {/* Active cycle highlight */}
      <div
        className="absolute top-1/2 -translate-y-1/2 h-[7px]"
        style={{
          left: `${activeStartPct}%`,
          width: `${activeEndPct - activeStartPct}%`,
          background: `${ACCENT_LIGHT}40`,
          borderRadius: 2,
        }}
      />
      {/* Progress fill 0 → nowPct */}
      <div
        className="absolute top-1/2 -translate-y-1/2 h-[5px] rounded-full"
        style={{
          left: 0,
          width: `${nowPct}%`,
          background: `linear-gradient(90deg, ${ACCENT}99 0%, ${ACCENT_LIGHT}cc 100%)`,
        }}
      />
    </div>
  );
}

/* ─── Tier 2 — Cycle: 6 segments, bg-only, hairline gaps for alignment ── */
function CycleStratum() {
  return (
    <div className="relative h-3">
      <div
        className="grid h-full gap-px"
        style={{
          gridTemplateColumns: `repeat(${CYCLES_PER_VERSION}, minmax(0, 1fr))`,
        }}
      >
        {Array.from({ length: CYCLES_PER_VERSION }).map((_, i) => {
          const isActive = i === ACTIVE_CYCLE;
          const isPast = i < ACTIVE_CYCLE;
          return (
            <div
              key={i}
              className="h-full"
              style={{
                background: isActive
                  ? `linear-gradient(90deg, ${ACCENT}b3, ${ACCENT_LIGHT}cc)`
                  : isPast
                  ? `${ACCENT}55`
                  : "rgba(255,255,255,0.05)",
                borderRadius: 2,
                boxShadow: isActive
                  ? `0 0 10px ${ACCENT}66, inset 0 1px 0 rgba(255,255,255,0.08)`
                  : undefined,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

/* ─── Tier 3 — Day: 90 dots, absolute-positioned for perfect alignment ── */
function DayStratum({
  nowPct,
  totalDays,
}: {
  nowPct: number;
  totalDays: number;
}) {
  const todayIdx = Math.round((nowPct / 100) * totalDays - 0.5);
  return (
    <div className="relative h-3">
      {Array.from({ length: totalDays }).map((_, i) => {
        const dayPct = ((i + 0.5) / totalDays) * 100;
        const isToday = i === todayIdx;
        const isPast = i < todayIdx;
        const size = isToday ? 11 : 2;
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
                ? ACCENT_LIGHT
                : isPast
                ? `${ACCENT}99`
                : "rgba(255,255,255,0.20)",
              boxShadow: isToday
                ? `0 0 12px ${ACCENT_LIGHT}, 0 0 4px ${ACCENT_LIGHT}cc`
                : undefined,
            }}
          />
        );
      })}
    </div>
  );
}
