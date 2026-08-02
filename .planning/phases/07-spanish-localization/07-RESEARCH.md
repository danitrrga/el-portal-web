---
phase: 07-spanish-localization
type: research
researched: 2026-08-02
status: complete
---

# Phase 7 — Spanish Localization: Research

Pre-planning research. Decisions marked LOCKED were taken by the design owner on
2026-08-02 and should not be re-litigated during planning.

---

## 1. The finding that shaped the phase

The original request was "choose by default what the browser has". Google's
multi-regional guidance says the opposite, verbatim:

> "Avoid automatically redirecting users from one language version of a site to a
> different language version of a site."

The reason is mechanical, not stylistic: **Googlebot crawls from the US and does
not send an `Accept-Language` header.** A site that redirects every URL by browser
language therefore shows the crawler exactly one locale, and the other may never be
indexed. For a phase whose entire point is reaching a Spanish audience, that is a
self-defeating outcome — the translation would exist but be unfindable in Spanish
search.

Google's recommended alternative is explicit signals over implicit detection:
`hreflang` annotations, distinct URLs per locale, and user-selectable links.

**Resolution (LOCKED):** negotiate on `/` only — the `x-default` URL — and never on
a locale-specific URL. This is the accepted industry pattern and gets the requested
behaviour without the indexing risk.

---

## 2. Library selection

**LOCKED: `next-intl@^4.13` (latest 4.13.4).**

| Candidate | Verdict |
|---|---|
| **next-intl** | De-facto standard for App Router. RSC-first: translations load in Server Components without hydration overhead. Verified `peerDependencies` declares `next: "^12 \|\| ^13 \|\| ^14 \|\| ^15 \|\| ^16"` — **official Next 16 support**, not a blog claim. |
| Paraglide JS (`@inlang/paraglide-js`, 2.23.1) | Compile-time, tree-shakeable; reportedly 6–10× smaller bundle. Rejected: younger ecosystem, and bundle size is not the binding constraint on a prose-heavy marketing site that is already fully static. |
| next-i18next | v16 added App Router support only in March 2026 and is described as still settling. Its advantage is the broader i18next ecosystem, which this project does not need. |

Verification performed: `npm view next-intl peerDependencies` — do not take the
version claim on trust when planning; re-check if time has passed.

---

## 3. Next.js 16 specifics — two traps

### 3.1 `middleware.ts` is deprecated in favour of `app/proxy.ts`

Next 16 renamed the convention. Consequences:

- File must live at `app/proxy.ts`, exporting `proxy` (not `middleware`).
- It now runs on the **Node.js runtime** by default, not Edge.
- It is scoped to routing — rewrites, redirects, headers. Locale negotiation is
  squarely within that remit.
- `middleware.ts` still works but warns; a codemod exists.

next-intl published a migration guide alongside the Next 16 release and its docs
already reference `proxy.ts`.

### 3.2 Static rendering requires *two* things, and failing quietly is the default

next-intl **opts into dynamic rendering** when `useTranslations` is used in a
Server Component. Preserving the current all-static build requires **both**:

- `generateStaticParams` — declares which locales to prerender;
- `setRequestLocale` — supplies the locale from route params so the component does
  **not** read `headers()`.

Omit `setRequestLocale` and pages still work — they just stop being static. There
is no error. This is the single most likely way this phase silently regresses the
build, and it would also collide with Phase 6's CSP work, which assumes static
prerendering. **Success criterion 6 exists specifically to catch it:** assert `○`
in the build output for all 8 routes × 2 locales.

---

## 4. Locale detection semantics (next-intl native)

Precedence, prefix-based routing:

1. Locale prefix in the pathname (`/es/pricing`)
2. Cookie holding a previously detected/selected locale
3. `Accept-Language`, matched with `@formatjs/intl-localematcher` **"best fit"**
4. `defaultLocale`

The "best fit" matcher is materially better than RFC 4647 "lookup" here: a browser
sending `es-AR` or `es-419` resolves to `es` rather than falling through to
English. Worth confirming during planning with the specific Spanish variants the
audience sends.

`localeDetection` can be disabled; `localePrefix` accepts `always` / `as-needed` /
`never`.

**LOCKED: `localePrefix: "as-needed"`** — English stays unprefixed, so no existing
URL moves and nothing already indexed needs re-crawling. The cost is asymmetry
(English is implicitly "the" default in the URL shape), accepted deliberately.

---

## 5. Translation workflow — how teams actually do this

Industry practice for teams at scale: extract strings → sync to a TMS
(Crowdin / Lokalise / Phrase / Transifex) → CI job pulls translations → deploy.
The TMS provides quality gates for ICU syntax errors, placeholder mismatches, and
length problems, and the vendors ship GitHub Actions/CLI for push-pull automation.

**That is not proportionate here.** This is a solo-maintained marketing site with
two locales and ~390 strings. A TMS adds a subscription, an integration, and a
sync failure mode to solve a coordination problem that does not exist with one
translator. Recorded as a **non-goal**.

What *is* worth adopting from that practice:

- **ICU MessageFormat** for plurals/interpolation — next-intl uses it natively, so
  this comes free and avoids hand-rolled pluralisation.
- **Placeholder-parity checking** — the single highest-value quality gate. A
  missing `{count}` in one locale is a runtime error, and it is trivially
  detectable by comparing key sets and placeholders between `en.json` and `es.json`
  in CI. Cheap to add to the existing `quality` job.
- **Flat, namespaced keys** so missing-key diffs are readable in review.

---

## 6. Scope and its ongoing costs

Content measured at research time: ~6,100 lines of TSX, ~390 translatable strings,
prose-heavy, all currently hardcoded inline. No extraction layer exists yet.

| Surface | Size | Note |
|---|---|---|
| `/features` | 970 lines | Largest single surface |
| `/changelog` | 944 lines, 35 entries | **Recurring cost — see below** |
| `/mcp` | 564 lines | Contains code blocks; do not translate code |
| `/pricing` | 506 lines | Currency/pricing explicitly a non-goal |
| `/privacy` + `/terms` | 465 lines | **Meaning risk — see below** |
| `/manifesto` | 244 lines | Highest brand-voice sensitivity |
| Shared chrome | Navbar, Footer, CTA, cards | Touches every page |

### Two costs the scope decision inherits

**Changelog is not a one-off.** The `el-portal-changelog` skill syncs new entries
from the app repo on an ongoing basis. Every future sync adds untranslated Spanish
content unless the sync workflow itself gains a translation step. Without that, the
Spanish changelog silently drifts out of parity — which is worse than not
translating it, because it looks complete. **Needs an explicit decision during
discuss-phase**: extend the sync workflow, or mark the changelog English-only with
a visible notice.

**Legal text carries meaning risk.** `/privacy` and `/terms` are the two surfaces
where a mistranslation has actual consequences. Many teams keep one authoritative
legal language and link to it rather than maintaining parallel legal copy. Decide:
is machine translation acceptable, does it need human review, and does English
remain authoritative?

---

## 7. Brand-voice constraint

`.planning/codebase/design/BRAND.md` defines a specific register (The Companion)
and an anti-words list. A translation that ignores it will read as a different
product in Spanish. The anti-words list is English; it needs a Spanish equivalent,
and the register needs a decision on formality — **`tú` vs `usted`** is the single
most consequential voice choice in Spanish marketing copy and should be made once,
explicitly, before any copy is written.

---

## 8. Interaction with Phase 6

Phase 6 (Security Headers) and this phase both touch response headers, and
potentially the same file: if Phase 6 implements CSP in `app/proxy.ts`, locale
negotiation lands there too. Either sequence works, but the second one done pays a
merge cost. Flagged in the roadmap sequencing note.

Phase 6's SEC-01 also explicitly requires "preserving static prerendering of all 8
routes" — which §3.2 above can silently break. Whichever phase runs second must
re-assert that criterion, not assume it.

---

## Sources

- [Google Search Central — Managing multi-regional and multilingual sites](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites)
- [next-intl — App Router setup with i18n routing](https://next-intl.dev/docs/getting-started/app-router/with-i18n-routing)
- [next-intl — Middleware / locale detection](https://next-intl.dev/docs/routing/middleware)
- [Next.js — Renaming Middleware to Proxy](https://nextjs.org/docs/messages/middleware-to-proxy)
- [Next.js 16 release notes](https://nextjs.org/blog/next-16)
- [Intlayer — Best i18n solution for Next.js 2026 benchmark](https://intlayer.org/en-GB/doc/benchmark/nextjs)
- [i18nexus — next-i18next vs next-intl](https://i18nexus.com/posts/i18next-vs-next-intl)
- [hreflang.org — Redirection and international SEO](https://hreflang.org/redirection-and-international-seo/)
- [Phrase — Localization workflow automation](https://phrase.com/blog/posts/localization-workflow-automations/)
- [SimpleLocalize — Translation workflow for small teams and solo devs](https://simplelocalize.io/blog/posts/translation-workflow-small-teams/)
