import { Router } from "express";
import { readSettings, writeSettings } from "../settings";

export const settingsRoutes = Router();

// Get user settings
settingsRoutes.get("/", async (req, res) => {
  try {
    const settings = readSettings();
    res.json(settings);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});

// Update user settings
settingsRoutes.patch("/", async (req, res) => {
  try {
    const updates = req.body;
    writeSettings(updates);
    const settings = readSettings();
    res.json(settings);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});
