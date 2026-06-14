"use client";

import { cn } from "@/lib/utils";

interface ReadingLayoutProps {
    children: React.ReactNode;
    className?: string;
}

export default function ReadingLayout({ children, className }: ReadingLayoutProps) {
    return (
        <div className="relative w-full">
            {/* Radial accent gradient — matches home hero */}
            <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[700px] bg-[radial-gradient(circle_at_50%_0%,_var(--color-ep-accent-alpha-12)_0%,_transparent_70%)] opacity-80" />

            {/* Film grain texture overlay */}
            <div
                className="pointer-events-none fixed inset-0 z-[1] opacity-[0.025]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
                }}
            />

            {/* Faint grid overlay — matches home page */}
            <div
                className="pointer-events-none fixed inset-0 z-0 opacity-[0.07]"
                style={{
                    maskImage: "radial-gradient(circle at center, black 40%, transparent 100%)",
                    WebkitMaskImage: "radial-gradient(circle at center, black 40%, transparent 100%)",
                }}
            >
                <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-ep-grid-line)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-ep-grid-line)_1px,transparent_1px)] bg-[size:40px_40px]" />
            </div>

            {/* Content */}
            <div className={cn("relative z-10 mx-auto max-w-3xl px-6 md:px-0", className)}>
                {children}
            </div>
        </div>
    );
}

