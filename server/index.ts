import express from "express";
import cors from "cors";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import path from "path";
import dotenv from "dotenv";
import { initializeDatabase } from "../src/db";
import { registerApiRoutes } from "./routes";
import { setupWebSocketHandlers } from "./websocket";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Initialize database
initializeDatabase();

// Register API routes
registerApiRoutes(app);

// Serve static files from the dist directory (built frontend)
const distPath = path.join(__dirname, "../dist");
app.use(express.static(distPath));

// Fallback to index.html for SPA routing
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// Create HTTP server
const server = createServer(app);

// Setup WebSocket server for streaming
const wss = new WebSocketServer({ server, path: "/ws" });
setupWebSocketHandlers(wss);

server.listen(PORT, () => {
  console.log(`Dyad Web Server running on http://localhost:${PORT}`);
  console.log(`WebSocket server available at ws://localhost:${PORT}/ws`);
});
