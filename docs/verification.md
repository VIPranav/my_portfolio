# Verification — 25 September 2026

## Production isolation

- `next dev` writes to `.next`.
- `next build` and `next start` use `.next-production`.
- Git, ESLint, and Prettier ignore both generated directories.
- TypeScript excludes development output and includes production-generated route types.
- The production route manifest retained all 29 entries after public-page and API checks. The earlier homepage 404 caused by shared generated output did not recur.

## Passed

- Production build, including Prisma Client generation, linting, type validation, and page generation.
- Standalone strict TypeScript check, zero-warning ESLint check, and Prettier check.
- Three regression test files: URL/contact/project/settings validation, nullable project updates, bounded JSON request parsing, origin validation, and patched Prisma dependency behavior (including recursive object graphs).
- Prisma schema validation and migration SQL generation.
- `npm audit`: **0 vulnerabilities** at the time of this check.
- HTTP 200 for all public routes, the sample case study, résumé PDF, sitemap, robots, Open Graph image, and project artwork.
- HTTP 404 for missing pages and unauthorized project previews.
- Admin page redirects to login; unauthenticated project, skill, and upload mutations return 401. Cross-origin mutation requests return 403.
- Contact rejects invalid/oversized requests, ignores honeypots, and reports an unavailable form when database configuration is missing.
- Firefox: public-page rendering, work filtering, mobile menu open/close, theme persistence after reload, and the contact form’s unavailable state.
- Homepage responsive checks at 768, 1280, and 1920 CSS pixels without horizontal overflow. Public pages also passed overflow checks at the automation window’s 500px minimum.
- A native Firefox screenshot at **360 × 900** confirmed the homepage’s narrower layout, wrapping, CTAs, mobile navigation, and stacked story. The automation window’s 500px capture was not counted as a 360px test.

## Not verified

- Live PostgreSQL migration application, seed execution, authenticated CRUD/publishing, upload persistence, and contact-to-inbox delivery. The workspace environment still has placeholder database/admin settings.
- Lighthouse scores or production-network LCP. No numeric performance score is claimed.
- Pointer-driven WebGL rendering or an actual GLB asset on GPU-capable hardware. Headless Firefox exercised the static hero fallback; actual Maya assets have not been supplied.
- Real personal social links, portrait, education, and project outcomes; those remain marked placeholders or explicitly labeled sample content.
