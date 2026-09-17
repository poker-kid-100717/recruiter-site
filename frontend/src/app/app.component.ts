import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { endorsements, experience, projects, publicRepos, stackGroups } from './portfolio.data';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <a class="skip-link" href="#main-content">Skip to content</a>

    <header class="nav shell" id="top">
      <a class="brand" href="#top" aria-label="Joshua Davis home">JD<span>.</span></a>
      <nav aria-label="Primary navigation">
        <a href="#work">Work</a>
        <a href="#architecture">Architecture</a>
        <a href="#experience">Experience</a>
        <a href="#stack">Stack</a>
        <a href="#endorsements">Endorsements</a>
      </nav>
      <a class="nav-cta" href="/resume.html" target="_blank" rel="noreferrer">Resume ↗</a>
    </header>

    <main id="main-content">
      <section class="hero shell" aria-labelledby="hero-title">
        <div class="hero-copy">
          <p class="kicker">Senior Full-Stack Engineer · Solution Architecture · Technical Leadership</p>
          <h1 id="hero-title">I turn ambiguous business problems into <span>production software.</span></h1>
          <p class="hero-text">10+ years across software and technology, with 8+ years delivering enterprise applications across logistics, manufacturing, fintech, healthcare, government, SaaS, and legal technology. My core stack is modern .NET, Angular/React, SQL Server, distributed integrations, CI/CD, and cloud/on-premises delivery.</p>
          <div class="actions">
            <a class="primary" href="#work">Explore case studies</a>
            <a class="secondary" href="/resume.html" target="_blank" rel="noreferrer">View resume</a>
            <a class="text-link" href="https://github.com/poker-kid-100717" target="_blank" rel="noreferrer">GitHub ↗</a>
          </div>
          <div class="proof-grid" aria-label="Engineering profile highlights">
            <div><strong>10+ yrs</strong><span>Software + technology</span></div>
            <div><strong>Multiple</strong><span>Enterprise systems delivered</span></div>
            <div><strong>Cloud + on-prem</strong><span>Architecture + migration</span></div>
            <div><strong>Lead scope</strong><span>Mentoring + delivery ownership</span></div>
          </div>
        </div>

        <aside class="terminal-card" aria-label="Engineering profile">
          <div class="terminal-bar"><i></i><i></i><i></i><span>engineering-profile.json</span></div>
          <pre><code>{{ profileCode }}</code></pre>
          <div class="api-status" [class.online]="apiOnline">
            <span class="status-dot"></span>
            <div><strong>Portfolio API</strong><small>{{ apiOnline ? '.NET API reachable' : 'Static portfolio mode' }}</small></div>
          </div>
        </aside>
      </section>

      <section class="signal-band" aria-label="Core technologies">
        <div class="shell signal-inner">
          <span>ASP.NET Core</span><span>Angular</span><span>React</span><span>TypeScript</span><span>SQL Server</span><span>EF Core</span><span>Azure</span><span>AWS</span><span>Docker</span><span>GitHub Actions</span><span>REST APIs</span>
        </div>
      </section>

      <section id="work" class="section shell">
        <div class="section-heading">
          <div><p class="kicker">Selected work</p><h2>Systems, not screenshots.</h2></div>
          <p>I want the portfolio to show the parts of senior engineering that survive beyond a demo: system boundaries, business logic, integrations, deployment, migration, reliability, and ownership.</p>
        </div>

        <div class="projects">
          <article class="project-card" *ngFor="let project of projects; let i = index" [class.featured]="i === 0">
            <div class="project-number">0{{ i + 1 }}</div>
            <div class="project-content">
              <div class="project-topline">
                <span>{{ project.eyebrow }}</span>
                <span *ngIf="project.professional" class="confidential">Professional case study · no proprietary code</span>
              </div>
              <h3>{{ project.title }}</h3>
              <p class="project-summary">{{ project.summary }}</p>
              <ul>
                <li *ngFor="let item of project.outcomes">{{ item }}</li>
              </ul>
              <div class="chips"><span *ngFor="let tech of project.tech">{{ tech }}</span></div>
              <div class="project-links" *ngIf="project.href || project.secondaryHref">
                <a *ngIf="project.href" [href]="project.href" target="_blank" rel="noreferrer">View repository ↗</a>
                <a *ngIf="project.secondaryHref" [href]="project.secondaryHref" target="_blank" rel="noreferrer">{{ project.secondaryLabel || 'View more' }} ↗</a>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section id="architecture" class="section dark-section">
        <div class="shell">
          <div class="section-heading inverse">
            <div><p class="kicker">Architecture</p><h2>Designed for change.</h2></div>
            <p>Frameworks change. Infrastructure constraints change. Business priorities definitely change. I design boundaries so the system can move without forcing a rewrite of the business itself.</p>
          </div>

          <div class="architecture-diagram" aria-label="Reference application architecture">
            <div class="arch-node edge"><span>Client</span><strong>Angular / React</strong><small>Responsive workflows · grids · forms</small></div>
            <div class="arch-arrow" aria-hidden="true">→</div>
            <div class="arch-node api"><span>API</span><strong>ASP.NET Core</strong><small>Contracts · auth · validation · orchestration</small></div>
            <div class="arch-arrow" aria-hidden="true">→</div>
            <div class="arch-node core"><span>Domain</span><strong>Application / Core</strong><small>Business rules · ports · use cases</small></div>
            <div class="arch-arrow" aria-hidden="true">→</div>
            <div class="arch-node infra"><span>Infrastructure</span><strong>SQL + Integrations</strong><small>EF Core · queues · APIs · storage</small></div>
          </div>

          <div class="architecture-grid">
            <div class="arch-card"><span>01</span><h3>Domain first</h3><p>Keep business rules independent from framework and hosting choices. Dependency inversion makes infrastructure replaceable instead of contagious.</p></div>
            <div class="arch-card"><span>02</span><h3>Contracts over coupling</h3><p>Explicit API contracts, validation, authorization boundaries, and integration adapters keep consumers from inheriting database or vendor concerns.</p></div>
            <div class="arch-card"><span>03</span><h3>Operational data</h3><p>SQL Server, EF Core, migrations, indexing, execution plans, transactional boundaries, and schema changes treated as deployable software.</p></div>
            <div class="arch-card"><span>04</span><h3>Production is part of design</h3><p>Containers, health checks, logs, CI pipelines, environment configuration, cloud/on-prem deployment, UAT, and rollback thinking belong in the architecture conversation.</p></div>
          </div>
        </div>
      </section>

      <section id="experience" class="section shell">
        <div class="section-heading">
          <div><p class="kicker">Experience</p><h2>A career built across layers.</h2></div>
          <p>The progression matters: production support created the troubleshooting foundation; full-stack roles added application depth; recent work adds architecture, modernization, mentoring, and delivery ownership.</p>
        </div>

        <div class="timeline">
          <article class="timeline-item" *ngFor="let role of experience">
            <div class="timeline-marker" aria-hidden="true"></div>
            <div class="timeline-date">{{ role.dates }}</div>
            <div class="timeline-body">
              <div class="role-heading"><div><h3>{{ role.company }}</h3><p>{{ role.title }}</p></div></div>
              <p class="role-summary">{{ role.summary }}</p>
              <ul><li *ngFor="let highlight of role.highlights">{{ highlight }}</li></ul>
              <div class="chips compact"><span *ngFor="let tech of role.tech">{{ tech }}</span></div>
            </div>
          </article>
        </div>
        <p class="timeline-note">Earlier technology experience includes U.S. Bank, Markettech (iOS/Swift), and Litera. Full chronology is available in the resume.</p>
      </section>

      <section id="stack" class="section stack-section">
        <div class="shell">
          <div class="section-heading">
            <div><p class="kicker">Technology</p><h2>Microsoft-first, integration-heavy, deployment-aware.</h2></div>
            <p>I am intentionally strongest where enterprise product development, data, cloud infrastructure, and business workflows intersect.</p>
          </div>
          <div class="stack-grid">
            <div *ngFor="let group of stackGroups" class="stack-group"><h3>{{ group.name }}</h3><div class="stack-list"><span *ngFor="let item of group.items">{{ item }}</span></div></div>
          </div>
        </div>
      </section>

      <section class="section shell">
        <div class="section-heading">
          <div><p class="kicker">Public code</p><h2>Evidence behind the resume.</h2></div>
          <p>Not every professional system can be public. These repositories provide inspectable evidence across architecture, cloud, integration, and full-stack work.</p>
        </div>
        <div class="repo-grid">
          <a class="repo-card" *ngFor="let repo of publicRepos" [href]="repo.href" target="_blank" rel="noreferrer">
            <div class="repo-icon">&lt;/&gt;</div>
            <h3>{{ repo.name }}</h3>
            <p>{{ repo.description }}</p>
            <span>{{ repo.tech }}</span>
          </a>
        </div>
      </section>

      <section id="endorsements" class="section leadership">
        <div class="shell">
          <div class="section-heading">
            <div><p class="kicker">Endorsements</p><h2>How people describe the work.</h2></div>
            <p>Selected excerpts from professional recommendations, focused on architecture ownership, leadership, collaboration, and delivery.</p>
          </div>
          <div class="quote-grid">
            <figure class="quote-card" *ngFor="let endorsement of endorsements">
              <blockquote>“{{ endorsement.quote }}”</blockquote>
              <figcaption><strong>{{ endorsement.name }}</strong><span>{{ endorsement.role }}</span></figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section class="section shell leadership-scope">
        <div>
          <p class="kicker">Senior / Lead scope</p>
          <h2>I’m most useful where technology meets ambiguity.</h2>
        </div>
        <div class="lead-list">
          <div><strong>Architecture → delivery</strong><p>Own solutions from requirements and technical direction through implementation, deployment, UAT, and production support.</p></div>
          <div><strong>Business partnership</strong><p>Translate conversations with operators and executives into system boundaries, workflows, acceptance criteria, and delivery plans.</p></div>
          <div><strong>Technical leadership</strong><p>Set standards, review code, mentor developers, shape priorities, and keep technical decisions connected to business value.</p></div>
          <div><strong>Modernization</strong><p>Move systems toward modern .NET, Angular/React, containers, cloud services, secure auth, CI/CD, and cleaner architectural boundaries.</p></div>
        </div>
      </section>

      <section class="cta shell">
        <div>
          <p class="kicker">Senior · Lead · Architect-track IC</p>
          <h2>Need someone who can build the system and explain why it should be built that way?</h2>
        </div>
        <div class="cta-panel">
          <a class="primary" href="mailto:joshuad100717@outlook.com">joshuad100717@outlook.com</a>
          <a class="secondary" href="/resume.html" target="_blank" rel="noreferrer">View / print resume</a>
          <a class="text-link" href="https://github.com/poker-kid-100717" target="_blank" rel="noreferrer">GitHub profile ↗</a>
          <p>Albuquerque, New Mexico · Open to remote opportunities</p>
        </div>
      </section>
    </main>

    <footer class="shell"><span>© 2026 Joshua Davis</span><span>Senior Full-Stack Engineer · Solution Architecture</span></footer>
  `
})
export class AppComponent implements OnInit {
  private readonly http = inject(HttpClient);

  projects = projects;
  experience = experience;
  endorsements = endorsements;
  stackGroups = stackGroups;
  publicRepos = publicRepos;
  apiOnline = false;

  profileCode = `{
  "engineer": "Joshua Davis",
  "focus": [
    "solution architecture",
    "full-stack delivery",
    "technical leadership"
  ],
  "backend": ".NET / ASP.NET Core",
  "frontend": "Angular / React / TypeScript",
  "data": "SQL Server / EF Core",
  "delivery": ["Azure", "AWS", "Docker", "CI/CD"],
  "mode": "cloud + on-prem"
}`;

  ngOnInit(): void {
    this.http.get('/api/profile').subscribe({
      next: () => this.apiOnline = true,
      error: () => this.apiOnline = false
    });
  }
}
