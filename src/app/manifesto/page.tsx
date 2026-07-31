import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SECTION_BG = "#04060c";
const FG_STRONG = "#f4f6fb";
const FG = "#aab3c5";
const FG_MUTED = "#8590a8";
// Foreground ramp is intentionally THREE steps on this surface, not four.
// The AA contrast remediation in phase 05 pointed the old `FG_SUBTLE`
// (`#5a6478`, 3.40:1 on `#04060c`) at `--color-ep-fg-muted-2` (`#8590a8`,
// 6.32:1) — the exact value `FG_MUTED` already held. Keeping both names would
// be a constant that lies: every FG_SUBTLE-vs-FG_MUTED distinction rendered
// identically. `FG_SUBTLE` is therefore removed rather than left as a dead
// alias. Restoring a real fourth step needs a new AA-clearing token
// (`--color-ep-fg-subtle-2` = `#5a6478` does not clear AA) — a design decision,
// not a mechanical one.
const ACCENT = "#4487D6";
const ACCENT_LIGHT = "#77B7ED";

type Act = "Foundation" | "Method" | "Practice";

type Principle = {
  num: string;
  act: Act;
  title: string;
  body: string;
};

const PRINCIPLES: Principle[] = [
  {
    num: "01",
    act: "Foundation",
    title: "Identity comes first.",
    body:
      "You choose who you want to become. The system organizes the rest around that, including the skills your future identity needs, the habits that identity does without thinking, and the work that compounds toward it.",
  },
  {
    num: "02",
    act: "Foundation",
    title: "The horizon has three scales.",
    body:
      "A Version is 90 days. A Cycle is 15. A Day is one. Strip any of them away and planning collapses into either daydreaming or grind.",
  },
  {
    num: "03",
    act: "Method",
    title: "Track what your memory can't hold.",
    body:
      "You can't optimize what you can't see, and you can't see what you didn't capture. Log honestly. The patterns that matter aren't the ones you notice in the moment.",
  },
  {
    num: "04",
    act: "Method",
    title: "The system reads. You decide.",
    body:
      "El Portal weighs the signals, including correlations, recurrences, and ripples. It surfaces what's working. The verdict is yours. A companion, not a coach.",
  },
  {
    num: "05",
    act: "Method",
    title: "Friction is signal, not failure.",
    body:
      "When the same obstacle keeps showing up across cycles, that's data. The system flags recurrences so you address them at the root, rather than three months from now.",
  },
  {
    num: "06",
    act: "Practice",
    title: "Boring beats clever.",
    body:
      "Discipline compounds. The system protects the boring parts of the practice so the interesting work has somewhere to land.",
  },
  {
    num: "07",
    act: "Practice",
    title: "The right tool disappears.",
    body:
      "Check it at boot. Check it at shutdown. Invisible in between, while you do the work it supports.",
  },
];

const ACTS: { name: Act; range: string }[] = [
  { name: "Foundation", range: "01 — 02" },
  { name: "Method", range: "03 — 05" },
  { name: "Practice", range: "06 — 07" },
];

function CardDecorator() {
  const c = "rgba(119, 183, 237, 0.28)";
  return (
    <>
      <span
        aria-hidden
        className="absolute left-2 top-2 size-2 border-l border-t"
        style={{ borderColor: c }}
      />
      <span
        aria-hidden
        className="absolute right-2 top-2 size-2 border-r border-t"
        style={{ borderColor: c }}
      />
      <span
        aria-hidden
        className="absolute bottom-2 left-2 size-2 border-b border-l"
        style={{ borderColor: c }}
      />
      <span
        aria-hidden
        className="absolute bottom-2 right-2 size-2 border-b border-r"
        style={{ borderColor: c }}
      />
    </>
  );
}

function ActLabel({ name, range }: { name: Act; range: string }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <span
        className="font-mono text-[11px] uppercase tracking-[0.22em]"
        style={{ color: FG_MUTED }}
      >
        {name}
      </span>
      <span
        aria-hidden
        className="font-mono text-[10px]"
        style={{ color: FG_MUTED }}
      >
        ·
      </span>
      <span
        className="font-mono text-[11px] tabular-nums"
        style={{ color: FG_MUTED }}
      >
        {range}
      </span>
      <div
        aria-hidden
        className="ml-1 h-px flex-1"
        style={{ background: "rgba(255,255,255,0.06)" }}
      />
    </div>
  );
}

function PrincipleCard({ p }: { p: Principle }) {
  return (
    <article
      className="group relative rounded-xl p-6 md:p-8"
      style={{ background: "rgba(255,255,255,0.015)" }}
    >
      <CardDecorator />
      <div className="relative">
        <span
          className="mb-3 block font-mono text-[11px] uppercase tracking-[0.22em] tabular-nums"
          style={{ color: FG_MUTED }}
        >
          {p.num}
        </span>
        <h2
          className="mb-3 text-balance text-[17px] font-semibold leading-[1.25] tracking-tight md:text-[19px]"
          style={{ color: FG_STRONG }}
        >
          {p.title}
        </h2>
        <p
          className="text-[14px] leading-[1.65] md:text-[15px]"
          style={{ color: FG }}
        >
          {p.body}
        </p>
      </div>
    </article>
  );
}

export default function ManifestoPage() {
  return (
    <div
      className="relative min-h-viewport w-full"
      style={{ background: SECTION_BG }}
    >
      {/* Atmospheric top-light radial — same recipe as changelog / CTA */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[700px]"
        style={{
          background: `radial-gradient(ellipse 60% 80% at 50% 0%, ${ACCENT}14, transparent 65%)`,
        }}
      />

      <Navbar />

      <main className="relative z-10 mx-auto w-full max-w-3xl px-6 pt-24 pb-32 md:pt-32 lg:px-8">
        {/* Hero */}
        <header className="mb-14 md:mb-20">
          <h1
            className="display text-balance leading-[1.05]"
            style={{
              fontSize: "clamp(32px, 3.6vw, 48px)",
              color: FG_STRONG,
            }}
          >
            A method for becoming yourself.
          </h1>
          <p
            className="mt-5 max-w-2xl text-[15px] leading-[1.6] md:text-base"
            style={{ color: FG }}
          >
            El Portal is built around a single conviction: identity isn&apos;t
            discovered, it&apos;s chosen, designed, rehearsed. The system
            gives you the structure. You bring the will.
          </p>
        </header>

        {/* Three acts: Foundation → Method → Practice */}
        <div className="space-y-14 md:space-y-20">
          {ACTS.map((act) => {
            const actPrinciples = PRINCIPLES.filter((p) => p.act === act.name);
            return (
              <section key={act.name}>
                <ActLabel name={act.name} range={act.range} />
                <div className="space-y-4 md:space-y-5">
                  {actPrinciples.map((p) => (
                    <PrincipleCard key={p.num} p={p} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
