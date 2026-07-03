import express from "express";
import {
  createOrGetConversation,
  getMyConversations,
  markConversationAsRead,
} from "../controllers/conversationController.js";
import { authGuard } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authGuard);

router.post("/", createOrGetConversation);
router.get("/", getMyConversations);
router.put("/:conversationId/read", markConversationAsRead);

export default router;