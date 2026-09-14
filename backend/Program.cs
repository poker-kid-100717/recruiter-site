var builder = WebApplication.CreateBuilder(args);
builder.Services.AddHealthChecks();
builder.Services.AddOpenApi();
builder.Services.AddCors(options => options.AddDefaultPolicy(policy => policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();
app.UseCors();
app.MapOpenApi();
app.MapHealthChecks("/health");
app.MapGet("/api/profile", () => Results.Ok(new
{
    name = "Joshua Davis",
    title = "Senior Full-Stack Software Engineer",
    focus = new[] { "Application Architecture", "Full-Stack Delivery", "Technical Leadership" },
    stack = new[] { ".NET 10", "ASP.NET Core", "Angular", "TypeScript", "SQL Server", "EF Core", "Azure", "AWS", "Docker", "GitHub Actions" }
}));
app.Run();
