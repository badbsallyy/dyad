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

echo "Starting Dyad Web Server..."
echo ""
echo "Server will be available at: http://localhost:3000"
echo "WebSocket available at: ws://localhost:3000/ws"
echo ""
echo "API Endpoints:"
echo "  GET http://localhost:3000/api/health"
echo "  GET http://localhost:3000/api/settings"
echo "  GET http://localhost:3000/api/apps"
echo "  GET http://localhost:3000/api/chats"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""
echo "================================================"

# Start the server
npm run web:start
