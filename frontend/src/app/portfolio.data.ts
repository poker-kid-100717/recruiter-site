export interface Project {
  title: string;
  eyebrow: string;
  summary: string;
  outcomes: string[];
  tech: string[];
  href?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  professional?: boolean;
}

export interface Experience {
  company: string;
  title: string;
  dates: string;
  summary: string;
  highlights: string[];
  tech?: string[];
}

export interface Endorsement {
  quote: string;
  name: string;
  role: string;
}

export interface ArchitectureLayer {
  name: string;
  note: string;
}

export interface ArchitectureDecision {
  choice: string;
  instead: string;
  why: string;
}

export interface RepoArchitecture {
  layers: ArchitectureLayer[];
  decisions: ArchitectureDecision[];
}

export interface PublicRepo {
  /** Short display name shown on the card; the GitHub repo name lives in href. */
  name: string;
  description: string;
  tech: string;
  href: string;
  architecture?: RepoArchitecture;
}

export const projects: Project[] = [
  {
    title: 'Freight DNA + Logistics Application Suite',
    eyebrow: 'Enterprise architecture / delivery',
    summary: 'Professional case study covering a business-logic-heavy CRM, LTL planning workflows, and yard operations tooling. These three applications are a recent example within a broader career delivering and modernizing enterprise systems across multiple industries.',
    outcomes: [
      'Architected and delivered a three-application logistics suite with multiple iterations from discovery through UAT readiness.',
      'Built Angular + ASP.NET Core + SQL Server workflows with Entra ID authentication, external transportation APIs, complex operational grids, and business-rule-heavy user experiences.',
      'Designed an Azure-hosted architecture and later reworked the platform for containerized/on-premises deployment when infrastructure requirements changed.',
      'Established a small delivery function around the products, mentoring contributors and translating C-level and operations requests into architecture, data models, APIs, workflows, and release decisions.'
    ],
    tech: ['C#', 'ASP.NET Core', 'Angular', 'TypeScript', 'EF Core', 'SQL Server', 'Azure', 'Docker', 'Entra ID', 'REST APIs', 'AG Grid'],
    professional: true
  },
  {
    title: 'WorkLens',
    eyebrow: 'Public full-stack platform',
    summary: 'A self-hosted job intelligence and application-tracking platform built as a production-style system rather than a portfolio toy.',
    outcomes: [
      'Clean Architecture backend with explicit Core, Infrastructure, and API boundaries.',
      'Live provider aggregation, background refresh, configurable search profiles, resume matching, analytics, and application pipeline workflows.',
      'Docker Compose stack with SQL Server, ASP.NET Core, Angular/nginx, EF migrations, health-aware startup, and GitHub Actions CI.',
      'Integrates RemoteOK, Remotive, Greenhouse, Dice MCP, browser-extension workflows, Microsoft Graph/Outlook, and OpenAI-assisted matching.'
    ],
    tech: ['ASP.NET Core 10', 'Angular 22', 'SQL Server', 'EF Core 10', 'Docker', 'GitHub Actions', 'Vitest', 'OpenAI', 'Microsoft Graph', 'MCP'],
    href: 'https://github.com/poker-kid-100717/WorkLens'
  },
  {
    title: 'TCG Price Guide',
    eyebrow: 'Public full-stack platform · live',
    summary: 'A price and set guide for the Pokémon TCG: TCGplayer market prices for every card in every set, a daily price history, the week’s biggest movers, and a Shop now link from each card to its TCGplayer listing.',
    outcomes: [
      'ASP.NET Core 10 minimal API over the Pokémon TCG API: typed client with escaped queries, HybridCache, a resilience pipeline, and a clear 502 when the upstream is down.',
      'Daily price snapshots of every card into PostgreSQL, triggered by a Cloudflare Cron Trigger and written with Postgres unnest bulk upserts, which power price-history charts and market movers.',
      'React 19 + TypeScript front end with TanStack Query: set guide, sortable and filterable set pages, card pages with price history and Shop now.',
      'Runs entirely on Cloudflare (Worker + Container, Neon Postgres); integration tests use a real Postgres via Testcontainers.'
    ],
    tech: ['ASP.NET Core 10', 'React 19', 'TypeScript', 'TanStack Query', 'PostgreSQL', 'EF Core 10', 'Cloudflare Workers', 'Cloudflare Containers', 'Testcontainers'],
    href: 'https://github.com/poker-kid-100717/tcg',
    secondaryHref: 'https://tcg-portfolio-sample.app',
    secondaryLabel: 'Open the live app'
  },
];

export const experience: Experience[] = [
  {
    company: 'Value Truck',
    title: 'Application Development Manager / Lead Application Developer',
    dates: 'May 2026 - Sep 2026',
    summary: 'Application architecture, full-stack delivery, modernization, and technical leadership for logistics operations across brokerage and asset-side workflows.',
    highlights: [
      'Architected and shipped Freight DNA CRM, LTL planning, and Yard operations - three enterprise applications delivered through multiple iterations in under five months.',
      'Owned hands-on full-stack delivery across Angular, ASP.NET Core, EF Core, SQL Server, Entra ID, transportation APIs, and operational workflows from discovery through UAT.',
      'Designed Azure-hosted and containerized on-premises deployment models, adapting authentication, configuration, data access, networking, and release processes as constraints changed.',
      'Continued coding while setting technical direction, reviewing work, mentoring two contributors, and translating business requests into maintainable APIs, data models, workflows, and production-ready features.'
    ],
    tech: ['.NET', 'Angular', 'SQL Server', 'Azure', 'Docker', 'Entra ID']
  },
  {
    company: 'Kenworth Truck Co.',
    title: 'Software Engineer',
    dates: 'May 2025 - May 2026',
    summary: 'Enterprise application development focused on maintainable .NET architecture, operational workflows, SQL performance, integration reliability, and production support.',
    highlights: [
      'Designed ASP.NET Core services with Clean Architecture, dependency injection, repository patterns, and explicit boundaries to improve maintainability, testability, and delivery.',
      'Built workflow-heavy web applications with complex grids, forms, validation, status transitions, REST-backed features, and operational data contracts.',
      'Improved SQL Server queries and stored procedures by roughly 15-25% through indexing, execution-plan analysis, query tuning, and data-access optimization.',
      'Implemented event-driven cloud messaging and strengthened CI/CD, environment configuration, structured logging, code quality, and production troubleshooting.'
    ],
    tech: ['ASP.NET Core', 'SQL Server', 'Clean Architecture', 'Messaging', 'CI/CD']
  },
  {
    company: 'Global Holdings',
    title: 'Software Engineer',
    dates: 'Jun 2024 - May 2025',
    summary: 'Backend architecture, SQL performance, asynchronous processing, observability, and production resiliency for distributed applications.',
    highlights: [
      'Architected reusable ASP.NET Core APIs and services using Clean Architecture, separation of concerns, and maintainable dependency boundaries.',
      'Improved key SQL Server workflows by approximately 20% through indexing, partitioning, stored-procedure optimization, and query analysis.',
      'Designed object-storage and queue-based processing for large-file ingestion and background workloads with transient-failure handling, structured logging, and correlation IDs.',
      'Partnered with engineering and QA to define contracts, debug production issues, improve observability, and deliver reliable releases with clear ownership.'
    ],
    tech: ['.NET', 'SQL Server', 'Cloud Storage', 'Queues', 'Observability']
  },
  {
    company: 'PFA Solutions',
    title: 'Software Engineer',
    dates: 'Jan 2022 - Jun 2024',
    summary: 'Full-stack SaaS delivery across Angular/TypeScript and .NET Core APIs from technical design through deployment.',
    highlights: [
      'Owned full-stack SaaS delivery across Angular/TypeScript and .NET Core REST APIs from technical design through implementation, testing, and deployment.',
      'Built reusable backend patterns with DTO mapping, FluentValidation, EF Core, REST contracts, and consistent response/error handling.',
      'Created modular Angular architecture with lazy loading, shared components, RxJS, reactive patterns, and responsive UI design.',
      'Implemented serverless and queue-based automation while improving scalability through caching, query optimization, and cleaner service/data boundaries.'
    ],
    tech: ['Angular', 'TypeScript', '.NET Core', 'EF Core', 'RxJS']
  },
  {
    company: 'UnitedHealth Group / Optum',
    title: 'Software Engineer',
    dates: 'Jan 2021 - Jan 2022',
    summary: 'Secure full-stack development, authorization, and production troubleshooting for healthcare workflows.',
    highlights: [
      'Built secure Angular/TypeScript applications and ASP.NET Core APIs for healthcare workflows under HIPAA-aligned security expectations.',
      'Implemented JWT authentication, role-based authorization, route protection, secure data access, and predictable API behavior.',
      'Translated product and QA requirements into maintainable frontend/backend changes while preserving security, stability, and testability.',
      'Diagnosed production defects through logs, reproduction, and root-cause analysis; delivered fixes and helped teammates troubleshoot automation and application issues.'
    ],
    tech: ['Angular', 'ASP.NET Core', 'JWT', 'RBAC', 'Healthcare']
  },
  {
    company: 'Wake County Government',
    title: 'Software Engineer',
    dates: 'Jan 2020 - Jan 2021',
    summary: 'Enterprise .NET Core applications, SQL reporting, and maintainable service/data boundaries for government workflows.',
    highlights: [
      'Developed enterprise .NET Core applications for government workflows, reporting, and operational processes across multiple departments.',
      'Applied repository and service patterns to isolate data access, improve testability, and reduce coupling between business logic and persistence.',
      'Designed SQL Server reporting solutions with stored procedures, views, and parameterized queries for dependable operational reporting.',
      'Extended applications as requirements evolved while preserving stable data contracts, production reliability, and clear separation of concerns.'
    ],
    tech: ['.NET Core', 'SQL Server', 'Stored Procedures', 'Government']
  },
  {
    company: 'Pilot Company',
    title: 'Software Engineer',
    dates: 'Jun 2019 - Jan 2020',
    summary: 'Full-stack business applications and integration work across ASP.NET Core, Angular, React, and Node.js.',
    highlights: [
      'Developed full-stack applications using ASP.NET Core, Angular, TypeScript, React, and Node.js for internal and customer-facing workflows.',
      'Designed and built a React/Node.js billing platform supporting transaction workflows, API integrations, and reliable data processing.',
      'Created REST APIs with explicit contracts, standardized response models, validation, and consistent error handling.',
      'Troubleshot across frontend, backend, and integration layers while establishing reusable patterns as requirements evolved.'
    ],
    tech: ['ASP.NET Core', 'Angular', 'React', 'Node.js', 'REST']
  },
  {
    company: 'U.S. Bank',
    title: 'Technical Support Specialist',
    dates: 'May 2018 - May 2019',
    summary: 'Enterprise production support for hospitality payment environments and business-critical systems.',
    highlights: [
      'Supported enterprise hospitality payment environments for clients including Wyndham, Hilton, and Marriott.',
      'Diagnosed network, connectivity, hardware, application, and payment-processing issues across interconnected systems.',
      'Isolated faults across dependent services and communicated clear resolution steps to technical and non-technical stakeholders.',
      'Built deep experience in production support, incident ownership, escalation, customer communication, and root-cause troubleshooting.'
    ],
    tech: ['Production Support', 'Payments', 'Troubleshooting', 'Enterprise Systems']
  },
  {
    company: 'Markettech',
    title: 'iOS Developer (Contract)',
    dates: 'Sep 2017 - Feb 2018',
    summary: 'Contract iOS development for operational performance reporting and call-center metrics.',
    highlights: [
      'Built a Swift/Xcode iOS application capturing call-center metrics and surfacing employee performance data.',
      'Translated reporting requirements into mobile UI workflows, data presentation, and application behavior.',
      'Implemented application logic and UI components while troubleshooting integration and usability issues.',
      'Delivered a mobile solution that improved leadership visibility into employee performance and operational reporting.'
    ],
    tech: ['Swift', 'Xcode', 'iOS']
  },
  {
    company: 'Litera',
    title: 'Technical Support Specialist',
    dates: 'Jan 2016 - Aug 2017',
    summary: 'Legal-technology production support and deep software troubleshooting for enterprise client environments.',
    highlights: [
      'Provided high-volume technical support for major legal-industry clients, including Baker McKenzie.',
      'Investigated application issues through structured diagnosis, reproduction, escalation, and resolution across client environments.',
      'Reviewed DLL behavior and implemented targeted patches to improve performance, compatibility, and user experience.',
      'Built a strong foundation in production diagnostics, customer-facing communication, issue ownership, and software troubleshooting.'
    ],
    tech: ['Legal Tech', 'Production Support', 'Troubleshooting']
  }
];

export const endorsements: Endorsement[] = [
  {
    quote: 'Josh owned the solution end to end, leading its architecture, development, integrations, and deployment. He would be a strong addition to any organization seeking a Lead Engineer or Architect who can design systems and drive complex initiatives from concept through production.',
    name: 'Ben Beddes',
    role: 'President of Logistics, Value Truck'
  },
  {
    quote: 'As a Senior Developer, you are required to do more than just crank out code. I have seen these traits show up regularly in Josh\'s work - mentoring others, helping develop technical design solutions, and encouraging good technical practices.',
    name: 'Nathaniel J. Lynn',
    role: 'Scrum Master, Kenworth'
  },
  {
    quote: 'Josh is truly exceptional to work with. His eagerness to learn and acquire new skills is remarkable, and he consistently channels that curiosity into delivering impressive results.',
    name: 'Jeanette Hunsberger',
    role: 'Staff AI/ML Engineer'
  }
];

export const stackGroups = [
  { name: 'Backend', items: ['C#', '.NET 8/9/10', 'ASP.NET Core', 'REST APIs', 'EF Core', 'Background Services', 'OpenAPI', 'Node.js'] },
  { name: 'Frontend', items: ['Angular', 'TypeScript', 'RxJS', 'AG Grid', 'React', 'Redux Toolkit', 'Tailwind CSS', 'Responsive UI', 'Reactive Forms'] },
  { name: 'Data', items: ['SQL Server', 'T-SQL', 'Stored Procedures', 'Views', 'EF Migrations', 'Indexing', 'Query Optimization', 'MySQL'] },
  { name: 'Cloud & Platform', items: ['Azure App Service', 'Azure SQL', 'Azure Functions', 'Service Bus', 'Blob Storage', 'AWS S3', 'Docker', 'nginx'] },
  { name: 'Delivery', items: ['GitHub Actions', 'Azure DevOps', 'CI/CD', 'Git', 'Containers', 'Environment Configuration', 'Health Checks', 'UAT'] },
  { name: 'Architecture', items: ['Clean Architecture', 'SOLID', 'DI', 'Event-Driven Systems', 'API Integration', 'AuthN/AuthZ', 'Cloud + On-Prem', 'Observability'] }
];

export const publicRepos: PublicRepo[] = [
  {
    name: 'Allocation Proration',
    description: 'Pro-rates a limited investment allocation across investors by historical average, redistributing whatever capped investors can’t take',
    tech: 'TypeScript · React · Cloudflare Workers · Vitest',
    href: 'https://github.com/poker-kid-100717/allocation-proration-tool',
    architecture: {
      layers: [
        { name: 'React UI', note: 'Form and results, served as static assets' },
        { name: 'Worker API', note: 'POST /api/prorate: validation and limits' },
        { name: 'Proration core', note: 'Pure function, no dependencies, fully unit-tested' }
      ],
      decisions: [
        {
          choice: 'The allocation math as a pure, dependency-free function',
          instead: 'computing inside the request handler',
          why: 'The algorithm is the part that has to be right: it caps investors at their request and keeps redistributing the remainder until nothing is left. Isolating it means every edge case (zero history, everyone capped, duplicate names, a “__proto__” investor) is a fast unit test rather than an HTTP test.'
        },
        {
          choice: 'One Cloudflare Worker serving both the UI and the API',
          instead: 'a separate static host and API server',
          why: 'One deployable, one origin (so no CORS), and no server to keep warm. Input limits on investor count and amounts keep the per-request work bounded, which matters on a platform that bills by CPU time.'
        }
      ]
    }
  },
  {
    name: 'Clean Architecture',
    description: 'CQRS/MediatR Clean Architecture reference — the same Core/Infrastructure/API boundary I’ve shipped at Kenworth, Global Holdings, and in WorkLens',
    tech: '.NET · Clean Architecture · CQRS',
    href: 'https://github.com/poker-kid-100717/CleanArchitectureTemplate',
    architecture: {
      layers: [
        { name: 'Domain', note: 'Entities, value objects, domain events — no outward dependencies' },
        { name: 'Application', note: 'CQRS handlers, validation, mapping, interfaces Infrastructure implements' },
        { name: 'Infrastructure', note: 'EF Core, Identity, file export, external services' },
        { name: 'WebUI', note: 'ASP.NET Core API + Angular client, wires it together via DI' }
      ],
      decisions: [
        {
          choice: 'CQRS with MediatR for every use case',
          instead: 'a conventional service layer with multi-purpose service classes',
          why: 'Each handler stays single-purpose and testable in isolation, and cross-cutting concerns (validation, logging, performance, authorization) attach as pipeline behaviours instead of being re-implemented per method. I default to this once a domain has more than a handful of use cases; for a 3-endpoint CRUD app the pipeline machinery isn’t worth it.'
        },
        {
          choice: 'IApplicationDbContext exposing DbSet<T> directly',
          instead: 'a generic IRepository<T> wrapper over EF Core',
          why: 'EF Core’s DbContext already is a unit-of-work; a generic repository on top of it usually just renames Where() calls without adding real substitutability. I only introduce a repository interface when there’s an actual second implementation to swap in — see the S3 utility below, where the backing store legitimately varies.'
        },
        {
          choice: 'Five MediatR pipeline behaviours (validation, logging, performance, authorization, exception handling) ahead of every handler',
          instead: 'handling each concern inline, per handler',
          why: 'A new contributor adding an endpoint gets validation, logging, and auth enforcement for free, structurally, instead of relying on them remembering to add it. The cost is indirection — tracing a request means reading the pipeline, not just the handler, which is a real tradeoff on a small team.'
        }
      ]
    }
  },
  {
    name: 'S3 Storage',
    description: 'Layered S3 bucket/object API — the pattern behind the large-file ingestion pipeline I built at Global Holdings',
    tech: '.NET · AWS S3 · API',
    href: 'https://github.com/poker-kid-100717/DotnetCoreS3APIBucketUtility',
    architecture: {
      layers: [
        { name: 'API', note: 'Controllers, request/response wiring' },
        { name: 'Core', note: 'IBucketRepository / IFilesRepository interfaces, own DTOs' },
        { name: 'Infrastructure', note: 'AWS SDK-backed implementation, mapped to Core DTOs' }
      ],
      decisions: [
        {
          choice: 'Own response DTOs (CreateBucketResponse, etc.) instead of returning AWS SDK types up through the API',
          instead: 'passing PutBucketResponse and other SDK response objects straight through to callers',
          why: 'The AWS SDK’s response shapes change across major versions and carry AWS-specific metadata callers don’t need. Mapping at the Infrastructure boundary means an SDK upgrade is a one-file change, not an API contract break.'
        },
        {
          choice: 'Interface-driven IBucketRepository / IFilesRepository over the AWS SDK',
          instead: 'calling IAmazonS3 directly from the controllers',
          why: 'This is the case where the abstraction actually pays for itself: the object-storage backend legitimately varies — S3 here, a different cloud provider’s storage on the Global Holdings project — and the interface is what let me carry the same Core-layer contract across both without touching callers. If I only ever expected one provider for the life of a project, I’d skip this layer and call the SDK directly from a thin service.'
        }
      ]
    }
  }
];
