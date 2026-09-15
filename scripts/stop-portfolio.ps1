$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

docker compose down
Write-Host 'Portfolio stack stopped.' -ForegroundColor Green
