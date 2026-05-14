import express from "express";
import { getPublicProfile, followUser } from "../controllers/userController.js";
import { authGuard } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/:id", getPublicProfile);
router.post("/:id/follow", authGuard, followUser);

export default router;