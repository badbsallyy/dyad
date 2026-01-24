import { Express } from "express";
import { appRoutes } from "./app";
import { chatRoutes } from "./chat";
import { settingsRoutes } from "./settings";

export function registerApiRoutes(app: Express) {
  // API routes prefix
  app.use("/api/apps", appRoutes);
  app.use("/api/chats", chatRoutes);
  app.use("/api/settings", settingsRoutes);
  
  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", version: "0.34.0-beta.1" });
  });
}
