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

app.MapGet("/api/profile", () => Results.Ok(new
{
    name = "Joshua Davis",
    title = "Senior Full-Stack Software Engineer",
    location = "Albuquerque, NM",
    focus = new[] { "Solution Architecture", "Full-Stack Delivery", "Technical Leadership", "Modernization" },
    stack = new[] { ".NET 10", "ASP.NET Core", "Angular", "React", "TypeScript", "SQL Server", "EF Core", "Azure", "AWS", "Docker", "GitHub Actions" },
    delivery = new[] { "Cloud", "On-Premises", "Containers", "CI/CD" }
}));

app.MapGet("/api/architecture", () => Results.Ok(new
{
    principles = new[]
    {
        new { name = "Domain first", detail = "Keep business rules independent from hosting and framework choices." },
        new { name = "Contracts over coupling", detail = "Use explicit API and integration contracts with validation and authorization boundaries." },
        new { name = "Data discipline", detail = "Treat schema, migrations, indexing, and performance as deployable application concerns." },
        new { name = "Production by design", detail = "Build health checks, logging, configuration, CI/CD, and deployment paths into the system." }
    },
    referenceFlow = new[] { "Angular/React", "ASP.NET Core", "Application/Core", "EF Core + SQL Server + Integrations" }
}));

app.MapGet("/api/work", () => Results.Ok(new[]
{
    new { name = "Freight DNA + Logistics Application Suite", type = "Professional case study", publicSource = false, repository = (string?)null },
    new { name = "WorkLens", type = "Public full-stack platform", publicSource = true, repository = (string?)"https://github.com/poker-kid-100717/WorkLens" },
    new { name = "Architecture + Integration Repositories", type = "Public engineering evidence", publicSource = true, repository = (string?)"https://github.com/poker-kid-100717?tab=repositories" }
}));

app.Run();
