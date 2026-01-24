import { Router } from "express";

export const appRoutes = Router();

// List all apps
appRoutes.get("/", async (req, res) => {
  try {
    // TODO: Import and use the actual app handlers from IPC
    res.json({ apps: [] });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});

// Get specific app
appRoutes.get("/:appId", async (req, res) => {
  try {
    const { appId } = req.params;
    // TODO: Import and use the actual app handlers from IPC
    res.json({ appId });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});

// Create new app
appRoutes.post("/", async (req, res) => {
  try {
    const appData = req.body;
    // TODO: Import and use the actual app handlers from IPC
    res.json({ success: true, appId: "new-app-id" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});

// Delete app
appRoutes.delete("/:appId", async (req, res) => {
  try {
    const { appId } = req.params;
    // TODO: Import and use the actual app handlers from IPC
    res.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});
