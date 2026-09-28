// Proves the database and the seed files agree: portfolio_document() must equal the document the Worker
// builds from content/*.json (its fallback), apart from fields the database owns (project status,
// demo URL, verified date), which are compared against the seed only on a freshly seeded database.
// Usage: DATABASE_URL=... node db/verify.mjs [--fresh]
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { connect } from './connection.mjs';
import { documentFromContent } from '../frontend/worker/content.js';

const read = async (name) => JSON.parse(await readFile(new URL(`../content/${name}`, import.meta.url), 'utf8'));
const expected = documentFromContent({
  resume: await read('resume.json'),
  recommendations: await read('recommendations.json'),
  projects: await read('projects.json'),
  site: await read('site.json')
});

const sql = connect();
try {
  const [{ doc }] = await sql`select portfolio_document() as doc`;
  if (!process.argv.includes('--fresh')) {
    for (const [index, project] of doc.projects.entries()) {
      const seed = expected.projects[index];
      if (seed) Object.assign(seed, { status: project.status, demo: project.demo, verifiedOn: project.verifiedOn });
    }
  }
  assert.deepEqual(doc, expected);
  console.log('portfolio_document() matches content/*.json');
} finally {
  await sql.end();
}
