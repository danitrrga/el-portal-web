import * as React from "react";
import { Lock, Rocket, Info, PenLine } from "lucide-react";

const NOTE_ICONS = {
  lock: Lock,
  rocket: Rocket,
  info: Info,
  pen: PenLine,
} as const;

export type BulletItem = { lead?: string; body: string };
export type NoteItem = { icon: keyof typeof NOTE_ICONS; text: string };

export type ChangelogEntry = {
  version: string;
  date: string;
  tags: string[];
  title: string;
  body: string;
  bullets?: BulletItem[];
  note?: NoteItem;
  isRelease?: boolean;
};

const FG_STRONG = "#f4f6fb";
const FG = "#aab3c5";
const FG_MUTED = "#8590a8";
// Foreground ramp is intentionally THREE steps on this surface, not four.
// The AA contrast remediation in phase 05 pointed the old `FG_SUBTLE`
// (`#5a6478`, 3.40:1 on `#04060c`) at `--color-ep-fg-muted-2` (`#8590a8`,
// 6.32:1) — the exact value `FG_MUTED` already held. Keeping both names would
// be a constant that lies: every FG_SUBTLE-vs-FG_MUTED distinction rendered
// identically. `FG_SUBTLE` is therefore removed rather than left as a dead
// alias. Restoring a real fourth step needs a new AA-clearing token
// (`--color-ep-fg-subtle-2` = `#5a6478` does not clear AA) — a design decision,
// not a mechanical one.
const ACCENT = "#4487D6";
const ACCENT_LIGHT = "#77B7ED";

export function ChangelogItem({
  entry,
  isLast,
}: {
  entry: ChangelogEntry;
  isLast?: boolean;
}) {
  const NoteIcon = entry.note ? NOTE_ICONS[entry.note.icon] : null;

  return (
    <article
      className={`grid grid-cols-1 gap-x-12 gap-y-5 py-14 md:py-16 lg:grid-cols-[160px_1fr] ${
        !isLast ? "border-b border-white/[0.05]" : ""
      }`}
    >
      {/* LEFT — version pill + date (sticky on lg) */}
      <div className="space-y-2.5 lg:sticky lg:top-28 lg:self-start">
        <span
          className="inline-flex items-center rounded-md border px-2 py-1 font-mono text-[11px] font-medium tabular-nums"
          style={{
            background: entry.isRelease
              ? "rgba(68,135,214,0.18)"
              : "rgba(68,135,214,0.08)",
            borderColor: entry.isRelease
              ? "rgba(119,183,237,0.40)"
              : "rgba(68,135,214,0.20)",
            color: entry.isRelease ? FG_STRONG : ACCENT_LIGHT,
          }}
        >
          v{entry.version}
        </span>
        <time
          className="block text-[13px]"
          style={{ color: FG_MUTED }}
        >
          {entry.date}
        </time>
        {entry.tags.length > 0 && (
          <div
            className="flex flex-wrap gap-x-2 gap-y-1 pt-1 font-mono text-[10px] uppercase tracking-[0.18em]"
            style={{ color: FG_MUTED }}
          >
            {entry.tags.map((tag, i) => (
              <span key={tag} className="inline-flex items-center">
                {i > 0 && <span className="mr-2 select-none">·</span>}
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT — title + body + bullets + note */}
      <div>
        <h2
          className={
            entry.isRelease
              ? "display mb-5 text-balance leading-[1.1]"
              : "mb-4 text-balance text-[24px] font-semibold leading-[1.2] tracking-tight md:text-[28px]"
          }
          style={{
            color: FG_STRONG,
            ...(entry.isRelease
              ? { fontSize: "clamp(28px, 2.8vw, 36px)" }
              : {}),
          }}
        >
          {entry.title}
        </h2>

        <p
          className="text-[15px] leading-[1.7] md:text-base"
          style={{ color: FG }}
        >
          {entry.body}
        </p>

        {entry.bullets && entry.bullets.length > 0 && (
          <ul className="mt-6 space-y-3">
            {entry.bullets.map((b, i) => (
              <li
                key={i}
                className="grid grid-cols-[auto_1fr] items-start gap-3 text-[15px] leading-[1.7] md:text-base"
                style={{ color: FG }}
              >
                <span
                  aria-hidden
                  className="select-none pt-[2px] font-mono"
                  style={{ color: FG_MUTED }}
                >
                  —
                </span>
                <span>
                  {b.lead && (
                    <>
                      <strong
                        className="font-semibold"
                        style={{ color: FG_STRONG }}
                      >
                        {b.lead}:
                      </strong>{" "}
                    </>
                  )}
                  {b.body}
                </span>
              </li>
            ))}
          </ul>
        )}

        {entry.note && NoteIcon && (
          <p
            className="mt-6 flex items-start gap-2.5 text-[14px] leading-[1.6] italic"
            style={{ color: FG_MUTED }}
          >
            <NoteIcon
              strokeWidth={1.5}
              className="mt-[3px] size-3.5 shrink-0 not-italic"
              style={{ color: ACCENT }}
            />
            <span>
              <strong className="font-semibold not-italic" style={{ color: FG }}>
                Note:
              </strong>{" "}
              {entry.note.text}
            </span>
          </p>
        )}
      </div>
    </article>
  );
}
