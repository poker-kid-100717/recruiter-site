const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Frame-Options": "SAMEORIGIN",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  "Content-Security-Policy": "default-src 'self'; base-uri 'self'; form-action 'self' mailto:; frame-ancestors 'self'; object-src 'none'; img-src 'self' data:; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; connect-src 'self'; manifest-src 'self'"
};

const profile = {
  name: "Joshua Davis",
  title: "Senior Full-Stack Software Engineer",
  location: "Albuquerque, NM",
  focus: ["Solution Architecture", "Full-Stack Delivery", "Technical Leadership", "Modernization"],
  stack: [".NET 10", "ASP.NET Core", "Angular", "React", "TypeScript", "SQL Server", "EF Core", "Azure", "AWS", "Docker", "GitHub Actions", "Cloudflare Workers"],
  delivery: ["Cloud", "On-Premises", "Containers", "CI/CD", "Edge"],
  runtime: "Cloudflare Worker"
};

const architecture = {
  principles: [
    { name: "Domain first", detail: "Keep business rules independent from hosting and framework choices." },
    { name: "Contracts over coupling", detail: "Use explicit API and integration contracts with validation and authorization boundaries." },
    { name: "Data discipline", detail: "Treat schema, migrations, indexing, and performance as deployable application concerns." },
    { name: "Production by design", detail: "Build health checks, logging, configuration, CI/CD, and deployment paths into the system." }
  ],
  referenceFlow: ["Angular/React", "ASP.NET Core", "Application/Core", "EF Core + SQL Server + Integrations"]
};

const work = [
  { name: "Freight DNA + Logistics Application Suite", type: "Professional case study", publicSource: false, repository: null },
  { name: "WorkLens", type: "Public full-stack platform", publicSource: true, repository: "https://github.com/poker-kid-100717/WorkLens" },
  { name: "Architecture + Integration Repositories", type: "Public engineering evidence", publicSource: true, repository: "https://github.com/poker-kid-100717?tab=repositories" }
];

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
