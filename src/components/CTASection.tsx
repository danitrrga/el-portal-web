import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";

const SECTION_BG = "var(--color-ep-section-bg)";
const FG_STRONG = "var(--color-ep-fg-strong)";
const FG = "var(--color-ep-fg)";
const FG_MUTED = "var(--color-ep-fg-muted-2)";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.el-portal.app";

// Stays a Server Component (getTranslations from next-intl/server) — this is
// a static marketing section with no interactivity, and adding a client
// directive here would ship it into the client bundle for no gain.
export default async function CTASection() {
  const t = await getTranslations("common");

  return (
    <section
      className="relative overflow-hidden py-16 md:py-32"
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
          className="display text-balance text-[clamp(1.5rem,2.679vw+0.964rem,2.25rem)] md:text-[clamp(36px,4.6vw,58px)]"
          style={{
            color: FG_STRONG,
          }}
        >
          {t("cta.heading")}
        </h2>

        <p
          className="mt-6 text-[15px] md:text-lg leading-[1.6] text-balance mx-auto max-w-xl"
          style={{ color: FG }}
        >
          {t("cta.body")}
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 md:flex-row md:gap-6">
          <Button asChild variant="brand" size="lg" className="text-base">
            <Link href={APP_URL}>
              <span className="text-nowrap">{t("cta.button")}</span>
            </Link>
          </Button>
          <span
            className="text-[11px] font-medium uppercase tracking-[0.18em]"
            style={{ color: FG_MUTED }}
          >
            {t("cta.microcopy")}
          </span>
        </div>
      </div>
    </section>
  );
}
