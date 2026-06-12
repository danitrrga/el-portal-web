"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { Bot, Cpu, Workflow, BrainCircuit, Cog, Terminal } from "lucide-react";

// Official MCP brand mark (icon paths only, from modelcontextprotocol.io/logo/dark.svg)
const McpLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 195 195"
    fill="none"
    stroke="currentColor"
    strokeWidth="12"
    strokeLinecap="round"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M25 97.8528L92.8822 29.9706C102.255 20.598 117.451 20.598 126.823 29.9706V29.9706C136.196 39.3431 136.196 54.5391 126.823 63.9117L75.5581 115.177" />
    <path d="M76.2652 114.47L126.823 63.9117C136.196 54.5391 151.392 54.5391 160.765 63.9117L161.118 64.2652C170.491 73.6378 170.491 88.8338 161.118 98.2063L99.7248 159.6C96.6006 162.724 96.6006 167.789 99.7248 170.913L112.331 183.52" />
    <path d="M109.853 46.9411L59.6482 97.1457C50.2756 106.518 50.2756 121.714 59.6482 131.087V131.087C69.0208 140.459 84.2167 140.459 93.5893 131.087L143.794 80.8822" />
  </svg>
);

export default function McpIntegrationSection() {
  return (
    <section>
      <div className="py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="aspect-16/10 group relative mx-auto flex max-w-[22rem] items-center justify-between sm:max-w-sm">
            {/* Outer ring — brand-blue top-light arc */}
            <div
              className="absolute inset-0 flex aspect-square items-center justify-center rounded-full border-t"
              style={{
                borderTopColor: "var(--color-ep-ring-border-outer)",
                background:
                  "radial-gradient(circle at 50% 0%, var(--color-ep-ring-bg-outer), transparent 55%)",
              }}
            >
              <IntegrationCard className="-translate-x-1/6 absolute left-0 top-1/4 -translate-y-1/4">
                <Bot />
              </IntegrationCard>
              <IntegrationCard className="absolute top-0 -translate-y-1/2">
                <Cpu />
              </IntegrationCard>
              <IntegrationCard className="translate-x-1/6 absolute right-0 top-1/4 -translate-y-1/4">
                <Workflow />
              </IntegrationCard>
            </div>
            {/* Inner ring — softer brand-blue glow */}
            <div
              className="absolute inset-16 flex aspect-square scale-90 items-center justify-center rounded-full border-t"
              style={{
                borderTopColor: "var(--color-ep-ring-border-inner)",
                background:
                  "radial-gradient(circle at 50% 0%, var(--color-ep-ring-bg-inner), transparent 55%)",
              }}
            >
              <IntegrationCard className="absolute top-0 -translate-y-1/2">
                <BrainCircuit />
              </IntegrationCard>
              <IntegrationCard className="absolute left-0 top-1/4 -translate-x-1/4 -translate-y-1/4">
                <Cog />
              </IntegrationCard>
              <IntegrationCard className="absolute right-0 top-1/4 -translate-y-1/4 translate-x-1/4">
                <Terminal />
              </IntegrationCard>
            </div>
            <div className="absolute inset-x-0 bottom-0 mx-auto my-2 flex w-fit justify-center gap-2">
              <div className="bg-muted relative z-20 rounded-full border p-1">
                <IntegrationCard
                  className="shadow-black-950/10 dark:bg-background size-16 border-black/20 shadow-xl dark:border-white/25 dark:shadow-white/15"
                  isCenter={true}
                >
                  <McpLogo className="text-[var(--color-ep-fg-strong)]" />
                </IntegrationCard>
              </div>
            </div>
          </div>
          <div className="bg-linear-to-t from-background relative z-20 mx-auto mt-12 max-w-lg space-y-6 from-55% text-center">
            <h2
              className="display text-balance"
              style={{
                fontSize: "clamp(28px, 3.2vw, 40px)",
                color: "var(--color-ep-fg-strong)",
              }}
            >
              Your agent keeps the record.
            </h2>
            <p className="text-muted-foreground">
              Connect Claude, Cursor, or any MCP-compatible agent. It reads habits, cycles, and trends. Writes back updates. The score moves while you do the work.
            </p>

            <Button variant="brand-link" size="sm" asChild>
              <Link href="/mcp">View the MCP server →</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

const IntegrationCard = ({
  children,
  className,
  isCenter = false,
}: {
  children: React.ReactNode;
  className?: string;
  isCenter?: boolean;
}) => {
  return (
    <div
      className={cn(
        "relative z-30 flex size-12 rounded-full border bg-white shadow-sm shadow-black/5 dark:bg-white/5 dark:backdrop-blur-md",
        className
      )}
    >
      <div className={cn("m-auto size-fit *:size-5", isCenter && "*:size-8")}>{children}</div>
    </div>
  );
};
