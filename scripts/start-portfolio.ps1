param(
    [switch]$NoBrowser
)

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

Write-Host 'Building and starting Joshua Davis portfolio...' -ForegroundColor Cyan
docker compose up -d --build

Write-Host 'Waiting for the portfolio gateway...' -ForegroundColor Cyan
$deadline = (Get-Date).AddMinutes(2)
do {
    try {
        $response = Invoke-WebRequest -UseBasicParsing -Uri 'http://localhost:8080/healthz' -TimeoutSec 3
        if ($response.StatusCode -eq 200) { break }
    }
    catch { Start-Sleep -Seconds 2 }
} while ((Get-Date) -lt $deadline)

if ((Get-Date) -ge $deadline) {
    docker compose ps
    throw 'Portfolio did not become healthy at http://localhost:8080/healthz'
}

$api = Invoke-RestMethod -Uri 'http://localhost:8080/api/profile' -TimeoutSec 5
Write-Host "Portfolio is healthy. API profile: $($api.name) - $($api.title)" -ForegroundColor Green
Write-Host 'Local URL: http://localhost:8080' -ForegroundColor Green

if (-not $NoBrowser) {
    Start-Process 'http://localhost:8080'
}
