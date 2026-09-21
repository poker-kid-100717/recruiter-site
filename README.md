# Joshua Davis - Senior Software Engineer Portfolio

A production-oriented engineering portfolio designed for Senior / Lead / Architect-track individual-contributor opportunities. The repository intentionally demonstrates the same kinds of technology and delivery concerns used in real application work instead of being only a static resume page.

## Live portfolio

Public URL:

```text
https://portfolio-joshdavis.app
```

The production site is hosted on Cloudflare Workers with static assets served from Cloudflare's edge. The public API endpoints used by the portfolio are also implemented at the edge, so the production site no longer depends on a local machine, Docker host, or ngrok tunnel.

## What this repository demonstrates

- **Angular 20 / TypeScript** recruiter-facing frontend
- **Cloudflare Worker API** for the production portfolio endpoints, with the existing ASP.NET Core 10 API retained for local full-stack development
- **Same-origin Cloudflare edge routing** so frontend and API are exposed through one production URL
- **Cloudflare Workers** for production hosting plus **Docker Compose** for a repeatable local full-stack runtime
- **GitHub Actions CI** for frontend, backend, and container builds
- **Responsive and accessible UI** with reduced-motion support and semantic navigation
- **Print-ready resume** at `/resume.html`
- Architecture diagrams, career timeline, public-code evidence, project case studies, and professional endorsements
- A cloud/on-premises delivery story that mirrors Joshua's engineering background

## Architecture

```text
Browser / Recruiter
       |
       v
Cloudflare edge
  |            |
  |            +---- /api/* ----> Cloudflare Worker API
  |
  +---- /, assets, /resume.html -> Angular production build
```

Production traffic is handled entirely by Cloudflare. Static assets and API routes stay same-origin under `portfolio-joshdavis.app`. Docker Compose remains available only as a local full-stack development option.

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
http://localhost:8080/resume.html   printable resume
http://localhost:8080/api/profile   .NET API profile endpoint
http://localhost:8080/api/work      .NET API project endpoint
http://localhost:8080/api/architecture
http://localhost:8080/health        ASP.NET health check via nginx
http://localhost:8080/healthz       nginx health check
```

## Cloudflare production deployment

Production domain:

```text
https://portfolio-joshdavis.app
```

The Cloudflare configuration lives in `frontend/wrangler.jsonc`. It binds the Angular production build as static assets and routes `/api/*`, `/health`, and `/healthz` through the Worker in `frontend/worker/index.js`.

From `frontend`:

```bash
npm install
npm run deploy
```

For GitHub Actions deployment, add these repository secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

The included deployment workflow publishes on pushes to `main` after CI succeeds.

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

1. **Enterprise delivery case study** - Freight DNA CRM, LTL planning, and Yard operations are presented as a recent three-application logistics suite within a broader career delivering and modernizing enterprise systems. Proprietary employer source code is not published.
2. **WorkLens** - the strongest current public full-stack example: ASP.NET Core 10, Angular 20, SQL Server, EF Core, Docker, CI, integrations, browser tooling, Outlook/Microsoft Graph, and AI-assisted matching.
3. **Architecture + integration history** - links to public repositories covering Clean Architecture, Azure-oriented Angular/.NET work, AWS S3, APIs, authentication, webhooks, and business-rule-heavy tooling.
4. **Career timeline** - recent roles are positioned around architecture, modernization, performance, security, distributed integrations, mentoring, and production ownership.
5. **Endorsements** - selected excerpts from professional recommendations support the leadership/architecture positioning.

## Public work highlighted

- [WorkLens](https://github.com/poker-kid-100717/WorkLens) - ASP.NET Core 10 + SQL Server + Angular 20 + Docker Compose + Clean Architecture job-search/application platform.
- [CleanArchitectureTemplate](https://github.com/poker-kid-100717/CleanArchitectureTemplate) - Clean Architecture reference work.
- [AngularAppAzure](https://github.com/poker-kid-100717/AngularAppAzure) - Angular + .NET solution structured for Azure-oriented deployment.
- [DotnetCoreS3APIBucketUtility](https://github.com/poker-kid-100717/DotnetCoreS3APIBucketUtility) - .NET / AWS S3 integration work.
- [allocation-proration-tool](https://github.com/poker-kid-100717/allocation-proration-tool) - business-rule-heavy allocation/proration tooling.
- [webhook-challenge](https://github.com/poker-kid-100717/webhook-challenge) - webhook/API integration work.

## CI

`.github/workflows/ci.yml` runs three independent checks on pushes and pull requests to `main`:

- Angular install + production build
- .NET restore + Release build
- `docker compose config` + full container image build

Cloudflare deployment is automated through GitHub Actions once the Cloudflare account ID and scoped API token are stored as repository secrets.

## Positioning

This portfolio is written for Senior Software Engineer, Lead Engineer, Lead Application Developer, Solution Architect, and architect-track IC opportunities. It emphasizes application architecture and delivery ownership while staying truthful about which work is public and which professional systems are confidential.
