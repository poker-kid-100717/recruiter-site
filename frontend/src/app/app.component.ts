
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import {
  allRecommendationsUrl,
  earlierExperience,
  endorsements,
  experience,
  profile,
  projects,
  publicRepos,
  recommendationCount,
  stackGroups
} from './portfolio.data';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <a class="skip-link" href="#main-content">Skip to content</a>
    
    <header class="nav shell" id="top">
      <a class="brand" href="#top" aria-label="Joshua Davis home">JD<span>.</span></a>
      <nav aria-label="Primary navigation">
        <a href="#work">Work</a>
        <a href="#architecture">Architecture</a>
        <a href="#experience">Experience</a>
        <a href="#stack">Stack</a>
        <a href="#recommendations">Recommendations</a>
      </nav>
      <a class="nav-cta" href="/resume.html" target="_blank" rel="noreferrer">Resume ↗</a>
    </header>
    
    <main id="main-content">
      <section class="hero shell" aria-labelledby="hero-title">
        <div class="hero-copy">
          <p class="kicker">{{ profile.headline }}</p>
          <h1 id="hero-title">Joshua Davis builds and supports <span>enterprise applications.</span></h1>
          <p class="hero-text">From loosely defined requirements through design, integrations, release, and production support — 10+ years in software and technology, 8+ building and modernizing enterprise systems. Most of my work is C# and ASP.NET Core APIs over SQL Server with Angular front ends, deployed to Azure or on-premises.</p>
          <div class="actions">
            <a class="primary" href="#work">Selected work</a>
            <a class="secondary" href="/resume.html" target="_blank" rel="noreferrer">View resume</a>
            <a class="text-link" [href]="profile.links.github" target="_blank" rel="noreferrer">GitHub ↗</a>
            <a class="text-link" [href]="profile.links.linkedin" target="_blank" rel="noreferrer">LinkedIn ↗</a>
          </div>
          <ul class="proof-grid" aria-label="Career impact from the resume">
            @for (item of profile.impact; track item) {
              <li>{{ item }}</li>
            }
          </ul>
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
        <div class="shell signal-inner" tabindex="0">
          <span>ASP.NET Core</span><span>Angular</span><span>React</span><span>TypeScript</span><span>SQL Server</span><span>EF Core</span><span>Azure</span><span>AWS</span><span>Docker</span><span>GitHub Actions</span><span>REST APIs</span>
        </div>
      </section>
    
      <section id="work" class="section shell">
        <div class="section-heading">
          <div><p class="kicker">Selected work</p><h2>Systems, not screenshots.</h2></div>
          <p>Public source for each project, with its status stated plainly: <strong>Verified live</strong> only after the app was opened and a real flow run; <strong>Deployed</strong> when it is hosted but not yet re-verified; <strong>Implemented</strong> when it runs locally from source.</p>
        </div>
    
        <div class="projects">
          @for (project of projects; track project; let i = $index) {
            <article class="project-card" [class.featured]="i === 0">
              <div class="project-number" aria-hidden="true">0{{ i + 1 }}</div>
              <div class="project-content">
                <div class="project-topline">
                  <span>{{ project.eyebrow }}</span>
                  <span class="status" [attr.data-status]="project.status">{{ project.status }}</span>
                  @if (project.professional) {
                    <span class="confidential">No proprietary code</span>
                  }
                </div>
                <h3>{{ project.title }}</h3>
                <p class="project-summary">{{ project.summary }}</p>
                <ul>
                  @for (item of project.outcomes; track item) {
                    <li>{{ item }}</li>
                  }
                </ul>
                @if (project.note) {
                  <p class="project-note">{{ project.note }}</p>
                }
                <div class="chips">@for (tech of project.tech; track tech) {
                  <span>{{ tech }}</span>
                }</div>
                @if (project.href || project.secondaryHref) {
                  <div class="project-links">
                    @if (project.href) {
                      <a [href]="project.href" target="_blank" rel="noreferrer">View repository ↗</a>
                    }
                    @if (project.secondaryHref) {
                      <a [href]="project.secondaryHref" target="_blank" rel="noreferrer">{{ project.secondaryLabel || 'View more' }} ↗</a>
                    }
                  </div>
                }
              </div>
            </article>
          }
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
          <p>Production support built the troubleshooting foundation; full-stack roles added application depth; recent work adds modernization, mentoring, and delivery ownership.</p>
        </div>
    
        <div class="timeline">
          @for (role of experience; track role) {
            <article class="timeline-item">
              <div class="timeline-marker" aria-hidden="true"></div>
              <div class="timeline-date">{{ role.dates }}</div>
              <div class="timeline-body">
                <div class="role-heading"><div><h3>{{ role.company }}</h3><p>{{ role.title }}</p></div></div>
                <ul>@for (highlight of role.highlights; track highlight) {
                  <li>{{ highlight }}</li>
                }</ul>
              </div>
            </article>
          }
        </div>

        <details class="earlier">
          <summary>Earlier: production support and contract roles ({{ earlierExperience.length }})</summary>
          <div class="timeline">
            @for (role of earlierExperience; track role) {
              <article class="timeline-item">
                <div class="timeline-marker" aria-hidden="true"></div>
                <div class="timeline-date">{{ role.dates }}</div>
                <div class="timeline-body">
                  <div class="role-heading"><div><h3>{{ role.company }}</h3><p>{{ role.title }}</p></div></div>
                  <ul>@for (highlight of role.highlights; track highlight) {
                    <li>{{ highlight }}</li>
                  }</ul>
                </div>
              </article>
            }
          </div>
        </details>

        <div class="education">
          <h3>Education</h3>
          <ul>@for (entry of profile.education; track entry) {
            <li>{{ entry }}</li>
          }</ul>
        </div>
      </section>
    
      <section id="stack" class="section stack-section">
        <div class="shell">
          <div class="section-heading">
            <div><p class="kicker">Core expertise</p><h2>Microsoft-first, integration-heavy, deployment-aware.</h2></div>
            <p>Grouped as on my resume.</p>
          </div>
          <div class="stack-grid">
            @for (group of stackGroups; track group) {
              <div class="stack-group"><h3>{{ group.name }}</h3><div class="stack-list">@for (item of group.items; track item) {
              <span>{{ item }}</span>
            }</div></div>
          }
        </div>
      </div>
    </section>
    
    <section class="section shell">
      <div class="section-heading">
        <div><p class="kicker">Architecture references</p><h2>Patterns, isolated and inspectable.</h2></div>
        <p>Smaller repositories that each isolate one architectural idea I use in production systems. Open “How it’s built” for the layers and the tradeoffs behind each decision.</p>
      </div>
      <div class="repo-grid">
        @for (repo of publicRepos; track repo) {
          <div class="repo-card">
            <a class="repo-card-link" [href]="repo.href" target="_blank" rel="noreferrer">
              <div class="repo-icon">&lt;/&gt;</div>
              <h3>{{ repo.name }} <span class="repo-external" aria-hidden="true">↗</span></h3>
              <p>{{ repo.description }}</p>
              <span class="repo-tech">{{ repo.tech }}</span>
            </a>
            @if (repo.architecture) {
              <button
                type="button"
                class="repo-arch-toggle"
                (click)="toggleArchitecture(repo.name)"
                [attr.aria-expanded]="isArchitectureOpen(repo.name)"
                >
                {{ isArchitectureOpen(repo.name) ? 'Hide architecture' : 'How it’s built' }}
                <span aria-hidden="true">{{ isArchitectureOpen(repo.name) ? '↑' : '↓' }}</span>
              </button>
            }
            @if (repo.architecture && isArchitectureOpen(repo.name)) {
              <div class="repo-arch">
                <div class="repo-arch-diagram">
                  @for (layer of repo.architecture.layers; track layer; let last = $last) {
                    <div class="repo-arch-node"><strong>{{ layer.name }}</strong><small>{{ layer.note }}</small></div>
                    @if (!last) {
                      <div class="repo-arch-arrow" aria-hidden="true">→</div>
                    }
                  }
                </div>
                <ul class="repo-arch-decisions">
                  @for (decision of repo.architecture.decisions; track decision) {
                    <li>
                      <strong>{{ decision.choice }}</strong>
                      <span class="repo-arch-instead">instead of {{ decision.instead }}</span>
                      <p>{{ decision.why }}</p>
                    </li>
                  }
                </ul>
              </div>
            }
          </div>
        }
      </div>
    </section>
    
    <section id="recommendations" class="section leadership">
      <div class="shell">
        <div class="section-heading">
          <div><p class="kicker">Recommendations</p><h2>How people describe the work.</h2></div>
          <p>Verbatim excerpts from {{ endorsements.length }} of the {{ recommendationCount }} recommendations on my LinkedIn profile. Titles are each author’s current LinkedIn headline.</p>
        </div>
        <div class="quote-grid">
          @for (endorsement of endorsements; track endorsement) {
            <figure class="quote-card">
              <blockquote>“{{ endorsement.quote }}”</blockquote>
              <figcaption>
                <strong>{{ endorsement.name }}</strong>
                <span><span class="label">Current title:</span> {{ endorsement.currentTitle }}</span>
                <span>{{ endorsement.relationship ? endorsement.relationship + ' · ' : '' }}{{ endorsement.date }}</span>
              </figcaption>
            </figure>
          }
        </div>
        <p class="all-recommendations"><a [href]="allRecommendationsUrl" target="_blank" rel="noreferrer">Read all {{ recommendationCount }} recommendations on LinkedIn ↗</a></p>
      </div>
    </section>
    
    <section class="section shell leadership-scope">
      <div>
        <p class="kicker">Senior / Lead scope</p>
        <h2>I’m most useful where technology meets ambiguity.</h2>
      </div>
      <div class="lead-list">
        <div><strong>Requirements → production</strong><p>Own solutions from requirements and technical direction through implementation, deployment, UAT, and production support.</p></div>
        <div><strong>Business partnership</strong><p>Translate conversations with operators and executives into system boundaries, workflows, acceptance criteria, and delivery plans.</p></div>
        <div><strong>Technical leadership</strong><p>Set standards, review code, mentor developers, shape priorities, and keep technical decisions connected to business value.</p></div>
        <div><strong>Modernization</strong><p>Move systems toward modern .NET, Angular/React, containers, cloud services, secure auth, CI/CD, and cleaner architectural boundaries.</p></div>
      </div>
    </section>
    
    <section class="cta shell">
      <div>
        <p class="kicker">Senior · Lead · Hands-on full-stack</p>
        <h2>Need someone who can build the system and explain why it should be built that way?</h2>
      </div>
      <div class="cta-panel">
        <a class="primary" [href]="'mailto:' + profile.email">{{ profile.email }}</a>
        <a class="secondary" href="/resume.html" target="_blank" rel="noreferrer">View / print resume</a>
        <a class="text-link" [href]="profile.links.linkedin" target="_blank" rel="noreferrer">LinkedIn ↗</a>
        <a class="text-link" [href]="profile.links.github" target="_blank" rel="noreferrer">GitHub ↗</a>
        <p>{{ profile.location }} · Open to remote opportunities</p>
      </div>
    </section>
    </main>
    
    <footer class="shell"><span>© 2026 Joshua Davis</span><span>Full-Stack Software Engineer · C# / .NET · Angular / React</span></footer>
    `
})
export class AppComponent implements OnInit {
  private readonly http = inject(HttpClient);

  profile = profile;
  projects = projects;
  experience = experience;
  earlierExperience = earlierExperience;
  endorsements = endorsements;
  allRecommendationsUrl = allRecommendationsUrl;
  recommendationCount = recommendationCount;
  stackGroups = stackGroups;
  publicRepos = publicRepos;
  apiOnline = false;
  private openArchitecture = new Set<string>();

  profileCode = `{
  "engineer": "Joshua Davis",
  "focus": [
    "full-stack .NET delivery",
    "APIs and integrations",
    "production support"
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

  toggleArchitecture(repoName: string): void {
    if (this.openArchitecture.has(repoName)) {
      this.openArchitecture.delete(repoName);
    } else {
      this.openArchitecture.add(repoName);
    }
  }

  isArchitectureOpen(repoName: string): boolean {
    return this.openArchitecture.has(repoName);
  }
}
