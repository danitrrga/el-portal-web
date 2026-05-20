"use client";

import React, { useRef } from "react";
import { motion, useAnimationFrame } from "framer-motion";

export function DayBentoCard() {
    const dotRef = useRef<HTMLDivElement>(null);
    const dayRadialGlowRef = useRef<HTMLDivElement>(null);
    const nightRadialGlowRef = useRef<HTMLDivElement>(null);

    const virtualTime = useRef(0);
    const timeScale = useRef(1);
    const isHovered = useRef(false);

    useAnimationFrame((time, delta) => {
        // Smoothly adjust timeScale for hover effect
        const targetScale = isHovered.current ? 0.2 : 1;
        timeScale.current += (targetScale - timeScale.current) * 0.05;
        // Prevent huge delta spikes, e.g., if switching browser tabs
        const safeDelta = Math.min(delta, 50);
        virtualTime.current += safeDelta * timeScale.current;

        const DURATION = 10000; // 10s loop
        const progress = (virtualTime.current % DURATION) / DURATION;

        // Start left side (PI), orbit to right side and back
        const angle = Math.PI + progress * Math.PI * 2;

        const radius = 100; // Orbit radius
        const xOffset = Math.cos(angle) * radius;
        const yOffset = Math.sin(angle) * radius;

        const isDay = Math.sin(angle) < 0; // Negative Y means top half (Day)

        const dayIntensity = Math.max(0, -Math.sin(angle));
        const nightIntensity = Math.max(0, Math.sin(angle));

        if (dotRef.current) {
            dotRef.current.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
            dotRef.current.style.backgroundColor = isDay
                ? `rgba(255, 240, 200, 1)`
                : `rgba(150, 200, 255, 1)`;
        }

        if (dayRadialGlowRef.current) {
            dayRadialGlowRef.current.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
            dayRadialGlowRef.current.style.opacity = `${dayIntensity}`;
        }

        if (nightRadialGlowRef.current) {
            nightRadialGlowRef.current.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
            nightRadialGlowRef.current.style.opacity = `${nightIntensity}`;
        }
    });

    return (
        <div
            className="group p-6 rounded-xl flex flex-col justify-between overflow-hidden relative transition-all duration-300 ease-out bg-zinc-950/80 backdrop-blur-xl border border-white/5 hover:border-blue-500/30 min-h-[300px]"
            onMouseEnter={() => (isHovered.current = true)}
            onMouseLeave={() => (isHovered.current = false)}
        >
            {/* Subtle Sweeping Glow Background */}
            <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                    background: 'radial-gradient(circle at 50% 120%, rgba(30,64,175,0.15), transparent 70%)'
                }}
            />

            <div className="relative z-10 pointer-events-none">
                <span className="material-symbols-outlined text-blue-500 mb-4 opacity-80 text-3xl transition-transform group-hover:scale-110">
                    bolt
                </span>
                <h4 className="font-serif text-3xl text-zinc-100 mb-2">Day</h4>

                <div className="flex items-center gap-2 mb-4">
                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                        Execution Unit • Tactical
                    </p>
                    <div className="flex items-center justify-center">
                        <motion.div
                            className="size-1.5 rounded-full bg-primary"
                            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </div>
                </div>

                <p className="text-sm text-zinc-400">
                    The pure unit of execution. Drives the foundational operations that compound over Cycles.
                </p>
            </div>

            <div className="relative w-full h-48 sm:h-56 mt-6 rounded-lg border border-white/5 bg-white/[0.02] flex items-center justify-center overflow-hidden z-0">
                {/* TASK 1: The Horizon Line */}
                <div className="absolute top-1/2 left-0 w-full h-[1px] -translate-y-1/2 bg-white/10 group-hover:bg-white/20 transition-all duration-500 shadow-[0_0_8px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] z-10" />

                {/* Faint Path Indicator for Orbital Arc (Optional but looks highly cinematic) */}
                <div className="absolute top-1/2 left-1/2 w-[200px] h-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/[0.08] pointer-events-none z-0" />

                {/* TASK 3: Ecliptic Glow (Top Half / Day Clipping) */}
                <div className="absolute top-0 left-0 w-full h-1/2 overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-full left-1/2 w-0 h-0">
                        <div
                            ref={dayRadialGlowRef}
                            className="absolute w-40 h-40 -translate-x-1/2 -translate-y-1/2 rounded-full"
                            style={{
                                background: 'radial-gradient(circle, rgba(255, 230, 150, 0.45) 0%, transparent 60%)',
                                filter: 'blur(12px)',
                                opacity: 0,
                                willChange: "transform, opacity",
                            }}
                        />
                    </div>
                </div>

                {/* TASK 3: Ecliptic Glow (Bottom Half / Night Clipping) */}
                <div className="absolute top-1/2 left-0 w-full h-1/2 overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-0 left-1/2 w-0 h-0">
                        <div
                            ref={nightRadialGlowRef}
                            className="absolute w-32 h-32 -translate-x-1/2 -translate-y-1/2 rounded-full"
                            style={{
                                background: 'radial-gradient(circle, rgba(100, 150, 255, 0.35) 0%, transparent 60%)',
                                filter: 'blur(10px)',
                                opacity: 0,
                                willChange: "transform, opacity",
                            }}
                        />
                    </div>
                </div>

                {/* TASK 2: Orbital Playhead */}
                <div className="absolute top-1/2 left-1/2 w-0 h-0 z-20 pointer-events-none">
                    <div
                        ref={dotRef}
                        className="absolute w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
                        style={{ willChange: "transform" }}
                    />
                </div>

                {/* Overlay gradient to fade edges clean */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#09090b] via-transparent to-[#09090b] z-30 opacity-90" />
            </div>
        </div>
    );
}
