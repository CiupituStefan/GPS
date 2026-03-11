#!/bin/bash
echo "============================================"
echo "  GPS Tracker - Build Android APK"
echo "============================================"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed."
    echo "        Please install it from https://nodejs.org"
    exit 1
fi

# Navigate to script directory
cd "$(dirname "$0")"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "[INFO] Installing dependencies..."
    npm install || { echo "[ERROR] npm install failed."; exit 1; }
    echo ""
fi

# Check if eas-cli is available
if ! npx eas --version &> /dev/null; then
    echo "[INFO] Installing EAS CLI..."
    npm install -g eas-cli
    echo ""
fi

echo "[INFO] Starting Android APK build (cloud)..."
echo "[INFO] If this is your first time, you will be prompted to:"
echo "       1. Log in with your Expo account (free at https://expo.dev)"
echo "       2. Confirm the build configuration"
echo ""
echo "============================================"
echo ""

npx eas build --platform android --profile preview

echo ""
echo "============================================"
echo "[INFO] Build complete!"
echo "[INFO] Download the APK from the URL shown above."
echo "[INFO] Install it on your Android device to test."
echo "============================================"
