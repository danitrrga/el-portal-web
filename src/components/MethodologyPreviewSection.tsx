import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const SECTION_BG = "var(--color-ep-section-bg)";
const FG_STRONG = "var(--color-ep-fg-strong)";
const FG = "var(--color-ep-fg)";
const FG_MUTED = "var(--color-ep-fg-muted-2)";
const FG_SUBTLE = "var(--color-ep-fg-subtle-2)";

const PRINCIPLES = [
  {
    num: "01",
    title: "Identity drives behavior.",
    body: "You decide who you want to become. Cycles align around that direction, focusing on the skills and habits your future identity requires. Days keep you consistent.",
  },
  {
    num: "02",
    title: "Data collection is essential",
    body: "You can’t improve what you don’t understand. Track the parts of your life that matter, and build a clearer picture of how you think, work, and live.",
  },
  {
    num: "03",
    title: "The system works for you.",
    body: "You do the work. The system analyzes patterns, weighs signals, and surfaces what matters most. A curated tool designed to support your growth, not demand your attention.",
  },
];

export default function MethodologyPreviewSection() {
  return (
    <section
      className="relative overflow-hidden py-24 md:py-32"
      style={{ background: SECTION_BG }}
    >
      {/* Atmospheric backdrop — same recipe as VCD / CTA */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 80% at 50% 0%, var(--color-ep-accent-alpha-08), transparent 65%)`,
        }}
      />

      <div className="relative mx-auto max-w-3xl px-6">
        {/* Heading */}
        <div className="text-center mb-16">
          <span
            className="text-[11px] font-medium uppercase tracking-[0.22em]"
            style={{ color: FG_MUTED }}
          >
            Methodology
          </span>
          <h2
            className="display text-balance mt-4"
            style={{
              fontSize: "clamp(28px, 3.2vw, 40px)",
              color: FG_STRONG,
            }}
          >
            A method, not a vibe.
          </h2>
          <p
            className="mt-5 text-base leading-[1.6] mx-auto max-w-xl"
            style={{ color: FG }}
          >
            El Portal isn&apos;t a template you fill in. Every mechanic
            answers to three principles that shape the rest of the system.
          </p>
        </div>

        {/* Principles — numbered stack, editorial */}
        <ol className="space-y-10">
          {PRINCIPLES.map((p) => (
            <li
              key={p.num}
              className="grid grid-cols-[auto_1fr] gap-6 md:gap-8"
            >
              <span
                className="text-[14px] font-medium tabular-nums leading-[1.15] pt-1"
                style={{ color: FG_SUBTLE }}
              >
                {p.num}
              </span>
              <div>
                <h3
                  className="text-lg md:text-xl font-semibold leading-[1.2]"
                  style={{ color: FG_STRONG }}
                >
                  {p.title}
                </h3>
                <p
                  className="mt-2 text-base leading-[1.6]"
                  style={{ color: FG }}
                >
                  {p.body}
                </p>
              </div>
            </li>
          ))}
        </ol>

        {/* CTA — read the full methodology */}
        <div className="mt-16 flex justify-center">
          <Button asChild variant="brand-link" size="lg" className="text-base">
            <Link href="/features" className="group inline-flex items-center gap-1.5">
              Read the full methodology
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
