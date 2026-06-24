import express from "express";
import { getPublicProfile, followUser, searchProfiles } from "../controllers/userController.js";
import { authGuard } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/search", authGuard, searchProfiles);
router.get("/:id", getPublicProfile);
router.post("/:id/follow", authGuard, followUser);

export default router;