// Verifies that the Cloudflare Worker and the ASP.NET Core API serve content/api.json unchanged.
// Usage: node scripts/check-api-content.mjs [backend-base-url]
// Without a URL only the Worker is checked; CI passes the URL of a locally started backend.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const content = JSON.parse(await readFile(new URL("../content/api.json", import.meta.url), "utf8"));
const { default: worker } = await import("../frontend/worker/index.js");
const backendUrl = process.argv[2];

const endpoints = {
  "/api/profile": content.profile,
  "/api/architecture": content.architecture,
  "/api/work": content.work
};

for (const [path, expected] of Object.entries(endpoints)) {
  const response = await worker.fetch(new Request(`https://example.test${path}`), {});
  assert.equal(response.status, 200, `Worker ${path} status`);
  const body = await response.json();
  // The Worker adds its runtime name to the profile; everything else must match exactly.
  if (path === "/api/profile") delete body.runtime;
  assert.deepEqual(body, expected, `Worker ${path} differs from content/api.json`);

  if (backendUrl) {
    const backendResponse = await fetch(new URL(path, backendUrl));
    assert.equal(backendResponse.status, 200, `Backend ${path} status`);
    assert.deepEqual(await backendResponse.json(), expected, `Backend ${path} differs from content/api.json`);
  }

  console.log(`ok ${path}${backendUrl ? " (worker + backend)" : " (worker)"}`);
}
