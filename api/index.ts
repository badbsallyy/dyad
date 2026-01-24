import express from "express";
import cors from "cors";
import { initializeDatabase } from "../src/db";
import { registerApiRoutes } from "../server/routes";

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Initialize database
let databaseInitialized = false;
try {
  initializeDatabase();
  databaseInitialized = true;
} catch (error) {
  console.error("Failed to initialize database:", error);
  // Database will remain uninitialized - API routes should handle this gracefully
}

// Register API routes (includes health check)
registerApiRoutes(app);

// Export the Express app as a serverless function
export default app;
