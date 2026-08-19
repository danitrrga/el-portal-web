"use client";

// D-10: text toggle only, no flags. D-12: switching preserves the current
// route via the locale-aware Link + usePathname pair from @/i18n/navigation
// (never next/link — a hand-built href swap cannot resolve the correct
// prefix under localePrefix: "as-needed").
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

interface LanguageSwitcherProps {
  /**
   * Selects the text size class ONLY — navbar and footer share every other
   * visual property. There is no third size for the mobile panel mount; it
   * passes context="navbar" because the panel is a nav instance.
   */
  context: "navbar" | "footer";
  /**
   * Called synchronously when a locale link is activated, after the cookie
   * writes and before/alongside navigation. The `#mobile-nav` panel mount
   * MUST pass Navbar's panel-close handler here — a client-side locale
   * navigation does not reset the panel's own open state. Desktop and
   * footer mounts have nothing to close and pass nothing.
   */
  onNavigate?: () => void;
}

/**
 * Writes both locale cookies BEFORE navigation begins. This is the fix for
 * the English-unreachable loop: src/proxy.ts negotiates at "/" only and
 * reads NEXT_LOCALE there but never writes it, so a reader on /es clicking
 * EN would otherwise land on the unprefixed "/", read the still-"es"
 * cookie, and bounce straight back to /es. Writing the cookie here, ahead
 * of the RSC navigation request, is what makes the choice stick.
 *
 * The second write expires NEXT_LOCALE_HINT so a reader who dismissed the
 * cross-locale hint and later changes language is not left permanently
 * unable to see it again — LocaleHint itself never clears this cookie, this
 * is the one place that owns every cookie the phase writes.
 */
function writeLocaleChoice(target: "en" | "es") {
  document.cookie = `NEXT_LOCALE=${target}; path=/; max-age=31536000; samesite=lax`;
  document.cookie = "NEXT_LOCALE_HINT=; path=/; max-age=0";
}

export function LanguageSwitcher({ context, onNavigate }: LanguageSwitcherProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("common");

  const textSizeClass = context === "navbar" ? "text-sm font-medium" : "text-sm";

  return (
    <div
      role="group"
      aria-label={t("switcher.label")}
      className={`flex items-center ${textSizeClass}`}
    >
      <Link
        href={pathname}
        locale="en"
        data-testid="locale-switch-en"
        aria-current={locale === "en" ? "page" : undefined}
        onClick={() => {
          writeLocaleChoice("en");
          onNavigate?.();
        }}
        className={[
          "flex min-h-11 min-w-11 items-center justify-center px-3 md:min-h-0 transition-colors duration-300",
          locale === "en"
            ? "text-[var(--color-ep-fg-strong)]"
            : "text-[var(--color-ep-fg)] hover:text-[var(--color-ep-fg-strong)]",
        ].join(" ")}
      >
        EN
      </Link>
      <span aria-hidden="true" className="text-[var(--color-ep-fg-subtle)]">
        /
      </span>
      <Link
        href={pathname}
        locale="es"
        data-testid="locale-switch-es"
        aria-current={locale === "es" ? "page" : undefined}
        onClick={() => {
          writeLocaleChoice("es");
          onNavigate?.();
        }}
        className={[
          "flex min-h-11 min-w-11 items-center justify-center px-3 md:min-h-0 transition-colors duration-300",
          locale === "es"
            ? "text-[var(--color-ep-fg-strong)]"
            : "text-[var(--color-ep-fg)] hover:text-[var(--color-ep-fg-strong)]",
        ].join(" ")}
      >
        ES
      </Link>
    </div>
  );
}
