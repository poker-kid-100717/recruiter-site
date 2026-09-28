using System.Text.Json.Nodes;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Npgsql;

namespace Portfolio.Api;

/// <summary>Reads the page document built by the database's portfolio_document() function.</summary>
public sealed class PortfolioContent(NpgsqlDataSource dataSource)
{
    public async Task<JsonNode> DocumentAsync(CancellationToken ct)
    {
        await using var command = dataSource.CreateCommand("select portfolio_document()::text");
        var json = (string?)await command.ExecuteScalarAsync(ct)
            ?? throw new InvalidOperationException("portfolio_document() returned no rows; run db/migrate.mjs and db/seed.mjs.");
        return JsonNode.Parse(json)!;
    }
}

/// <summary>The small legacy endpoints; mirrors profileView/workView in frontend/worker/content.js.</summary>
public static class PortfolioViews
{
    public static JsonObject Profile(JsonNode doc, string runtime)
    {
        var profile = doc["profile"]!;
        return new JsonObject
        {
            ["name"] = profile["name"]!.DeepClone(),
            ["title"] = profile["title"]!.DeepClone(),
            ["location"] = profile["location"]!.DeepClone(),
            ["focus"] = profile["focus"]!.DeepClone(),
            ["stack"] = profile["stack"]!.DeepClone(),
            ["delivery"] = profile["delivery"]!.DeepClone(),
            ["runtime"] = runtime
        };
    }

    public static JsonArray Work(JsonNode doc)
    {
        var work = new JsonArray();
        foreach (var project in doc["projects"]!.AsArray())
        {
            var status = (string)project!["status"]!;
            work.Add(new JsonObject
            {
                ["name"] = project["title"]!.DeepClone(),
                ["type"] = project["eyebrow"]!.DeepClone(),
                ["publicSource"] = !(bool)project["professional"]!,
                ["repository"] = project["repository"]?.DeepClone(),
                ["demo"] = status == "Verified live" ? project["demo"]?.DeepClone() : null,
                ["status"] = status
            });
        }
        return work;
    }
}

public sealed class DatabaseHealthCheck(NpgsqlDataSource dataSource) : IHealthCheck
{
    public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken ct = default)
    {
        try
        {
            await using var command = dataSource.CreateCommand("select 1");
            await command.ExecuteScalarAsync(ct);
            return HealthCheckResult.Healthy();
        }
        catch (Exception ex) when (ex is NpgsqlException or TimeoutException)
        {
            return HealthCheckResult.Unhealthy("database unreachable");
        }
    }
}

/// <summary>Accepts either an Npgsql connection string or a postgres:// URL (the Neon/Worker format).</summary>
public static class PostgresUrl
{
    public static string ToConnectionString(string value)
    {
        if (!value.StartsWith("postgres://") && !value.StartsWith("postgresql://")) return value;

        var uri = new Uri(value);
        var userInfo = uri.UserInfo.Split(':', 2);
        var builder = new NpgsqlConnectionStringBuilder
        {
            Host = uri.Host,
            Port = uri.IsDefaultPort ? 5432 : uri.Port,
            Database = uri.AbsolutePath.TrimStart('/'),
            Username = Uri.UnescapeDataString(userInfo[0]),
            Password = userInfo.Length > 1 ? Uri.UnescapeDataString(userInfo[1]) : null
        };
        var query = System.Web.HttpUtility.ParseQueryString(uri.Query);
        if (query["sslmode"] is { } sslMode) builder.SslMode = Enum.Parse<SslMode>(sslMode, ignoreCase: true);
        return builder.ConnectionString;
    }
}
