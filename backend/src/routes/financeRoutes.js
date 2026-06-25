import express from "express";
import { authGuard } from "../middlewares/authMiddleware.js";

import {
  createExpense,
  getExpenses,
  createSavingGoal,
  getSavingGoals,
  createContribution,
} from "../controllers/financeController.js";

const router = express.Router();

router.use(authGuard);

router.post("/expenses", createExpense);
router.get("/expenses", getExpenses);

router.post("/goals", createSavingGoal);
router.get("/goals", getSavingGoals);

router.post("/goals/:goalId/contributions", createContribution);

export default router;