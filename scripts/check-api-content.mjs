// Verifies that the Cloudflare Worker and the ASP.NET Core API serve identical content from the same database.
// Usage: DATABASE_URL=... node scripts/check-api-content.mjs <backend-base-url>
import assert from "node:assert/strict";

const { default: worker } = await import("../frontend/worker/index.js");
const backendUrl = process.argv[2];
const databaseUrl = process.env.DATABASE_URL;
if (!backendUrl || !databaseUrl) {
  console.error("Usage: DATABASE_URL=... node scripts/check-api-content.mjs <backend-base-url>");
  process.exit(1);
}

const env = { DATABASE_URL: databaseUrl, ASSETS: { fetch: () => new Response("", { status: 404 }) } };
const pending = [];
const ctx = { waitUntil: (promise) => pending.push(promise) };

for (const path of ["/api/portfolio", "/api/profile", "/api/architecture", "/api/work"]) {
  const response = await worker.fetch(new Request(`https://example.test${path}`), env, ctx);
  assert.equal(response.status, 200, `Worker ${path} status`);
  assert.equal(response.headers.get("X-Content-Source"), "database", `Worker ${path} did not read the database`);
  const fromWorker = await response.json();

  const backendResponse = await fetch(new URL(path, backendUrl));
  assert.equal(backendResponse.status, 200, `Backend ${path} status`);
  const fromBackend = await backendResponse.json();

  // Each runtime names itself on /api/profile; everything else must match exactly.
  if (path === "/api/profile") {
    delete fromWorker.runtime;
    delete fromBackend.runtime;
  }
  assert.deepEqual(fromBackend, fromWorker, `${path}: Worker and .NET API differ`);
  console.log(`ok ${path}`);
}

await Promise.allSettled(pending);
process.exit(0);
