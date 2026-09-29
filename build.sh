#!/usr/bin/env bash
# Exit on error
set -o errexit

echo "=========================================="
echo "  FixConnect: Building for Render..."
echo "=========================================="

# 1. Install frontend dependencies and build React bundle
echo "==> Building frontend with Vite..."
npm --prefix frontend install
npm --prefix frontend run build

# 2. Install backend Python dependencies
echo "==> Installing Python dependencies..."
python -m pip install --upgrade pip
python -m pip install -r backend/requirements.txt

echo "=========================================="
echo "  Build completed successfully!"
echo "=========================================="
