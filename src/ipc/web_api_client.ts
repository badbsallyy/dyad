/**
 * Web API Client - Replaces Electron IPC with HTTP/WebSocket calls
 * This client provides the same interface as the Electron IPC client but uses web APIs
 */

// Use environment variables with fallbacks for different environments
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? window.location.origin + "/api" : "http://localhost:3000/api");
const WS_URL = import.meta.env.VITE_WS_URL || 
  (import.meta.env.PROD ? `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws` : "ws://localhost:3000/ws");

type WebSocketListener = (data: any) => void;

class WebApiClient {
  private static instance: WebApiClient;
  private ws: WebSocket | null = null;
  private wsListeners: Map<string, Set<WebSocketListener>> = new Map();
  private wsReconnectTimeout: number | null = null;

  private constructor() {
    this.connectWebSocket();
  }

  static getInstance(): WebApiClient {
    if (!WebApiClient.instance) {
      WebApiClient.instance = new WebApiClient();
    }
    return WebApiClient.instance;
  }

  private connectWebSocket() {
    try {
      this.ws = new WebSocket(WS_URL);

      this.ws.onopen = () => {
        console.log("WebSocket connected");
        if (this.wsReconnectTimeout) {
          clearTimeout(this.wsReconnectTimeout);
          this.wsReconnectTimeout = null;
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          this.notifyListeners(message.type, message.payload);
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      };

      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      this.ws.onclose = () => {
        console.log("WebSocket disconnected, attempting to reconnect...");
        this.ws = null;
        // Attempt to reconnect after 3 seconds
        this.wsReconnectTimeout = window.setTimeout(() => {
          this.connectWebSocket();
        }, 3000);
      };
    } catch (error) {
      console.error("Failed to connect WebSocket:", error);
    }
  }

  private notifyListeners(type: string, payload: any) {
    const listeners = this.wsListeners.get(type);
    if (listeners) {
      listeners.forEach(listener => listener(payload));
    }
  }

  private sendWebSocketMessage(type: string, payload: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }));
    } else {
      const status = this.ws ? ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'][this.ws.readyState] : 'NOT_INITIALIZED';
      const error = `WebSocket not ready (status: ${status}). Please wait for connection or try again.`;
      console.error(error);
      throw new Error(error);
    }
  }

  // Subscribe to WebSocket events
  on(channel: string, listener: WebSocketListener): () => void {
    if (!this.wsListeners.has(channel)) {
      this.wsListeners.set(channel, new Set());
    }
    this.wsListeners.get(channel)!.add(listener);

    // Return unsubscribe function
    return () => {
      const listeners = this.wsListeners.get(channel);
      if (listeners) {
        listeners.delete(listener);
      }
    };
  }

  // HTTP API methods
  private async fetch(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(error.error || "Request failed");
    }

    return response.json();
  }

  // Settings API
  async getUserSettings() {
    return this.fetch("/settings");
  }

  async setUserSettings(settings: any) {
    return this.fetch("/settings", {
      method: "PATCH",
      body: JSON.stringify(settings),
    });
  }

  // Apps API
  async listApps() {
    return this.fetch("/apps");
  }

  async getApp(appId: string) {
    return this.fetch(`/apps/${appId}`);
  }

  async createApp(appData: any) {
    return this.fetch("/apps", {
      method: "POST",
      body: JSON.stringify(appData),
    });
  }

  async deleteApp(appId: string) {
    return this.fetch(`/apps/${appId}`, {
      method: "DELETE",
    });
  }

  // Chats API
  async listChats() {
    return this.fetch("/chats");
  }

  async getChat(chatId: string) {
    return this.fetch(`/chats/${chatId}`);
  }

  async createChat(chatData: any) {
    return this.fetch("/chats", {
      method: "POST",
      body: JSON.stringify(chatData),
    });
  }

  // Chat streaming via WebSocket
  startChatStream(payload: any) {
    this.sendWebSocketMessage("chat:stream", payload);
  }

  cancelChat(payload: any) {
    this.sendWebSocketMessage("chat:cancel", payload);
  }

  // WebSocket event listeners
  onChatStreamChunk(listener: (data: any) => void) {
    return this.on("chat:response:chunk", listener);
  }

  onChatStreamEnd(listener: (data: any) => void) {
    return this.on("chat:response:end", listener);
  }

  onChatStreamError(listener: (data: any) => void) {
    return this.on("chat:response:error", listener);
  }

  onChatStreamStart(listener: (chatId: string) => void) {
    return this.on("chat:stream:start", listener);
  }

  // Stubs for other methods - these would need full implementation
  onMcpToolConsentRequest(listener: (data: any) => void) {
    return this.on("mcp:tool-consent-request", listener);
  }

  respondToMcpConsentRequest(requestId: string, decision: any) {
    this.sendWebSocketMessage("mcp:tool-consent-response", { requestId, decision });
  }

  onAgentToolConsentRequest(listener: (data: any) => void) {
    return this.on("agent-tool:consent-request", listener);
  }

  onAgentTodosUpdate(listener: (data: any) => void) {
    return this.on("agent-tool:todos-update", listener);
  }

  onAgentProblemsUpdate(listener: (data: any) => void) {
    return this.on("agent-tool:problems-update", listener);
  }

  onTelemetryEvent(listener: (data: any) => void) {
    return this.on("telemetry:event", listener);
  }

  // Window controls (no-op for web)
  async minimizeWindow() {
    console.warn("Window control not available in web version");
  }

  async maximizeWindow() {
    console.warn("Window control not available in web version");
  }

  async closeWindow() {
    console.warn("Window control not available in web version");
  }

  async getSystemPlatform() {
    return { platform: "web" };
  }

  async getAppVersion() {
    return { version: "0.34.0-beta.1-web" };
  }
}

export const WebIpcClient = WebApiClient;
