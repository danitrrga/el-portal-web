"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ElPortalWordmark } from "./ElPortalWordmark";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.el-portal.app';

const navLinks = [
    { href: "/manifesto", label: "Manifesto" },
    { href: "/changelog", label: "Changelog" },
    { href: "/methodology", label: "Methodology" },
    { href: "/features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
];

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    return (
        <nav
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
                    <Link href="/" className="flex items-center gap-2">
                        <ElPortalWordmark size={24} />
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
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
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center space-x-4">
                        <Button asChild variant="brand-link" size="sm" className="hidden sm:inline-flex pr-4">
                            <Link href={`${APP_URL}/login`}>Log in</Link>
                        </Button>
                        <Button asChild variant="brand" size="sm">
                            <Link href={APP_URL}>Sign Up</Link>
                        </Button>
                        {/* Mobile Hamburger */}
                        <button
                            className="md:hidden text-[var(--color-ep-fg)] hover:text-[var(--color-ep-fg-strong)] transition-colors duration-300"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? (
                                <X size={20} />
                            ) : (
                                <Menu size={20} />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-white/[0.05] bg-[var(--color-ep-mobile-menu-bg)] backdrop-blur-xl rounded-b-2xl">
                    <div className="px-6 py-4 space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                className={[
                                    "block text-sm font-medium py-2 transition-colors duration-300",
                                    pathname === link.href
                                        ? "text-[var(--color-ep-fg-strong)]"
                                        : "text-[var(--color-ep-fg)] hover:text-[var(--color-ep-fg-strong)]",
                                ].join(" ")}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link
                            className="block text-sm font-medium text-[var(--color-ep-fg)] hover:text-[var(--color-ep-fg-strong)] transition-colors duration-300 py-2"
                            href={`${APP_URL}/login`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Log in
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
