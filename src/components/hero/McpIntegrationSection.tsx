"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PortalIcon } from "@/components/PortalIcon";
import { AnimatedGroup } from "@/components/ui/animated-group";

// Simplified monotone glyphs for MCP clients (placeholders — swap for real brand SVGs later)
const ClaudeLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...props}>
    <path d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l3 3M16 16l3 3M5 19l3-3M16 8l3-3" />
  </svg>
);

const ChatGptLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 2a4 4 0 0 0-3.46 6A4 4 0 0 0 8 14a4 4 0 0 0 4 4 4 4 0 0 0 4-4 4 4 0 0 0-.54-6A4 4 0 0 0 12 2z" />
    <path d="M12 12v6M12 12L7 9M12 12l5-3" />
  </svg>
);

const CursorLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M3 3l9 18 3-9 9-3L3 3z" />
  </svg>
);

const ClineLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...props}>
    <circle cx="6" cy="12" r="2" />
    <circle cx="18" cy="12" r="2" />
    <path d="M8 12h8" />
  </svg>
);

const WindsurfLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...props}>
    <path d="M2 12c4-4 8-4 12 0s8 4 12 0" />
    <path d="M2 17c4-4 8-4 12 0s8 4 12 0" />
  </svg>
);

const ZedLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M4 4h16v3l-10 10h10v3H4v-3l10-10H4z" />
  </svg>
);

const SatelliteCard = ({
  children,
  className,
  isCenter = false,
}: {
  children: React.ReactNode;
  className?: string;
  isCenter?: boolean;
}) => (
  <div
    className={cn(
      "relative z-30 flex size-12 rounded-full border bg-white/[0.04] backdrop-blur-md shadow-sm shadow-black/40",
      className
    )}
    style={{
      borderColor: "rgba(255,255,255,0.10)",
    }}
  >
    <div
      className={cn(
        "m-auto size-fit text-[#f4f6fb] *:size-5",
        isCenter && "*:size-8"
      )}
    >
      {children}
    </div>
  </div>
);

export default function McpIntegrationSection() {
  return (
    <section className="relative" style={{ background: "#04060c" }}>
      <div className="py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <AnimatedGroup
            variants={{
              container: {
                visible: {
                  transition: { staggerChildren: 0.08, delayChildren: 0.1 },
                },
              },
              item: {
                hidden: { opacity: 0, filter: "blur(12px)", y: 12 },
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
            }}
          >
            {/* Orbital visual */}
            <div className="aspect-[16/10] group relative mx-auto flex max-w-[22rem] items-center justify-between sm:max-w-sm">
              {/* Outer rotating ring (visible on hover only) */}
              <div
                role="presentation"
                aria-hidden
                className="absolute inset-0 z-10 aspect-square animate-spin items-center justify-center rounded-full border-t opacity-0 duration-[3.5s] group-hover:opacity-100"
                style={{
                  borderTopColor: "rgba(255,255,255,0.05)",
                  background:
                    "radial-gradient(circle, rgba(68,135,214,0.15) 0%, transparent 25%)",
                }}
              />
              <div
                role="presentation"
                aria-hidden
                className="absolute inset-16 z-10 aspect-square scale-90 animate-spin items-center justify-center rounded-full border-t opacity-0 duration-[3.5s] group-hover:opacity-100"
                style={{
                  borderTopColor: "rgba(255,255,255,0.05)",
                  background:
                    "radial-gradient(circle, rgba(119,183,237,0.15) 0%, transparent 25%)",
                }}
              />

              {/* Outer constellation (Claude / ChatGPT / Cursor) */}
              <div
                className="absolute inset-0 flex aspect-square items-center justify-center rounded-full border-t"
                style={{
                  borderTopColor: "rgba(133,144,168,0.20)",
                  background:
                    "radial-gradient(circle, rgba(133,144,168,0.06) 0%, transparent 25%)",
                }}
              >
                <SatelliteCard className="absolute left-0 top-1/4 -translate-x-1/6 -translate-y-1/4">
                  <ClaudeLogo />
                </SatelliteCard>
                <SatelliteCard className="absolute top-0 -translate-y-1/2">
                  <ChatGptLogo />
                </SatelliteCard>
                <SatelliteCard className="absolute right-0 top-1/4 translate-x-1/6 -translate-y-1/4">
                  <CursorLogo />
                </SatelliteCard>
              </div>

              {/* Inner constellation (Cline / Windsurf / Zed) */}
              <div
                className="absolute inset-16 flex aspect-square scale-90 items-center justify-center rounded-full border-t"
                style={{
                  borderTopColor: "rgba(133,144,168,0.20)",
                  background:
                    "radial-gradient(circle, rgba(133,144,168,0.06) 0%, transparent 25%)",
                }}
              >
                <SatelliteCard className="absolute top-0 -translate-y-1/2">
                  <WindsurfLogo />
                </SatelliteCard>
                <SatelliteCard className="absolute left-0 top-1/4 -translate-x-1/4 -translate-y-1/4">
                  <ClineLogo />
                </SatelliteCard>
                <SatelliteCard className="absolute right-0 top-1/4 translate-x-1/4 -translate-y-1/4">
                  <ZedLogo />
                </SatelliteCard>
              </div>

              {/* Center: PortalIcon */}
              <div className="absolute inset-x-0 bottom-0 mx-auto my-2 flex w-fit justify-center gap-2">
                <div
                  className="relative z-20 rounded-full border p-1"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    borderColor: "rgba(255,255,255,0.10)",
                  }}
                >
                  <SatelliteCard
                    className="size-16 border-white/25 shadow-xl shadow-white/15"
                    isCenter
                  >
                    <PortalIcon size={32} />
                  </SatelliteCard>
                </div>
              </div>
            </div>

            {/* Heading + sub + CTA */}
            <div className="relative z-20 mx-auto mt-12 max-w-lg space-y-6 text-center">
              <h2
                className="display text-balance"
                style={{
                  fontSize: "clamp(28px, 3.2vw, 40px)",
                  color: "#f4f6fb",
                }}
              >
                Your agent keeps the record.
              </h2>
              <p
                className="text-base leading-[1.6]"
                style={{ color: "#aab3c5" }}
              >
                Connect Claude, Cursor, or any MCP-compatible agent. It reads habits, cycles, and trends. Writes back updates. The score moves while you do the work.
              </p>
              <Button asChild variant="brand-link" size="sm">
                <Link href="/mcp">
                  View the MCP server →
                </Link>
              </Button>
            </div>
          </AnimatedGroup>
        </div>
      </div>
    </section>
  );
}
