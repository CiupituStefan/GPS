#!/bin/bash
echo "============================================"
echo "  GPS Tracker - Starting Development Server"
echo "============================================"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed."
    echo "        Please install it from https://nodejs.org"
    exit 1
fi

echo "[INFO] Node.js version: $(node --version)"
echo ""

# Navigate to script directory
cd "$(dirname "$0")"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "[INFO] Installing dependencies..."
    echo "       This may take a few minutes on first run."
    echo ""
    npm install || { echo "[ERROR] npm install failed."; exit 1; }
    echo ""
    echo "[INFO] Dependencies installed successfully."
    echo ""
fi

echo "[INFO] Starting Expo dev server with web..."
echo "[INFO] The web app will open automatically in your browser."
echo "[INFO] Press Ctrl+C to stop the server."
echo ""
echo "============================================"
echo ""

npx expo start --web
