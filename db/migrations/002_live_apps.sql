-- Live Apps: the portfolio's deployed, clickable applications, each with the skills it demonstrates.
-- Unlike projects, every column here is content: db/seed.mjs replaces the rows from
-- content/projects.json on each run, so an app's status changes through a reviewed content change.

create table live_apps (
  slug text primary key,
  position int not null unique,
  name text not null,
  tagline text not null,
  status text not null check (status in ('Verified live', 'Deployed', 'Implemented')),
  url text,
  repository_url text,
  verified_on date,
  -- Same rule as projects: "Verified live" only with the date a real flow was run against the live app.
  constraint live_app_verified_needs_date check (status <> 'Verified live' or verified_on is not null),
  constraint live_app_verified_needs_url check (status <> 'Verified live' or url is not null)
);

create table live_app_skills (
  app_slug text not null references live_apps (slug) on delete cascade,
  position int not null,
  name text not null,
  primary key (app_slug, position)
);

-- The whole page as one JSON document. The Cloudflare Worker and the ASP.NET Core API both serve this,
-- so the mapping from tables to the API shape exists in exactly one place.
create or replace function portfolio_document() returns json
language sql stable as $$
  select json_build_object(
    'profile', (
      select json_build_object(
        'name', p.name, 'headline', p.headline, 'title', p.title, 'location', p.location,
        'email', p.email, 'summary', p.summary,
        'links', json_build_object('linkedin', p.linkedin_url, 'github', p.github_url, 'portfolio', p.portfolio_url),
        'impact', profile_list('impact'), 'education', profile_list('education'),
        'focus', profile_list('focus'), 'stack', profile_list('stack'), 'delivery', profile_list('delivery'))
      from profile p),
    'skills', (
      select coalesce(json_agg(json_build_object(
        'name', g.name,
        'items', (select coalesce(json_agg(s.name order by s.position), '[]'::json) from skills s where s.group_position = g.position)
      ) order by g.position), '[]'::json)
      from skill_groups g),
    'experience', (
      select coalesce(json_agg(json_build_object(
        'company', r.company, 'title', r.title,
        'start', to_char(r.start_month, 'YYYY-MM'), 'end', to_char(r.end_month, 'YYYY-MM'),
        'earlier', r.earlier,
        'highlights', (select coalesce(json_agg(b.text order by b.position), '[]'::json) from role_bullets b where b.role_position = r.position)
      ) order by r.position), '[]'::json)
      from roles r),
    'recommendations', json_build_object(
      'allUrl', (select value from site_settings where key = 'all_recommendations_url'),
      'total', (select value::int from site_settings where key = 'recommendations_total'),
      'featured', (
        select coalesce(json_agg(json_build_object(
          'id', c.id, 'author', c.author, 'currentTitle', c.current_title, 'relationship', c.relationship,
          'date', to_char(c.recommended_on, 'YYYY-MM-DD'), 'excerpt', c.excerpt
        ) order by c.position), '[]'::json)
        from recommendations c)),
    'projects', (
      select coalesce(json_agg(json_build_object(
        'slug', pr.slug, 'title', pr.title, 'eyebrow', pr.eyebrow, 'status', pr.status, 'summary', pr.summary,
        'outcomes', (select coalesce(json_agg(o.text order by o.position), '[]'::json) from project_outcomes o where o.project_slug = pr.slug),
        'tech', (select coalesce(json_agg(t.name order by t.position), '[]'::json) from project_tech t where t.project_slug = pr.slug),
        'note', pr.note, 'repository', pr.repository_url, 'demo', pr.demo_url,
        'verifiedOn', to_char(pr.verified_on, 'YYYY-MM-DD'), 'professional', pr.professional
      ) order by pr.position), '[]'::json)
      from projects pr),
    'publicRepos', (
      select coalesce(json_agg(json_build_object(
        'name', rp.name, 'description', rp.description, 'tech', rp.tech, 'href', rp.href,
        'architecture', case when exists (select 1 from repo_layers l where l.repo_position = rp.position) then json_build_object(
          'layers', (select json_agg(json_build_object('name', l.name, 'note', l.note) order by l.position) from repo_layers l where l.repo_position = rp.position),
          'decisions', (select coalesce(json_agg(json_build_object('choice', d.choice, 'instead', d.instead, 'why', d.why) order by d.position), '[]'::json) from repo_decisions d where d.repo_position = rp.position)
        ) end
      ) order by rp.position), '[]'::json)
      from public_repos rp),
    'liveApps', (
      select coalesce(json_agg(json_build_object(
        'slug', a.slug, 'name', a.name, 'tagline', a.tagline, 'status', a.status,
        'skills', (select coalesce(json_agg(s.name order by s.position), '[]'::json) from live_app_skills s where s.app_slug = a.slug),
        'url', a.url, 'repository', a.repository_url, 'verifiedOn', to_char(a.verified_on, 'YYYY-MM-DD')
      ) order by a.position), '[]'::json)
      from live_apps a),
    'architecture', json_build_object(
      'principles', (select coalesce(json_agg(json_build_object('name', a.name, 'detail', a.detail) order by a.position), '[]'::json) from architecture_principles a),
      'referenceFlow', profile_list('reference_flow'))
  )
$$;
