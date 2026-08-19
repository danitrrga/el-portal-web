import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Locale-aware navigation primitives built on `routing`. Every component with
 * an INTERNAL href imports `Link` from here, never from `next/link` — this is
 * what keeps a locale switch on the current route correct under
 * `localePrefix: "as-needed"`, where the English path carries no prefix to
 * strip. Absolute external URLs (APP_URL) stay on `next/link`.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
