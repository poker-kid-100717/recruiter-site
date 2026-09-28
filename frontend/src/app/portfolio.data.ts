import resume from '../../../content/resume.json';
import recommendations from '../../../content/recommendations.json';

// Resume facts, skills, and recommendations are read from content/*.json (the source of truth);
// only the project write-ups and architecture notes below are authored here.

/** Status words are exact: only "Verified live" after the app has been opened and a real flow run. */
export type ProjectStatus = 'Verified live' | 'Deployed' | 'Implemented' | 'Professional';

export interface Project {
  title: string;
  eyebrow: string;
  status: ProjectStatus;
  summary: string;
  outcomes: string[];
  tech: string[];
  href?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  note?: string;
  professional?: boolean;
}

export interface Experience {
  company: string;
  title: string;
  dates: string;
  highlights: string[];
}

export interface Endorsement {
  quote: string;
  name: string;
  currentTitle: string;
  relationship: string | null;
  date: string;
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

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "2026-05" -> "May 2026" */
export function formatMonth(value: string): string {
  const [year, month] = value.split('-').map(Number);
  return `${months[month - 1]} ${year}`;
}

/** "2026-09-01" -> "Sep 2026" */
export function formatDate(value: string): string {
  return formatMonth(value.slice(0, 7));
}

export const profile = {
  name: resume.name,
  headline: resume.headline,
  location: resume.location,
  email: resume.email,
  links: resume.links,
  summary: resume.summary,
  impact: resume.impact,
  education: resume.education
};

/** Companies shown collapsed under "Earlier" (support and contract roles). */
const earlierCompanies = new Set(['U.S. Bank', 'Markettech', 'Litera']);

const allExperience: Experience[] = resume.experience.map((job) => ({
  company: job.company,
  title: job.title,
  dates: `${formatMonth(job.start)} - ${formatMonth(job.end)}`,
  highlights: job.bullets
}));

export const experience = allExperience.filter((job) => !earlierCompanies.has(job.company));
export const earlierExperience = allExperience.filter((job) => earlierCompanies.has(job.company));

export const stackGroups = Object.entries(resume.skills).map(([name, items]) => ({ name, items }));

export const endorsements: Endorsement[] = recommendations.featured.map((entry) => ({
  quote: entry.excerpt,
  name: entry.author,
  currentTitle: entry.currentTitle,
  relationship: entry.relationship,
  date: formatDate(entry.date)
}));

export const allRecommendationsUrl = recommendations.allRecommendationsUrl;
export const recommendationCount = recommendations.totalReceived;

export const projects: Project[] = [
  {
    title: 'TCG Signal',
    eyebrow: 'Public full-stack project',
    status: 'Deployed',
    summary: 'Price and set guide for Pokémon card collectors. React front end served from Cloudflare; an ASP.NET Core API and a separate inventory service run in Cloudflare Containers over PostgreSQL.',
    outcomes: [
      'Scheduled jobs record daily prices into PostgreSQL, which power price history and market movers.',
      'The set advisor falls back to a rule-based summary when the AI provider is unavailable.',
      'One Cloudflare Worker serves the static front end and routes /api to the containers; Neon PostgreSQL for data.'
    ],
    tech: ['React', 'TypeScript', 'ASP.NET Core', 'PostgreSQL', 'Cloudflare Workers', 'Cloudflare Containers'],
    href: 'https://github.com/poker-kid-100717/tcg'
  },
  {
    title: 'Logistics Portfolio Suite',
    eyebrow: 'Public clean-room project',
    status: 'Implemented',
    summary: 'Clean-room reconstruction of freight CRM, LTL planning, and yard workflows on synthetic data, with a signed, idempotent event hand-off from Yard Ops to the LTL planner.',
    outcomes: [
      'Three ASP.NET Core APIs with Angular front ends, one per product.',
      'Yard Ops writes events to an outbox and delivers them HMAC-signed; the LTL planner ignores an event it has already processed.',
      'Runs locally with Docker Compose on synthetic data.'
    ],
    tech: ['ASP.NET Core', 'Angular', 'TypeScript', 'Docker', 'GitHub Actions'],
    note: 'Built from general domain knowledge on synthetic data. It is not employer code and contains no employer data, schemas, or screens.',
    href: 'https://github.com/poker-kid-100717/logistics-portfolio-suite'
  },
  {
    title: 'WorkLens',
    eyebrow: 'Public full-stack project',
    status: 'Implemented',
    summary: 'Self-hosted job feed and application tracker: ASP.NET Core API over SQL Server with an Angular front end, run locally with Docker Compose.',
    outcomes: [
      'Clean Architecture backend with Core, Infrastructure, and API projects; EF Core migrations applied against a real SQL Server in CI.',
      'Job feed from RemoteOK, Remotive, the Greenhouse Job Board API, and Dice’s Job Search MCP server, refreshed by a background service.',
      'Application pipeline, follow-up reminders, analytics, a browser extension, Outlook sync through Microsoft Graph, and OpenAI-assisted resume matching.'
    ],
    tech: ['ASP.NET Core 10', 'Angular 22', 'SQL Server', 'EF Core 10', 'Docker', 'GitHub Actions', 'Vitest', 'Microsoft Graph', 'OpenAI'],
    href: 'https://github.com/poker-kid-100717/WorkLens'
  },
  {
    title: 'Freight CRM, LTL Planning & Yard Operations',
    eyebrow: 'Professional work · Value Truck',
    status: 'Professional',
    summary: 'Three enterprise applications for freight CRM, LTL planning, and yard operations, delivered through multiple iterations in under five months. Employer source code, data, and screens are confidential and not published here.',
    outcomes: resume.experience[0].bullets,
    tech: ['C#', 'ASP.NET Core', 'EF Core', 'SQL Server', 'Angular', 'Entra ID', 'Azure', 'Docker'],
    professional: true
  }
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
