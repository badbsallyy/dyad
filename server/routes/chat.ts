import { Router } from "express";

export const chatRoutes = Router();

// List chats
chatRoutes.get("/", async (req, res) => {
  try {
    // TODO: Import and use the actual chat handlers from IPC
    res.json({ chats: [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get specific chat
chatRoutes.get("/:chatId", async (req, res) => {
  try {
    const { chatId } = req.params;
    // TODO: Import and use the actual chat handlers from IPC
    res.json({ chatId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new chat
chatRoutes.post("/", async (req, res) => {
  try {
    const chatData = req.body;
    // TODO: Import and use the actual chat handlers from IPC
    res.json({ success: true, chatId: "new-chat-id" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Note: Chat streaming is handled via WebSocket
