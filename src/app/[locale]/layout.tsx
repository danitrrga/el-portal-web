import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Inter, JetBrains_Mono, Instrument_Serif, Special_Gothic_Expanded_One } from "next/font/google";
import { MotionProvider } from "@/components/MotionProvider";
import { LocaleHint } from "@/components/LocaleHint";
import { routing } from "@/i18n/routing";
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

export const metadata: Metadata = {
  title: "El Portal - The personal OS",
  description:
    "El Portal is a mobile-first personal operating system. Manage habits with drag-and-drop, track deep work cycles, and align your goals, now with a unified architecture and semantic design system.",
};

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
