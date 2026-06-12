import Link from "next/link";
import { Button } from "@/components/ui/button";

const SECTION_BG = "var(--color-ep-section-bg)";
const FG_STRONG = "var(--color-ep-fg-strong)";
const FG = "var(--color-ep-fg)";
const FG_MUTED = "var(--color-ep-fg-muted-2)";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.el-portal.app";

export default function CTASection() {
  return (
    <section
      className="relative overflow-hidden py-24 md:py-32"
      style={{ background: SECTION_BG }}
    >
      {/* Top hairline — gradient fade so it doesn't read as a hard rule */}
      <div
        aria-hidden
        className="absolute left-0 right-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, var(--color-ep-hairline), transparent)",
        }}
      />

      {/* Atmospheric backdrop — top-light radial, mirrors VCDSection vocabulary */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 70% 90% at 50% 0%, var(--color-ep-accent-alpha-12), transparent 60%)`,
        }}
      />

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <h2
          className="display text-balance"
          style={{
            fontSize: "clamp(36px, 4.6vw, 58px)",
            color: FG_STRONG,
          }}
        >
          Start your first Version.
        </h2>

        <p
          className="mt-6 text-base md:text-lg leading-[1.6] text-balance mx-auto max-w-xl"
          style={{ color: FG }}
        >
          Open El Portal, draft a 90-day arc, run your first Cycle. The
          system tracks, analyzes, and surfaces patterns — you focus on
          the work.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 md:flex-row md:gap-6">
          <Button asChild variant="brand" size="lg" className="text-base">
            <Link href={APP_URL}>
              <span className="text-nowrap">Open El Portal</span>
            </Link>
          </Button>
          <span
            className="text-[11px] font-medium uppercase tracking-[0.18em]"
            style={{ color: FG_MUTED }}
          >
            No card · set up in under 10 minutes
          </span>
        </div>
      </div>
    </section>
  );
}
