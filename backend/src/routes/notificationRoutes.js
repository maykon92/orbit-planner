import express from "express";
import {
  getNotifications,
  readNotification,
  readAllNotifications,
} from "../controllers/notificationController.js";

import { authGuard } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authGuard, getNotifications);
router.patch("/:id/read", authGuard, readNotification);
router.patch("/read-all", authGuard, readAllNotifications);

export default router;