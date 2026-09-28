// Records a project's status after checking it. "Verified live" requires the date the live app was
// opened and a real flow run (enforced by a check constraint too).
// Usage: DATABASE_URL=... node db/set-status.mjs <slug> "<Verified live|Deployed|Implemented|Professional>" [YYYY-MM-DD] [demo-url]
import { connect } from './connection.mjs';

const [slug, status, verifiedOn = null, demo] = process.argv.slice(2);
if (!slug || !status) {
  console.error('Usage: node db/set-status.mjs <slug> <status> [verified-on YYYY-MM-DD] [demo-url]');
  process.exit(1);
}

const sql = connect();
try {
  const rows = await sql`
    update projects
       set status = ${status},
           verified_on = ${verifiedOn},
           demo_url = coalesce(${demo ?? null}, demo_url)
     where slug = ${slug}
    returning slug, status, verified_on, demo_url`;
  if (rows.length === 0) {
    console.error(`No project with slug "${slug}".`);
    process.exitCode = 1;
  } else {
    console.log(rows[0]);
  }
} finally {
  await sql.end();
}
