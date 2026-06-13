export default function FeaturesHeroSection() {
  return (
    <header className="mb-14 md:mb-20">
      {/* Mono eyebrow — technical-drawing annotation voice (D-03) */}
      <p
        className="mb-5 font-mono text-[11px] uppercase tracking-[0.22em]"
        style={{ color: "var(--color-ep-fg-muted)" }}
      >
        Features · 01
      </p>

      <h1
        className="display text-balance leading-[1.05]"
        style={{
          fontSize: "clamp(42px, 4.2vw, 58px)",
          color: "var(--color-ep-fg-strong)",
        }}
      >
        Everything El Portal does.
      </h1>

      <p
        className="mt-5 max-w-2xl text-[15px] leading-[1.6] md:text-base"
        style={{ color: "var(--color-ep-fg)" }}
      >
        A temporal system structured around Versions, Cycles, and Days —
        purpose-built rooms for goals, identity work, and reflection —
        and a daily flow that disappears between morning boot and evening
        shutdown. Here is what ships.
      </p>
    </header>
  );
}
