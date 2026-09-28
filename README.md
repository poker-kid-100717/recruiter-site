# Joshua Davis — portfolio

Source for **[portfolio-joshdavis.app](https://portfolio-joshdavis.app)**: my resume, selected projects, and recommendations, for hands-on full-stack software roles (C# / .NET, Angular / React, Azure / AWS).

- **What it is:** an Angular 22 site served from Cloudflare Workers Static Assets, a small Worker for the `/api/*` content endpoints and security headers, and an ASP.NET Core 10 API + Docker Compose setup for local full-stack development.
- **Who it's for:** recruiters and hiring teams who want the resume, the public source, and what is actually running, in one place.
- **Status:** deployed to Cloudflare Workers (`joshua-davis-portfolio`) by the GitHub Actions workflow on every push to `main`. Last verified live: not yet re-verified after this change set; the verification date is recorded here once the production URL has been opened and checked.
- **My role:** everything — design, content, code, and deployment.

## Where the content comes from

The site's content lives in **PostgreSQL** (Neon in production). The Angular app loads the whole page from `GET /api/portfolio`; the database builds that document itself with one SQL function, `portfolio_document()` (`db/migrations/001_portfolio_schema.sql`), so the Cloudflare Worker (production) and the ASP.NET Core API (local) run the same query and cannot drift.

| Piece | Role |
|---|---|
| `db/migrations/*.sql` | Schema: profile, roles and bullets, skills, recommendations, projects (with status and verified date), supporting repos, architecture notes. Applied by `db/migrate.mjs` (advisory-locked, each file once). |
| `content/resume.json` | The resume, the source of truth. Seeds the database and generates `frontend/public/resume.html` (`scripts/build-resume.mjs`). The only change from the PDF is that the former employer's product name is replaced with "a freight CRM"; no phone number on web pages. |
| `content/recommendations.json` | Six featured LinkedIn recommendations: verbatim excerpts, author, relationship, date, and each author's current LinkedIn headline. |
| `content/projects.json`, `content/site.json` | Project write-ups, supporting repos, the **Live Apps** section, profile lists, and architecture notes. Live apps are content-owned: their status, URL, and verified date change here, through a reviewed commit, and the seed replaces them on every run. |
| `db/seed.mjs` | Loads the JSON into the database. Idempotent. Text is replaced on every run; a project's **status, demo URL, and verified date are owned by the database** after the first insert. |
| `db/set-status.mjs` | Records status after checking an app: `node db/set-status.mjs tcg-signal "Verified live" 2026-10-01 https://…`. The schema rejects "Verified live" without a date, and the site shows a live link only for verified apps. |

If the database is not configured or not reachable, the Worker serves the same document built from the seed files (`frontend/worker/content.js`), marks the response `X-Content-Source: fallback: …`, and `/health` reports `Degraded`. `db/verify.mjs` proves the SQL function and the seed builder produce identical output.

CI enforces the guarantees:

```bash
node db/verify.mjs --fresh                                # portfolio_document() == seed files
node scripts/check-api-content.mjs http://localhost:5088  # Worker and .NET API identical on the same database
node scripts/build-resume.mjs --check                     # resume.html matches content/resume.json
```

## Architecture

```
Browser ──> Cloudflare Worker "joshua-davis-portfolio" (portfolio-joshdavis.app)
              ├── /, assets, /resume.html ──> Angular production build (static assets)
              └── /api/*, /health ──> Worker ──> Neon Postgres: select portfolio_document()
                                          └─(database unreachable)─> bundled seed, X-Content-Source: fallback
Local:  nginx (Angular) ──/api──> ASP.NET Core API ──> Postgres (same schema and function)
```

The Worker caches the document per isolate for 60 seconds so Neon, which scales to zero, stays off the hot path. No container is needed: the Worker talks to Postgres directly over TCP (`postgres` driver, `nodejs_compat`).

## Run locally

```bash
cp .env.example .env
docker compose up -d --build     # Postgres, migrate + seed job, .NET API, Angular/nginx at http://localhost:8080
```

Without Docker (needs a local Postgres):

```bash
export DATABASE_URL=postgres://portfolio:portfolio-local@127.0.0.1:5432/portfolio
npm ci --prefix db && node db/migrate.mjs && node db/seed.mjs
cd backend && dotnet run --urls http://localhost:5088      # .NET API
cd frontend && npm ci && npm start                           # proxies /api to :5088
```

To run the production Worker locally against the same database: put `DATABASE_URL=...` in `frontend/.dev.vars`, then `cd frontend && npm run dev:cloudflare`.

Useful URLs: `/` portfolio · `/resume.html` printable resume · `/api/portfolio` · `/api/profile` · `/api/work` · `/api/architecture` · `/health` · `/healthz`.

## Quality checks

Measured locally on 2026-09-28 with `wrangler dev` against Postgres 16, Playwright (Chromium) and axe-core, at 1440 px and 390 px:

- axe: 0 serious/critical violations on `/` (with the "Earlier" roles expanded) and on the error state.
- No horizontal scroll at 390 px; first Tab reaches the skip link.
- Database stopped: the page still renders from the seed and says so; API failing: an error message with a working "Try again".
- Lighthouse: not yet measured (to be recorded after the next production deploy).

## Deploy

Pushes to `main` deploy through `.github/workflows/deploy-cloudflare.yml`: build, migrate + seed Neon, deploy with Wrangler (uploading the Worker secret `DATABASE_URL`), then check the production HTML, stylesheet, `/api/profile`, and that `/health` reports the database as `ok`.

Repository secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, and `WORKER_DATABASE_URL` (the Neon pooled connection string for this app's own Neon project, including `?sslmode=require`; TLS follows the URL's `sslmode`, so local and Compose databases connect without it). Without `WORKER_DATABASE_URL` the deploy still works and the site serves the seed.

## CI

- Angular install, `resume.html` freshness check, production build, CSP-safe stylesheet check, `npm audit`, `wrangler deploy --dry-run`
- Postgres service: migrate, seed, verify (twice, for idempotency); .NET Release build; Worker vs .NET API comparison on that database
- `docker compose` build, then the full stack up and answering `/api/portfolio` from Postgres

## Projects featured on the site

- [TCG Signal](https://github.com/poker-kid-100717/tcg) — React, ASP.NET Core, PostgreSQL on Cloudflare Workers + Containers (deployed)
- [Logistics Portfolio Suite](https://github.com/poker-kid-100717/logistics-portfolio-suite) — clean-room .NET + Angular logistics apps on synthetic data; not employer code (implemented, not yet deployed)
- [WorkLens](https://github.com/poker-kid-100717/WorkLens) — .NET + Angular job feed and application tracker, runs locally with Docker Compose (implemented)

Professional work at Value Truck, Kenworth, Global Holdings and earlier employers is described on the site in the resume's words only; no employer source code, data, or screens are published.

## Known limits

- The resume PDF download is intentionally offline until a revised PDF is supplied; `/resume.html` is the printable version.
- Status labels change only when someone runs `db/set-status.mjs` after checking the live app; nothing updates them automatically.
- Editing resume text means editing `content/resume.json` and redeploying (the seed runs on deploy); the resume stays a versioned document.
