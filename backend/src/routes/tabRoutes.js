import express from "express";
import {
  createTab,
  getTabs,
  getTabById,
  updateTab,
  deleteTab,
} from "../controllers/tabController.js";

import { authGuard } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authGuard);

router.post("/", createTab);
router.get("/", getTabs);
router.get("/:id", getTabById);
router.put("/:id", updateTab);
router.delete("/:id", deleteTab);

export default router;