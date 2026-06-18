# SnapProHead — Vercel production deploy (PowerShell)
$ErrorActionPreference = "Continue"
Set-Location $PSScriptRoot\..

Write-Host "=== SnapProHead Vercel Production Deploy ===" -ForegroundColor Cyan
node scripts\vercel-deploy-now.mjs
Write-Host "EXIT_CODE: $LASTEXITCODE"

if (Test-Path deploy-result.txt) {
    Write-Host "`n--- deploy-result.txt ---" -ForegroundColor Yellow
    Get-Content deploy-result.txt
}
