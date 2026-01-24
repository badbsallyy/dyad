import fs from "node:fs";
import path from "node:path";
import { getUserDataPath } from "../src/paths/paths.js";
import {
  UserSettingsSchema,
  type UserSettings,
} from "../src/lib/schemas.js";
import { v4 as uuidv4 } from "uuid";
import { DEFAULT_TEMPLATE_ID } from "../src/shared/templates.js";
import { DEFAULT_THEME_ID } from "../src/shared/themes.js";

// Web-compatible settings (no Electron dependencies)

const DEFAULT_SETTINGS: UserSettings = {
  selectedModel: {
    name: "auto",
    provider: "auto",
  },
  providerSettings: {},
  telemetryConsent: "unset",
  telemetryUserId: uuidv4(),
  hasRunBefore: false,
  experiments: {},
  isRunning: false,
  enableAutoUpdate: false,
  releaseChannel: "stable",
  enableNativeGit: false,
  checkForProblems: "on-demand",
  selectedTheme: DEFAULT_THEME_ID,
  defaultTemplate: DEFAULT_TEMPLATE_ID,
  localModels: {
    ollama: { enabled: false, baseUrl: "http://localhost:11434" },
    lmstudio: { enabled: false, baseUrl: "http://localhost:1234" },
  },
  zoomFactor: 1,
  isTestMode: false,
  githubPersonalAccessToken: null,
  openaiKey: null,
  anthropicKey: null,
  googleKey: null,
  vertexSettings: null,
  azureSettings: null,
  amazonSettings: null,
  groqKey: null,
  deepseekKey: null,
  xaiKey: null,
  aiSettings: null,
};

export function getSettingsFilePath(): string {
  const userDataPath = getUserDataPath();
  return path.join(userDataPath, "settings.json");
}

export function readSettings(): UserSettings {
  const settingsPath = getSettingsFilePath();
  
  if (!fs.existsSync(settingsPath)) {
    // Create default settings
    const userDataPath = getUserDataPath();
    if (!fs.existsSync(userDataPath)) {
      fs.mkdirSync(userDataPath, { recursive: true });
    }
    
    fs.writeFileSync(settingsPath, JSON.stringify(DEFAULT_SETTINGS, null, 2));
    return DEFAULT_SETTINGS;
  }

  try {
    const rawData = fs.readFileSync(settingsPath, "utf-8");
    const parsedData = JSON.parse(rawData);
    
    // Merge with defaults to ensure all fields are present
    const settings = {
      ...DEFAULT_SETTINGS,
      ...parsedData,
    };
    
    // Validate with schema
    return UserSettingsSchema.parse(settings);
  } catch (error) {
    console.error("Failed to read settings:", error);
    return DEFAULT_SETTINGS;
  }
}

export function writeSettings(updates: Partial<UserSettings>): void {
  const settingsPath = getSettingsFilePath();
  const currentSettings = readSettings();
  
  const newSettings = {
    ...currentSettings,
    ...updates,
  };
  
  try {
    fs.writeFileSync(settingsPath, JSON.stringify(newSettings, null, 2));
  } catch (error) {
    console.error("Failed to write settings:", error);
    throw error;
  }
}
