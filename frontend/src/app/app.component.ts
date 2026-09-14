import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Project {
  title: string;
  eyebrow: string;
  description: string;
  impact: string[];
  tech: string[];
  href?: string;
  confidential?: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="nav shell">
      <a class="brand" href="#top" aria-label="Joshua Davis home">JD<span>.</span></a>
      <nav>
        <a href="#work">Work</a>
        <a href="#architecture">Architecture</a>
        <a href="#stack">Stack</a>
        <a href="#leadership">Leadership</a>
      </nav>
      <a class="nav-cta" href="https://github.com/poker-kid-100717" target="_blank" rel="noreferrer">GitHub ↗</a>
    </header>

    <main id="top">
      <section class="hero shell">
        <div class="hero-copy">
          <p class="kicker">Senior Full-Stack Engineer · Application Architecture · Technical Leadership</p>
          <h1>I design and ship <span>business-critical software</span> from architecture through production.</h1>
          <p class="hero-text">10+ years building full-stack systems across logistics, fintech, healthcare, government, and SaaS. I specialize in modern .NET, Angular, SQL Server, APIs, cloud/on-prem delivery, Clean Architecture, CI/CD, and turning ambiguous business problems into maintainable software.</p>
          <div class="actions">
            <a class="primary" href="#work">View selected work</a>
            <a class="secondary" href="https://github.com/poker-kid-100717" target="_blank" rel="noreferrer">Explore GitHub</a>
          </div>
          <div class="proof-grid">
            <div><strong>10+ yrs</strong><span>Software delivery</span></div>
            <div><strong>Full stack</strong><span>.NET + Angular</span></div>
            <div><strong>Cloud + On-Prem</strong><span>Azure / AWS / Docker</span></div>
            <div><strong>Lead scope</strong><span>Architecture + mentoring</span></div>
          </div>
        </div>
        <aside class="terminal-card" aria-label="Engineering profile">
          <div class="terminal-bar"><i></i><i></i><i></i><span>engineering-profile.json</span></div>
          <pre><code>{{ profileCode }}</code></pre>
        </aside>
      </section>

      <section class="signal-band">
        <div class="shell signal-inner">
          <span>ASP.NET Core</span><span>Angular</span><span>TypeScript</span><span>SQL Server</span><span>EF Core</span><span>Azure</span><span>AWS</span><span>Docker</span><span>GitHub Actions</span><span>REST APIs</span>
        </div>
      </section>

      <section id="work" class="section shell">
        <div class="section-heading">
          <div><p class="kicker">Selected work</p><h2>Systems, not screenshots.</h2></div>
          <p>The portfolio focuses on architectural decisions, business logic, deployment, integration, and ownership—the parts of senior engineering that matter after the UI demo ends.</p>
        </div>

        <div class="projects">
          <article class="project-card featured" *ngFor="let project of projects">
            <div class="project-topline">
              <span>{{ project.eyebrow }}</span>
              <span *ngIf="project.confidential" class="confidential">Professional case study</span>
            </div>
            <h3>{{ project.title }}</h3>
            <p>{{ project.description }}</p>
            <ul>
              <li *ngFor="let item of project.impact">{{ item }}</li>
            </ul>
            <div class="chips">
              <span *ngFor="let tech of project.tech">{{ tech }}</span>
            </div>
            <a *ngIf="project.href" [href]="project.href" target="_blank" rel="noreferrer">View repository ↗</a>
          </article>
        </div>
      </section>

      <section id="architecture" class="section dark-section">
        <div class="shell">
          <div class="section-heading inverse">
            <div><p class="kicker">Architecture</p><h2>How I think about systems.</h2></div>
            <p>I optimize for clear boundaries, replaceable infrastructure, observable behavior, secure defaults, and delivery paths that teams can actually operate.</p>
          </div>
          <div class="architecture-grid">
            <div class="arch-card"><span>01</span><h3>Domain first</h3><p>Keep business rules independent from frameworks. Clean Architecture, dependency inversion, testable domain/application layers.</p></div>
            <div class="arch-card"><span>02</span><h3>API contracts</h3><p>Explicit REST contracts, validation, auth boundaries, version-aware integrations, and predictable error handling.</p></div>
            <div class="arch-card"><span>03</span><h3>Data discipline</h3><p>SQL Server, EF Core, migrations, query optimization, transactional boundaries, and schema changes treated as deployable software.</p></div>
            <div class="arch-card"><span>04</span><h3>Operational delivery</h3><p>Containers, health checks, CI pipelines, environment configuration, cloud/on-prem deployment, and minimal manual drift.</p></div>
          </div>
        </div>
      </section>

      <section id="stack" class="section shell">
        <div class="section-heading">
          <div><p class="kicker">Technology</p><h2>Built around the stack I use in real work.</h2></div>
          <p>The stack below is intentionally broad but opinionated: Microsoft-first enterprise engineering with modern web, cloud, integration, and delivery tooling.</p>
        </div>
        <div class="stack-grid">
          <div *ngFor="let group of stackGroups" class="stack-group"><h3>{{ group.name }}</h3><div class="stack-list"><span *ngFor="let item of group.items">{{ item }}</span></div></div>
        </div>
      </section>

      <section id="leadership" class="section leadership">
        <div class="shell leadership-grid">
          <div>
            <p class="kicker">Senior / Lead scope</p>
            <h2>I’m most useful where technology meets ambiguity.</h2>
          </div>
          <div class="lead-list">
            <div><strong>Architecture → delivery</strong><p>Own solutions from requirements and technical direction through implementation, deployment, and production support.</p></div>
            <div><strong>Business partnership</strong><p>Translate conversations with operators and executives into systems, workflows, acceptance criteria, and delivery plans.</p></div>
            <div><strong>Technical leadership</strong><p>Set standards, review code, mentor developers, shape backlog priorities, and keep engineering decisions tied to business value.</p></div>
            <div><strong>Modernization</strong><p>Move systems toward modern .NET, Angular, containers, cloud services, secure auth, CI/CD, and cleaner architectural boundaries.</p></div>
          </div>
        </div>
      </section>

      <section class="cta shell">
        <p class="kicker">Open to senior engineering opportunities</p>
        <h2>Need someone who can build the system and explain why it should be built that way?</h2>
        <div class="actions"><a class="primary" href="mailto:joshuad100717@outlook.com">Contact me</a><a class="secondary" href="https://github.com/poker-kid-100717" target="_blank" rel="noreferrer">GitHub profile ↗</a></div>
      </section>
    </main>

    <footer class="shell"><span>© 2026 Joshua Davis</span><span>Senior Full-Stack Software Engineer</span></footer>
  `
})
export class AppComponent {
  profileCode = `{
  "engineer": "Joshua Davis",
  "focus": [
    "application architecture",
    "full-stack delivery",
    "technical leadership"
  ],
  "backend": ".NET / ASP.NET Core",
  "frontend": "Angular / TypeScript",
  "data": "SQL Server / EF Core",
  "delivery": ["Azure", "AWS", "Docker", "CI/CD"],
  "mode": "cloud + on-prem"
}`;

  projects: Project[] = [
    {
      title: 'Freight DNA + Logistics Application Suite',
      eyebrow: 'Enterprise delivery',
      description: 'A professional case study spanning a business-logic-heavy CRM, LTL planning workflows, and yard operations tooling. I owned architecture and implementation across cloud and on-prem deployment paths while establishing a small delivery team around the products.',
      impact: [
        'Designed and delivered three enterprise applications with multiple production-oriented iterations.',
        'Built full-stack workflows across Angular, .NET APIs, SQL Server, authentication, external logistics APIs, and operational data grids.',
        'Reworked deployment architecture from Azure-hosted services to on-prem/containerized infrastructure when business constraints changed.',
        'Mentored junior contributors, introduced development structure, and translated executive/business requests directly into software.'
      ],
      tech: ['.NET', 'Angular', 'SQL Server', 'EF Core', 'Azure', 'Docker', 'Entra ID', 'REST APIs', 'AG Grid'],
      confidential: true
    },
    {
      title: 'WorkLens',
      eyebrow: 'Current public project',
      description: 'Self-hosted job intelligence and application tracking platform with live data integrations, resume matching, browser tooling, analytics, and a full production-style delivery pipeline.',
      impact: [
        'Clean Architecture backend with Core, Infrastructure, and API boundaries.',
        'Background provider aggregation, configurable search profiles, resume/job match scoring, and analytics workflows.',
        'Docker Compose stack with SQL Server, ASP.NET Core API, Angular frontend, nginx, migrations, health-aware startup, and CI checks.',
        'Integrates RemoteOK, Remotive, Greenhouse, Dice MCP, browser extension workflows, and OpenAI-assisted matching.'
      ],
      tech: ['ASP.NET Core 10', 'Angular 18', 'SQL Server', 'EF Core', 'Docker', 'GitHub Actions', 'OpenAI', 'MCP'],
      href: 'https://github.com/poker-kid-100717/WorkLens'
    },
    {
      title: 'Clean Architecture + Integration Work',
      eyebrow: 'Engineering foundations',
      description: 'Public repositories showing architectural patterns and integration experience across modern .NET, Angular, authentication, AWS S3, Azure-hosted app structure, webhook/API work, and data-heavy business tools.',
      impact: [
        'Reusable Clean Architecture reference work and dependency-boundary patterns.',
        'AWS S3 API integration and cloud storage utility implementation.',
        'Angular + .NET Azure-oriented solution structure and deployment experiments.',
        'Authentication/authorization, webhook, CRUD, and business-rule implementation across multiple codebases.'
      ],
      tech: ['C#', '.NET', 'Angular', 'AWS S3', 'Azure', 'OAuth/Auth', 'Webhooks', 'REST'],
      href: 'https://github.com/poker-kid-100717?tab=repositories'
    }
  ];

  stackGroups = [
    { name: 'Backend', items: ['C#', '.NET 8/9/10', 'ASP.NET Core', 'REST APIs', 'EF Core', 'Background Services', 'OpenAPI'] },
    { name: 'Frontend', items: ['Angular', 'TypeScript', 'RxJS', 'AG Grid', 'Tailwind CSS', 'Responsive UI', 'React exposure'] },
    { name: 'Data', items: ['SQL Server', 'T-SQL', 'Stored Procedures', 'EF Migrations', 'Query Optimization', 'Relational Modeling'] },
    { name: 'Cloud & Platform', items: ['Azure App Service', 'Azure SQL', 'Azure Functions', 'Service Bus', 'Blob Storage', 'AWS S3', 'Docker', 'nginx'] },
    { name: 'Delivery', items: ['GitHub Actions', 'Azure DevOps', 'CI/CD', 'Git', 'Containers', 'Environment Configuration', 'Health Checks'] },
    { name: 'Architecture', items: ['Clean Architecture', 'SOLID', 'DI', 'Event-Driven Systems', 'API Integration', 'AuthN/AuthZ', 'Cloud + On-Prem'] }
  ];
}
