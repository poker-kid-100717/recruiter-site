# Joshua Davis — portfolio

Source for **[portfolio-joshdavis.app](https://portfolio-joshdavis.app)**: my resume, selected projects, and recommendations, for hands-on full-stack software roles (C# / .NET, Angular / React, Azure / AWS).

- **What it is:** an Angular 22 site served from Cloudflare Workers Static Assets, a small Worker for the `/api/*` content endpoints and security headers, and an ASP.NET Core 10 API + Docker Compose setup for local full-stack development.
- **Who it's for:** recruiters and hiring teams who want the resume, the public source, and what is actually running, in one place.
- **Status:** deployed to Cloudflare Workers (`joshua-davis-portfolio`) by the GitHub Actions workflow on every push to `main`. Last verified live: not yet re-verified after this change set; the verification date is recorded here once the production URL has been opened and checked.
- **My role:** everything — design, content, code, and deployment.

## Where the content comes from

| File | Used by | Rule |
|---|---|---|
| `content/resume.json` | Angular site (experience, skills, summary, impact, education) and `scripts/build-resume.mjs`, which generates `frontend/public/resume.html` | The resume is the source of truth. The only change from the PDF is that the former employer's product name is replaced with "a freight CRM". No phone number on web pages. |
| `content/recommendations.json` | Recommendations section | Six featured LinkedIn recommendations, verbatim excerpts only, with author, relationship, date, and each author's current LinkedIn headline. |
| `content/api.json` | Cloudflare Worker **and** ASP.NET Core API (`/api/profile`, `/api/architecture`, `/api/work`) | One file for both runtimes, so production (Worker) and local full-stack mode (.NET) cannot drift. |

CI enforces both generated/shared paths:

```bash
node scripts/build-resume.mjs --check                     # resume.html matches content/resume.json
node scripts/check-api-content.mjs http://localhost:5088  # Worker + running .NET API serve content/api.json
```

## Architecture

```
Browser ──> Cloudflare Worker "joshua-davis-portfolio" (portfolio-joshdavis.app)
              ├── /, assets, /resume.html ──> Angular production build (static assets)
              └── /api/*, /health, /healthz ──> Worker handlers (frontend/worker/index.js, content/api.json)
```

The Worker is the production API. `backend/` serves the same endpoints from the same file for local development. Both Docker images build from the repository root (`docker-compose.yml` sets `dockerfile: backend/Dockerfile` and `frontend/Dockerfile`) so they can include `content/`.

## Run locally

```bash
docker compose up -d --build     # http://localhost:8080
```

Or without Docker:

```bash
cd backend && dotnet run --urls http://localhost:5088
cd frontend && npm ci && npm start   # proxies /api to :5088
```

To run the production Worker locally: `cd frontend && npm run dev:cloudflare`.

Useful URLs: `/` portfolio · `/resume.html` printable resume · `/api/profile` · `/api/work` · `/api/architecture` · `/health` · `/healthz`.

## Quality checks

Measured locally on 2026-09-28 with `wrangler dev`, Playwright (Chromium) and axe-core, at 1440 px and 390 px:

- axe: 0 serious/critical violations on `/` (with the "Earlier" roles expanded).
- No horizontal scroll at 390 px.
- Lighthouse: not yet measured (to be recorded after the next production deploy).

## Deploy

Pushes to `main` deploy through `.github/workflows/deploy-cloudflare.yml`, which builds, deploys with Wrangler, and then checks the production HTML, stylesheet, and `/api/profile`. Required repository secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`.

## CI

- Angular install, `resume.html` freshness check, production build, CSP-safe stylesheet check, `npm audit`, `wrangler deploy --dry-run`
- .NET restore + Release build, then the Worker/.NET content check above
- `docker compose config` + image build

## Projects featured on the site

- [TCG Signal](https://github.com/poker-kid-100717/tcg) — React, ASP.NET Core, PostgreSQL on Cloudflare Workers + Containers (deployed)
- [Logistics Portfolio Suite](https://github.com/poker-kid-100717/logistics-portfolio-suite) — clean-room .NET + Angular logistics apps on synthetic data; not employer code (implemented, not yet deployed)
- [WorkLens](https://github.com/poker-kid-100717/WorkLens) — .NET + Angular job feed and application tracker, runs locally with Docker Compose (implemented)

Professional work at Value Truck, Kenworth, Global Holdings and earlier employers is described on the site in the resume's words only; no employer source code, data, or screens are published.

## Known limits

- The resume PDF download is intentionally offline until a revised PDF is supplied; `/resume.html` is the printable version.
- Status labels on the site are updated by hand after each app is verified live.
