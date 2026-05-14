import express from "express";
import { sendMessage, getMessages } from "../controllers/messageController.js";
import { authGuard } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authGuard);

router.post("/", sendMessage);
router.get("/:conversationId", getMessages);

export default router;