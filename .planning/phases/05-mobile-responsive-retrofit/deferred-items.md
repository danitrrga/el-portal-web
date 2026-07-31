# Deferred Items — Phase 05 mobile-responsive-retrofit

Out-of-scope discoveries logged during plan execution but not fixed (per executor
scope-boundary rules). Not blockers for the plans that found them.

## From 05-03

- **`touch-iphone` (WebKit) Playwright project cannot launch in this sandbox.**
  `npx playwright install webkit` succeeds (binary downloads fine), but launching it fails
  host-dependency validation: `Host system is missing dependencies to run browsers` —
  requires `sudo apt-get install libicu74 libxml2 libflite1` or
  `sudo npx playwright install-deps`, both of which need root and are outside a
  code-fixing plan's scope. All 8 routes fail identically with the same host-dependency
  error (not a per-route overflow finding), confirming this is an environment gap, not a
  regression from any 05-03 code change. The other 7 projects in the matrix
  (`reflow-320`, `mobile-360`, `mobile-390`, `mobile-430`, `tablet-768`, `laptop-1024`,
  `desktop-1440` — 56 tests total) all pass. Whoever next has sudo on this box should run
  `sudo npx playwright install-deps` once, after which `npm run audit:overflow` should
  cover all 8 projects.
