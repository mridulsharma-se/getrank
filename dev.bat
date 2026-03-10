@echo off
REM #########################################################################
REM GetRank Development Startup Script for Windows
REM Starts both Django backend and Next.js frontend servers
REM Usage: dev.bat
REM #########################################################################

setlocal enabledelayedexpansion

cls
echo.
echo ========================================
echo   GetRank Development Startup
echo ========================================
echo.

REM Check Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python not found
    echo Please install Python 3.8+: https://python.org
    echo.
    pause
    exit /b 1
)
for /f "tokens=2" %%i in ('python --version 2^>^&1') do set PYTHON_VERSION=%%i
echo [OK] Python %PYTHON_VERSION%

REM Check Node is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js not found
    echo Please install Node.js 16+: https://nodejs.org
    echo.
    pause
    exit /b 1
)
for /f %%i in ('node --version 2^>^&1') do set NODE_VERSION=%%i
echo [OK] Node.js %NODE_VERSION%
echo.

REM Setup backend
echo Setting up backend...
if not exist "backend\venv" (
    cd backend
    python -m venv venv
    cd ..
)

cd backend
call venv\Scripts\activate.bat
python -m pip install --upgrade pip -q >nul 2>&1
pip install -r requirements.txt -q >nul 2>&1
cd ..
echo [OK] Backend dependencies installed

REM Setup frontend
echo Setting up frontend...
cd frontend
npm install -q >nul 2>&1
cd ..
echo [OK] Frontend dependencies installed
echo.

REM Summary
echo ========================================
echo   Servers Starting:
echo   Frontend: http://localhost:3000
echo   Backend: http://localhost:8000
echo ========================================
echo.
echo Starting servers (Ctrl+C to stop)...
echo.

REM Start backend in a new window
echo Starting backend...
cd backend
start "GetRank Backend" cmd /k "call venv\Scripts\activate.bat && python manage.py runserver 8000"
cd ..

REM Wait a bit for backend to start
timeout /t 2 /nobreak >nul

REM Start frontend in a new window
echo Starting frontend...
cd frontend
start "GetRank Frontend" cmd /k "npm run dev"
cd ..

echo.
echo [OK] Both servers are starting!
echo.
echo Frontend: http://localhost:3000
echo Backend: http://localhost:8000
echo.
echo Close the server windows to stop them.
echo.

pause
