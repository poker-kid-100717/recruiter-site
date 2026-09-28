import content from "../../content/api.json" with { type: "json" };

const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Frame-Options": "SAMEORIGIN",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  "Content-Security-Policy": "default-src 'self'; base-uri 'self'; form-action 'self' mailto:; frame-ancestors 'self'; object-src 'none'; img-src 'self' data:; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; connect-src 'self'; manifest-src 'self'"
};

// Shared with the ASP.NET Core API (backend/Program.cs); scripts/check-api-content.mjs keeps them in sync.
const { profile: sharedProfile, architecture, work } = content;
const profile = { ...sharedProfile, runtime: "Cloudflare Worker" };

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

function json(data, status = 200) {
  return withSecurityHeaders(
    new Response(JSON.stringify(data), {
      status,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store"
      }
    })
  );
}

export default {
  async fetch(request, env) {
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
      return json({ status: "Healthy", runtime: "Cloudflare Worker", site: "portfolio-joshdavis.app" });
    }

    if (url.pathname === "/api/profile") return json(profile);
    if (url.pathname === "/api/architecture") return json(architecture);
    if (url.pathname === "/api/work") return json(work);
    if (url.pathname.startsWith("/api/")) return json({ error: "Not found" }, 404);

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
