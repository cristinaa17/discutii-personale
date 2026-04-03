@echo off
chcp 65001 >nul
cd /d "%~dp0"
start "App" cmd /k "npm run dev"
exit /b 0
