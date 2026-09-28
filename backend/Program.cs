using Microsoft.AspNetCore.HttpOverrides;
using Npgsql;
using Portfolio.Api;

var builder = WebApplication.CreateBuilder(args);

// Same database and SQL function as the Cloudflare Worker: select portfolio_document().
var connectionString = PostgresUrl.ToConnectionString(
    builder.Configuration["DATABASE_URL"] ?? builder.Configuration.GetConnectionString("Portfolio")
    ?? throw new InvalidOperationException("Set DATABASE_URL (postgres://...) or ConnectionStrings:Portfolio."));

builder.Services.AddSingleton(NpgsqlDataSource.Create(connectionString));
builder.Services.AddSingleton<PortfolioContent>();
builder.Services.AddHealthChecks().AddCheck<DatabaseHealthCheck>("database");
builder.Services.AddProblemDetails();
builder.Services.AddOpenApi();
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    options.KnownIPNetworks.Clear();
    options.KnownProxies.Clear();
});

var app = builder.Build();

app.UseForwardedHeaders();
app.UseExceptionHandler();
app.MapOpenApi();
app.MapHealthChecks("/health");

var api = app.MapGroup("/api");
api.MapGet("/portfolio", async (PortfolioContent content, CancellationToken ct) => Results.Json(await content.DocumentAsync(ct)));
api.MapGet("/profile", async (PortfolioContent content, CancellationToken ct) => Results.Json(PortfolioViews.Profile(await content.DocumentAsync(ct), "ASP.NET Core")));
api.MapGet("/architecture", async (PortfolioContent content, CancellationToken ct) => Results.Json((await content.DocumentAsync(ct))["architecture"]));
api.MapGet("/work", async (PortfolioContent content, CancellationToken ct) => Results.Json(PortfolioViews.Work(await content.DocumentAsync(ct))));

app.Run();
