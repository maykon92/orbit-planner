import express from "express";
import {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
} from "../controllers/authController.js";

import { authGuard } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", authGuard, getMe);
router.put("/profile", authGuard, updateProfile);

export default router;