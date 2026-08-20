"use client";

import { useEffect, useState } from "react";
// Internal navigation goes through the locale-aware Link (never next/link —
// see src/i18n/navigation.ts) so a nav click on /es/* stays on the Spanish
// tree. The absolute external APP_URL destinations (Log in, Sign Up) stay on
// plain next/link, aliased here to avoid a name collision.
import { Link } from "@/i18n/navigation";
import ExternalLink from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ElPortalWordmark } from "./ElPortalWordmark";
import { LanguageSwitcher } from "./LanguageSwitcher";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.el-portal.app';

const navLinks = [
    { href: "/manifesto", key: "manifesto" },
    { href: "/changelog", key: "changelog" },
    { href: "/features", key: "features" },
    { href: "/pricing", key: "pricing" },
] as const;

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const t = useTranslations("common");
    const closeMobileMenu = () => setMobileMenuOpen(false);

    // Escape dismisses the menu. Without this a keyboard user has no way out
    // except tabbing through every link in the panel. Bound only while open so
    // the site is not carrying a permanent document-level keydown listener.
    useEffect(() => {
        if (!mobileMenuOpen) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setMobileMenuOpen(false);
        };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [mobileMenuOpen]);

    return (
        <nav
            aria-label={t("nav.landmarkLabel")}
            className={[
                "fixed top-4 left-1/2 -translate-x-1/2 z-50",
                "max-w-5xl w-[calc(100%-2rem)]",
                "bg-[var(--color-ep-nav-bg)] backdrop-blur-xl",
                "border border-white/[0.05]",
                "shadow-[0_0_30px_-5px_var(--color-ep-nav-shadow)]",
                "rounded-2xl transition-colors duration-300",
            ].join(" ")}
        >
            <div className="px-6">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    {/* Two instances rather than one, because the lockup sets its
                        size as an inline font-size and the expanded display face
                        is wide: at 320px a 24px mark plus the Spanish "Crear
                        cuenta" pill pushed this row 2px past the viewport. 20px
                        below md matches what the El Portal app itself uses in
                        MobileHeader. The responsive display class goes on a
                        wrapper, not on the lockup itself: its root already
                        carries `inline-flex`, and two display utilities on one
                        element are resolved by stylesheet order, not attribute
                        order, so `hidden` did not reliably win and both marks
                        rendered. */}
                    <Link href="/" className="flex min-h-11 items-center gap-2 md:min-h-0">
                        <span className="md:hidden">
                            <ElPortalWordmark size={20} />
                        </span>
                        <span className="hidden md:block">
                            <ElPortalWordmark size={24} />
                        </span>
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center space-x-1 lg:space-x-8 text-sm font-medium">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                className={[
                                    "transition-colors duration-300",
                                    pathname === link.href
                                        ? "text-[var(--color-ep-fg-strong)]"
                                        : "text-[var(--color-ep-fg)] hover:text-[var(--color-ep-fg-strong)]",
                                ].join(" ")}
                                href={link.href}
                            >
                                {t(`nav.${link.key}`)}
                            </Link>
                        ))}
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center space-x-0 lg:space-x-4">
                        <div className="hidden md:flex items-center">
                            <LanguageSwitcher context="navbar" />
                        </div>
                        <Button asChild variant="brand-link" size="sm" className="hidden sm:inline-flex pr-4">
                            <ExternalLink href={`${APP_URL}/login`}>{t("nav.logIn")}</ExternalLink>
                        </Button>
                        <Button asChild variant="brand" size="sm">
                            <ExternalLink href={APP_URL}>{t("nav.signUp")}</ExternalLink>
                        </Button>
                        {/* Mobile Hamburger */}
                        <Button
                            variant="brand-link"
                            size="icon"
                            type="button"
                            className="md:hidden"
                            // Without aria-expanded a screen reader announces
                            // "Toggle menu, button" with no indication of whether
                            // the panel is currently open. axe does not flag this.
                            aria-expanded={mobileMenuOpen}
                            aria-controls="mobile-nav"
                            onClick={() => setMobileMenuOpen((open) => !open)}
                            aria-label={t("nav.toggleMenu")}
                        >
                            {mobileMenuOpen ? (
                                <X className="size-5" />
                            ) : (
                                <Menu className="size-5" />
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div id="mobile-nav" className="md:hidden border-t border-white/[0.05] bg-[var(--color-ep-mobile-menu-bg)] backdrop-blur-xl rounded-b-2xl">
                    <div className="px-6 py-4 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                className={[
                                    "flex min-h-11 items-center text-sm font-medium transition-colors duration-300",
                                    pathname === link.href
                                        ? "text-[var(--color-ep-fg-strong)]"
                                        : "text-[var(--color-ep-fg)] hover:text-[var(--color-ep-fg-strong)]",
                                ].join(" ")}
                                href={link.href}
                                onClick={closeMobileMenu}
                            >
                                {t(`nav.${link.key}`)}
                            </Link>
                        ))}
                        <ExternalLink
                            className="flex min-h-11 items-center text-sm font-medium text-[var(--color-ep-fg)] hover:text-[var(--color-ep-fg-strong)] transition-colors duration-300"
                            href={`${APP_URL}/login`}
                            onClick={closeMobileMenu}
                        >
                            {t("nav.logIn")}
                        </ExternalLink>
                        <div className="pt-2 mt-2 border-t border-white/[0.05]">
                            <LanguageSwitcher context="navbar" onNavigate={closeMobileMenu} />
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
