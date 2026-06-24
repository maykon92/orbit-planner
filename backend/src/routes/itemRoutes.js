import express from "express";
import {
  createItem,
  getItemsByTab,
  getItemById,
  updateItem,
  deleteItem,
  getUpcomingEvents,
} from "../controllers/itemController.js";

import { authGuard } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authGuard);

router.post("/", createItem);
router.get("/tab/:tabId", getItemsByTab);
router.get("/upcoming", authGuard, getUpcomingEvents);
router.get("/:id", getItemById);
router.put("/:id", updateItem);
router.delete("/:id", deleteItem);

export default router;