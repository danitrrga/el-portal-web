"use client";

import { useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShinyButton } from "@/components/ui/shiny-button";

/* ─── Inline SVG icons ────────────────────────────────────────────── */

function CheckIcon({ filled = false }: { filled?: boolean }) {
    return (
        <svg
            className={`w-4 h-4 shrink-0 ${filled ? "text-blue-400" : "text-blue-500/70"}`}
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
        >
            <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd"
            />
        </svg>
    );
}

function ChevronIcon() {
    return (
        <svg
            className="w-5 h-5 text-zinc-500 transition-transform duration-300 group-open:rotate-180"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
        >
            <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
            />
        </svg>
    );
}

/* ─── Data ────────────────────────────────────────────────────────── */

const tiers = [
    {
        name: "Initiate",
        description: "Start building your first identity version.",
        price: "$0",
        period: "forever free",
        cta: "Begin Your Journey",
        featured: false,
        features: [
            "1 Active Version (90-Day cycle)",
            "1 Cycle at a time (15-Day sprint)",
            "Basic habit tracking (up to 5 habits)",
            "Daily performance scoring (P_daily)",
            "Community access",
        ],
    },
    {
        name: "Lifetime",
        description: "One payment. Full access. Forever.",
        price: "$10",
        period: "one-time",
        cta: "Claim Lifetime Access",
        featured: true,
        badge: "Best Value",
        features: [
            "Unlimited Versions & Cycles",
            "Dual-Progression Goals (Streaks + Projects)",
            "Cinema Mode — 5 immersive slides",
            "The Archives — full knowledge base",
            "Daily Pulse — mood & vitals tracking",
            "Trends — analytics & insights",
            "5-language internationalization",
            "Mobile-optimized experience",
            "Drag-and-drop reordering",
            "Early access to new features",
            "Founding Member badge",
            "Lifetime updates, zero renewals",
            "Direct line to the creator",
        ],
    },
];

const comparisonFeatures: {
    name: string;
    initiate: string | boolean;
    lifetime: string | boolean;
}[] = [
        {
            name: "Habit Tracking + Goal System",
            initiate: true,
            lifetime: true,
        },
        {
            name: "Cinema Mode",
            initiate: true,
            lifetime: true,
        },
        {
            name: "The Archives",
            initiate: true,
            lifetime: true,
        },
        {
            name: 'Weekly Review & Recap of Cycles',
            initiate: true,
            lifetime: true,
        },
        {
            name: 'Keyboard Centric Design',
            initiate: true,
            lifetime: true,
        },
        {
            name: "Mobile Experience",
            initiate: true,
            lifetime: true,
        },
        {
            name: "Drag-and-Drop Reordering",
            initiate: true,
            lifetime: true,
        },
        {
            name: "Internationalization (5 Languages)",
            initiate: true,
            lifetime: true,
        },
        {
            name: "Daily Pulse Check-Ins",
            initiate: true,
            lifetime: true,
        },
        {
            name: "Storage",
            initiate: "60MB",
            lifetime: "Unlimited",
        },
        {
            name: "Priority Support",
            initiate: "—",
            lifetime: true,
        },
        {
            name: "Trends & Advanced Mood Analytics",
            initiate: "—",
            lifetime: true,
        },
    ];

const faqs = [
    {
        q: "What is a Version?",
        a: "A Version is a 90-day identity phase, a deliberate container for who you're becoming. Each Version has its own title, persona, macro goals, and habits. When it ends, it's permanently archived so you can see how you've evolved.",
    },
    {
        q: "How do Cycles work inside a Version?",
        a: "Each Version is divided into 15-day Cycles, tactical sprints where you define mini-priorities, select habits, and execute daily. At the end of every Cycle, your performance is snapshotted and you decide which habits to carry forward or kill.",
    },
    {
        q: "Why is it only $10?",
        a: "El Portal is built for serious operators, not for profit margins. A one-time $10 payment unlocks everything. Future updates are included. No subscriptions, no renewals, no hidden fees. You pay once and the whole system is yours, forever.",
    },
    {
        q: "What is the Dual-Progression Goal System?",
        a: "Goals in El Portal are tracked mathematically. Type A goals are powered by habit streaks and follow an asymptotic curve (early consistency is heavily rewarded). Type B goals are project-based with linear subtask completion. Both are always quantified.",
    },
    {
        q: "What happens to my data if I stay on the free tier?",
        a: "Your data is never deleted. On the Initiate tier, advanced features like Cinema Mode and The Archives are not available, but your Versions, Cycles, and performance history remain fully intact.",
    },
];

/* ─── Component ───────────────────────────────────────────────────── */

export default function PricingPage() {
    notFound();

    return (
        <div className="relative w-full overflow-x-hidden bg-zinc-950 min-h-screen">
            {/* Grain texture overlay */}
            <div
                className="fixed inset-0 z-50 pointer-events-none opacity-[0.02]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* Top radial blue gradient (DESIGN.md §2) */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-950/40 via-zinc-950 to-zinc-950 pointer-events-none" />

            {/* Background grid texture */}
            <div
                className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"
                style={{
                    maskImage: "radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 100%)",
                    WebkitMaskImage: "radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 100%)"
                }}
            />

            <Navbar />

            <main className="relative z-10 flex flex-col items-center">
                {/* ── Hero Header ──────────────────────────────────── */}
                <div className="w-full max-w-5xl px-6 md:px-8 pt-56 pb-10 flex flex-col items-center text-center">
                    <h1 className="text-zinc-100 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter mb-5">
                        Invest in your identity architecture
                    </h1>
                    <p className="text-zinc-400 text-sm md:text-base max-w-lg leading-relaxed mb-12">
                        El Portal is the bridge between your Current Self and your Future
                        Self. Start free, or unlock everything, forever, for a single
                        payment.
                    </p>

                    {/* ── Pricing Cards Grid ───────────────────────── */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-3xl items-stretch">
                        {tiers.map((tier) => (
                            <div
                                key={tier.name}
                                className={`
                                    relative flex flex-col p-6 rounded-2xl text-left
                                    transition-all duration-300 ease-out
                                    bg-zinc-950/80 backdrop-blur-xl border
                                    ${tier.featured
                                        ? "border-blue-500/20 shadow-[0_0_30px_-5px_rgba(30,64,175,0.15)] hover:shadow-[0_0_40px_-5px_rgba(30,64,175,0.25)] hover:border-blue-500/30"
                                        : "border-white/5 hover:border-blue-500/20 hover:shadow-[0_0_30px_-5px_rgba(30,64,175,0.1)]"
                                    }
                                `}
                            >
                                {/* Badge */}
                                {tier.badge && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-wider rounded-full whitespace-nowrap border border-blue-500/20">
                                        {tier.badge}
                                    </div>
                                )}

                                {/* Tier Name & Price */}
                                <div className="mb-2">
                                    <h3 className="text-zinc-100 text-lg font-semibold tracking-tight mb-1">
                                        {tier.name}
                                    </h3>
                                    <p className="text-zinc-500 text-xs leading-relaxed mb-3">
                                        {tier.description}
                                    </p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-zinc-100 text-4xl font-bold tracking-tight">
                                            {tier.price}
                                        </span>
                                        <span className="text-zinc-500 text-xs">
                                            {tier.period}
                                        </span>
                                    </div>
                                </div>

                                {/* Separator */}
                                <div className="w-full h-px bg-zinc-800/50 my-4" />

                                {/* Features */}
                                <ul className="space-y-2.5 mb-6 flex-grow">
                                    {tier.features.map((feature) => (
                                        <li
                                            key={feature}
                                            className="flex items-start gap-2.5 text-xs leading-relaxed"
                                        >
                                            <CheckIcon filled={tier.featured} />
                                            <span
                                                className={
                                                    tier.featured
                                                        ? "text-zinc-300"
                                                        : "text-zinc-400"
                                                }
                                            >
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA Button */}
                                {tier.featured ? (
                                    <ShinyButton className="w-full text-xs py-2.5 px-5">
                                        {tier.cta}
                                    </ShinyButton>
                                ) : (
                                    <button
                                        className="w-full py-4 px-8 pb-1px rounded-md font-medium text-lg tracking-tight transition-all duration-300 ease-out bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-white/5 hover:border-blue-500/20"
                                    >
                                        {tier.cta}
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Feature Comparison Table ─────────────────────── */}
                <section className="w-full max-w-3xl px-6 md:px-8 py-16">
                    <h2 className="text-zinc-100 text-2xl font-bold tracking-tight mb-10 text-center">
                        Feature Comparison
                    </h2>
                    <div className="bg-zinc-950/80 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-zinc-800/50">
                                    <th className="p-4 md:p-5 text-zinc-100 font-semibold text-xs tracking-tight">
                                        Feature
                                    </th>
                                    <th className="p-4 md:p-5 text-zinc-400 font-medium text-xs text-center">
                                        Initiate
                                    </th>
                                    <th className="p-4 md:p-5 text-blue-400 font-semibold text-xs text-center">
                                        Lifetime
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/50">
                                {comparisonFeatures.map((row, i) => (
                                    <tr
                                        key={row.name}
                                        className={`transition-colors hover:bg-white/[0.02] ${i % 2 === 1
                                            ? "bg-white/[0.01]"
                                            : ""
                                            }`}
                                    >
                                        <td className="p-4 md:p-5 text-zinc-300 text-xs leading-relaxed">
                                            {row.name}
                                        </td>
                                        {(
                                            [
                                                "initiate",
                                                "lifetime",
                                            ] as const
                                        ).map((tier) => {
                                            const val = row[tier];
                                            return (
                                                <td
                                                    key={tier}
                                                    className="p-4 md:p-5 text-center"
                                                >
                                                    {val === true ? (
                                                        <span className="inline-flex justify-center">
                                                            <CheckIcon
                                                                filled={
                                                                    tier ===
                                                                    "lifetime"
                                                                }
                                                            />
                                                        </span>
                                                    ) : (
                                                        <span
                                                            className={`text-xs ${val === "—"
                                                                ? "text-zinc-600"
                                                                : tier ===
                                                                    "lifetime"
                                                                    ? "text-zinc-100 font-medium"
                                                                    : "text-zinc-400"
                                                                }`}
                                                        >
                                                            {val as string}
                                                        </span>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* ── FAQ Section ──────────────────────────────────── */}
                <section className="w-full max-w-2xl px-6 md:px-8 py-16">
                    <h2 className="text-zinc-100 text-2xl font-bold tracking-tight mb-10 text-center">
                        Common Questions
                    </h2>
                    <div className="space-y-3">
                        {faqs.map((faq) => (
                            <details
                                key={faq.q}
                                className="group rounded-xl border border-white/5 bg-zinc-950/80 backdrop-blur-xl px-5 py-4 transition-all duration-300 ease-out hover:border-blue-500/20 cursor-pointer"
                            >
                                <summary className="flex items-center justify-between font-medium text-sm text-zinc-100 list-none tracking-tight">
                                    <span>{faq.q}</span>
                                    <ChevronIcon />
                                </summary>
                                <p className="mt-3 text-xs text-zinc-400 leading-relaxed">
                                    {faq.a}
                                </p>
                            </details>
                        ))}
                    </div>
                </section>

                {/* ── Bottom CTA Glass Panel ───────────────────────── */}
                <section className="w-full max-w-4xl px-6 md:px-8 pb-24">
                    <div className="relative p-8 md:p-10 rounded-2xl bg-zinc-950/80 backdrop-blur-xl border border-white/5 overflow-hidden">
                        {/* Top gradient line */}
                        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-700/50 to-transparent" />
                        {/* Background glow */}
                        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/10 to-transparent pointer-events-none" />

                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                            <div className="max-w-lg">
                                <h2 className="text-zinc-100 text-2xl md:text-3xl font-bold tracking-tight mb-3">
                                    Ready to architect your next Version?
                                </h2>
                                <p className="text-zinc-400 text-sm leading-relaxed">
                                    Start your first Version today.
                                    Define who you&apos;re becoming, set your
                                    macro goals, and let the system hold you
                                    accountable, mathematically.
                                </p>
                            </div>
                            <div
                                className="flex flex-col sm:flex-row gap-4 shrink-0 origin-center md:origin-right"
                                style={{ transform: "scale(0.7)" }}
                            >
                                <Link href={process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.el-portal.app'}>
                                    <ShinyButton>
                                        Start Version 1
                                    </ShinyButton>
                                </Link>
                                <Link href="/methodology">
                                    <button
                                        className=" px-4 h-16 rounded-md font-medium text-lg tracking-tight transition-all duration-300 ease-out bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-white/5 hover:border-blue-500/20"
                                    >
                                        Read the Methodology
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
