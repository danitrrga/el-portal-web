"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";

export function PerformanceMetric() {
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { once: false, amount: 0.3 });
    const [hasAnimated, setHasAnimated] = useState(false);

    const countValue = useMotionValue(0);
    const displayCount = useTransform(countValue, (latest) => Math.round(latest));
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (isInView && !hasAnimated) {
            // Intentional: one-shot animation trigger gated on scroll-into-view (external sync).
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setHasAnimated(true);
            // The number counter ticks up after habits have "slid" in (approx 1.5s delay)
            setTimeout(() => {
                animate(countValue, 100, { duration: 2, ease: "easeOut" });
            }, 1500);
        } else if (!isInView) {
            setHasAnimated(false);
            countValue.set(0);
        }
    }, [isInView, hasAnimated, countValue]);

    const habits = [
        { id: 1, label: "PRIORITY HIGH (4pt)", delay: 0 },
        { id: 2, label: "PRIORITY MEDIUM (2pt)", delay: 0.4 },
        { id: 3, label: "PRIORITY LOW (1pt)", delay: 0.8 },
    ];

    return (
        <div ref={containerRef} className="flex flex-col md:flex-row gap-8 w-full">
            {/* Code Block (Formula) */}
            <div className="w-full md:w-[60%] glass-panel rounded-2xl overflow-hidden border-border transition-all duration-300 hover:border-primary/30 hover:shadow-[var(--shadow-ep-glow-blue-20)] flex flex-col">
                <div className="p-4 border-b border-white/5 flex items-center justify-between bg-zinc-950/80">
                    <span className="text-xs font-bold text-muted-foreground">P_daily Algorithm</span>
                    <div className="flex gap-2">
                        <div className="size-2.5 rounded-full bg-red-500/50"></div>
                        <div className="size-2.5 rounded-full bg-yellow-500/50"></div>
                        <div className="size-2.5 rounded-full bg-green-500/50"></div>
                    </div>
                </div>
                <div className="flex-1 p-6 md:p-8 bg-[var(--color-ep-code-bg)] font-mono text-sm overflow-x-auto flex items-center">
                    <pre className="leading-relaxed whitespace-pre-wrap sm:whitespace-pre w-full overflow-hidden">
                        <code className="text-zinc-300"><span className="text-pink-500">function</span> <span className="text-blue-400">calculatePerformance</span>(habits) {'{'}
                            {"\n  "} <span className="text-slate-500">{"// Weight mapping for priority execution"}</span>
                            {"\n  "} <span className="text-pink-500">const</span> weightMap = {'{'}
                            {"\n    "} High: <span className="text-orange-400">4</span>, Medium: <span className="text-orange-400">2</span>, Low: <span className="text-orange-400">1</span>
                            {"\n  "} {'}'};
                            {"\n\n  "} <span className="text-pink-500">const</span> totalCompleted = habits.<span className="text-blue-300">reduce</span>((acc, task) =&gt;
                            {"\n    "} acc + (task.completed ? weightMap[task.priority] : <span className="text-orange-400">0</span>)
                            {"\n  "}, <span className="text-orange-400">0</span>);
                            {"\n\n  "} <span className="text-pink-500">const</span> totalPossible = habits.<span className="text-blue-300">reduce</span>((acc, task) =&gt;
                            {"\n    "} acc + weightMap[task.priority]
                            {"\n  "}, <span className="text-orange-400">0</span>);
                            {"\n\n  "} <span className="text-pink-500">return</span> (totalCompleted / totalPossible) * <span className="text-orange-400">100</span>;
                            {'}'}</code>
                    </pre>
                </div>
            </div>

            {/* Animation & Visualization Container */}
            <div className="w-full md:w-[40%] flex flex-col items-center justify-center gap-6 glass-panel p-8 rounded-2xl relative bg-white/[0.03] border-white/5 hover:border-white/10 overflow-hidden">

                {/* Habit slide-in blocks */}
                <div className="flex flex-col gap-3 w-full max-w-[200px] mb-4">
                    {habits.map((habit) => (
                        <motion.div
                            key={habit.id}
                            initial={{ x: -150, opacity: 0 }}
                            animate={hasAnimated ? { x: 0, opacity: 1 } : { x: -150, opacity: 0 }}
                            transition={{ duration: 0.6, delay: habit.delay, ease: "easeOut" }}
                            className={`h-2 rounded-full ${habit.id === 1 ? 'bg-primary shadow-[var(--shadow-ep-habit-bar)]' : habit.id === 2 ? 'bg-primary/50' : 'bg-primary/20'}`}
                        />
                    ))}
                </div>

                {/* Math divider line sliding in */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={hasAnimated ? { scaleX: 1 } : { scaleX: 0 }}
                    transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
                    className="w-full h-px bg-white/20 my-2"
                />

                {/* P_daily final calculation with hover tooltip */}
                <div
                    className="relative cursor-pointer group flex flex-col items-center"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <span className="text-xs text-muted-foreground font-bold tracking-widest uppercase mb-2 group-hover:text-primary transition-colors">
                        P_daily Score
                    </span>
                    <motion.div
                        className="font-serif text-6xl text-foreground relative z-10 transition-all duration-300"
                        animate={hasAnimated ? {
                            textShadow: "0 0 40px var(--color-ep-glow-blue-40), 0 0 12px var(--color-ep-text-glow-white)"
                        } : { textShadow: "none" }}
                        transition={{ delay: 3, duration: 1 }}
                    >
                        <motion.span>{displayCount}</motion.span>%
                    </motion.div>

                    {/* Hover Tooltip showing habit weights */}
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={isHovered ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-4 bg-zinc-900 border border-white/10 rounded-xl p-4 shadow-2xl z-20 w-48 pointer-events-none"
                    >
                        <div className="flex justify-between items-center text-xs mb-2 pb-2 border-b border-white/10">
                            <span className="text-muted-foreground">Total Points</span>
                            <span className="font-bold text-primary">7/7</span>
                        </div>
                        <div className="flex flex-col gap-2 text-xs">
                            <div className="flex justify-between text-zinc-300">
                                <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> High</span>
                                <span>4</span>
                            </div>
                            <div className="flex justify-between text-zinc-300">
                                <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-primary/50" /> Medium</span>
                                <span>2</span>
                            </div>
                            <div className="flex justify-between text-zinc-300">
                                <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-primary/20" /> Low</span>
                                <span>1</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

            </div>
        </div>
    );
}
