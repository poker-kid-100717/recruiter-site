// Applies db/migrations/*.sql in name order, once each, inside a transaction guarded by an advisory lock.
// Usage: DATABASE_URL=... node db/migrate.mjs
import { readdir, readFile } from 'node:fs/promises';
import { connect } from './connection.mjs';

const sql = connect();
const dir = new URL('./migrations/', import.meta.url);

try {
  await sql.begin(async (tx) => {
    await tx`select pg_advisory_xact_lock(hashtext('portfolio-migrations'))`;
    await tx`create table if not exists schema_migrations (name text primary key, applied_at timestamptz not null default now())`;
    const applied = new Set((await tx`select name from schema_migrations`).map((row) => row.name));
    const files = (await readdir(dir)).filter((file) => file.endsWith('.sql')).sort();

    for (const file of files) {
      if (applied.has(file)) continue;
      await tx.unsafe(await readFile(new URL(file, dir), 'utf8'));
      await tx`insert into schema_migrations (name) values (${file})`;
      console.log(`applied ${file}`);
    }
  });
  console.log('migrations up to date');
} finally {
  await sql.end();
}
