-- Portfolio content store. Seeded from content/*.json by scripts/db/seed.mjs;
-- project status and verification dates are owned by the database (see scripts/db/set-status.mjs).

create table profile (
  id smallint primary key default 1 check (id = 1),
  name text not null,
  headline text not null,
  title text not null,
  location text not null,
  email text not null,
  summary text not null,
  linkedin_url text not null,
  github_url text not null,
  portfolio_url text not null
);

-- Ordered string lists that hang off the profile.
create table profile_items (
  kind text not null check (kind in ('impact', 'education', 'focus', 'stack', 'delivery', 'reference_flow')),
  position int not null,
  value text not null,
  primary key (kind, position)
);

create table skill_groups (
  position int primary key,
  name text not null unique
);

create table skills (
  group_position int not null references skill_groups (position) on delete cascade,
  position int not null,
  name text not null,
  primary key (group_position, position)
);

create table roles (
  position int primary key,
  company text not null,
  title text not null,
  start_month date not null,
  end_month date,
  earlier boolean not null default false
);

create table role_bullets (
  role_position int not null references roles (position) on delete cascade,
  position int not null,
  text text not null,
  primary key (role_position, position)
);

create table recommendations (
  id text primary key,
  position int not null unique,
  author text not null,
  current_title text not null,
  relationship text,
  recommended_on date not null,
  excerpt text not null
);

create table site_settings (
  key text primary key,
  value text not null
);

create table projects (
  slug text primary key,
  position int not null unique,
  title text not null,
  eyebrow text not null,
  status text not null check (status in ('Verified live', 'Deployed', 'Implemented', 'Professional')),
  summary text not null,
  note text,
  repository_url text,
  demo_url text,
  verified_on date,
  professional boolean not null default false,
  -- "Verified live" is only allowed with the date the live app was opened and a real flow run.
  constraint verified_needs_date check (status <> 'Verified live' or verified_on is not null)
);

create table project_outcomes (
  project_slug text not null references projects (slug) on delete cascade,
  position int not null,
  text text not null,
  primary key (project_slug, position)
);

create table project_tech (
  project_slug text not null references projects (slug) on delete cascade,
  position int not null,
  name text not null,
  primary key (project_slug, position)
);

create table public_repos (
  position int primary key,
  name text not null,
  description text not null,
  tech text not null,
  href text not null
);

create table repo_layers (
  repo_position int not null references public_repos (position) on delete cascade,
  position int not null,
  name text not null,
  note text not null,
  primary key (repo_position, position)
);

create table repo_decisions (
  repo_position int not null references public_repos (position) on delete cascade,
  position int not null,
  choice text not null,
  instead text not null,
  why text not null,
  primary key (repo_position, position)
);

create table architecture_principles (
  position int primary key,
  name text not null,
  detail text not null
);

create function profile_list(list_kind text) returns json
language sql stable as $$
  select coalesce(json_agg(value order by position), '[]'::json) from profile_items where kind = list_kind
$$;

-- The whole page as one JSON document. The Cloudflare Worker and the ASP.NET Core API both serve this,
-- so the mapping from tables to the API shape exists in exactly one place.
create function portfolio_document() returns json
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
    'architecture', json_build_object(
      'principles', (select coalesce(json_agg(json_build_object('name', a.name, 'detail', a.detail) order by a.position), '[]'::json) from architecture_principles a),
      'referenceFlow', profile_list('reference_flow'))
  )
$$;
