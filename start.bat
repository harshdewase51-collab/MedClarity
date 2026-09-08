@echo off
title MedClarity - Launching Full-Stack Application
color 0b

echo ===================================================
echo        Starting MedClarity Medical Platform
echo ===================================================
echo.

echo [1/2] Launching FastAPI Clinical Backend on http://127.0.0.1:8000 ...
start "MedClarity Backend API" cmd /k "cd backend && python -m uvicorn app.main:app --host 127.0.0.1 --port 8000"

echo [2/2] Launching Vite Modern Frontend on http://localhost:5173 ...
start "MedClarity Frontend UI" cmd /k "cd frontend && npm run dev"

echo.
echo ===================================================
echo  Both services are running!
echo  - Frontend: http://localhost:5173
echo  - Backend API: http://127.0.0.1:8000/docs
echo ===================================================
echo.
pause
