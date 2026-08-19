"use client";

import React from "react";
// Internal navigation (the pricing pill, "Read the methodology") uses the
// locale-aware Link (see src/i18n/navigation.ts); the external APP_URL CTA
// stays on next/link, aliased to avoid a name collision.
import { Link } from "@/i18n/navigation";
import ExternalLink from "next/link";
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
    <section className="relative overflow-hidden" style={{ background: "var(--color-ep-bg-base)" }}>
      {/* Atmospheric blue-tinted radials on the left (adapted from tailark) */}
      <div
        aria-hidden
        className="z-[2] absolute inset-0 pointer-events-none isolate contain-strict hidden lg:block"
      >
        <div className="w-[34rem] h-[80rem] -translate-y-[340px] absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,var(--color-ep-atmos-1)_0,var(--color-ep-atmos-2)_45%,rgba(8,56,133,0)_80%)]" />
        <div className="h-[80rem] absolute left-0 top-0 w-60 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,var(--color-ep-atmos-3)_0,var(--color-ep-atmos-4)_70%,transparent_100%)] [translate:5%_-50%]" />
        <div className="h-[80rem] -translate-y-[340px] absolute left-0 top-0 w-56 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,var(--color-ep-atmos-5)_0,var(--color-ep-atmos-6)_70%,transparent_100%)]" />
      </div>

      {/* Film-grain noise overlay for texture — masked out below mockup zone */}
      <div
        aria-hidden
        className="z-[3] absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='4.5' numOctaves='1' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1.4 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
          backgroundRepeat: "repeat",
          backgroundSize: "160px 160px",
          maskImage: "linear-gradient(to bottom, black 0%, black 40%, transparent 65%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 40%, transparent 65%)",
        }}
      />

      {/* Bottom fade to pure black — kills seam against next section */}
      <div
        aria-hidden
        className="z-[4] absolute inset-x-0 bottom-0 h-[40%] pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent 0%, var(--color-ep-fade-black) 100%)",
        }}
      />

      <section>
        <div className="relative pt-24 md:pt-36">
          {/* Bottom fade so radial atmosphere blends into the next section */}
          <div
            aria-hidden
            className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--color-ep-bg-base)_75%)]"
          />

          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
              <AnimatedGroup variants={transitionVariants}>
                {/* Announcement pill — promo: first 300 users get Pro lifetime free */}
                <Link
                  href="/pricing"
                  className="group mx-auto flex w-fit items-center gap-4 rounded-full border p-1 pl-4 transition-colors duration-300 min-h-11 md:min-h-0"
                  style={{
                    background: "var(--color-ep-pill-bg)",
                    borderColor: "var(--color-ep-pill-border)",
                  }}
                >
                  <span className="text-sm" style={{ color: "var(--color-ep-fg)" }}>
                    <span style={{ color: "var(--color-ep-accent-light)" }} className="font-medium">Early access</span>
                    <span style={{ color: "var(--color-ep-separator)" }}> · </span>
                    Launching soon · First 30 signups get Pro for life
                  </span>
                  <span
                    className="block h-4 w-0.5"
                    style={{ background: "var(--color-ep-divider)" }}
                  />
                  <div
                    className="size-6 overflow-hidden rounded-full duration-500"
                    style={{ background: "var(--color-ep-pill-btn-bg)" }}
                  >
                    <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                      <span className="flex size-6">
                        <ArrowRight className="m-auto size-3" style={{ color: "var(--color-ep-fg-strong)" }} />
                      </span>
                      <span className="flex size-6">
                        <ArrowRight className="m-auto size-3" style={{ color: "var(--color-ep-fg-strong)" }} />
                      </span>
                    </div>
                  </div>
                </Link>

                {/* H1 — Special Gothic Expanded One uppercase */}
                <h1
                  className="display mt-8 max-w-4xl mx-auto text-balance lg:mt-16 text-[clamp(1.625rem,3.571vw+0.911rem,2.625rem)] md:text-[clamp(42px,4.2vw,58px)]"
                  style={{
                    color: "var(--color-ep-fg-strong)",
                  }}
                >
                  The final operating system for high-performers.
                </h1>

                {/* Sub — narrative prose */}
                <p
                  className="mx-auto mt-8 max-w-2xl text-balance text-lg leading-[1.55]"
                  style={{ color: "var(--color-ep-fg)" }}
                >
                  Versions set the identity you're building. Cycles are the sprints inside them, aimed at the skills it takes. Track habits, goals, biometrics... The system analyzes the trends the eye misses.
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
                  <ExternalLink href={APP_URL}>
                    <span className="text-nowrap">Open El Portal</span>
                  </ExternalLink>
                </Button>
                <Button
                  key={2}
                  asChild
                  size="lg"
                  variant="brand-link"
                  className="text-base"
                >
                  <Link href="/features">
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
            <div className="relative z-[5] mt-6 overflow-hidden px-2 sm:mt-8 md:mt-10">
              <div
                aria-hidden
                className="absolute inset-0 z-10 from-transparent from-35%"
                style={{
                  background: "linear-gradient(to bottom, transparent 0%, transparent 70%, var(--color-ep-bg-base) 100%)",
                }}
              />
              <div
                className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl border p-4"
                style={{
                  background: "var(--color-ep-bg-base)",
                  borderColor: "var(--color-ep-frame-border)",
                  boxShadow: "0 30px 80px var(--color-ep-shadow-dark)",
                }}
              >
                <HeroAppMockup />
              </div>
            </div>
          </AnimatedGroup>
        </div>
      </section>
    </section>
  );
}
