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
            <div className="relative h-fit pl-6 md:pl-12">
              <div
                className="absolute -inset-6"
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
                <div className="aspect-[16/10] flex items-center justify-center">
                  <p className="text-xs uppercase tracking-[0.18em]" style={{ color: "#5a6478" }}>
                    Version timeline screenshot
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Card 2 — Habit + skill scoring (col-2, screenshot) */}
          <Card
            className="group overflow-hidden shadow-black/20 sm:col-span-2 sm:rounded-none sm:rounded-tr-xl border-white/[0.08]"
            style={{ background: "#0a1429" }}
          >
            <p
              className="display mx-auto my-6 max-w-md text-balance px-6 text-center md:p-6"
              style={{
                fontSize: "clamp(18px, 1.8vw, 24px)",
                color: "#f4f6fb",
              }}
            >
              Habits + skills, weighted and scored.
            </p>
            <CardContent className="mt-auto h-fit">
              <div className="relative mb-6 sm:mb-0">
                <div
                  className="absolute -inset-6"
                  style={{
                    background:
                      "radial-gradient(50% 75% at 75% 50%, transparent, #04060c 100%)",
                  }}
                />
                <div
                  className="aspect-[76/59] overflow-hidden rounded-r-lg border flex items-center justify-center"
                  style={{
                    background: "#04060c",
                    borderColor: "rgba(255,255,255,0.08)",
                  }}
                >
                  <p className="text-xs uppercase tracking-[0.18em]" style={{ color: "#5a6478" }}>
                    Habit tracker screenshot
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 3 — Shortcut system (col-2, keys) */}
          <Card
            className="group p-6 shadow-black/20 sm:col-span-2 sm:rounded-none sm:rounded-bl-xl md:p-12 border-white/[0.08]"
            style={{ background: "#0a1429" }}
          >
            <p
              className="display mx-auto mb-12 max-w-md text-balance text-center"
              style={{
                fontSize: "clamp(18px, 1.8vw, 24px)",
                color: "#f4f6fb",
              }}
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
