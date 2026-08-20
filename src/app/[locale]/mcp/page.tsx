import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CopyButton } from "@/components/CopyButton";
import { buildPageMetadata } from "@/lib/seo";

/* ─── Data ────────────────────────────────────────────────────────── */

/**
 * `description` intentionally lives OUT of this data structure — it is the
 * only translatable field on a Tool, so it is looked up from the `mcp`
 * catalogue by `name` (`tools.read.<name>` / `tools.write.<name>`) instead.
 * `params` and `returns` stay here, in English, in both locales: they are
 * TypeScript-shaped type signatures and API-response descriptions that
 * double as documentation of the literal wire format — translating them
 * would describe a contract the API does not actually expose.
 */
interface Tool {
  name: string;
  params: string;
  returns: string;
}

const readTools: Tool[] = [
  {
    name: "portal_snapshot",
    params: 'include?: ("pulse_today" | "archives" | "identity" | "mantras")[]',
    returns:
      "Snapshot object with cycle, habits array, goals array, daily score, and any requested optional sections.",
  },
  {
    name: "portal_review",
    params: 'include?: ("insights" | "pulse_history" | "debrief_stats")[]',
    returns:
      "Review object with scores array, consistency map, days remaining, and optional extras.",
  },
  {
    name: "portal_history",
    params: 'type: "version" | "cycle" | "debrief", version?: string, status?: string',
    returns: "Array of matching historical records ordered by creation date.",
  },
  {
    name: "portal_search",
    params: "query: string, limit?: number (max 50)",
    returns: "Array of matching entities with type, id, title, and excerpt.",
  },
];

const writeTools: Tool[] = [
  {
    name: "portal_log_habits",
    params:
      "entries: { habit_id: string; status: boolean; date?: string }[], up to 30",
    returns: "Array of updated habit records with current streak and revised daily score.",
  },
  {
    name: "portal_pulse",
    params:
      'action: "read" | "write", section: "morning" | "evening", data?: PulseData',
    returns: "Current pulse check-in data for the given section, or confirmation of write.",
  },
  {
    name: "portal_create_cycle",
    params:
      "title: string, goals: Goal[], habits: Habit[], priorities?: string[], mantras?: string[], carry_over?: string[]",
    returns: "Created cycle object with all nested entities and generated IDs.",
  },
  {
    name: "portal_debrief_cycle",
    params: "cycle_id: string, reflection: string",
    returns:
      "Debrief record with server-computed stats, reflection text, and closed cycle summary.",
  },
  {
    name: "portal_create",
    params: "entities: { type: EntityType; data: EntityData }[], up to 10",
    returns: "Array of created entities with generated IDs and timestamps.",
  },
  {
    name: "portal_update",
    params:
      "operations: { type: EntityType; id: string; data: Partial<EntityData> }[], up to 10",
    returns: "Array of updated entities reflecting the applied changes.",
  },
  {
    name: "portal_delete",
    params: "items: { type: EntityType; id: string }[], up to 10",
    returns: "Confirmation array with deleted IDs and cascade summary per item.",
  },
  {
    name: "portal_settings",
    params: 'action: "read" | "update", data?: Partial<UserSettings>',
    returns: "Current or updated user settings object.",
  },
];

/* ─── Code strings ────────────────────────────────────────────────── */

const STDIO_CONFIG = `{
  "mcpServers": {
    "el-portal": {
      "type": "stdio",
      "command": "cmd",
      "args": [
        "/c", "npx", "tsx",
        "--env-file-if-exists=.env.local",
        "--tsconfig", "tsconfig.json",
        "src/mcp/index.ts"
      ],
      "env": {
        "PORTAL_API_KEY": "ep_YOUR_KEY_HERE"
      }
    }
  }
}`;

const HTTP_CONFIG = `POST https://app.el-portal.app/api/mcp
Authorization: Bearer ep_YOUR_KEY_HERE
Content-Type: application/json`;

const EXAMPLE_SNAPSHOT = `{
  "method": "tools/call",
  "params": {
    "name": "portal_snapshot",
    "arguments": {
      "include": ["pulse_today"]
    }
  }
}`;

const EXAMPLE_LOG_HABIT = `{
  "method": "tools/call",
  "params": {
    "name": "portal_log_habits",
    "arguments": {
      "entries": [
        { "habit_id": "your-habit-uuid", "status": true }
      ]
    }
  }
}`;

const EXAMPLE_MORNING = `{
  "method": "tools/call",
  "params": {
    "name": "portal_pulse",
    "arguments": {
      "action": "write",
      "section": "morning",
      "data": {
        "sleep_quality": "good",
        "morning_mood": "energized",
        "one_thing": "Finish the MCP docs"
      }
    }
  }
}`;

/* ─── Shared primitives ───────────────────────────────────────────── */

/**
 * Return type of `getTranslations("mcp")` — the shared translator threaded
 * through every server-side helper below that needs to look up a catalogue
 * string (`CodeBlock`'s aria-label, `ToolRow`'s description/labels). Passed
 * as a prop rather than re-fetched per helper because these are plain
 * functions, not Server Components, and all render inside one request.
 */
type Translator = Awaited<ReturnType<typeof getTranslations>>;

/**
 * `tabIndex={0}` is required: the <pre> scrolls horizontally, and a
 * scrollable region must be keyboard-reachable (axe `scrollable-region-focusable`).
 * But a focus stop with no role and no accessible name announces as nothing —
 * five silent stops per /mcp visit. `role="region"` + `aria-label` is what turns
 * each one into a named landmark a screen reader can announce and skip.
 *
 * The aria-label is an ICU message (`mcp.codeSampleLabel`, `"{label} — code
 * sample"`) with a `{label}` placeholder rather than string concatenation
 * around a translated `label` — concatenation around a translated fragment
 * is the classic way to produce copy a language cannot reorder.
 */
function CodeBlock({ code, label, t }: { code: string; label: string; t: Translator }) {
  return (
    <div className="relative group">
      <pre
        tabIndex={0}
        role="region"
        aria-label={t("codeSampleLabel", { label })}
        className="rounded-lg bg-zinc-900 border border-zinc-800/60 px-4 py-3.5 pr-20 text-[13px] font-mono text-zinc-300 leading-[1.65] overflow-x-auto"
      >
        <code>{code}</code>
      </pre>
      <CopyButton value={code} />
    </div>
  );
}

function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="font-mono text-[12px] text-zinc-300 bg-zinc-800/60 px-1.5 py-0.5 rounded">
      {children}
    </code>
  );
}

function H2({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <h2
      id={id}
      className="text-zinc-100 text-base font-semibold tracking-tight mt-14 mb-5 scroll-mt-24 pb-3 border-b border-zinc-800/60"
    >
      {children}
    </h2>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-zinc-300 text-sm font-medium mt-6 mb-2">{children}</h3>
  );
}

function Para({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-zinc-400 text-sm leading-7">{children}</p>
  );
}

function ToolRow({ tool, write, t }: { tool: Tool; write: boolean; t: Translator }) {
  const roleLabel = t(
    write ? "sections.toolReference.writeBadge" : "sections.toolReference.readBadge",
  );
  const description = t(`tools.${write ? "write" : "read"}.${tool.name}`);
  return (
    <details className="group border-b border-zinc-800/50 last:border-0">
      <summary className="flex items-center justify-between py-3 cursor-pointer list-none">
        <div className="flex items-center gap-3">
          <span
            className={`text-[10px] font-mono font-medium w-8 shrink-0 ${
              write ? "text-amber-500/70" : "text-blue-400/85"
            }`}
          >
            {roleLabel}
          </span>
          <code className="text-sm font-mono text-zinc-200">{tool.name}</code>
        </div>
        <svg
          className="w-3.5 h-3.5 text-zinc-600 transition-transform duration-200 group-open:rotate-180 shrink-0"
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
      </summary>
      <div className="pb-4 pl-11 space-y-3">
        <p className="text-sm text-zinc-400 leading-6">{description}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-[11px] text-zinc-400 uppercase tracking-wider mb-1.5">
              {t("sections.toolReference.parametersLabel")}
            </p>
            <p className="text-xs font-mono text-zinc-400 leading-5">{tool.params}</p>
          </div>
          <div>
            <p className="text-[11px] text-zinc-400 uppercase tracking-wider mb-1.5">
              {t("sections.toolReference.returnsLabel")}
            </p>
            <p className="text-xs text-zinc-400 leading-5">{tool.returns}</p>
          </div>
        </div>
      </div>
    </details>
  );
}

/* ─── TOC ─────────────────────────────────────────────────────────── */

const tocItems = [
  { id: "capabilities", key: "capabilities" },
  { id: "getting-started", key: "gettingStarted" },
  { id: "tool-reference", key: "toolReference" },
  { id: "examples", key: "examples" },
  { id: "permissions", key: "permissions" },
] as const;

/* ─── Page ────────────────────────────────────────────────────────── */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildPageMetadata(locale, "mcp");
}

export default async function McpPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("mcp");

  return (
    <div className="relative w-full bg-zinc-950 min-h-viewport">
      <Navbar />

      <div className="mx-auto max-w-5xl px-6 md:px-8 pt-32 pb-24">
        <div className="flex gap-16 items-start">

          {/* ── Main content ─────────────────────────────────── */}
          <main className="flex-1 min-w-0">

            {/* Hero */}
            <div className="mb-12">
              <p className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest mb-4">
                {t("hero.eyebrow")}
              </p>
              <h1 className="text-zinc-100 text-3xl font-semibold tracking-tight mb-4 leading-snug">
                {t("hero.title")}
              </h1>
              <Para>{t("hero.description")}</Para>
              <div className="flex items-center gap-4 mt-5 text-[12px] font-mono text-zinc-400">
                <span>{t("hero.stats.tools")}</span>
                <span>{t("hero.stats.transport")}</span>
                <span>{t("hero.stats.protocol")}</span>
              </div>
            </div>

            {/* ── Capabilities ─────────────────────────────────── */}
            <H2 id="capabilities">{t("sections.capabilities.heading")}</H2>
            <Para>{t("sections.capabilities.intro")}</Para>

            <H3>{t("sections.capabilities.readToolsHeading")}</H3>
            <div className="rounded-lg border border-zinc-800/60 overflow-hidden mb-6">
              {readTools.map((tool) => (
                <div
                  key={tool.name}
                  className="flex gap-4 px-4 py-3 border-b border-zinc-800/50 last:border-0 hover:bg-zinc-900/50 transition-colors duration-150"
                >
                  <code className="text-sm font-mono text-zinc-200 shrink-0 w-44">
                    {tool.name}
                  </code>
                  <p className="text-sm text-zinc-400 leading-5 min-w-0">
                    {t(`tools.read.${tool.name}`)}
                  </p>
                </div>
              ))}
            </div>

            <H3>{t("sections.capabilities.writeToolsHeading")}</H3>
            <div className="rounded-lg border border-zinc-800/60 overflow-hidden">
              {writeTools.map((tool) => (
                <div
                  key={tool.name}
                  className="flex gap-4 px-4 py-3 border-b border-zinc-800/50 last:border-0 hover:bg-zinc-900/50 transition-colors duration-150"
                >
                  <code className="text-sm font-mono text-zinc-200 shrink-0 w-44">
                    {tool.name}
                  </code>
                  <p className="text-sm text-zinc-400 leading-5 min-w-0">
                    {t(`tools.write.${tool.name}`)}
                  </p>
                </div>
              ))}
            </div>

            {/* ── Getting started ──────────────────────────────── */}
            <H2 id="getting-started">{t("sections.gettingStarted.heading")}</H2>

            <div className="space-y-8">
              {/* Step 1 */}
              <div>
                <H3>{t("sections.gettingStarted.step1.heading")}</H3>
                <Para>
                  {t.rich("sections.gettingStarted.step1.body", {
                    settingsPath: (chunks) => (
                      <span className="text-zinc-300">{chunks}</span>
                    ),
                    code: (chunks) => <InlineCode>{chunks}</InlineCode>,
                  })}
                </Para>
              </div>

              {/* Step 2 */}
              <div>
                <H3>{t("sections.gettingStarted.step2.heading")}</H3>
                <Para>
                  {t.rich("sections.gettingStarted.step2.body", {
                    stdioTag: (chunks) => (
                      <span className="text-zinc-300">{chunks}</span>
                    ),
                    httpTag: (chunks) => (
                      <span className="text-zinc-300">{chunks}</span>
                    ),
                  })}
                </Para>
              </div>

              {/* Step 3 */}
              <div>
                <H3>{t("sections.gettingStarted.step3.heading")}</H3>
                <p className="text-[11px] text-zinc-400 uppercase tracking-wider mb-2 mt-4">
                  {t("sections.gettingStarted.step3.stdioCaption")}
                </p>
                <CodeBlock
                  code={STDIO_CONFIG}
                  label={t("sections.gettingStarted.step3.stdioCodeLabel")}
                  t={t}
                />
                <p className="text-[11px] text-zinc-400 uppercase tracking-wider mb-2 mt-5">
                  {t("sections.gettingStarted.step3.httpCaption")}
                </p>
                <CodeBlock
                  code={HTTP_CONFIG}
                  label={t("sections.gettingStarted.step3.httpCodeLabel")}
                  t={t}
                />
              </div>
            </div>

            {/* ── Tool reference ───────────────────────────────── */}
            <H2 id="tool-reference">{t("sections.toolReference.heading")}</H2>
            <Para>{t("sections.toolReference.intro")}</Para>

            <div className="mt-6 rounded-lg border border-zinc-800/60 px-4">
              {readTools.map((tool) => (
                <ToolRow key={tool.name} tool={tool} write={false} t={t} />
              ))}
              {writeTools.map((tool) => (
                <ToolRow key={tool.name} tool={tool} write={true} t={t} />
              ))}
            </div>

            {/* ── Examples ─────────────────────────────────────── */}
            <H2 id="examples">{t("sections.examples.heading")}</H2>

            <H3>{t("sections.examples.snapshot")}</H3>
            <CodeBlock
              code={EXAMPLE_SNAPSHOT}
              label={t("sections.examples.snapshot")}
              t={t}
            />

            <H3>{t("sections.examples.logHabit")}</H3>
            <CodeBlock
              code={EXAMPLE_LOG_HABIT}
              label={t("sections.examples.logHabit")}
              t={t}
            />

            <H3>{t("sections.examples.morning")}</H3>
            <CodeBlock
              code={EXAMPLE_MORNING}
              label={t("sections.examples.morning")}
              t={t}
            />

            {/* ── Permissions ──────────────────────────────────── */}
            <H2 id="permissions">{t("sections.permissions.heading")}</H2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
              {/* Permission model */}
              <div className="rounded-lg border border-zinc-800/60 p-5">
                <p className="text-sm font-medium text-zinc-300 mb-4">
                  {t("sections.permissions.model.title")}
                </p>
                <ul className="space-y-3.5">
                  <li>
                    <p className="text-[11px] font-mono text-blue-400/85 uppercase tracking-wider mb-1">
                      {t("sections.permissions.model.read.label")}
                    </p>
                    <p className="text-xs text-zinc-400 leading-5">
                      {t("sections.permissions.model.read.body")}
                    </p>
                  </li>
                  <li>
                    <p className="text-[11px] font-mono text-amber-500/70 uppercase tracking-wider mb-1">
                      {t("sections.permissions.model.write.label")}
                    </p>
                    <p className="text-xs text-zinc-400 leading-5">
                      {t("sections.permissions.model.write.body")}
                    </p>
                  </li>
                  <li>
                    <p className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1">
                      {t("sections.permissions.model.storage.label")}
                    </p>
                    <p className="text-xs text-zinc-400 leading-5">
                      {t("sections.permissions.model.storage.body")}
                    </p>
                  </li>
                </ul>
              </div>

              {/* Rate limits */}
              <div className="rounded-lg border border-zinc-800/60 p-5">
                <p className="text-sm font-medium text-zinc-300 mb-4">
                  {t("sections.permissions.rateLimits.title")}
                </p>
                <table className="w-full">
                  <tbody className="divide-y divide-zinc-800/50">
                    {(
                      [
                        "readTools",
                        "writeTools",
                        "keyCreation",
                        "activeKeys",
                      ] as const
                    ).map((row) => (
                      <tr key={row}>
                        <td className="text-xs text-zinc-400 py-2">
                          {t(`sections.permissions.rateLimits.${row}.op`)}
                        </td>
                        <td className="text-xs text-zinc-400 text-right py-2 font-mono">
                          {t(`sections.permissions.rateLimits.${row}.limit`)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-14 pt-8 border-t border-zinc-800/60">
              <p className="text-zinc-100 text-[15px] md:text-base font-medium mb-2">
                {t("cta.heading")}
              </p>
              <p className="text-sm text-zinc-400 mb-5">{t("cta.body")}</p>
              <Link
                href={`${process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.el-portal.app'}/settings`}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-100 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-4 py-2 rounded-lg transition-colors duration-150 min-h-11 md:min-h-0"
              >
                {t("cta.button")}
                <svg
                  className="w-3.5 h-3.5 text-zinc-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </main>

          {/* ── Sticky TOC ───────────────────────────────────────── */}
          <aside className="hidden xl:block w-44 shrink-0">
            <div className="sticky top-28">
              <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-widest mb-3">
                {t("toc.heading")}
              </p>
              <nav aria-label={t("toc.heading")}>
                <ul className="space-y-1">
                  {tocItems.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className="block text-xs text-zinc-400 hover:text-zinc-300 py-0.5 transition-colors duration-150"
                      >
                        {t(`toc.items.${item.key}`)}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </aside>

        </div>
      </div>

      <Footer />
    </div>
  );
}
