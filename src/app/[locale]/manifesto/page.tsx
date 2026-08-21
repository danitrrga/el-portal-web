import { getTranslations, setRequestLocale } from "next-intl/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { buildPageMetadata } from "@/lib/seo";

const SECTION_BG = "var(--color-ep-section-bg)";
const FG_STRONG = "var(--color-ep-fg-strong)";
const FG = "var(--color-ep-fg)";
const FG_MUTED = "var(--color-ep-fg-muted-2)";
// Foreground ramp is intentionally THREE steps on this surface, not four.
// The AA contrast remediation in phase 05 pointed the old `FG_SUBTLE`
// (`#5a6478`, 3.40:1 on `#04060c`) at `--color-ep-fg-muted-2` (`#8590a8`,
// 6.32:1) — the exact value `FG_MUTED` already held. Keeping both names would
// be a constant that lies: every FG_SUBTLE-vs-FG_MUTED distinction rendered
// identically. `FG_SUBTLE` is therefore removed rather than left as a dead
// alias. Restoring a real fourth step needs a new AA-clearing token
// (`--color-ep-fg-subtle-2` = `#5a6478` does not clear AA) — a design decision,
// not a mechanical one.
// ACCENT / ACCENT_LIGHT deliberately stay raw hex. They are consumed as
// hex-alpha template literals (`${ACCENT}14`, `${ACCENT_LIGHT}4d`, ...), and
// `var(--color-ep-accent)14` is invalid CSS — the swap would silently drop the
// declaration. The project convention (01-02-PLAN.md) is a pre-baked alpha
// token per opacity; only `--color-ep-accent-alpha-12/-08` and
// `--color-ep-accent-light-alpha-80` exist today, and these files need five
// more (33, 66, 4d, 40, 59). Minting design tokens is a design decision, so
// this is logged as debt in deferred-items.md rather than guessed at here.
const ACCENT = "#4487D6";
const ACCENT_LIGHT = "#77B7ED";

// `act` is catalogue-driven text (translated per locale), not a fixed
// English literal union — the render is a filter (`p.act === act.name`)
// evaluated entirely within one locale's own catalogue values, so the
// grouping stays correct even though the strings differ between en/es.
type Principle = {
  num: string;
  act: string;
  title: string;
  body: string;
};

type ActInfo = {
  name: string;
  range: string;
};

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

function ActLabel({ name, range }: { name: string; range: string }) {
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildPageMetadata(locale, "manifesto");
}

export default async function ManifestoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("manifesto");

  // Raw accessor, not per-key lookups: PRINCIPLES/ACTS stay ordered arrays
  // in the catalogue so the parity gate can compare array lengths and a
  // reordering shows up as a visible diff. `act` is preserved as DATA on
  // each principle — the render below is a filter, and translating that
  // field on one locale silently empties an act if the two sides diverge.
  const principles = t.raw("principles") as Principle[];
  const acts = t.raw("acts") as ActInfo[];

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
            className="display text-balance leading-[1.05] text-[clamp(1.438rem,2.009vw+1.036rem,2rem)] md:text-[clamp(32px,3.6vw,48px)]"
            style={{
              color: FG_STRONG,
            }}
          >
            {t("hero.headline")}
          </h1>
          <p
            className="mt-5 max-w-2xl text-[15px] leading-[1.6] md:text-base"
            style={{ color: FG }}
          >
            {t("hero.body")}
          </p>
        </header>

        {/* Three acts: Foundation → Method → Practice */}
        <div className="space-y-14 md:space-y-20">
          {acts.map((act) => {
            const actPrinciples = principles.filter((p) => p.act === act.name);
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
