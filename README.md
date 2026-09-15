# Joshua Davis — Senior Software Engineer Portfolio

A production-oriented engineering portfolio designed for Senior / Lead / Architect-track individual-contributor opportunities. The repository intentionally demonstrates the same kinds of technology and delivery concerns used in real application work instead of being only a static résumé page.

## What this repository demonstrates

- **Angular 20 / TypeScript** recruiter-facing frontend
- **ASP.NET Core 10** API with OpenAPI and health checks
- **Same-origin nginx gateway** so frontend and API are exposed through one URL
- **Docker Compose** for a repeatable full-stack runtime
- **GitHub Actions CI** for frontend, backend, and container builds
- **Responsive and accessible UI** with reduced-motion support and semantic navigation
- **Print-ready résumé** at `/resume.html`
- Architecture diagrams, career timeline, public-code evidence, project case studies, and professional endorsements
- A cloud/on-premises delivery story that mirrors Joshua's actual engineering background

> Hosting is intentionally **not enabled yet**. The stack is prepared to run locally on port `8080`; when an ngrok URL is supplied, the final public URL metadata and exposure step can be added without restructuring the application.

## Architecture

```text
Browser / Recruiter
       |
       v
nginx gateway :8080
  |            |
  |            +---- /api/* ----> ASP.NET Core 10 API :8080 (internal)
  |
  +---- /, assets, /resume.html -> Angular production build
```

The public container only exposes port `8080`. The API remains internal to the Compose network and is reached through nginx, which keeps browser requests same-origin and avoids a separate public API URL.

## Fastest local start

### Windows / PowerShell

```powershell
./scripts/start-portfolio.ps1
```

The script builds the containers, waits for the gateway health endpoint, validates `/api/profile`, and opens:

```text
http://localhost:8080
```

Stop it with:

```powershell
./scripts/stop-portfolio.ps1
```

### macOS / Linux

```bash
sh ./scripts/start-portfolio.sh
```

Stop it with:

```bash
sh ./scripts/stop-portfolio.sh
```

### Direct Docker Compose

```bash
docker compose up -d --build
```

Useful checks:

```text
http://localhost:8080/              portfolio
http://localhost:8080/resume.html   printable résumé
http://localhost:8080/api/profile   .NET API profile endpoint
http://localhost:8080/api/work      .NET API project endpoint
http://localhost:8080/api/architecture
http://localhost:8080/health        ASP.NET health check via nginx
http://localhost:8080/healthz       nginx health check
```

## Local developer mode

Run the API:

```bash
cd backend
dotnet restore
dotnet run --urls http://localhost:5088
```

Then run Angular in another terminal:

```bash
cd frontend
npm install
npm start
```

Angular's dev server proxies `/api` and `/health` to `http://localhost:5088` through `proxy.conf.json`.

## Portfolio content

The public site is organized around senior-engineering evidence rather than a generic list of skills:

1. **Enterprise delivery case study** — Freight DNA CRM, LTL planning, and Yard operations work is described through architecture, delivery scope, integrations, cloud/on-prem migration, and team leadership. Proprietary employer source code is not published.
2. **WorkLens** — the strongest current public full-stack example: ASP.NET Core, Angular, SQL Server, EF Core, Docker, CI, integrations, browser tooling, and AI-assisted matching.
3. **Architecture + integration history** — links to public repositories covering Clean Architecture, Azure-oriented Angular/.NET work, AWS S3, APIs, authentication, webhooks, and business-rule-heavy tooling.
4. **Career timeline** — recent roles are positioned around architecture, modernization, performance, security, distributed integrations, mentoring, and production ownership.
5. **Endorsements** — selected excerpts from professional recommendations support the leadership/architecture positioning.

## Public work highlighted

- [WorkLens](https://github.com/poker-kid-100717/WorkLens) — ASP.NET Core 10 + SQL Server + Angular 18 + Docker Compose + Clean Architecture job-search/application platform.
- [CleanArchitectureTemplate](https://github.com/poker-kid-100717/CleanArchitectureTemplate) — Clean Architecture reference work.
- [AngularAppAzure](https://github.com/poker-kid-100717/AngularAppAzure) — Angular + .NET solution structured for Azure-oriented deployment.
- [DotnetCoreS3APIBucketUtility](https://github.com/poker-kid-100717/DotnetCoreS3APIBucketUtility) — .NET / AWS S3 integration work.
- [allocation-proration-tool](https://github.com/poker-kid-100717/allocation-proration-tool) — business-rule-heavy allocation/proration tooling.
- [webhook-challenge](https://github.com/poker-kid-100717/webhook-challenge) — webhook/API integration work.

## CI

`.github/workflows/ci.yml` runs three independent checks on pushes and pull requests to `main`:

- Angular install + production build
- .NET restore + Release build
- `docker compose config` + full container image build

There is deliberately **no deployment job** yet.

## Before public exposure

When the ngrok URL is available, the remaining host-specific work is intentionally small:

- set the canonical URL and `og:url` metadata
- optionally add the final social-preview image
- run the full stack locally and verify the ngrok route
- verify `/`, `/resume.html`, `/api/profile`, and `/health` through the public URL
- optionally add the generated PDF résumé as a static asset if a direct `.pdf` download is preferred over the print-ready résumé page

## Positioning

This portfolio is written for Senior Software Engineer, Lead Engineer, Lead Application Developer, Solution Architect, and architect-track IC opportunities. It emphasizes application architecture and delivery ownership while staying truthful about which work is public and which professional systems are confidential.
