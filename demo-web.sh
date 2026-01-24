#!/bin/bash

# Demo script to show Dyad Web App running

echo "================================================"
echo "Dyad Web Application - Startup Demo"
echo "================================================"
echo ""

# Check if dist directory exists
if [ ! -d "dist" ]; then
    echo "Building web client..."
    npm run web:client:build
    echo ""
fi

# Build server
echo "Building server..."
npm run web:server:build
echo ""

echo "Starting Dyad Web Server..."
echo ""
echo "Server will be available at: http://localhost:3000"
echo "WebSocket available at: ws://localhost:3000/ws"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""
echo "================================================"

# Start the server
npm run web:start
