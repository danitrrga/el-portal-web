"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function SystemFeaturesSection() {
  return (
    <section style={{ background: "#04060c" }} className="py-12 md:py-20">
      <div className="mx-auto max-w-5xl px-6">
        {/* Section eyebrow + heading */}
        <div className="mx-auto max-w-2xl text-center mb-12">
          <span
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-[11px] font-medium uppercase tracking-[0.18em]"
            style={{
              color: "#8590a8",
              borderColor: "rgba(255,255,255,0.10)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#4487D6" }} />
            The system
          </span>
          <h2
            className="display text-balance mt-5"
            style={{
              fontSize: "clamp(28px, 3.2vw, 40px)",
              color: "#f4f6fb",
            }}
          >
            Three horizons. One hierarchy.
          </h2>
          <p
            className="mt-5 text-base leading-[1.6]"
            style={{ color: "#aab3c5" }}
          >
            Versions, Cycles, and Days are first-class objects. Each one carries its own role — and they nest into a single system the companion learns over time.
          </p>
        </div>

        <div className="mx-auto grid gap-2 sm:grid-cols-5">
          {/* Card 1 — Time hierarchy (col-3, screenshot placeholder for Daniel) */}
          <Card
            className="group overflow-hidden shadow-black/20 sm:col-span-3 sm:rounded-none sm:rounded-tl-xl border-white/[0.08]"
            style={{ background: "#0a1429" }}
          >
            <CardHeader>
              <div className="p-3 md:p-5">
                <p className="font-medium text-[#f4f6fb]">Time hierarchy</p>
                <p className="text-[#aab3c5] mt-2 max-w-sm text-sm leading-[1.55]">
                  90-day Versions plan identity. 15-day Cycles run focus. Days carry the score. The nested structure your life already follows.
                </p>
              </div>
            </CardHeader>
            <div className="relative h-fit pl-5 md:pl-9">
              <div
                className="absolute -inset-5"
                style={{
                  background:
                    "radial-gradient(75% 95% at 50% 0%, transparent, #04060c 100%)",
                }}
              />
              <div
                className="overflow-hidden rounded-tl-lg border-l border-t pl-2 pt-2"
                style={{
                  background: "#04060c",
                  borderColor: "rgba(255,255,255,0.08)",
                }}
              >
                <VersionTimelineWireframe />
              </div>
            </div>
          </Card>

          {/* Card 2 — Habit + skill scoring (col-2, framed app-fragment) */}
          <Card
            className="group overflow-hidden shadow-black/20 sm:col-span-2 sm:rounded-none sm:rounded-tr-xl border-white/[0.08]"
            style={{ background: "#0a1429" }}
          >
            <p
              className="font-sans font-medium mx-auto max-w-md text-balance px-5 pt-5 pb-3 text-center text-[15px] md:px-6 md:pt-6 md:pb-4 md:text-[17px]"
              style={{ color: "#f4f6fb" }}
            >
              Habits and skills, weighted and scored.
            </p>
            <CardContent className="h-fit">
              <div className="relative px-5 pb-5">
                <HabitScoreboardVisual />
              </div>
            </CardContent>
          </Card>

          {/* Card 3 — Shortcut system (col-2, keys) */}
          <Card
            className="group p-5 shadow-black/20 sm:col-span-2 sm:rounded-none sm:rounded-bl-xl md:p-7 border-white/[0.08]"
            style={{ background: "#0a1429" }}
          >
            <p
              className="font-sans font-medium mx-auto mb-7 max-w-md text-balance text-center text-[15px] md:text-[17px]"
              style={{ color: "#f4f6fb" }}
            >
              Quick capture, one keystroke away.
            </p>
            <div className="flex justify-center gap-5">
              <div
                className="relative flex aspect-square size-14 items-center rounded-[7px] border p-3"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  borderColor: "rgba(255,255,255,0.12)",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
                }}
              >
                <span className="absolute right-2 top-1 block text-xs" style={{ color: "#aab3c5" }}>
                  ⌘
                </span>
                <span className="mt-auto text-sm" style={{ color: "#aab3c5" }}>
                  P
                </span>
              </div>
              <div
                className="flex aspect-square size-14 items-center justify-center rounded-[7px] border p-3"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  borderColor: "rgba(255,255,255,0.12)",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
                }}
              >
                <span className="text-lg font-medium" style={{ color: "#f4f6fb" }}>
                  K
                </span>
              </div>
            </div>
          </Card>

          {/* Card 4 — Goals linked to identity (col-3, framed goal cards) */}
          <Card
            className="group relative shadow-black/20 sm:col-span-3 sm:rounded-none sm:rounded-br-xl border-white/[0.08]"
            style={{ background: "#0a1429" }}
          >
            <CardHeader className="p-5 md:p-7 md:pb-5">
              <p className="font-medium text-[#f4f6fb]">Goals linked to identity</p>
              <p className="text-[#aab3c5] mt-2 max-w-sm text-sm leading-[1.55]">
                Every goal ties back to a Version's identity phase. Habits, tasks, and check-ins inherit that direction.
              </p>
            </CardHeader>
            <CardContent className="relative h-fit px-5 pb-5 md:px-7 md:pb-7">
              <IdentityBeamVisual />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

/* ─── Card 2 visual ─────────────────────────────────────────────── */
function HabitScoreboardVisual() {
  const habits: { name: string; weight: "LOW" | "MED" | "HIGH"; done: boolean }[] = [
    { name: "Deep work block", weight: "HIGH", done: true },
    { name: "Mobility", weight: "MED", done: true },
    { name: "Read 20m", weight: "LOW", done: true },
    { name: "Cold shower", weight: "LOW", done: false },
  ];

  const weightVal = { LOW: 1, MED: 2, HIGH: 4 } as const;
  const total = habits.reduce((s, h) => s + weightVal[h.weight], 0);
  const done = habits.reduce((s, h) => s + (h.done ? weightVal[h.weight] : 0), 0);
  const pct = (done / total) * 100;

  // Score ring geometry
  const R = 18;
  const C = 2 * Math.PI * R;
  const dash = (pct / 100) * C;

  return (
    <div
      className="relative w-full rounded-lg border overflow-hidden"
      style={{
        background: "#04060c",
        borderColor: "rgba(255,255,255,0.08)",
      }}
    >
      {/* Mini UI chrome — header bar */}
      <div
        className="flex items-center justify-between px-3 py-2 border-b"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <span className="text-[9px] uppercase tracking-[0.18em]" style={{ color: "#5a6478" }}>
          Today
        </span>
        <div className="flex items-center gap-2">
          {/* Score ring */}
          <svg width="44" height="44" viewBox="0 0 44 44">
            <circle cx="22" cy="22" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
            <circle
              cx="22"
              cy="22"
              r={R}
              fill="none"
              stroke="#77B7ED"
              strokeWidth="3"
              strokeDasharray={`${dash} ${C}`}
              strokeLinecap="round"
              transform="rotate(-90 22 22)"
            />
            <text
              x="22"
              y="26"
              textAnchor="middle"
              fontSize="11"
              fontWeight="500"
              fill="#f4f6fb"
              fontFamily="'JetBrains Mono', monospace"
            >
              {Math.round(pct)}
            </text>
          </svg>
        </div>
      </div>

      {/* Habit list */}
      <div className="px-3 py-2.5 space-y-2">
        {habits.map((h, i) => (
          <div key={i} className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-2">
              <span
                className="inline-flex w-3 h-3 rounded-sm border flex-shrink-0 items-center justify-center"
                style={{
                  background: h.done ? "rgba(68,135,214,0.30)" : "transparent",
                  borderColor: h.done
                    ? "rgba(119,183,237,0.50)"
                    : "rgba(255,255,255,0.20)",
                }}
              >
                {h.done && (
                  <svg viewBox="0 0 12 12" className="w-2 h-2" style={{ color: "#f4f6fb" }}>
                    <path
                      d="M2 6l3 3 5-6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
              <span style={{ color: h.done ? "#f4f6fb" : "#aab3c5" }}>{h.name}</span>
            </div>
            <span
              className="text-[8px] uppercase tracking-[0.14em] font-medium px-1.5 py-0.5 rounded"
              style={{
                color: "#8590a8",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {h.weight}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Card 1 wireframe stub (replaced by Daniel's screenshot) ─── */
function VersionTimelineWireframe() {
  return (
    <div className="relative aspect-[16/8] overflow-hidden">
      {/* Atmospheric backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(68,135,214,0.10), transparent 70%)",
        }}
      />
      {/* Horizontal hairline beam */}
      <div
        className="absolute left-0 right-0 top-1/2 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(119,183,237,0.30) 30%, rgba(119,183,237,0.30) 70%, transparent)",
        }}
      />
      {/* Tiny placeholder caption — bottom-left */}
      <span
        className="absolute bottom-3 left-3 text-[9px] uppercase tracking-[0.18em]"
        style={{ color: "#5a6478" }}
      >
        screenshot pending
      </span>
    </div>
  );
}

/* ─── Card 4 cinematic visual — identity beam with goal nodes ─── */
function IdentityBeamVisual() {
  // 3 goal nodes positioned along a descending beam
  const nodes = [
    { cx: 28, cy: 30, r: 4, glow: 14 },
    { cx: 55, cy: 55, r: 5, glow: 18 },
    { cx: 80, cy: 78, r: 3.5, glow: 12 },
  ];

  return (
    <div
      className="relative w-full aspect-[16/7] rounded-lg border overflow-hidden"
      style={{
        background: "#04060c",
        borderColor: "rgba(255,255,255,0.08)",
      }}
    >
      {/* Atmospheric blue wash from top-left */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 80% at 20% 20%, rgba(68,135,214,0.16), transparent 70%)",
        }}
      />
      {/* Soft top-light arc */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 20% at 50% 0%, rgba(119,183,237,0.10), transparent 60%)",
        }}
      />

      {/* SVG beam + nodes */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
      >
        <defs>
          <linearGradient id="beam-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(119,183,237,0.55)" />
            <stop offset="60%" stopColor="rgba(68,135,214,0.30)" />
            <stop offset="100%" stopColor="rgba(8,56,133,0)" />
          </linearGradient>
          <radialGradient id="node-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(119,183,237,0.55)" />
            <stop offset="100%" stopColor="rgba(119,183,237,0)" />
          </radialGradient>
        </defs>

        {/* Diagonal beam (identity → goals) */}
        <line
          x1="15"
          y1="15"
          x2="92"
          y2="90"
          stroke="url(#beam-grad)"
          strokeWidth="0.6"
          strokeLinecap="round"
        />

        {/* Connecting hairlines from beam to each node */}
        {nodes.map((n, i) => (
          <line
            key={`l-${i}`}
            x1={n.cx - 6}
            y1={n.cy - 6}
            x2={n.cx}
            y2={n.cy}
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="0.3"
          />
        ))}

        {/* Glow halos */}
        {nodes.map((n, i) => (
          <circle
            key={`g-${i}`}
            cx={n.cx}
            cy={n.cy}
            r={n.glow}
            fill="url(#node-glow)"
          />
        ))}

        {/* Solid nodes */}
        {nodes.map((n, i) => (
          <circle
            key={`n-${i}`}
            cx={n.cx}
            cy={n.cy}
            r={n.r}
            fill="#77B7ED"
            stroke="rgba(255,255,255,0.30)"
            strokeWidth="0.4"
          />
        ))}
      </svg>

      {/* Two micro-labels positioned for breathing */}
      <span
        className="absolute top-3 left-3 text-[9px] uppercase tracking-[0.18em] font-medium"
        style={{ color: "#aab3c5" }}
      >
        Identity
      </span>
      <span
        className="absolute bottom-3 right-3 text-[9px] uppercase tracking-[0.18em] font-medium"
        style={{ color: "#aab3c5" }}
      >
        Goals
      </span>
    </div>
  );
}
