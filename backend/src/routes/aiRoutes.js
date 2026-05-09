import express from "express";
import { suggest } from "../controllers/aiController.js";
import { authGuard } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/suggest", authGuard, suggest);

export default router;