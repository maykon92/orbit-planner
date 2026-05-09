import express from "express";
import {
  createPost,
  getMyPosts,
  getPublicFeed,
  updatePost,
  deletePost,
  likePost,
  addComment,
} from "../controllers/postController.js";

import { authGuard } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/feed", getPublicFeed);

router.use(authGuard);

router.post("/", createPost);
router.get("/my-posts", getMyPosts);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);
router.post("/:id/like", likePost);
router.post("/:id/comments", addComment);

export default router;