"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { ShinyButton } from "./ui/shiny-button";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.el-portal.app';

const navLinks = [
    { href: "/manifesto", label: "Manifesto" },
    { href: "/changelog", label: "Changelog" },
    { href: "/methodology", label: "Methodology" },
];

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    return (
        <nav
            className={[
                "fixed top-4 left-1/2 -translate-x-1/2 z-50",
                "max-w-5xl w-[calc(100%-2rem)]",
                "bg-zinc-900/80 backdrop-blur-xl",
                "border border-white/5",
                "shadow-[0_0_30px_-5px_rgba(0,0,0,0.5)]",
                "rounded-2xl transition-all duration-300",
            ].join(" ")}
        >
            <div className="px-6">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <span className="font-bold text-2xl text-white tracking-tighter relative z-10 flex items-center">
                            P
                            <img
                                src="/icon.svg"
                                alt="El Portal Icon"
                                className="w-[1.1em] h-[1.1em] mx-[2px]"
                            />
                            RTAL
                        </span>
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                className={[
                                    "transition-colors duration-300",
                                    pathname === link.href
                                        ? "text-zinc-100"
                                        : "text-zinc-400 hover:text-zinc-100",
                                ].join(" ")}
                                href={link.href}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center space-x-4">
                        <Link
                            className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors duration-300 hidden sm:block pr-4"
                            href={`${APP_URL}/login`}
                        >
                            Log in
                        </Link>
                        <Link href={APP_URL}>
                            <ShinyButton className="!px-6 !py-3 !text-sm !rounded-xl !h-[44px] !font-medium">
                                Get Started
                            </ShinyButton>
                        </Link>
                        {/* Mobile Hamburger */}
                        <button
                            className="md:hidden text-zinc-400 hover:text-zinc-100 transition-colors duration-300"
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
                <div className="md:hidden border-t border-white/5 bg-zinc-950/95 backdrop-blur-xl rounded-b-2xl">
                    <div className="px-6 py-4 space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                className={[
                                    "block text-sm font-medium py-2 transition-colors duration-300",
                                    pathname === link.href
                                        ? "text-zinc-100"
                                        : "text-zinc-400 hover:text-zinc-100",
                                ].join(" ")}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link
                            className="block text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors duration-300 py-2"
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
