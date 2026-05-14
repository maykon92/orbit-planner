import express from "express";
import {
  createOrGetConversation,
  getMyConversations,
} from "../controllers/conversationController.js";
import { authGuard } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authGuard);

router.post("/", createOrGetConversation);
router.get("/", getMyConversations);

export default router;