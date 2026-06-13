import {
  CalendarDots,
  FilmSlate,
  Folders,
  Heart,
  Kanban,
  Lightning,
  Target,
  Translate,
  Timer,
} from "@phosphor-icons/react/dist/ssr";

/* ── Section eyebrow — mono num · label + hairline rule ───────────── */
function SectionEyebrow({ num, label }: { num: string; label: string }) {
  return (
    <div className="mb-8 flex items-center gap-3 md:mb-10">
      <span
        className="font-mono text-[11px] tabular-nums"
        style={{ color: "var(--color-ep-fg-subtle-2)" }}
      >
        {num}
      </span>
      <span
        aria-hidden
        className="font-mono text-[10px]"
        style={{ color: "var(--color-ep-fg-subtle-2)" }}
      >
        ·
      </span>
      <span
        className="font-mono text-[11px] uppercase tracking-[0.22em]"
        style={{ color: "var(--color-ep-fg-muted)" }}
      >
        {label}
      </span>
      <div
        aria-hidden
        className="ml-1 h-px flex-1"
        style={{ background: "var(--color-ep-rule)" }}
      />
    </div>
  );
}

/* ── Feature highlight cell data ──────────────────────────────────── */
type HighlightCell = {
  icon: React.ElementType;
  label: string;
  body: string;
  featured?: boolean;
};

const HIGHLIGHTS: HighlightCell[] = [
  {
    icon: CalendarDots,
    label: "Temporal System",
    body: "Version → Cycle → Day. Three nested time containers, all configurable. One version and one cycle active at a time.",
  },
  {
    icon: Target,
    label: "Goals",
    body: "Project goals track subtask completion. Consistency goals follow an asymptotic curve — sustained effort compounds over raw streak length.",
    featured: true,
  },
  {
    icon: Kanban,
    label: "Lab",
    body: "Where versions and cycles take shape. Set priorities, frictions, CCH, mantras, habits, and goals before each cycle begins.",
  },
  {
    icon: Folders,
    label: "Archives",
    body: "Persistent knowledge across cycles: routines (boot, shutdown, deep work), the 5-year vision, the mantra bank, and study notes.",
  },
  {
    icon: FilmSlate,
    label: "Cinema",
    body: "Full-screen visualization mode. Five slides — Me, Her, Purpose, Social, Material — each with an image and text. Editable directly on the slide.",
  },
  {
    icon: Lightning,
    label: "Daily Flow",
    body: "Morning boot: read your identity, check mantras, see your focus. Evening shutdown: log habits, record your pulse. The system disappears in between.",
    featured: true,
  },
  {
    icon: Timer,
    label: "Configurable Tempo",
    body: "Adjust version length and cycle count in settings. The system derives cycle duration automatically and validates the split.",
  },
  {
    icon: Heart,
    label: "Pulse",
    body: "The daily check-in. Mood, energy, sleep, and a freeform reflection — captured in words, not scores. Feeds the Trends analytics engine.",
  },
  {
    icon: Translate,
    label: "5 Languages",
    body: "Full interface in English, Spanish, French, German, and Portuguese. Switch at any time.",
  },
];

/* ── Open line-ruled highlight grid (D-05: no card backgrounds) ───── */
export default function HighlightGrid() {
  return (
    <section>
      <SectionEyebrow num="02" label="Highlights" />

      <div className="grid gap-8 md:grid-cols-3 md:gap-12">
        {HIGHLIGHTS.map(({ icon: Icon, label, body, featured }) => (
          <div
            key={label}
            className={[
              "flex flex-col border-t pt-6",
              featured ? "md:col-span-2" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            style={{ borderColor: "var(--color-ep-hairline)" }}
          >
            {/* Icon */}
            <div className="mb-3">
              <Icon
                size={18}
                weight="light"
                style={{ color: "var(--color-ep-accent)" }}
              />
            </div>

            {/* Mono label */}
            <span
              className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em]"
              style={{ color: "var(--color-ep-fg-muted)" }}
            >
              {label}
            </span>

            {/* Body */}
            <p
              className="text-[14px] leading-[1.6]"
              style={{ color: "var(--color-ep-fg)" }}
            >
              {body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
