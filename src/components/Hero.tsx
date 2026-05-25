"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { HeroAppMockup } from "./hero/HeroAppMockup";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.el-portal.app";

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring" as const,
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
};

export default function Hero() {
  return (
    <main className="relative overflow-hidden" style={{ background: "#04060c" }}>
      {/* Atmospheric blue-tinted radials on the left (adapted from tailark) */}
      <div
        aria-hidden
        className="z-[2] absolute inset-0 pointer-events-none isolate opacity-50 contain-strict hidden lg:block"
      >
        <div className="w-[35rem] h-[80rem] -translate-y-[350px] absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,rgba(68,135,214,0.10)_0,rgba(56,103,214,0.04)_50%,rgba(8,56,133,0)_80%)]" />
        <div className="h-[80rem] absolute left-0 top-0 w-56 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,rgba(119,183,237,0.06)_0,rgba(56,103,214,0.02)_80%,transparent_100%)] [translate:5%_-50%]" />
        <div className="h-[80rem] -translate-y-[350px] absolute left-0 top-0 w-56 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,rgba(119,183,237,0.04)_0,rgba(56,103,214,0.02)_80%,transparent_100%)]" />
      </div>

      <section>
        <div className="relative pt-24 md:pt-36">
          {/* Bottom fade so radial atmosphere blends into the next section */}
          <div
            aria-hidden
            className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,#04060c_75%)]"
          />

          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
              <AnimatedGroup variants={transitionVariants}>
                {/* Announcement pill with arrow-swap hover (adapted from tailark) */}
                <Link
                  href={APP_URL}
                  className="group mx-auto flex w-fit items-center gap-4 rounded-full border p-1 pl-4 transition-colors duration-300"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    borderColor: "rgba(255,255,255,0.10)",
                  }}
                >
                  <span className="text-sm" style={{ color: "#aab3c5" }}>
                    V2 is live — public access
                  </span>
                  <span
                    className="block h-4 w-0.5"
                    style={{ background: "rgba(255,255,255,0.15)" }}
                  />
                  <div
                    className="size-6 overflow-hidden rounded-full duration-500"
                    style={{ background: "rgba(255,255,255,0.06)" }}
                  >
                    <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                      <span className="flex size-6">
                        <ArrowRight className="m-auto size-3" style={{ color: "#f4f6fb" }} />
                      </span>
                      <span className="flex size-6">
                        <ArrowRight className="m-auto size-3" style={{ color: "#f4f6fb" }} />
                      </span>
                    </div>
                  </div>
                </Link>

                {/* H1 — Special Gothic Expanded One uppercase */}
                <h1
                  className="display mt-8 max-w-4xl mx-auto text-balance lg:mt-16"
                  style={{
                    fontSize: "clamp(42px, 4.2vw, 58px)",
                    color: "#f4f6fb",
                  }}
                >
                  The final operating system for high-performers.
                </h1>

                {/* Sub — narrative prose */}
                <p
                  className="mx-auto mt-8 max-w-2xl text-balance text-lg leading-[1.55]"
                  style={{ color: "#aab3c5" }}
                >
                  Versions plan a 90-day identity. Cycles run a 15-day focus. Track habits, goals, biometrics... The system analyzes the trends the eye misses.
                </p>
              </AnimatedGroup>

              {/* CTAs */}
              <AnimatedGroup
                variants={{
                  container: {
                    visible: {
                      transition: {
                        staggerChildren: 0.05,
                        delayChildren: 0.75,
                      },
                    },
                  },
                  ...transitionVariants,
                }}
                className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row"
              >
                <Button key={1} asChild variant="brand" size="lg" className="text-base">
                  <Link href={APP_URL}>
                    <span className="text-nowrap">Open El Portal</span>
                  </Link>
                </Button>
                <Button
                  key={2}
                  asChild
                  size="lg"
                  variant="brand-link"
                  className="text-base"
                >
                  <Link href="/methodology">
                    <span className="text-nowrap">Read the methodology</span>
                  </Link>
                </Button>
              </AnimatedGroup>
            </div>
          </div>

          {/* App mockup framed wrapper (adapted from tailark) */}
          <AnimatedGroup
            variants={{
              container: {
                visible: {
                  transition: {
                    staggerChildren: 0.05,
                    delayChildren: 0.75,
                  },
                },
              },
              ...transitionVariants,
            }}
          >
            <div className="relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20">
              <div
                aria-hidden
                className="absolute inset-0 z-10 from-transparent from-35%"
                style={{
                  background: "linear-gradient(to bottom, transparent 0%, transparent 35%, #04060c 100%)",
                }}
              />
              <div
                className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl border p-4"
                style={{
                  background: "#04060c",
                  borderColor: "rgba(255,255,255,0.08)",
                  boxShadow: "0 30px 80px rgba(0, 0, 0, 0.4)",
                }}
              >
                <HeroAppMockup />
              </div>
            </div>
          </AnimatedGroup>
        </div>
      </section>
    </main>
  );
}
