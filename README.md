# Joshua Davis — Senior Software Engineer Portfolio

A production-oriented engineering portfolio built to demonstrate the same technologies and architectural patterns I use in professional software delivery: Angular, ASP.NET Core, Clean Architecture, SQL Server/EF Core, Docker, CI/CD, Azure/AWS concepts, API design, and pragmatic modernization.

## Goals

This is intentionally more than a static résumé. The repository demonstrates:

- Angular standalone-component frontend
- ASP.NET Core 10 API with OpenAPI and health endpoints
- Clean separation between presentation and backend concerns
- Dockerized local/full-stack execution
- GitHub Actions CI and GitHub Pages deployment
- Responsive, accessible recruiter-facing UI
- Architecture and project case-study content suitable for senior/lead/architect roles

## Run the portfolio frontend

```bash
cd frontend
npm install
npm start
```

Open `http://localhost:4200`.

## Run the API

```bash
cd backend
dotnet restore
dotnet run
```

Open `http://localhost:5088/api/profile` or `/health`.

## Run the full stack with Docker

```bash
docker compose up --build
```

Frontend: `http://localhost:8080`  
API: `http://localhost:5088`

## Public work highlighted

- [WorkLens](https://github.com/poker-kid-100717/WorkLens) — ASP.NET Core 10 + SQL Server + Angular 18 + Docker Compose + Clean Architecture job-search/application platform.
- [CleanArchitectureTemplate](https://github.com/poker-kid-100717/CleanArchitectureTemplate) — Clean Architecture reference work.
- [AngularAppAzure](https://github.com/poker-kid-100717/AngularAppAzure) — Angular + .NET solution structured for Azure-oriented deployment.
- [DotnetCoreS3APIBucketUtility](https://github.com/poker-kid-100717/DotnetCoreS3APIBucketUtility) — .NET/AWS S3 integration work.
- [allocation-proration-tool](https://github.com/poker-kid-100717/allocation-proration-tool) — business-rule-heavy allocation/proration tooling.

## Positioning

The portfolio is written for Senior/Lead/Staff-level full-stack and application architecture opportunities. Professional case studies intentionally describe outcomes and architectural responsibility without publishing proprietary employer source code or confidential implementation details.
