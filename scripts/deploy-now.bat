@echo off
cd /d "%~dp0.."
echo === SnapProHead Vercel Production Deploy ===
node scripts\vercel-deploy-now.mjs
echo.
if exist deploy-result.txt type deploy-result.txt
echo.
pause
