@echo off
title GPS Tracker - Build Android APK
echo ============================================
echo   GPS Tracker - Build Android APK
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

REM Navigate to script directory
cd /d "%~dp0"

REM Install dependencies if needed
if not exist "node_modules\" (
    echo [INFO] Installing dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install dependencies.
        pause
        exit /b 1
    )
    echo.
)

REM Check if eas-cli is available
call npx eas --version >nul 2>nul
if %errorlevel% neq 0 (
    echo [INFO] Installing EAS CLI...
    call npm install -g eas-cli
    echo.
)

echo [INFO] Starting Android APK build (cloud)...
echo [INFO] If this is your first time, you will be prompted to:
echo        1. Log in with your Expo account (free at https://expo.dev)
echo        2. Confirm the build configuration
echo.
echo ============================================
echo.

call npx eas build --platform android --profile preview

echo.
echo ============================================
echo [INFO] Build complete!
echo [INFO] Download the APK from the URL shown above.
echo [INFO] Install it on your Android device to test.
echo ============================================
pause
