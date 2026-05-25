"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { HeroAppMockup } from "./hero/HeroAppMockup";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: EASE },
    },
  };

  return (
    <section
      className="relative min-h-[110vh] overflow-hidden"
      style={{ background: "#04060c" }}
    >
      {/* Top atmosphere bloom */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 40% at 50% -10%, rgba(56,103,214,0.22), transparent 60%)",
        }}
      />
      {/* Dot pattern */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage:
            "radial-gradient(ellipse 60% 50% at 50% 0%, black 50%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 60% 50% at 50% 0%, black 50%, transparent 100%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1100px] px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="pt-40 text-center"
        >
          {/* Eyebrow */}
          <motion.div variants={itemVariants} className="flex justify-center">
            <span
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-[11px] font-medium uppercase tracking-[0.18em]"
              style={{
                color: "#8590a8",
                borderColor: "rgba(255,255,255,0.10)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "#4487D6" }}
              />
              V2 · public access
            </span>
          </motion.div>

          {/* H1 */}
          <motion.h1
            variants={itemVariants}
            className="display mt-7 mx-auto max-w-[1000px]"
            style={{
              fontSize: "clamp(42px, 4.2vw, 58px)",
              color: "#f4f6fb",
            }}
          >
            The final operating system<br />for high-performers.
          </motion.h1>

          {/* Sub */}
          <motion.p
            variants={itemVariants}
            className="mx-auto mt-7 max-w-[620px] text-[17px] leading-[1.6]"
            style={{ color: "#aab3c5" }}
          >
            Versions plan a 90-day identity. Cycles run a 15-day focus. Track habits, goals, biometrics... The system analyzes the trends the eye misses.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={itemVariants}
            className="mt-9 flex items-center justify-center gap-[18px]"
          >
            <a
              href={process.env.NEXT_PUBLIC_APP_URL ?? "https://app.el-portal.app"}
              className="inline-flex items-center gap-2 px-[22px] py-3 rounded-full text-sm font-medium border transition-colors"
              style={{
                color: "#f4f6fb",
                borderColor: "rgba(255,255,255,0.20)",
                background: "rgba(255,255,255,0.05)",
              }}
            >
              <span>Open El Portal</span>
              <span aria-hidden>→</span>
            </a>
            <a
              href="/methodology"
              className="text-sm font-medium transition-colors hover:text-[#f4f6fb]"
              style={{ color: "#aab3c5" }}
            >
              Read the methodology
            </a>
          </motion.div>

          {/* App mockup */}
          <motion.div variants={itemVariants}>
            <HeroAppMockup />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
