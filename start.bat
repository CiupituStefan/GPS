@echo off
title GPS Tracker - Development Server
echo ============================================
echo   GPS Tracker - Starting Development Server
echo ============================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed.
    echo         Please install it from https://nodejs.org
    pause
    exit /b 1
)

echo [INFO] Node.js version:
call node --version
echo.

REM Navigate to script directory
cd /d "%~dp0"

REM Check if node_modules exists, install if not
if not exist "node_modules\" (
    echo [INFO] Installing dependencies...
    echo        This may take a few minutes on first run.
    echo.
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install dependencies.
        pause
        exit /b 1
    )
    echo.
    echo [INFO] Dependencies installed successfully.
    echo.
)

echo [INFO] Starting Expo dev server with web...
echo [INFO] The web app will open automatically in your browser.
echo [INFO] Press Ctrl+C to stop the server.
echo.
echo ============================================
echo.

call npx expo start --web

pause
