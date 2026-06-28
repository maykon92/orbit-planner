import express from "express";
import { authGuard } from "../middlewares/authMiddleware.js";
import { getWorkspace } from "../controllers/financeWorkspaceController.js";

const router = express.Router();

router.use(authGuard);

router.get("/:workspaceId", getWorkspace);

export default router;