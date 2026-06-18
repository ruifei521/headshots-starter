# SnapProHead — production deploy (git push → Vercel auto-deploy, or vercel CLI fallback)
# Run in PowerShell from repo root:
#   .\scripts\deploy-production.ps1

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

Write-Host "`n=== SnapProHead production deploy ===" -ForegroundColor Cyan

Write-Host "`n[1/5] Git status" -ForegroundColor Yellow
git status -sb
git diff --stat HEAD

$pending = git status --porcelain
if ($pending) {
    Write-Host "`n[2/5] Committing local changes..." -ForegroundColor Yellow
    git add -A
    git commit -m @"
Deploy: pricing copy, Astria UX, upload fixes, email notifications
"@
} else {
    Write-Host "`n[2/5] No uncommitted changes — skip commit" -ForegroundColor Green
}

Write-Host "`n[3/5] Vercel login check" -ForegroundColor Yellow
try {
    vercel whoami
} catch {
    Write-Host "Vercel CLI not logged in. Run: vercel login" -ForegroundColor Red
}

Write-Host "`n[4/5] Push to origin/main (triggers Vercel if GitHub connected)..." -ForegroundColor Yellow
$pushOk = $false
try {
    git push origin main
    if ($LASTEXITCODE -eq 0) { $pushOk = $true }
} catch {
    Write-Host "git push failed: $_" -ForegroundColor Red
}

if (-not $pushOk) {
    Write-Host "`n[4b] Fallback: vercel deploy --prod --yes" -ForegroundColor Yellow
    vercel deploy --prod --yes
}

Write-Host "`n[5/5] Verify live pricing copy (should show 10/20/30 outfit styles)..." -ForegroundColor Yellow
Start-Sleep -Seconds 30
try {
    $html = Invoke-WebRequest -Uri "https://snapprohead.com/pricing" -UseBasicParsing -TimeoutSec 30
    if ($html.Content -match "10 outfit styles") {
        Write-Host "OK: Live site shows new pricing copy." -ForegroundColor Green
    } elseif ($html.Content -match "20\+ outfits") {
        Write-Host "WARN: Live site still shows OLD copy (20+/40+/80+). Wait for Vercel build or check dashboard." -ForegroundColor Red
    } else {
        Write-Host "Could not detect pricing copy — check https://snapprohead.com/pricing manually." -ForegroundColor Yellow
    }
} catch {
    Write-Host "Could not fetch live site: $_" -ForegroundColor Yellow
}

Write-Host "`nDone. Check Vercel dashboard for build status." -ForegroundColor Cyan
