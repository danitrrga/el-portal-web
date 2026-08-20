import { getTranslations, setRequestLocale } from "next-intl/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChangelogItem, type ChangelogEntry } from "@/components/ChangelogItem";
import { buildPageMetadata } from "@/lib/seo";

const SECTION_BG = "#04060c";
const FG_STRONG = "#f4f6fb";
const FG = "#aab3c5";
const FG_MUTED = "#8590a8";
const ACCENT = "#4487D6";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildPageMetadata(locale, "changelog");
}

export default async function ChangelogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // `src/messages/es/changelog.json` sits at exactly `{}` until plan 07-14
  // translates it — same page-scoped English-fallback shape 07-11 used for
  // `/features` (`t.has()` gates the fallback, scoped to this page only,
  // never touching the shared i18n request config). This is what lets
  // `/es/changelog` keep prerendering with temporarily-English copy in the
  // interim, instead of throwing MISSING_MESSAGE from a bare `t()`/`t.raw()`
  // call. Once 07-14 fills the file, `t.has()` is true and this branch stops
  // firing.
  let t = await getTranslations("changelog");
  if (!t.has("page.heading")) {
    t = await getTranslations({ locale: "en", namespace: "changelog" });
  }

  const entries = t.raw("entries") as ChangelogEntry[];

  return (
    <div className="relative min-h-viewport w-full" style={{ background: SECTION_BG }}>
      {/* Atmospheric top-light radial — same recipe as CTA / Methodology */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[700px]"
        style={{
          background: `radial-gradient(ellipse 60% 80% at 50% 0%, ${ACCENT}14, transparent 65%)`,
        }}
      />

      <Navbar />

      <main className="relative z-10 mx-auto w-full max-w-5xl px-6 pt-28 pb-24 md:pt-36 lg:px-8">
        {/* Hero — Raycast-style: big bold heading, no subtitle */}
        <header className="mb-6 md:mb-10">
          <h1
            className="display text-balance leading-[1.05] text-[clamp(2rem,3.92vw+1.12rem,3rem)] md:text-[clamp(48px,6vw,80px)]"
            style={{
              color: FG_STRONG,
            }}
          >
            {t("page.heading")}
          </h1>
          <p
            className="mt-5 max-w-xl text-[15px] leading-[1.6] md:text-base"
            style={{ color: FG }}
          >
            {t("page.subheading")}
          </p>
        </header>

        {/* Top hairline anchoring the entry list */}
        <div
          aria-hidden
          className="h-px"
          style={{ background: "rgba(255,255,255,0.06)" }}
        />

        {/* Entries — flat list with hairline dividers, sticky left rail */}
        <div>
          {entries.map((entry, i) => (
            <ChangelogItem
              key={entry.version + entry.date + i}
              entry={entry}
              isLast={i === entries.length - 1}
            />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
