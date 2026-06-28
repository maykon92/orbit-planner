import express from "express";
import { authGuard } from "../middlewares/authMiddleware.js";

import {
  getWorkspaces,
  createWorkspace,
  createExpense,
  getExpenses,
  createSavingGoal,
  getSavingGoals,
  createContribution,
  inviteWorkspaceMember,
  updateExpense,
  deleteExpense,
  updateSavingGoal,
  deleteSavingGoal,
  upsertMonthlyBudget,
  getMonthlyBudgets,
} from "../controllers/financeController.js";

const router = express.Router();

router.use(authGuard);

router.get("/workspaces", getWorkspaces);
router.post("/workspaces", createWorkspace);

router.get("/expenses", getExpenses);
router.post("/expenses", createExpense);
router.put("/expenses/:expenseId", updateExpense);
router.delete("/expenses/:expenseId", deleteExpense);

router.get("/goals", getSavingGoals);
router.post("/goals", createSavingGoal);
router.post("/goals/:goalId/contributions", createContribution);
router.put("/goals/:goalId", updateSavingGoal);
router.delete("/goals/:goalId", deleteSavingGoal);
router.get("/budgets", getMonthlyBudgets);
router.post("/budgets", upsertMonthlyBudget);

router.post(
  "/workspaces/:workspaceId/invite",
  inviteWorkspaceMember
);

export default router;