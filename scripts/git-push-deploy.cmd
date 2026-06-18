@echo off
setlocal
cd /d "%~dp0.."

echo ========================================
echo  SnapProHead - Git Push (Vercel auto-deploy)
echo ========================================
echo.

echo [1/4] git add...
git add -A
if errorlevel 1 goto fail

echo [2/4] git commit...
git commit -m "Deploy: pricing copy, Astria UX, upload fixes, email notifications"
if errorlevel 1 (
  echo No new commit or commit failed - continuing to pull/push...
)

echo [3/4] git pull origin main...
git pull origin main --no-edit
if errorlevel 1 (
  echo.
  echo CONFLICT or pull failed. Copy this window text and send to agent.
  goto end
)

echo [4/4] git push origin main...
git push origin main
if errorlevel 1 (
  echo.
  echo PUSH FAILED - GitHub login required.
  echo Open https://github.com/login in browser, then retry.
  echo Or create token: https://github.com/settings/tokens
  goto end
)

echo.
echo ========================================
echo SUCCESS - pushed to GitHub main
echo Vercel will auto-build in 1-3 min.
echo Check: https://vercel.com/dashboard
echo Verify: https://snapprohead.com/pricing
echo   should show "10 outfit styles" when Ready
echo ========================================
goto end

:fail
echo FAILED at git step.

:end
pause
endlocal
