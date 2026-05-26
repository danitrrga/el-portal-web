"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function SystemFeaturesSection() {
  return (
    <section style={{ background: "#04060c" }} className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        {/* Section eyebrow + heading */}
        <div className="mx-auto max-w-2xl text-center mb-16">
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
            className="display text-balance mt-6"
            style={{
              fontSize: "clamp(28px, 3.2vw, 40px)",
              color: "#f4f6fb",
            }}
          >
            Three horizons. One hierarchy.
          </h2>
          <p
            className="mt-6 text-base leading-[1.6]"
            style={{ color: "#aab3c5" }}
          >
            Versions, Cycles, and Days are first-class objects. Each one carries its own role — and they nest into a single system the companion learns over time.
          </p>
        </div>

        <div className="mx-auto grid gap-2 sm:grid-cols-5">
          {/* Card 1 — Time hierarchy (col-3, screenshot) */}
          <Card
            className="group overflow-hidden shadow-black/20 sm:col-span-3 sm:rounded-none sm:rounded-tl-xl border-white/[0.08]"
            style={{ background: "#0a1429" }}
          >
            <CardHeader>
              <div className="md:p-6">
                <p className="font-medium text-[#f4f6fb]">Time hierarchy</p>
                <p className="text-[#aab3c5] mt-3 max-w-sm text-sm leading-[1.6]">
                  90-day Versions plan identity. 15-day Cycles run focus. Days carry the score. The nested structure your life already follows.
                </p>
              </div>
            </CardHeader>
            <div className="relative h-fit px-6 pb-6 md:px-12 md:pb-12">
              <TimeHierarchyVisual />
            </div>
          </Card>

          {/* Card 2 — Habit + skill scoring (col-2, custom visual) */}
          <Card
            className="group overflow-hidden shadow-black/20 sm:col-span-2 sm:rounded-none sm:rounded-tr-xl border-white/[0.08]"
            style={{ background: "#0a1429" }}
          >
            <p
              className="font-sans font-medium mx-auto my-6 max-w-md text-balance px-6 text-center text-[18px] md:p-6 md:text-[20px]"
              style={{ color: "#f4f6fb" }}
            >
              Habits and skills, weighted and scored.
            </p>
            <CardContent className="mt-auto h-fit">
              <div className="relative mb-6 sm:mb-0 px-6 pb-6">
                <HabitScoreboardVisual />
              </div>
            </CardContent>
          </Card>

          {/* Card 3 — Shortcut system (col-2, keys) */}
          <Card
            className="group p-6 shadow-black/20 sm:col-span-2 sm:rounded-none sm:rounded-bl-xl md:p-12 border-white/[0.08]"
            style={{ background: "#0a1429" }}
          >
            <p
              className="font-sans font-medium mx-auto mb-12 max-w-md text-balance text-center text-[18px] md:text-[20px]"
              style={{ color: "#f4f6fb" }}
            >
              Quick capture, one keystroke away.
            </p>
            <div className="flex justify-center gap-6">
              <div
                className="relative flex aspect-square size-16 items-center rounded-[7px] border p-3 shadow-lg"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  borderColor: "rgba(255,255,255,0.12)",
                  boxShadow: "0 6px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
                }}
              >
                <span className="absolute right-2 top-1 block text-sm" style={{ color: "#aab3c5" }}>
                  ⌘
                </span>
                <span className="mt-auto text-sm" style={{ color: "#aab3c5" }}>
                  P
                </span>
              </div>
              <div
                className="flex aspect-square size-16 items-center justify-center rounded-[7px] border p-3 shadow-lg"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  borderColor: "rgba(255,255,255,0.12)",
                  boxShadow: "0 6px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
                }}
              >
                <span className="text-xl font-medium" style={{ color: "#f4f6fb" }}>
                  K
                </span>
              </div>
            </div>
          </Card>

          {/* Card 4 — Goals linked to identity (col-3, grid) */}
          <Card
            className="group relative shadow-black/20 sm:col-span-3 sm:rounded-none sm:rounded-br-xl border-white/[0.08]"
            style={{ background: "#0a1429" }}
          >
            <CardHeader className="p-6 md:p-12">
              <p className="font-medium text-[#f4f6fb]">Goals linked to identity</p>
              <p className="text-[#aab3c5] mt-2 max-w-sm text-sm leading-[1.6]">
                Every goal ties back to a Version's identity phase. Habits, tasks, and check-ins inherit that direction.
              </p>
            </CardHeader>
            <CardContent className="relative h-fit px-6 pb-6 md:px-12 md:pb-12">
              <div className="grid grid-cols-4 gap-2 md:grid-cols-6">
                {[
                  { label: "Identity" },
                  { label: "Focus" },
                  { label: null },
                  { label: "Habits" },
                  { label: null },
                  { label: "Scores" },
                ].map((tile, i) => (
                  <div
                    key={i}
                    className={
                      tile.label
                        ? "aspect-square border flex items-center justify-center rounded-md p-4"
                        : "aspect-square border border-dashed rounded-md"
                    }
                    style={
                      tile.label
                        ? {
                            background: "rgba(255,255,255,0.03)",
                            borderColor: "rgba(255,255,255,0.10)",
                          }
                        : {
                            borderColor: "rgba(255,255,255,0.06)",
                          }
                    }
                  >
                    {tile.label && (
                      <span
                        className="text-[10px] uppercase tracking-[0.14em] text-center"
                        style={{ color: "#aab3c5" }}
                      >
                        {tile.label}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

/* ─── Card 1 visual ─────────────────────────────────────────────── */
function TimeHierarchyVisual() {
  return (
    <div className="w-full space-y-3">
      {/* Version row — single full-width bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span
            className="text-[10px] uppercase tracking-[0.18em] font-medium"
            style={{ color: "#8590a8" }}
          >
            Version
          </span>
          <span
            className="text-[10px] uppercase tracking-[0.12em]"
            style={{ color: "#5a6478" }}
          >
            90 days
          </span>
        </div>
        <div
          className="h-9 rounded-md border flex items-center px-3"
          style={{
            background:
              "linear-gradient(90deg, rgba(68,135,214,0.18), rgba(68,135,214,0.06))",
            borderColor: "rgba(119,183,237,0.22)",
          }}
        >
          <span className="text-[11px] font-medium" style={{ color: "#f4f6fb" }}>
            Identity phase
          </span>
        </div>
      </div>

      {/* Cycle row — 6 segments */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span
            className="text-[10px] uppercase tracking-[0.18em] font-medium"
            style={{ color: "#8590a8" }}
          >
            Cycle × 6
          </span>
          <span
            className="text-[10px] uppercase tracking-[0.12em]"
            style={{ color: "#5a6478" }}
          >
            15 days
          </span>
        </div>
        <div className="grid grid-cols-6 gap-1">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-6 rounded-md border"
              style={{
                background:
                  i === 1
                    ? "rgba(68,135,214,0.22)"
                    : "rgba(255,255,255,0.04)",
                borderColor:
                  i === 1
                    ? "rgba(119,183,237,0.35)"
                    : "rgba(255,255,255,0.08)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Day row — 15 small markers */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span
            className="text-[10px] uppercase tracking-[0.18em] font-medium"
            style={{ color: "#8590a8" }}
          >
            Day × 15
          </span>
          <span
            className="text-[10px] uppercase tracking-[0.12em]"
            style={{ color: "#5a6478" }}
          >
            scored
          </span>
        </div>
        <div className="grid grid-cols-15 gap-1" style={{ gridTemplateColumns: "repeat(15, minmax(0, 1fr))" }}>
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="h-3 rounded-sm border"
              style={{
                background:
                  i < 4
                    ? "rgba(68,135,214,0.30)"
                    : "rgba(255,255,255,0.04)",
                borderColor:
                  i < 4
                    ? "rgba(119,183,237,0.40)"
                    : "rgba(255,255,255,0.06)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
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

  return (
    <div
      className="w-full rounded-lg border p-3 space-y-2"
      style={{
        background: "rgba(255,255,255,0.02)",
        borderColor: "rgba(255,255,255,0.08)",
      }}
    >
      {habits.map((h, i) => (
        <div key={i} className="flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-2">
            <span
              className="inline-block w-3 h-3 rounded-sm border flex-shrink-0 flex items-center justify-center"
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
            className="text-[9px] uppercase tracking-[0.12em] font-medium px-1.5 py-0.5 rounded"
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
      <div
        className="pt-2 mt-1 flex items-center justify-between text-[11px] border-t"
        style={{ borderColor: "rgba(255,255,255,0.08)" }}
      >
        <span
          className="uppercase tracking-[0.14em] text-[10px]"
          style={{ color: "#8590a8" }}
        >
          Day score
        </span>
        <span className="font-mono font-medium" style={{ color: "#f4f6fb" }}>
          {done} / {total}
        </span>
      </div>
    </div>
  );
}
