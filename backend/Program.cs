using System.Text.Json.Nodes;
using Microsoft.AspNetCore.HttpOverrides;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHealthChecks();
builder.Services.AddOpenApi();
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
});

var app = builder.Build();

app.UseForwardedHeaders();
app.MapOpenApi();
app.MapHealthChecks("/health");

// Shared with the Cloudflare Worker (frontend/worker/index.js); scripts/check-api-content.mjs keeps them in sync.
var content = JsonNode.Parse(File.ReadAllText(Path.Combine(AppContext.BaseDirectory, "content", "api.json")))
    ?? throw new InvalidOperationException("content/api.json is empty.");

app.MapGet("/api/profile", () => Results.Json(content["profile"]));
app.MapGet("/api/architecture", () => Results.Json(content["architecture"]));
app.MapGet("/api/work", () => Results.Json(content["work"]));

app.Run();
