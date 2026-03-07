#!/bin/bash
# Setup script for new addon development
# Replace {{ADDON_NAME}} with your addon name
set -e
echo "Setting up addon development environment..."
npm install
echo "Done. Edit addon-manifest.json and package.json to customize your addon."
