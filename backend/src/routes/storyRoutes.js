import express from "express";

import {
  createStory,
  getStories,
  viewStory,
  deleteStory,
  likeStory,
  replyToStory,
  getReplies,
  readStoryReplies,
} from "../controllers/storyController.js";

import { authGuard } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authGuard);

router.get("/", getStories);
router.post("/", createStory);

router.put("/:storyId/view", viewStory);
router.put("/:storyId/like", likeStory);

router.post("/:storyId/replies", replyToStory);
router.get("/:storyId/replies", getReplies);
router.put("/:storyId/replies/read", readStoryReplies);

router.delete("/:storyId", deleteStory);

export default router;