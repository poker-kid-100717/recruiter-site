// Shape of GET /api/portfolio. The content lives in Postgres (db/migrations, portfolio_document());
// the Worker serves it and falls back to the content/*.json seed if the database is unreachable.

/** Status words are exact: "Verified live" only after the app was opened and a real flow run. */
export type ProjectStatus = 'Verified live' | 'Deployed' | 'Implemented' | 'Professional';

export interface Profile {
  name: string;
  headline: string;
  title: string;
  location: string;
  email: string;
  summary: string;
  links: { linkedin: string; github: string; portfolio: string };
  impact: string[];
  education: string[];
  focus: string[];
  stack: string[];
  delivery: string[];
}

export interface SkillGroup {
  name: string;
  items: string[];
}

export interface Role {
  company: string;
  title: string;
  /** YYYY-MM */
  start: string;
  /** YYYY-MM, or null for a current role */
  end: string | null;
  earlier: boolean;
  highlights: string[];
}

export interface Recommendation {
  id: string;
  author: string;
  currentTitle: string;
  relationship: string | null;
  /** YYYY-MM-DD */
  date: string;
  excerpt: string;
}

export interface Project {
  slug: string;
  title: string;
  eyebrow: string;
  status: ProjectStatus;
  summary: string;
  outcomes: string[];
  tech: string[];
  note: string | null;
  repository: string | null;
  demo: string | null;
  verifiedOn: string | null;
  professional: boolean;
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
  architecture: RepoArchitecture | null;
}

/** A deployed, clickable app in the Live Apps section. Its status is content-owned (content/projects.json). */
export interface LiveApp {
  slug: string;
  name: string;
  tagline: string;
  status: Exclude<ProjectStatus, 'Professional'>;
  /** Skills the app demonstrates, shown as chips. */
  skills: string[];
  url: string | null;
  repository: string | null;
  /** YYYY-MM-DD of the last real flow run against the live app; required for "Verified live". */
  verifiedOn: string | null;
}

export interface PortfolioDocument {
  profile: Profile;
  skills: SkillGroup[];
  experience: Role[];
  recommendations: { allUrl: string; total: number; featured: Recommendation[] };
  projects: Project[];
  publicRepos: PublicRepo[];
  liveApps: LiveApp[];
  architecture: { principles: { name: string; detail: string }[]; referenceFlow: string[] };
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "2026-05" or "2026-05-14" -> "May 2026" */
export function formatMonth(value: string): string {
  const [year, month] = value.split('-').map(Number);
  return `${months[month - 1]} ${year}`;
}

/** "2026-05", "2026-09" -> "May 2026 - Sep 2026"; open-ended roles read "Present". */
export function formatRange(start: string, end: string | null): string {
  return `${formatMonth(start)} - ${end ? formatMonth(end) : 'Present'}`;
}

/** "2026-09-28" -> "Sep 28, 2026" */
export function formatDay(value: string): string {
  const [year, month, day] = value.split('-').map(Number);
  return `${months[month - 1]} ${day}, ${year}`;
}
