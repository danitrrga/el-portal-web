import Link from "next/link";
import { Button } from "@/components/ui/button";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.el-portal.app";

export default function FeaturesCTASection() {
  return (
    <section
      className="relative overflow-hidden py-24 md:py-32"
      style={{ background: "var(--color-ep-section-bg)" }}
    >
      {/* Top hairline — gradient fade */}
      <div
        aria-hidden
        className="absolute left-0 right-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, var(--color-ep-hairline), transparent)",
        }}
      />

      {/* Atmospheric backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 90% at 50% 0%, var(--color-ep-accent-alpha-12), transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <h2
          className="display text-balance"
          style={{
            fontSize: "clamp(36px, 4.6vw, 58px)",
            color: "var(--color-ep-fg-strong)",
          }}
        >
          Start your first Version.
        </h2>

        <p
          className="mt-6 text-base md:text-lg leading-[1.6] text-balance mx-auto max-w-xl"
          style={{ color: "var(--color-ep-fg)" }}
        >
          Open El Portal, set your arc, run your first Cycle. The system
          tracks habits, goals, and patterns — you stay focused on the
          work.
        </p>

        {/* D-10: primary → APP_URL, secondary → /pricing */}
        <div className="mt-10 flex flex-col items-center justify-center gap-3 md:flex-row md:gap-6">
          <Button asChild variant="brand" size="lg" className="text-base">
            <Link href={APP_URL}>
              <span className="text-nowrap">Open El Portal</span>
            </Link>
          </Button>
          <Button asChild variant="brand-link" size="lg">
            <Link href="/pricing">See pricing</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
