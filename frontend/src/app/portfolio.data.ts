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

export const projects: Project[] = [
  {
    title: 'Freight DNA + Logistics Application Suite',
    eyebrow: 'Enterprise architecture / delivery',
    summary: 'Professional case study covering a business-logic-heavy CRM, LTL planning workflows, and yard operations tooling. The work demonstrates end-to-end architecture ownership under changing infrastructure and business constraints.',
    outcomes: [
      'Architected and delivered three enterprise applications with multiple iterations from discovery through UAT readiness.',
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
      'Integrates RemoteOK, Remotive, Greenhouse, Dice MCP, browser-extension workflows, and OpenAI-assisted matching.'
    ],
    tech: ['ASP.NET Core 10', 'Angular 18', 'SQL Server', 'EF Core', 'Docker', 'GitHub Actions', 'OpenAI', 'MCP'],
    href: 'https://github.com/poker-kid-100717/WorkLens'
  },
  {
    title: 'Architecture + Integration Repositories',
    eyebrow: 'Public engineering evidence',
    summary: 'A collection of repositories that show the progression of my engineering work across .NET, Angular, cloud storage, authentication, API design, deployment, webhooks, and business-rule-heavy applications.',
    outcomes: [
      'Reusable Clean Architecture reference patterns and dependency-boundary work.',
      'AWS S3 integration utilities and Azure-oriented Angular/.NET application structure.',
      'Authentication/authorization, REST APIs, webhook processing, CRUD foundations, and data-centric business tooling.',
      'A public code history that reflects both breadth and continued modernization of the stack.'
    ],
    tech: ['.NET', 'Angular', 'Azure', 'AWS S3', 'OAuth/Auth', 'Webhooks', 'REST', 'SQL'],
    href: 'https://github.com/poker-kid-100717?tab=repositories'
  }
];

export const experience: Experience[] = [
  {
    company: 'Value Truck',
    title: 'Application Development Manager / Lead Application Developer',
    dates: 'May 2026 - Sep 2026',
    summary: 'Owned application architecture and delivery for logistics operations across brokerage and asset-side workflows.',
    highlights: [
      'Delivered Freight DNA CRM, LTL planning, and Yard operations applications with multiple enterprise iterations.',
      'Owned cloud and on-premises architecture, integrations, authentication, database design, deployment, and UAT readiness.',
      'Built a small delivery team and provided daily technical direction, mentoring, review, and delivery coordination.'
    ],
    tech: ['.NET', 'Angular', 'SQL Server', 'Azure', 'Docker', 'Entra ID']
  },
  {
    company: 'Kenworth Truck Co.',
    title: 'Software Engineer',
    dates: 'Jan 2025 - May 2026',
    summary: 'Enterprise application development focused on maintainable .NET architecture, operational workflows, SQL performance, and integration reliability.',
    highlights: [
      'Designed ASP.NET Core services with Clean Architecture, DI, repositories, and explicit service boundaries.',
      'Built complex workflow UIs and improved SQL Server queries/stored procedures by roughly 15-25%.',
      'Implemented event-driven integration patterns and improved CI/CD, configuration, and structured logging.'
    ],
    tech: ['ASP.NET Core', 'SQL Server', 'Clean Architecture', 'Messaging', 'CI/CD']
  },
  {
    company: 'Global Holdings',
    title: 'Software Engineer',
    dates: 'Jun 2024 - Jan 2025',
    summary: 'Backend architecture, SQL performance, asynchronous processing, and production resiliency for distributed applications.',
    highlights: [
      'Built reusable ASP.NET Core API/service patterns with clean dependency boundaries.',
      'Improved key SQL workflows by approximately 20% using indexing, partitioning, and stored procedure tuning.',
      'Designed object-storage + queue processing and added transient-failure handling, structured logging, and correlation IDs.'
    ],
    tech: ['.NET', 'SQL Server', 'Cloud Storage', 'Queues', 'Observability']
  },
  {
    company: 'PFA Solutions',
    title: 'Software Engineer',
    dates: 'Jan 2022 - Jun 2024',
    summary: 'Full-stack SaaS delivery across Angular/TypeScript and .NET Core APIs.',
    highlights: [
      'Owned features from technical approach through implementation and deployment.',
      'Built DTO/validation/API patterns with EF Core and consistent error contracts.',
      'Created modular Angular architecture with RxJS, reusable components, lazy loading, and serverless/queue-based automation.'
    ],
    tech: ['Angular', 'TypeScript', '.NET Core', 'EF Core', 'RxJS']
  },
  {
    company: 'UnitedHealth Group / Optum',
    title: 'Software Engineer',
    dates: 'Jan 2021 - Jan 2022',
    summary: 'Secure full-stack development for healthcare workflows.',
    highlights: [
      'Built Angular + ASP.NET Core applications under HIPAA-aligned security expectations.',
      'Implemented JWT authentication, role-based authorization, protected routes, and secure data-access patterns.',
      'Troubleshot production defects through logs, reproduction, root-cause analysis, and targeted fixes.'
    ],
    tech: ['Angular', 'ASP.NET Core', 'JWT', 'RBAC', 'Healthcare']
  },
  {
    company: 'Wake County Government',
    title: 'Software Engineer',
    dates: 'Jan 2020 - Jan 2021',
    summary: 'Enterprise .NET applications and SQL reporting for internal government workflows.',
    highlights: [
      'Applied repository/service patterns to improve testability and reduce coupling.',
      'Designed SQL Server reporting with stored procedures, views, and parameterized queries.'
    ],
    tech: ['.NET Core', 'SQL Server', 'Stored Procedures', 'Government']
  },
  {
    company: 'Pilot Company',
    title: 'Software Engineer',
    dates: 'Jan 2019 - Jan 2020',
    summary: 'Full-stack business applications and integration work across .NET, Angular, React, and Node.js.',
    highlights: [
      'Built internal/customer-facing workflows and a React/Node billing platform.',
      'Designed REST contracts, validation, standardized responses, and cross-layer integrations.'
    ],
    tech: ['ASP.NET Core', 'Angular', 'React', 'Node.js', 'REST']
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
  { name: 'Frontend', items: ['Angular', 'TypeScript', 'RxJS', 'AG Grid', 'React', 'Tailwind CSS', 'Responsive UI', 'Reactive Forms'] },
  { name: 'Data', items: ['SQL Server', 'T-SQL', 'Stored Procedures', 'Views', 'EF Migrations', 'Indexing', 'Query Optimization', 'MySQL'] },
  { name: 'Cloud & Platform', items: ['Azure App Service', 'Azure SQL', 'Azure Functions', 'Service Bus', 'Blob Storage', 'AWS S3', 'Docker', 'nginx'] },
  { name: 'Delivery', items: ['GitHub Actions', 'Azure DevOps', 'CI/CD', 'Git', 'Containers', 'Environment Configuration', 'Health Checks', 'UAT'] },
  { name: 'Architecture', items: ['Clean Architecture', 'SOLID', 'DI', 'Event-Driven Systems', 'API Integration', 'AuthN/AuthZ', 'Cloud + On-Prem', 'Observability'] }
];

export const publicRepos = [
  { name: 'WorkLens', description: 'Full-stack job intelligence + application tracking platform', tech: '.NET 10 · Angular · SQL Server · Docker', href: 'https://github.com/poker-kid-100717/WorkLens' },
  { name: 'CleanArchitectureTemplate', description: 'Reference work around clean boundaries and maintainable .NET structure', tech: '.NET · Clean Architecture', href: 'https://github.com/poker-kid-100717/CleanArchitectureTemplate' },
  { name: 'AngularAppAzure', description: 'Angular + .NET solution structured around Azure-oriented delivery', tech: 'Angular · .NET · Azure', href: 'https://github.com/poker-kid-100717/AngularAppAzure' },
  { name: 'DotnetCoreS3APIBucketUtility', description: 'AWS S3 integration utility built with .NET', tech: '.NET · AWS S3 · API', href: 'https://github.com/poker-kid-100717/DotnetCoreS3APIBucketUtility' },
  { name: 'allocation-proration-tool', description: 'Business-rule-heavy allocation and proration tooling', tech: '.NET · Business Logic', href: 'https://github.com/poker-kid-100717/allocation-proration-tool' },
  { name: 'webhook-challenge', description: 'Webhook/API processing implementation and integration work', tech: 'API · Webhooks · Integration', href: 'https://github.com/poker-kid-100717/webhook-challenge' }
];
