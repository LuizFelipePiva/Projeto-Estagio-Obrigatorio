import { Router } from "express";

import {
  createConversation,
  deleteConversation,
  getConversations,
  getMessages,
  sendMessage,
} from "../controllers/chat.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

router.get("/conversations", authMiddleware, getConversations);
router.post("/conversations", authMiddleware, createConversation);
router.get("/conversations/:id_conversa/messages", authMiddleware, getMessages);
router.post("/conversations/:id_conversa/messages", authMiddleware, sendMessage);
router.delete("/conversations/:id_conversa", authMiddleware, deleteConversation);

export default router;
