"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

// MCP logo — 3-node mesh graph at center
const McpLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="6" cy="18" r="2.5" />
    <circle cx="18" cy="18" r="2.5" />
    <circle cx="12" cy="5" r="2.5" />
    <line x1="7.5" y1="16" x2="11" y2="7" />
    <line x1="16.5" y1="16" x2="13" y2="7" />
    <line x1="8.5" y1="18" x2="15.5" y2="18" />
  </svg>
);

const Gemini = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12.0001 9.1716L14.8285 6.34313L17.6569 9.1716L14.8285 12.0001L12.0001 9.1716Z" />
    <path d="M9.17157 12.0001L6.34311 14.8285L9.17157 17.6569L12.0001 14.8285L9.17157 12.0001Z" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z"
    />
  </svg>
);

const Replit = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M8.28,3.027,3.16,8.147v7.706l5.12,5.12h7.706l5.12-5.12V8.147L15.987,3.027ZM9.033,9.44h5.933v2.373H9.033Zm0,3.56h5.933v2.373H9.033Z" />
  </svg>
);

const MagicUI = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M12 3v6M6.343 6.343l4.243 4.243M3 12h6m-1.657 5.657l4.243-4.243M12 21v-6m5.657-4.343l-4.243 4.243M21 12h-6m1.657-5.657l-4.243 4.243" />
  </svg>
);

const VSCodium = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M22.5 1.5l-13 10.375v9.625l13 1.5V1.5zm-14.5.5L1.625 8.125 8 12l-6.375 3.875L8 22l6.5-4.5V5z" />
  </svg>
);

const MediaWiki = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M4.11 15.35c.42 0 .8-.14 1.09-.42l1.01-1.02a.84.84 0 00.25-.6c0-.23-.08-.44-.25-.6L4.25 10.7a1.44 1.44 0 00-1.09-.44c-.41 0-.8.15-1.1.44l-.8.8c-.3.3-.44.68-.44 1.1s.15.8.44 1.1l.8.8c.3.28.68.41 1.09.41zm15.78 0c.41 0 .8-.14 1.09-.42l.8-.8c.3-.3.44-.68-.44-1.1s-.14-.8-.44-1.1l-.8-.8a1.44 1.44 0 00-1.09-.44c-.42 0-.8.15-1.09.44l-1.96 1.97c-.17.16-.25.37-.25.6s.08.44.25.6l1.01 1.02c.28.28.67.42 1.09.42zM12 2.01c.41 0 .8.15 1.1.44l.8.8c.3.3.44.68.44 1.1s-.14.8-.44 1.1l-1.95 1.96a.84.84 0 01-.6.25c-.24 0-.45-.08-.61-.25L9.72 6.46a1.44 1.44 0 01-.44-1.1c0-.41.15-.8.44-1.1l.8-.8c.3-.3.68-.44 1.09-.44zm0 11.28c.41 0 .8.14 1.09.42l1.01 1.01c.17.17.25.38.25.61s-.08.44-.25.6L12.09 18a1.44 1.44 0 01-1.09.44c-.41 0-.8-.14-1.09-.44l-1.01-1.01a.84.84 0 01-.25-.6c0-.24.08-.45.25-.61l2-1.96c.28-.28.67-.42 1.09-.42zm-2.65 6.36c.42 0 .8-.14 1.09-.42l1.96-1.96a.84.84 0 00.25-.6c0-.24-.08-.45-.25-.61L9.4 14.1c-.3-.3-.68-.44-1.09-.44-.41 0-.8.15-1.09.44l-.8.8c-.3.3-.44.68-.44 1.1s.15.8.44 1.1l.8.8c.3.28.68.41 1.09.41zm10.6-5.26c-.17-.17-.38-.25-.6-.25-.24 0-.45.08-.61.25l-2 1.96c-.3.3-.44.68-.44 1.09s.14.8.44 1.09l1.01 1.01c.28.28.67.42 1.09.42.41 0 .8-.14 1.09-.42l.8-.8c.3-.3.44-.68-.44-1.1s-.14-.8-.44-1.1l-.8-.8a1.44 1.44 0 00-1.09-.44z" />
  </svg>
);

const GooglePaLM = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M12 2a10 10 0 0 0-4.32 19.14" />
    <path d="M12 2a10 10 0 0 1 4.32 19.14" />
    <path d="M12 2v8" />
    <path d="M17.68 6.86a6 6 0 0 1-11.36 0" />
    <path d="M4 12H2" />
    <path d="M22 12h-2" />
    <path d="M12 12v10" />
  </svg>
);

export default function McpIntegrationSection() {
  return (
    <section>
      <div className="py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="aspect-16/10 group relative mx-auto flex max-w-[22rem] items-center justify-between sm:max-w-sm">
            <div
              role="presentation"
              className="bg-linear-to-b border-foreground/5 absolute inset-0 z-10 aspect-square animate-spin items-center justify-center rounded-full border-t from-lime-500/15 to-transparent to-25% opacity-0 duration-[3.5s] group-hover:opacity-100 dark:from-white/5"
            ></div>
            <div
              role="presentation"
              className="bg-linear-to-b border-foreground/5 absolute inset-16 z-10 aspect-square scale-90 animate-spin items-center justify-center rounded-full border-t from-blue-500/15 to-transparent to-25% opacity-0 duration-[3.5s] group-hover:opacity-100"
            ></div>
            <div className="bg-linear-to-b from-muted-foreground/15 absolute inset-0 flex aspect-square items-center justify-center rounded-full border-t to-transparent to-25%">
              <IntegrationCard className="-translate-x-1/6 absolute left-0 top-1/4 -translate-y-1/4">
                <Gemini />
              </IntegrationCard>
              <IntegrationCard className="absolute top-0 -translate-y-1/2">
                <Replit />
              </IntegrationCard>
              <IntegrationCard className="translate-x-1/6 absolute right-0 top-1/4 -translate-y-1/4">
                <MagicUI />
              </IntegrationCard>
            </div>
            <div className="bg-linear-to-b from-muted-foreground/15 absolute inset-16 flex aspect-square scale-90 items-center justify-center rounded-full border-t to-transparent to-25%">
              <IntegrationCard className="absolute top-0 -translate-y-1/2">
                <VSCodium />
              </IntegrationCard>
              <IntegrationCard className="absolute left-0 top-1/4 -translate-x-1/4 -translate-y-1/4">
                <MediaWiki />
              </IntegrationCard>
              <IntegrationCard className="absolute right-0 top-1/4 -translate-y-1/4 translate-x-1/4">
                <GooglePaLM />
              </IntegrationCard>
            </div>
            <div className="absolute inset-x-0 bottom-0 mx-auto my-2 flex w-fit justify-center gap-2">
              <div className="bg-muted relative z-20 rounded-full border p-1">
                <IntegrationCard
                  className="shadow-black-950/10 dark:bg-background size-16 border-black/20 shadow-xl dark:border-white/25 dark:shadow-white/15"
                  isCenter={true}
                >
                  <McpLogo className="text-[#f4f6fb]" />
                </IntegrationCard>
              </div>
            </div>
          </div>
          <div className="bg-linear-to-t from-background relative z-20 mx-auto mt-12 max-w-lg space-y-6 from-55% text-center">
            <h2
              className="display text-balance"
              style={{
                fontSize: "clamp(28px, 3.2vw, 40px)",
                color: "#f4f6fb",
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
