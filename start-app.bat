@echo off
echo ========================================================
echo        Starting IMovies Cinema Ticket Platform
echo ========================================================
echo.
start "IMovies Backend (Port 5000)" cmd /k "cd /d %~dp0backend && node server.js"
timeout /t 3 >nul
start "IMovies Frontend (Port 5173)" cmd /k "cd /d %~dp0frontend && npm run dev"
echo.
echo Both servers are launching!
echo Backend API:  http://localhost:5000
echo Frontend UI:  http://localhost:5173
echo.
timeout /t 2 >nul
start http://localhost:5173
exit
