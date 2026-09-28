// Builds the portfolio document from the content/*.json seed files.
// The database's portfolio_document() SQL function is the runtime source; this builder produces the
// identical shape so the Worker can still serve the page if the database is unreachable, and so tests
// can prove the SQL function and the seed agree (scripts/db/verify.mjs).

/** @param {{ resume: any, recommendations: any, projects: any, site: any }} content */
export function documentFromContent({ resume, recommendations, projects, site }) {
  const earlier = new Set(site.earlierCompanies);
  const roleBullets = (company) => {
    const role = resume.experience.find((job) => job.company === company);
    if (!role) throw new Error(`outcomesFromRole: no role for ${company}`);
    return role.bullets;
  };

  return {
    profile: {
      name: resume.name,
      headline: resume.headline,
      title: site.profile.title,
      location: resume.location,
      email: resume.email,
      summary: resume.summary,
      links: { linkedin: resume.links.linkedin, github: resume.links.github, portfolio: resume.links.portfolio },
      impact: resume.impact,
      education: resume.education,
      focus: site.profile.focus,
      stack: site.profile.stack,
      delivery: site.profile.delivery
    },
    skills: Object.entries(resume.skills).map(([name, items]) => ({ name, items })),
    experience: resume.experience.map((job) => ({
      company: job.company,
      title: job.title,
      start: job.start,
      end: job.end ?? null,
      earlier: earlier.has(job.company),
      highlights: job.bullets
    })),
    recommendations: {
      allUrl: recommendations.allRecommendationsUrl,
      total: recommendations.totalReceived,
      featured: recommendations.featured.map((entry) => ({
        id: entry.id,
        author: entry.author,
        currentTitle: entry.currentTitle,
        relationship: entry.relationship,
        date: entry.date,
        excerpt: entry.excerpt
      }))
    },
    projects: projects.projects.map((project) => ({
      slug: project.slug,
      title: project.title,
      eyebrow: project.eyebrow,
      status: project.status,
      summary: project.summary,
      outcomes: project.outcomesFromRole ? roleBullets(project.outcomesFromRole) : project.outcomes,
      tech: project.tech,
      note: project.note ?? null,
      repository: project.repository ?? null,
      demo: project.demo ?? null,
      verifiedOn: project.verifiedOn ?? null,
      professional: Boolean(project.professional)
    })),
    publicRepos: projects.publicRepos.map((repo) => ({
      name: repo.name,
      description: repo.description,
      tech: repo.tech,
      href: repo.href,
      architecture: repo.architecture
        ? {
            layers: repo.architecture.layers.map(({ name, note }) => ({ name, note })),
            decisions: repo.architecture.decisions.map(({ choice, instead, why }) => ({ choice, instead, why }))
          }
        : null
    })),
    architecture: {
      principles: site.architecture.principles.map(({ name, detail }) => ({ name, detail })),
      referenceFlow: site.architecture.referenceFlow
    }
  };
}

// The small legacy endpoints are views over the same document.

export function profileView(doc) {
  const { name, title, location, focus, stack, delivery } = doc.profile;
  return { name, title, location, focus, stack, delivery };
}

export function workView(doc) {
  return doc.projects.map((project) => ({
    name: project.title,
    type: project.eyebrow,
    publicSource: !project.professional,
    repository: project.repository,
    demo: project.status === 'Verified live' ? project.demo : null,
    status: project.status
  }));
}

export function architectureView(doc) {
  return doc.architecture;
}
