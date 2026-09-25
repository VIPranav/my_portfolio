# Pranav VP — Portfolio

A Next.js 15 / React 19 portfolio with Tailwind v4, a lazy React Three Fiber hero, PostgreSQL content, and an Auth.js credentials admin panel. Personal copy uses the supplied biography. The three example projects are clearly labeled sample concepts; no clients or outcome metrics are invented.

## Local setup

Use Node.js 22.18+ and npm. Docker is optional if you already have PostgreSQL 16+.

```bash
npm ci
cp .env.example .env
# Edit .env with your own admin email and password (at least 12 characters).
# Generate AUTH_SECRET locally with: openssl rand -base64 32

docker compose up -d
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

Open http://localhost:3000 and `/admin/login`. The example database URL matches the local-only PostgreSQL container in `compose.yaml`. Keep `.env` out of Git. The existing `.env` is never overwritten by setup scripts.

If database configuration is missing or still the original `user:pass` placeholder, public pages show labeled sample content. Contact submissions report that the form is unavailable; they never claim a message was saved. Admin login requires a configured database, a seeded user, and `AUTH_SECRET`. A configured database failure surfaces an error instead of silently substituting samples.

The seed creates one admin, four skill categories, the supplied tools with honest levels, five milestones, and three published sample projects. Re-running it preserves existing content and passwords. It does not reset an existing admin password. Remove or replace sample projects before publishing your personal work.

## Implemented pages and workflows

- Public: home, work with shareable type filters, case studies, about, skills, journey, services, contact, résumé, and 404.
- Home: pointer/scroll-responsive 3D, five scroll-story disciplines, bento toolkit, featured projects, factual background strip, and contact CTA.
- Admin: dashboard, project creation/editing/deletion, numeric ordering, drafts/previews/publishing, featured work, skills and category management, message inbox/archive, and site settings.
- Contact: shared validation for the server action and API, honeypot, database-backed atomic rate limits, and persisted message status.
- SEO: page metadata, generated Open Graph image, Person JSON-LD, sitemap, and robots rules excluding admin/API/preview routes.

Every admin page, server mutation, and API mutation checks authentication on the server. JWT sessions expire after eight hours. Database checks reject sessions for deleted users. Middleware is an additional guard and uses Next.js 15.5’s Node runtime. Sign-in attempts are rate-limited by both email and client bucket.

### Project publishing

1. Sign in and create a new project.
2. Set a title, slug, discipline, cover, tools, and case-study copy. Add image/video URLs and an optional GLB URL.
3. Save with **Published** unchecked to create a draft.
4. Use **Preview** for `/work/[slug]?preview=1`; this requires an admin session and is excluded from indexing.
5. Publish from the editor or table. Home, work, the case study, and sitemap are revalidated. Lower order numbers display first.

Uploaded cover images are stored in PostgreSQL (`Asset`) and served from `/api/media/[id]`, so they survive serverless filesystem resets. Uploads require authentication, accept PNG/JPEG/WebP signatures, and are limited to 5 MB. Assets are publicly readable by URL; they are not suitable for confidential material. Removed project references do not automatically delete assets. For larger galleries/videos/models, use HTTPS URLs from your media host. External images load directly to avoid server-side fetching of arbitrary hosts.

### Messages

Opening a message marks it read. Archive and restore controls preserve the submission. The dashboard counts unread messages. Inbox views show the latest 200 messages per folder. No email delivery service is configured; the database inbox is the source of truth.

### Site settings and résumé

Settings update the site title, biography, public email, socials, and résumé URL. Social links remain explicit placeholders until configured. `/resume` can be printed or saved as a PDF. A downloadable starter `public/resume.pdf` is included, with explicit contact/education/project placeholders. Update the PDF or set a hosted résumé URL in Settings; regenerate the starter with `node scripts/generate-resume.mjs` after editing its source.

The portrait remains a labeled placeholder. Add your own portrait and verified project media before launch.

## Environment

| Variable               | Purpose                                                                              |
| ---------------------- | ------------------------------------------------------------------------------------ |
| `DATABASE_URL`         | PostgreSQL connection URL; use the provider’s required TLS parameters in production. |
| `AUTH_SECRET`          | A long, randomly generated secret for session signing/encryption.                    |
| `ADMIN_EMAIL`          | Email of the admin created by the seed.                                              |
| `ADMIN_PASSWORD`       | Initial seed password, at least 12 characters.                                       |
| `NEXT_PUBLIC_SITE_URL` | Canonical public origin for metadata and sitemap.                                    |
| `TRUSTED_IP_HEADER`    | Optional header overwritten by your trusted reverse proxy.                           |

Do not set `TRUSTED_IP_HEADER` to a client-controlled header. Without it, IP-level contact and sign-in limits use a shared bucket; the email sign-in limit still applies separately. Counters live in PostgreSQL so limits work across application instances. Contact allows three attempts/minute; login allows twenty attempts/client bucket and five/email per fifteen minutes. Expired counters are cleaned opportunistically.

## Verification

```bash
npm test
npm run typecheck
npm run lint
npm run format:check
npm run build
npm audit
npm run start
```

The build explicitly generates Prisma Client. Its first run downloads Inter via `next/font` and needs network access. Production output uses `.next-production`; development uses `.next`, so a running dev server cannot overwrite the production route manifest.

Regression tests cover unsafe URLs, contact validation, draft defaults, project media validation, settings URLs, nested Prisma configuration merging, and the cyclic-input vulnerability. The Prisma schema is validated and an initial SQL migration is checked in.

Live database integration (migration application, seeded login, publish/revalidate, upload persistence, and contact-to-inbox) must be verified against a configured PostgreSQL instance. Lighthouse performance/accessibility/SEO scores are not yet certified. See the final delivery report for the checks actually run in this workspace.

## Dependency security fix

`@prisma/config@6.19.3` pulled in vulnerable `deepmerge-ts@7.1.5`, creating three high-severity audit entries along one dependency chain. A scoped npm override installs **8.0.2** for that package. Prisma CLI validation, client generation, configuration loading, and regression tests pass with the override. npm reported **zero vulnerabilities** after installation. See [GHSA-ggr8-5vv4-36mx](https://github.com/advisories/GHSA-ggr8-5vv4-36mx).

PostCSS remains pinned through an override to 8.5.28; Auth.js uses patched v5 beta 32 or later in the same release line. Keep the lockfile. Re-run audit when upgrading; the zero-finding result is a point-in-time check. ESLint 9’s upstream support warning remains, separate from security findings.

## Deploy: Vercel + Neon or Supabase

1. Provision PostgreSQL and set production environment variables in the host dashboard. Use a migration-capable database connection for migrations; follow your provider’s pooled/direct connection guidance.
2. Use `npm ci` for installation and `npm run build:deploy` for the build command. This applies checked-in migrations before generating Prisma Client and building Next.js.
3. Seed the database once from a trusted environment with the production connection and admin credentials. Do not seed during every deployment.
4. Confirm admin login, create a draft, preview it, publish it, and verify the public page. Submit a real contact test and confirm it reaches the inbox.
5. Add your real media, portrait, links, résumé, and case studies; remove samples. Verify mobile/desktop layout and run Lighthouse on the deployed HTTPS site.

There is no deployment configured or published by this repository setup. For self-hosting, use `npm run build` followed by `npm run start` behind an HTTPS reverse proxy.

## Maya / 3D workflow

Export from Maya to glTF/GLB using your exporter, or export FBX and convert it to glTF with your DCC tooling. Optimize with the glTF Transform CLI outside this app’s runtime dependencies: reduce geometry, apply Draco compression, and convert textures to WebP. Target a GLB under 3 MB and verify the result in a glTF viewer. Put it in `public/models` or host it at an HTTPS URL with suitable CORS headers, then set the project’s model URL.

The hero uses procedural geometry and local lights, with no external HDR download. It caps DPR at 1.5 and falls back to a static composition on reduced motion, narrow screens, low hardware concurrency, data-saving mode, or WebGL failure. The case-study model viewer loads only after entering the viewport and being explicitly enabled. Auto-rotation is disabled for reduced motion. Compressed GLBs may need the Draco decoder fetched by Drei/Three; ensure your deployment allows the decoder host or configure a self-hosted decoder before restricting network policy.

## Git workflow

Use `main` for deployment, `dev` for integration, and `feat/*` branches for changes. Use conventional commit prefixes such as `feat:`, `fix:`, and `chore:`. This workspace’s `.git` placeholder is not a functioning repository; no commits, branches, or remotes were created.
