import express from "express";
import { sendMessage, getMessages, readConversationMessages } from "../controllers/messageController.js";
import { authGuard } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authGuard);

router.post("/", sendMessage);
router.get("/:conversationId", getMessages);
router.put("/conversations/:conversationId/read", readConversationMessages);

export default router;