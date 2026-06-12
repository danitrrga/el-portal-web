import { LayoutDashboard, FlaskConical, History, Settings, CalendarDays, Check, Flame, Crosshair, TrendingUp } from "lucide-react";

export default function DashboardPreview() {
    return (
        <div className="h-full w-full relative rounded-xl overflow-hidden">
            <div className="bg-slate-950/90 rounded-xl overflow-hidden border border-slate-800/30 h-full relative flex shadow-inner">
                {/* Sidebar */}
                <div className="w-16 lg:w-64 border-r border-slate-800/30 bg-slate-950/90 backdrop-blur-sm hidden md:flex flex-col p-4">
                    <div className="mb-8 font-bold text-xl text-white flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-[0_0_10px_rgba(30,64,175,0.5)]"></div>
                        <span className="hidden lg:inline text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                            PORTAL
                        </span>
                    </div>
                    <div className="space-y-1">
                        <div className="px-3 py-2 bg-primary/10 border border-primary/20 text-primary-glow rounded-md flex items-center gap-3 cursor-pointer shadow-[0_0_10px_rgba(30,64,175,0.1)]">
                            <LayoutDashboard size={14} />
                            <span className="hidden lg:inline text-sm font-medium">
                                Dashboard
                            </span>
                        </div>
                        <div className="px-3 py-2 text-slate-500 hover:text-slate-200 hover:bg-slate-800/50 rounded-md flex items-center gap-3 cursor-pointer transition-all duration-300">
                            <FlaskConical size={14} />
                            <span className="hidden lg:inline text-sm">The Lab</span>
                        </div>
                        <div className="px-3 py-2 text-slate-500 hover:text-slate-200 hover:bg-slate-800/50 rounded-md flex items-center gap-3 cursor-pointer transition-all duration-300">
                            <History size={14} />
                            <span className="hidden lg:inline text-sm">History</span>
                        </div>
                    </div>
                    <div className="mt-auto flex items-center gap-3 text-slate-500 px-3 hover:text-slate-300 cursor-pointer transition-all duration-300">
                        <Settings size={14} />
                        <span className="hidden lg:inline text-sm">Settings</span>
                    </div>
                </div>

                {/* Main content */}
                <div className="flex-1 bg-gradient-to-br from-slate-950 to-black p-6 overflow-hidden relative">
                    <div
                        className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
                        style={{
                            backgroundImage:
                                "url('https://www.transparenttextures.com/patterns/carbon-fibre.png')",
                        }}
                    ></div>

                    {/* Header */}
                    <div className="flex justify-between items-start mb-8 relative z-10">
                        <div>
                            <div className="text-[10px] font-mono text-primary-glow mb-1 tracking-widest uppercase">
                                Version 1.0{" "}
                                <span className="text-slate-600 ml-2">ACTIVE</span>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-1">
                                Q1 2026: The Foundation
                            </h2>
                            <p className="text-sm text-slate-500">
                                Establishing core habits and systems.
                            </p>
                        </div>
                        <div className="text-right hidden sm:block">
                            <div className="flex items-center gap-2 text-xs text-primary-glow mb-1 justify-end">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_5px_rgba(30,64,175,0.8)]"></span>
                                CYCLE 1 ACTIVE
                            </div>
                            <div className="text-xs font-mono text-slate-600">
                                FEB 15 →{" "}
                                <span className="text-primary-glow">MAR 01</span>
                            </div>
                        </div>
                    </div>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
                        {/* Habit Tracker Card */}
                        <div className="bg-slate-950/80 border border-slate-800/50 rounded-xl p-5 hover:border-blue-500/30 hover:bg-slate-900/60 transition-all duration-500 ease-out backdrop-blur-xl shadow-2xl shadow-black/20">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                                    <CalendarDays size={14} className="text-slate-500" />
                                    HABIT TRACKER
                                </div>
                                <span className="text-xs text-slate-600">1/2</span>
                            </div>
                            <div className="space-y-3">
                                <div className="bg-black/30 rounded-lg p-3 flex justify-between items-center group cursor-pointer border border-slate-800/30 hover:border-slate-700/50 transition-all duration-300">
                                    <div className="flex items-center gap-3">
                                        <div className="w-4 h-4 rounded border border-slate-700 group-hover:border-slate-500 bg-transparent"></div>
                                        <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                                            Morning Run
                                        </span>
                                    </div>
                                    <div className="flex gap-1">
                                        <div className="w-2 h-1 bg-slate-800 rounded-full"></div>
                                        <div className="w-2 h-1 bg-slate-800 rounded-full"></div>
                                        <div className="w-2 h-1 bg-slate-800 rounded-full"></div>
                                    </div>
                                </div>
                                <div className="bg-gradient-to-r from-emerald-900/30 to-emerald-900/10 rounded-lg p-3 flex justify-between items-center cursor-pointer border border-accent-green/20 shadow-[0_0_15px_rgba(16,185,129,0.05)] hover:border-accent-green/40 transition-all duration-300">
                                    <div className="flex items-center gap-3">
                                        <div className="w-4 h-4 rounded bg-accent-green flex items-center justify-center shadow-[0_0_8px_rgba(16,185,129,0.4)]">
                                            <Check size={10} className="text-black" strokeWidth={3} />
                                        </div>
                                        <span className="text-sm text-white font-medium">
                                            Deep Work
                                        </span>
                                    </div>
                                    <div className="flex gap-1 text-accent-green text-[10px] items-center">
                                        <Flame size={10} className="animate-pulse" />{" "}
                                        4
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Cycle Metrics Card */}
                        <div className="bg-slate-950/80 border border-slate-800/50 rounded-xl p-5 flex flex-col items-center justify-center relative overflow-hidden group hover:border-blue-500/30 transition-all duration-500 ease-out backdrop-blur-xl shadow-2xl shadow-black/20">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] rounded-full pointer-events-none"></div>
                            <div className="absolute top-4 left-4 text-[10px] text-slate-500 font-mono tracking-widest">
                                CYCLE METRICS
                            </div>
                            <div className="relative w-32 h-32 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90 drop-shadow-lg">
                                    <circle
                                        className="text-slate-800"
                                        cx="64"
                                        cy="64"
                                        fill="transparent"
                                        r="56"
                                        stroke="currentColor"
                                        strokeWidth="6"
                                    />
                                    <circle
                                        className="text-primary-glow drop-shadow-[0_0_10px_rgba(30,64,175,0.6)]"
                                        cx="64"
                                        cy="64"
                                        fill="transparent"
                                        r="56"
                                        stroke="currentColor"
                                        strokeDasharray="351.86"
                                        strokeDashoffset="230"
                                        strokeLinecap="round"
                                        strokeWidth="6"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-3xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                                        33
                                    </span>
                                    <span className="text-[9px] uppercase tracking-widest text-slate-500 mt-1">
                                        Efficiency
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Goals Card */}
                        <div className="bg-slate-950/80 border border-slate-800/50 rounded-xl p-5 hover:border-blue-500/30 hover:bg-slate-900/60 transition-all duration-500 ease-out backdrop-blur-xl shadow-2xl shadow-black/20">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                                    <Crosshair size={14} className="text-slate-500" />
                                    GOALS
                                </div>
                                <span className="text-xs text-slate-600">0/1</span>
                            </div>
                            <div className="mb-4">
                                <div className="flex justify-between text-xs text-slate-300 mb-2 font-medium">
                                    <span>Website Redesign</span>
                                    <span className="text-primary-glow">50%</span>
                                </div>
                                <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden border border-slate-800/30">
                                    <div className="bg-gradient-to-r from-primary to-blue-400 h-full w-1/2 shadow-[0_0_10px_rgba(30,64,175,0.4)]"></div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-xs text-slate-500 line-through decoration-slate-600">
                                    <div className="w-3 h-3 bg-primary/20 border border-primary/40 rounded-sm flex items-center justify-center">
                                        <Check size={8} className="text-primary" strokeWidth={3} />
                                    </div>
                                    Design Mockups
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-500 line-through decoration-slate-600">
                                    <div className="w-3 h-3 bg-primary/20 border border-primary/40 rounded-sm flex items-center justify-center">
                                        <Check size={8} className="text-primary" strokeWidth={3} />
                                    </div>
                                    Implement Hero
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-300">
                                    <div className="w-3 h-3 border border-slate-600 rounded-sm"></div>
                                    Implement About
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Progress Chart */}
                    <div className="mt-6 bg-slate-950/80 border border-slate-800/50 rounded-xl p-6 h-48 relative overflow-hidden group hover:border-blue-500/30 transition-all duration-500 ease-out backdrop-blur-xl shadow-2xl shadow-black/20">
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                        <div className="flex justify-between items-center mb-4 relative z-10">
                            <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
                                <TrendingUp size={14} className="text-slate-500" />
                                PROGRESS
                            </div>
                            <div className="flex bg-black/40 border border-slate-800/30 rounded p-0.5 backdrop-blur-sm">
                                <button className="px-2 py-0.5 text-[10px] bg-slate-800/60 text-white rounded shadow-sm border border-slate-700/30">
                                    WEEK
                                </button>
                                <button className="px-2 py-0.5 text-[10px] text-slate-500 hover:text-slate-300 transition-colors">
                                    30 DAYS
                                </button>
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-32 flex items-end px-0 pb-0">
                            <div className="w-full h-full relative">
                                <svg
                                    className="w-full h-full"
                                    preserveAspectRatio="none"
                                    viewBox="0 0 100 40"
                                >
                                    <path
                                        className="drop-shadow-[0_0_4px_rgba(30,64,175,0.5)]"
                                        d="M0,10 C20,10 30,35 100,38"
                                        fill="none"
                                        stroke="var(--color-ep-chart-line)"
                                        strokeWidth="0.5"
                                    />
                                    <defs>
                                        <linearGradient
                                            id="chartGradient"
                                            x1="0"
                                            x2="0"
                                            y1="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="0%"
                                                stopColor="var(--color-ep-glow-blue-30)"
                                            />
                                            <stop
                                                offset="100%"
                                                stopColor="rgba(30, 64, 175, 0)"
                                            />
                                        </linearGradient>
                                    </defs>
                                    <path
                                        d="M0,10 C20,10 30,35 100,38 L100,40 L0,40 Z"
                                        fill="url(#chartGradient)"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
