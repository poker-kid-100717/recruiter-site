// Loads content/*.json into the database. Idempotent: resume, recommendation, and project text are
// replaced on every run; a project's status, demo URL, and verified date are only set when the project
// is first inserted, because after that the database owns them (db/set-status.mjs). Live apps are
// content-owned: they are replaced from content/projects.json on every run.
// Usage: DATABASE_URL=... node db/seed.mjs
import { readFile } from 'node:fs/promises';
import { connect } from './connection.mjs';

const read = async (name) => JSON.parse(await readFile(new URL(`../content/${name}`, import.meta.url), 'utf8'));
const [resume, recommendations, projects, site] = await Promise.all(
  ['resume.json', 'recommendations.json', 'projects.json', 'site.json'].map(read)
);

const month = (value) => (value ? `${value}-01` : null);
const sql = connect();

try {
  await sql.begin(async (tx) => {
    await tx`delete from profile_items`;
    await tx`delete from skill_groups`;
    await tx`delete from roles`;
    await tx`delete from recommendations`;
    await tx`delete from site_settings`;
    await tx`delete from public_repos`;
    await tx`delete from architecture_principles`;
    await tx`delete from live_apps`;

    await tx`
      insert into profile (id, name, headline, title, location, email, summary, linkedin_url, github_url, portfolio_url)
      values (1, ${resume.name}, ${resume.headline}, ${site.profile.title}, ${resume.location}, ${resume.email},
              ${resume.summary}, ${resume.links.linkedin}, ${resume.links.github}, ${resume.links.portfolio})
      on conflict (id) do update set name = excluded.name, headline = excluded.headline, title = excluded.title,
        location = excluded.location, email = excluded.email, summary = excluded.summary,
        linkedin_url = excluded.linkedin_url, github_url = excluded.github_url, portfolio_url = excluded.portfolio_url`;

    const lists = {
      impact: resume.impact,
      education: resume.education,
      focus: site.profile.focus,
      stack: site.profile.stack,
      delivery: site.profile.delivery,
      reference_flow: site.architecture.referenceFlow
    };
    for (const [kind, values] of Object.entries(lists)) {
      for (const [position, value] of values.entries()) {
        await tx`insert into profile_items (kind, position, value) values (${kind}, ${position}, ${value})`;
      }
    }

    for (const [groupPosition, [name, items]] of Object.entries(resume.skills).entries()) {
      await tx`insert into skill_groups (position, name) values (${groupPosition}, ${name})`;
      for (const [position, skill] of items.entries()) {
        await tx`insert into skills (group_position, position, name) values (${groupPosition}, ${position}, ${skill})`;
      }
    }

    const earlier = new Set(site.earlierCompanies);
    for (const [rolePosition, job] of resume.experience.entries()) {
      await tx`
        insert into roles (position, company, title, start_month, end_month, earlier)
        values (${rolePosition}, ${job.company}, ${job.title}, ${month(job.start)}, ${month(job.end)}, ${earlier.has(job.company)})`;
      for (const [position, bullet] of job.bullets.entries()) {
        await tx`insert into role_bullets (role_position, position, text) values (${rolePosition}, ${position}, ${bullet})`;
      }
    }

    for (const [position, entry] of recommendations.featured.entries()) {
      await tx`
        insert into recommendations (id, position, author, current_title, relationship, recommended_on, excerpt)
        values (${entry.id}, ${position}, ${entry.author}, ${entry.currentTitle}, ${entry.relationship}, ${entry.date}, ${entry.excerpt})`;
    }
    await tx`insert into site_settings (key, value) values
      ('all_recommendations_url', ${recommendations.allRecommendationsUrl}),
      ('recommendations_total', ${String(recommendations.totalReceived)})`;

    const slugs = projects.projects.map((project) => project.slug);
    await tx`delete from projects where slug <> all(${slugs})`;
    // Park existing positions so reordering cannot collide with the unique constraint.
    await tx`update projects set position = -position - 1000`;
    for (const [position, project] of projects.projects.entries()) {
      const outcomes = project.outcomesFromRole
        ? resume.experience.find((job) => job.company === project.outcomesFromRole).bullets
        : project.outcomes;
      await tx`
        insert into projects (slug, position, title, eyebrow, status, summary, note, repository_url, demo_url, verified_on, professional)
        values (${project.slug}, ${position}, ${project.title}, ${project.eyebrow}, ${project.status}, ${project.summary},
                ${project.note ?? null}, ${project.repository ?? null}, ${project.demo ?? null}, ${project.verifiedOn ?? null},
                ${Boolean(project.professional)})
        on conflict (slug) do update set position = excluded.position, title = excluded.title, eyebrow = excluded.eyebrow,
          summary = excluded.summary, note = excluded.note, repository_url = excluded.repository_url,
          professional = excluded.professional`;
      await tx`delete from project_outcomes where project_slug = ${project.slug}`;
      await tx`delete from project_tech where project_slug = ${project.slug}`;
      for (const [index, text] of outcomes.entries()) {
        await tx`insert into project_outcomes (project_slug, position, text) values (${project.slug}, ${index}, ${text})`;
      }
      for (const [index, name] of project.tech.entries()) {
        await tx`insert into project_tech (project_slug, position, name) values (${project.slug}, ${index}, ${name})`;
      }
    }

    for (const [repoPosition, repo] of projects.publicRepos.entries()) {
      await tx`
        insert into public_repos (position, name, description, tech, href)
        values (${repoPosition}, ${repo.name}, ${repo.description}, ${repo.tech}, ${repo.href})`;
      for (const [position, layer] of (repo.architecture?.layers ?? []).entries()) {
        await tx`insert into repo_layers (repo_position, position, name, note) values (${repoPosition}, ${position}, ${layer.name}, ${layer.note})`;
      }
      for (const [position, decision] of (repo.architecture?.decisions ?? []).entries()) {
        await tx`
          insert into repo_decisions (repo_position, position, choice, instead, why)
          values (${repoPosition}, ${position}, ${decision.choice}, ${decision.instead}, ${decision.why})`;
      }
    }

    for (const [position, app] of projects.liveApps.entries()) {
      await tx`
        insert into live_apps (slug, position, name, tagline, status, url, repository_url, verified_on)
        values (${app.slug}, ${position}, ${app.name}, ${app.tagline}, ${app.status}, ${app.url ?? null},
                ${app.repository ?? null}, ${app.verifiedOn ?? null})`;
      for (const [index, name] of app.skills.entries()) {
        await tx`insert into live_app_skills (app_slug, position, name) values (${app.slug}, ${index}, ${name})`;
      }
    }

    for (const [position, principle] of site.architecture.principles.entries()) {
      await tx`insert into architecture_principles (position, name, detail) values (${position}, ${principle.name}, ${principle.detail})`;
    }
  });
  console.log('seeded portfolio content');
} finally {
  await sql.end();
}
