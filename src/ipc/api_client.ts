/**
 * Platform-agnostic client adapter
 * Automatically uses Electron IPC or Web API based on environment
 */

// Check if we're in an Electron environment
const isElectron = typeof window !== "undefined" && window.electron !== undefined;

let ClientClass: any;

if (isElectron) {
  // Use Electron IPC client
  const { IpcClient } = await import("./ipc_client");
  ClientClass = IpcClient;
} else {
  // Use Web API client
  const { WebIpcClient } = await import("./web_api_client");
  ClientClass = WebIpcClient;
}

// Export the appropriate client
export const ApiClient = ClientClass;
export type { IpcClient as ApiClientType } from "./ipc_client";
