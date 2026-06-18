# Set Resend on Vercel production and deploy SnapProHead.
# Usage (from repo root):
#   $env:RESEND_API_KEY = "re_your_production_key"
#   .\scripts\deploy-with-resend.ps1
#
# Optional:
#   $env:VERCEL_TOKEN = "your_vercel_token"

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $Root

if (-not $env:RESEND_API_KEY) {
  Write-Error "Set RESEND_API_KEY first (production key from resend.com/api-keys)."
}

$fromEmail = if ($env:RESEND_FROM_EMAIL) { $env:RESEND_FROM_EMAIL } else { "SnapProHead <contact@snapprohead.com>" }

Write-Host "Linking Vercel project snapprohead..."
vercel link --project snapprohead --yes

Write-Host "Setting RESEND_API_KEY on production..."
$env:RESEND_API_KEY | vercel env add RESEND_API_KEY production --force

Write-Host "Setting RESEND_FROM_EMAIL on production..."
$fromEmail | vercel env add RESEND_FROM_EMAIL production --force

Write-Host "Deploying to production..."
vercel deploy --prod --yes

Write-Host "Done. Verify RESEND_API_KEY in Vercel dashboard > snapprohead > Settings > Environment Variables."
