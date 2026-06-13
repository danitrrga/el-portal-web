"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ElPortalWordmark } from "./ElPortalWordmark";

const footerColumns = [
    {
        title: "Product",
        links: [
            { label: "Features", href: "/features" },
            { label: "Changelog", href: "/changelog" },
            { label: "MCP Integration", href: "/mcp" },
        ],
    },
    {
        title: "Company",
        links: [
            { label: "Manifesto", href: "/manifesto" },
            { label: "About", href: "/manifesto" },
        ],
    },
    {
        title: "Legal",
        links: [
            { label: "Privacy", href: "/privacy" },
            { label: "Terms", href: "/terms" },
        ],
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        },
    },
};

export default function Footer() {
    return (
        <footer>
            {/* Section separator */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="max-w-6xl mx-auto px-6 md:px-8 pt-16 md:pt-20 pb-8">
                {/* Main grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-60px" }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8 mb-16"
                >
                    {/* Brand column */}
                    <motion.div variants={itemVariants} className="col-span-2 md:col-span-1">
                        <Link href="/" aria-label="El Portal home" className="inline-block mb-4">
                            <ElPortalWordmark size={24} />
                        </Link>
                        <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">
                            Your personal operating system for intentional living and peak performance.
                        </p>
                    </motion.div>

                    {/* Link columns */}
                    {footerColumns.map((column) => (
                        <motion.div key={column.title} variants={itemVariants}>
                            <h4 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4">
                                {column.title}
                            </h4>
                            <ul className="space-y-3">
                                {column.links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors duration-300"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Bottom bar — copyright left, giant grain-fill wordmark right at the same height */}
                <div className="pt-6 border-t border-white/5 flex flex-col gap-10 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                    <p className="text-sm text-zinc-500 shrink-0">
                        &copy; {new Date().getFullYear()} El Portal. All rights reserved.
                    </p>

                    {/* Brand wordmark — ghost outline that fills with grain on hover */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        viewport={{ once: true }}
                        aria-hidden="true"
                        className="min-w-0 overflow-hidden"
                    >
                        <div className="wordmark">
                            <span className="wordmark__layer wordmark__outline">El Portal</span>
                            <span className="wordmark__layer wordmark__fill">El Portal</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </footer>
    );
}
