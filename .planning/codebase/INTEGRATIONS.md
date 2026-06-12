# External Integrations

**Analysis Date:** 2026-06-12

## Summary

This is a **static marketing/landing website** with no backend database, authentication system, or external API integrations for user data. Content is hardcoded or served via static generation. The project links to an external El Portal app but does not integrate with its APIs or services.

---

## APIs & External Services

**Internal App Links (No Integration):**
- El Portal App (`https://app.el-portal.app`)
  - Used for: Navigation links to main application
  - What it's NOT: Not called or integrated from this marketing site; links only
  - Environment variable: `NEXT_PUBLIC_APP_URL` (defaults to `https://app.el-portal.app`)
  - Files: `src/components/Navbar.tsx`, `src/components/Hero.tsx`, `src/components/CTASection.tsx`, `src/app/pricing/page.tsx`, `src/app/mcp/page.tsx`

**MCP Server Documentation (Reference Only):**
- MCP Protocol endpoint documented in `src/app/mcp/page.tsx` for external integration reference
  - What it is: Static documentation of MCP server endpoints (POST `https://app.el-portal.app/api/mcp`)
  - What it's NOT: Not called from this site; displayed as reference content for users/developers
  - No SDK or client library integrated

**Google Fonts CDN:**
- Loaded via Next.js `next/font/google` (server-side bundling)
- Font families: Inter, JetBrains Mono, Instrument Serif, Special Gothic Expanded One
- Configured in: `src/app/layout.tsx`
- No direct HTTP calls; fonts embedded in build output

**Material Symbols (Legacy Reference):**
- CDN link present in `src/app/layout.tsx` head tag
  - `<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />`
  - Status: Loaded but not actively used in current codebase (Lucide React is primary icon library)
  - Can be removed in future cleanup

---

## Data Storage

**Databases:**
- None - This is a static marketing site with no backend database

**File Storage:**
- None - No file uploads or storage integrations
- All assets (images, videos, SVGs) are static files in `public/` or embedded in components

**Caching:**
- Next.js built-in ISR (Incremental Static Regeneration) for pages
- Browser caching via standard HTTP headers
- No external caching service

---

## Authentication & Identity

**Auth Provider:**
- None - No user authentication on this marketing site
- Links redirect to El Portal app for login, but no auth integration here

---

## Monitoring & Observability

**Error Tracking:**
- Not detected - No Sentry, LogRocket, or similar integration

**Logs:**
- Next.js console output during development and build
- Vercel (or hosting provider) server logs in production
- No structured logging library integrated

**Analytics/Telemetry:**
- Not detected - No Google Analytics, Mixpanel, or similar tracking

---

## CI/CD & Deployment

**Hosting:**
- Not specified in codebase - No deployment configuration detected
- Likely target: Vercel (Next.js creator), but not enforced in code
- Could also deploy to: Self-hosted Node.js, Netlify, AWS Amplify, or any Node-compatible platform

**CI Pipeline:**
- Not detected - No GitHub Actions, GitLab CI, or similar configuration files present

**Build Output:**
- `.next/` directory (generated during `npm run build`)
- Static exports possible via `next build && next export` (not configured by default)

---

## Environment Configuration

**Required env vars:**
- `NEXT_PUBLIC_APP_URL` (optional, defaults to `https://app.el-portal.app`)
  - Public environment variable (visible to browser)
  - Controls external app link destinations
  - Set in `.env.local` or deployment platform

**Secrets location:**
- `.env.local` file present in root
- Contents not inspected (security policy); assumed for any development-only configuration
- Production secrets: Managed by hosting platform (Vercel, etc.) or `.env.production.local`

**No Sensitive Operations:**
- No API keys, tokens, or credentials required for site functionality
- No Supabase, Firebase, or similar backend service integration

---

## Webhooks & Callbacks

**Incoming:**
- None - No API endpoints defined in this marketing site
- No webhook receivers

**Outgoing:**
- None - No outbound API calls made from pages or components
- External links are navigation only (user-initiated)

---

## Third-Party Embeds

**Video Players:**
- Remotion Player component (`@remotion/player`)
  - Used for: Embedded animations (e.g., `AsymptoticPlayer`, `CyclesPlayer` in `src/components/animations/AnimationPlayers.tsx`)
  - What it does: Renders client-side video compositions
  - Not an external service; runs locally

**Design System / Component Library:**
- shadcn/ui - Copies of components stored in `src/components/ui/` directory
- No external API calls; components are local implementations
- Lucide React icons - NPM package, not external service

---

## Notes for Future Integration

- If future versions require email capture (newsletter signup, waitlist), add email service (e.g., Resend, SendGrid)
- If analytics needed, integrate Google Analytics 4 or alternative (via `next/script`)
- If contact forms required, add form handler (e.g., Formspree, Basin)
- Any future El Portal app integration should use the MCP protocol documented in `src/app/mcp/page.tsx`

---

*Integration audit: 2026-06-12*
