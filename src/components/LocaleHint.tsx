"use client";

// A memory of a choice, never a guess. Locale is negotiated at "/" only
// (src/proxy.ts), so an explicit NEXT_LOCALE=es choice is never consulted on
// English routes — a reader who picked Spanish and then opens a bookmarked or
// shared /pricing gets English with no sign Spanish exists on that page. This
// component is the fix: a dismissible, non-redirecting notice, rendered only
// on English routes, that appears when the cookie says "es".
//
// Renders null until mounted and until the cookie is read: the cookie is not
// available during prerender, so any other shape is a hydration mismatch on
// every English page. No cookie means a first-time visitor, and a first-time
// visitor must see nothing — geolocation was ruled out for this phase for
// the same reason, and rendering on a guess here would repeat that mistake.
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

interface LocaleHintProps {
  message: string;
  action: string;
  dismissLabel: string;
  /**
   * A short Spanish noun phrase naming what the region is (common.localeHint.label),
   * distinct from `message`. An unnamed <aside> is a complementary landmark
   * with no purpose to a screen reader; role=complementary alone doesn't say
   * what it complements.
   */
  label: string;
}

function readCookie(name: string): string | undefined {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];
}

export function LocaleHint({ message, action, dismissLabel, label }: LocaleHintProps) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const locale = readCookie("NEXT_LOCALE");
    const dismissed = readCookie("NEXT_LOCALE_HINT") === "off";
    // Intentional: document.cookie is not readable during prerender, so the
    // server pass and first client paint must both render null (external
    // sync with the DOM's cookie jar, not derivable from React state).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(locale === "es" && !dismissed);
  }, []);

  if (!visible) {
    return null;
  }

  const dismiss = () => {
    document.cookie = "NEXT_LOCALE_HINT=off; path=/; max-age=31536000; samesite=lax";
    setVisible(false);
  };

  return (
    <aside
      data-testid="locale-hint"
      aria-label={label}
      // z-40 sits below the Navbar's own (higher) fixed stacking value — the
      // nav must always win. Bottom-anchored because the Navbar is fixed top-4;
      // anchoring at the opposite edge structurally guarantees they cannot
      // collide. inset-x-4 keeps a 16px gutter at 320px so the card never
      // causes horizontal overflow. Background/border reuse the site's
      // existing fixed-panel tokens (same ones Navbar's mobile menu uses),
      // not an invented "elevated" surface — see TOKENS.md/README.md on why
      // only --color-ep-* tokens are real.
      className="fixed inset-x-4 bottom-4 z-40 sm:inset-x-auto sm:left-4 sm:max-w-sm rounded-lg border border-[var(--color-ep-hairline)] bg-[var(--color-ep-mobile-menu-bg)] backdrop-blur-xl px-4 py-3 shadow-lg"
    >
      <div className="flex items-center gap-3">
        <p className="flex-1 text-sm text-[var(--color-ep-fg-muted)]">{message}</p>
        <Link
          href={pathname}
          locale="es"
          className="min-h-11 inline-flex items-center px-3 md:min-h-0 text-sm font-medium text-[var(--color-ep-fg)] hover:text-[var(--color-ep-fg-strong)] transition-colors duration-300"
        >
          {action}
        </Link>
        <Button
          type="button"
          variant="brand-link"
          size="icon"
          aria-label={dismissLabel}
          data-testid="locale-hint-dismiss"
          onClick={dismiss}
        >
          <X aria-hidden="true" className="size-4" />
        </Button>
      </div>
    </aside>
  );
}
