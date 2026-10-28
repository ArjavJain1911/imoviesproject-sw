@echo off
title IMovies Launcher
echo ========================================================
echo        Starting IMovies Cinema Ticket Platform
echo ========================================================
echo.

REM Clear any stale processes on ports 5000 and 5173
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000 ^| findstr LISTENING') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do taskkill /f /pid %%a >nul 2>&1

echo [1/3] Starting Backend API on port 5000...
start "IMovies Backend (Port 5000)" cmd /k "cd /d %~dp0backend && node server.js"
timeout /t 3 >nul

echo [2/3] Starting Frontend Client on port 5173...
start "IMovies Frontend (Port 5173)" cmd /k "cd /d %~dp0frontend && npm.cmd run dev"
timeout /t 2 >nul

echo [3/3] Opening browser...
start http://localhost:3000

echo.
echo ========================================================
echo   Application is running!
echo   Frontend:  http://localhost:3000
echo   Backend:   http://localhost:5000
echo ========================================================
echo.
