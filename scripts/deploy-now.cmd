@echo off
setlocal EnableDelayedExpansion
cd /d "%~dp0.."

echo ========================================
echo  SnapProHead - One-Click Vercel Deploy
echo ========================================
echo.

echo [1/4] Installing Vercel CLI 54.9.1...
call npm install vercel@54.9.1 --save-dev --no-fund --no-audit --registry https://registry.npmjs.org
if errorlevel 1 (
  echo Retry with default registry...
  call npm install vercel@54.9.1 --save-dev --no-fund --no-audit
)
if errorlevel 1 (
  echo FAILED: npm install
  goto end
)

echo.
echo [2/4] CLI version:
call node_modules\.bin\vercel.cmd --version
echo.

if not exist .vercel-token.local (
  echo FAILED: Missing .vercel-token.local
  goto end
)

set /p VERCEL_TOKEN=<.vercel-token.local
echo [3/4] Account check:
call node_modules\.bin\vercel.cmd whoami --token !VERCEL_TOKEN!
if errorlevel 1 (
  echo FAILED: Invalid token - create new one at vercel.com/account/tokens
  goto end
)

echo.
echo [4/4] Deploying to PRODUCTION (may take 5-10 min)...
call node_modules\.bin\vercel.cmd deploy --prod --yes --token !VERCEL_TOKEN!
set DEPLOY_EXIT=!ERRORLEVEL!

echo.
echo ========================================
if !DEPLOY_EXIT! equ 0 (
  echo SUCCESS - check Production URL above
) else (
  echo FAILED - exit code !DEPLOY_EXIT!
)
echo ========================================

:end
pause
endlocal
