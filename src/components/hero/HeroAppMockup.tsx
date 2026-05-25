import React from "react";

/**
 * Placeholder app-screenshot frame for the hero.
 * Renders a wireframe block (sidebar + 3x3 grid) until the real screenshot is supplied.
 * Aspect-ratio, border, and shadow match the locked design mockup.
 */
export const HeroAppMockup: React.FC = () => {
  return (
    <div
      className="mx-auto mt-[70px] max-w-[1000px] aspect-[16/9] overflow-hidden rounded-2xl border border-white/8 flex flex-col"
      style={{
        background: "linear-gradient(135deg, #0a1429, #0d1a37)",
        boxShadow: "0 30px 80px rgba(0, 0, 0, 0.4)",
      }}
    >
      {/* Title bar */}
      <div className="h-8 bg-white/[0.04] border-b border-white/[0.06] flex gap-1.5 items-center px-3.5">
        <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
        <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
        <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
      </div>
      {/* Content area: sidebar + main */}
      <div className="flex-1 grid grid-cols-[200px_1fr]">
        <div className="bg-white/[0.02] border-r border-white/[0.04] p-4">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="h-3 bg-white/[0.06] rounded mb-2.5" />
          ))}
        </div>
        <div className="p-5 grid grid-cols-3 gap-3">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-white/[0.04] rounded-lg min-h-[60px]" />
          ))}
        </div>
      </div>
    </div>
  );
};
