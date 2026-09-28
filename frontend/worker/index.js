import postgres from "postgres";
import resume from "../../content/resume.json" with { type: "json" };
import recommendations from "../../content/recommendations.json" with { type: "json" };
import projects from "../../content/projects.json" with { type: "json" };
import site from "../../content/site.json" with { type: "json" };
import { architectureView, documentFromContent, profileView, workView } from "./content.js";

const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Frame-Options": "SAMEORIGIN",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  "Content-Security-Policy": "default-src 'self'; base-uri 'self'; form-action 'self' mailto:; frame-ancestors 'self'; object-src 'none'; img-src 'self' data:; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; connect-src 'self'; manifest-src 'self'"
};

// Served only when the database is not configured or not reachable, so the page never goes blank.
const fallbackDocument = documentFromContent({ resume, recommendations, projects, site });

const CACHE_MS = 60_000;
const DB_TIMEOUT_MS = 4_000;
let cached = null; // { doc, source, at } — per isolate; keeps Neon (which scales to zero) off the hot path

function withSecurityHeaders(response, extra = {}) {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(securityHeaders)) headers.set(key, value);
  for (const [key, value] of Object.entries(extra)) headers.set(key, value);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

function json(data, status = 200, extra = {}) {
  return withSecurityHeaders(
    new Response(JSON.stringify(data), {
      status,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
        ...extra
      }
    })
  );
}

function problem(status, title) {
  return withSecurityHeaders(
    new Response(JSON.stringify({ type: "about:blank", title, status }), {
      status,
      headers: { "Content-Type": "application/problem+json; charset=utf-8", "Cache-Control": "no-store" }
    })
  );
}

async function queryDocument(env, ctx) {
  const sql = postgres(env.DATABASE_URL, { max: 1, fetch_types: false, prepare: false, connect_timeout: 3 });
  try {
    const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("database timeout")), DB_TIMEOUT_MS));
    const [row] = await Promise.race([sql`select portfolio_document() as doc`, timeout]);
    return row.doc;
  } finally {
    ctx.waitUntil(sql.end({ timeout: 1 }));
  }
}

/** Returns { doc, source } where source is "database", "fallback: <reason>". */
async function loadDocument(env, ctx, { fresh = false } = {}) {
  if (!fresh && cached && Date.now() - cached.at < CACHE_MS) return cached;
  if (!env.DATABASE_URL) {
    cached = { doc: fallbackDocument, source: "fallback: database not configured", at: Date.now() };
    return cached;
  }
  try {
    cached = { doc: await queryDocument(env, ctx), source: "database", at: Date.now() };
  } catch (error) {
    console.error(JSON.stringify({ event: "portfolio_document_failed", message: String(error?.message ?? error) }));
    cached = { doc: fallbackDocument, source: "fallback: database unreachable", at: Date.now() };
  }
  return cached;
}

const views = {
  "/api/portfolio": (doc) => doc,
  "/api/profile": (doc) => ({ ...profileView(doc), runtime: "Cloudflare Worker" }),
  "/api/architecture": architectureView,
  "/api/work": workView
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/healthz") {
      return withSecurityHeaders(new Response("ok", {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-store"
        }
      }));
    }

    if (url.pathname === "/health") {
      const { source } = await loadDocument(env, ctx, { fresh: true });
      const database = source === "database" ? "ok" : source.replace("fallback: database ", "");
      return json({
        status: source === "database" ? "Healthy" : "Degraded",
        runtime: "Cloudflare Worker",
        site: "portfolio-joshdavis.app",
        database
      });
    }

    const view = views[url.pathname];
    if (view) {
      if (request.method !== "GET" && request.method !== "HEAD") return problem(405, "Method not allowed");
      const { doc, source } = await loadDocument(env, ctx);
      return json(view(doc), 200, { "X-Content-Source": source });
    }
    if (url.pathname.startsWith("/api/")) return problem(404, "Not found");

    const assetResponse = await env.ASSETS.fetch(request);

    if (url.pathname === "/" || url.pathname === "/index.html") {
      return withSecurityHeaders(assetResponse, {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "Pragma": "no-cache",
        "Expires": "0"
      });
    }

    return withSecurityHeaders(assetResponse);
  }
};
