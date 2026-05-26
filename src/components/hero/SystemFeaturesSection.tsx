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

/* ─── Card 2 visual — boxy weekly score grid ─────────────────── */
function HabitScoreboardVisual() {
  // 7 days, score 0-100. Latest day = index 5 (today)
  const days = [82, 76, 91, 68, 88, 75, 0];
  const todayIdx = 5;

  return (
    <div className="w-full space-y-2">
      {/* Top label row */}
      <div className="flex items-center justify-between">
        <span
          className="text-[9px] uppercase tracking-[0.18em] font-mono"
          style={{ color: "#5a6478" }}
        >
          W23 · cycle 4
        </span>
        <span
          className="text-[9px] uppercase tracking-[0.18em] font-mono"
          style={{ color: "#5a6478" }}
        >
          day 84 / 90
        </span>
      </div>

      {/* 7-square grid — each square = one day, fill opacity = score */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((score, i) => {
          const opacity = score === 0 ? 0 : 0.15 + (score / 100) * 0.40;
          const isToday = i === todayIdx;
          return (
            <div
              key={i}
              className="aspect-square border relative"
              style={{
                background:
                  score === 0
                    ? "transparent"
                    : `linear-gradient(180deg, rgba(119,183,237,${opacity + 0.05}), rgba(68,135,214,${opacity}))`,
                borderColor: isToday
                  ? "rgba(119,183,237,0.55)"
                  : score === 0
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(255,255,255,0.10)",
              }}
            />
          );
        })}
      </div>

      {/* Bottom label row */}
      <div
        className="flex items-center justify-between pt-1 border-t"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <span
          className="text-[9px] uppercase tracking-[0.18em] font-mono"
          style={{ color: "#5a6478" }}
        >
          score
        </span>
        <span
          className="text-[11px] font-mono font-medium"
          style={{ color: "#f4f6fb" }}
        >
          12 / 16
        </span>
      </div>
    </div>
  );
}

/* ─── Card 1 wireframe stub (replaced by Daniel's screenshot) ─── */
function VersionTimelineWireframe() {
  return (
    <div className="relative aspect-[16/5] overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(68,135,214,0.08), transparent 70%)",
        }}
      />
      <div
        className="absolute left-0 right-0 top-1/2 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(119,183,237,0.25) 30%, rgba(119,183,237,0.25) 70%, transparent)",
        }}
      />
      <span
        className="absolute bottom-2 left-2 text-[9px] uppercase tracking-[0.18em] font-mono"
        style={{ color: "#5a6478" }}
      >
        screenshot pending
      </span>
    </div>
  );
}

/* ─── Card 4 visual — boxy goal slot matrix ─────────────────── */
function IdentityBeamVisual() {
  // 4x2 grid — 6 active, 2 empty slots
  const slots: { active: boolean; fill: number }[] = [
    { active: true, fill: 72 },
    { active: true, fill: 88 },
    { active: true, fill: 45 },
    { active: false, fill: 0 },
    { active: true, fill: 60 },
    { active: true, fill: 33 },
    { active: true, fill: 92 },
    { active: false, fill: 0 },
  ];

  return (
    <div className="w-full space-y-2">
      {/* Top label row */}
      <div className="flex items-center justify-between">
        <span
          className="text-[9px] uppercase tracking-[0.18em] font-mono"
          style={{ color: "#5a6478" }}
        >
          V2 · 6 active
        </span>
        <span
          className="text-[9px] uppercase tracking-[0.18em] font-mono"
          style={{ color: "#5a6478" }}
        >
          identity: founder
        </span>
      </div>

      {/* 4x2 boxy slot grid */}
      <div className="grid grid-cols-4 gap-1">
        {slots.map((slot, i) => {
          const opacity = slot.active ? 0.10 + (slot.fill / 100) * 0.35 : 0;
          return (
            <div
              key={i}
              className="aspect-[3/2] border relative overflow-hidden"
              style={{
                background: slot.active
                  ? `linear-gradient(180deg, rgba(119,183,237,${opacity + 0.05}), rgba(68,135,214,${opacity}))`
                  : "transparent",
                borderColor: slot.active
                  ? "rgba(255,255,255,0.10)"
                  : "rgba(255,255,255,0.05)",
                borderStyle: slot.active ? "solid" : "dashed",
              }}
            >
              {slot.active && (
                <div
                  className="absolute bottom-0 left-0 right-0"
                  style={{
                    height: `${slot.fill}%`,
                    background:
                      "linear-gradient(180deg, transparent, rgba(119,183,237,0.18))",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom label row */}
      <div
        className="flex items-center justify-between pt-1 border-t"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <span
          className="text-[9px] uppercase tracking-[0.18em] font-mono"
          style={{ color: "#5a6478" }}
        >
          cycle fill
        </span>
        <span
          className="text-[11px] font-mono font-medium"
          style={{ color: "#f4f6fb" }}
        >
          61%
        </span>
      </div>
    </div>
  );
}
