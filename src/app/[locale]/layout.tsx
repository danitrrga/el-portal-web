import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Inter, JetBrains_Mono, Instrument_Serif, Special_Gothic_Expanded_One } from "next/font/google";
import { MotionProvider } from "@/components/MotionProvider";
import { LocaleHint } from "@/components/LocaleHint";
import { routing, type Locale } from "@/i18n/routing";
import { getSiteOrigin } from "@/lib/seo";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "900"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

const specialGothicExpandedOne = Special_Gothic_Expanded_One({
  variable: "--font-special-gothic-expanded",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  adjustFontFallback: false,
});

/**
 * Root-level fallback only — every route under `[locale]` already exports
 * its own `generateMetadata` delegating to `buildPageMetadata` (07-01), which
 * overrides `title`/`description` per page. This still has to be per-locale
 * (an English fallback leaking onto a Spanish 404, for instance, is exactly
 * the kind of inherited-English-metadata this plan exists to close) and
 * `metadataBase` has to live here once, from the confirmed origin, so every
 * page's relative OG image paths resolve against the real site instead of
 * `undefined`.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: "metadata" });

  return {
    metadataBase: new URL(getSiteOrigin()),
    title: t("home.title"),
    description: t("home.description"),
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#02030a",
  colorScheme: "dark",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  // The hint speaks Spanish on an English page, so its copy resolves from
  // the "es" catalogue regardless of the surrounding request locale — never
  // hardcoded here, never duplicated into en/common.json as real content.
  // Only rendered server-side when the route locale is "en"; the mirror
  // case (cookie "en" while reading /es/*) is deliberately out of scope —
  // see 07-04-PLAN.md Task 3.
  const hintT = locale === "en" ? await getTranslations({ locale: "es", namespace: "common" }) : null;

  return (
    <html lang={locale} className="dark">
      <head>
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${instrumentSerif.variable} ${specialGothicExpandedOne.variable} bg-[#02030a] text-slate-300 font-sans antialiased selection:bg-primary/30 selection:text-white`}
      >
        <NextIntlClientProvider>
          <MotionProvider>{children}</MotionProvider>
          {hintT && (
            <LocaleHint
              message={hintT("localeHint.message")}
              action={hintT("localeHint.action")}
              dismissLabel={hintT("localeHint.dismissLabel")}
              label={hintT("localeHint.label")}
            />
          )}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
