import {
  getOrCreatePersonalWorkspace,
  getUserFinanceWorkspaces,
  createUserFinanceWorkspace,
  createUserExpense,
  getUserExpenses,
  createUserSavingGoal,
  getUserSavingGoals,
  addSavingContribution,
  inviteUserToFinanceWorkspace,
  updateUserExpense,
  deleteUserExpense,
  updateUserSavingGoal,
  deleteUserSavingGoal,
  createOrUpdateMonthlyBudget,
  getWorkspaceMonthlyBudgets,
} from "../services/financeService.js";

const resolveWorkspaceId = async (req) => {
  if (req.params?.workspaceId) return req.params.workspaceId;
  if (req.body?.workspaceId) return req.body.workspaceId;
  if (req.query?.workspaceId) return req.query.workspaceId;

  const personalWorkspace = await getOrCreatePersonalWorkspace(req.user._id);

  return personalWorkspace._id;
};

export const getWorkspaces = async (req, res) => {
  try {
    await getOrCreatePersonalWorkspace(req.user._id);

    const workspaces = await getUserFinanceWorkspaces(req.user._id);

    res.json(workspaces);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createWorkspace = async (req, res) => {
  try {
    const { name, type = "shared" } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Workspace name is required.",
      });
    }

    const workspace = await createUserFinanceWorkspace({
      userId: req.user._id,
      name,
      type,
    });

    res.status(201).json(workspace);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createExpense = async (req, res) => {
  try {
    const workspaceId = await resolveWorkspaceId(req);

    const expense = await createUserExpense({
      userId: req.user._id,
      workspaceId,
      ...req.body,
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getExpenses = async (req, res) => {
  try {
    const workspaceId = await resolveWorkspaceId(req);

    const expenses = await getUserExpenses({
      userId: req.user._id,
      workspaceId,
    });

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createSavingGoal = async (req, res) => {
  try {
    const workspaceId = await resolveWorkspaceId(req);

    const goal = await createUserSavingGoal({
      userId: req.user._id,
      workspaceId,
      ...req.body,
    });

    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSavingGoals = async (req, res) => {
  try {
    const workspaceId = await resolveWorkspaceId(req);

    const goals = await getUserSavingGoals({
      userId: req.user._id,
      workspaceId,
    });

    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createContribution = async (req, res) => {
  try {
    const workspaceId = await resolveWorkspaceId(req);

    const contribution = await addSavingContribution({
      userId: req.user._id,
      workspaceId,
      goalId: req.params.goalId,
      ...req.body,
    });

    res.status(201).json(contribution);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const inviteWorkspaceMember = async (req, res) => {
  try {
    const { userIdToInvite } = req.body;

    if (!userIdToInvite) {
      return res.status(400).json({
        message: "User ID is required.",
      });
    }

    const workspace = await inviteUserToFinanceWorkspace({
      workspaceId: req.params.workspaceId,
      ownerId: req.user._id,
      userIdToInvite,
    });

    res.json(workspace);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const workspaceId = await resolveWorkspaceId(req);

    const expense = await updateUserExpense({
      userId: req.user._id,
      workspaceId,
      expenseId: req.params.expenseId,
      expenseData: req.body,
    });

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found.",
      });
    }

    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const workspaceId = await resolveWorkspaceId(req);

    const deletedExpense = await deleteUserExpense({
      userId: req.user._id,
      workspaceId,
      expenseId: req.params.expenseId,
    });

    if (!deletedExpense) {
      return res.status(404).json({
        message: "Expense not found.",
      });
    }

    res.json({
      message: "Expense deleted successfully.",
      expenseId: deletedExpense._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSavingGoal = async (req, res) => {
  try {
    const workspaceId = await resolveWorkspaceId(req);

    const goal = await updateUserSavingGoal({
      userId: req.user._id,
      workspaceId,
      goalId: req.params.goalId,
      goalData: req.body,
    });

    if (!goal) {
      return res.status(404).json({ message: "Saving goal not found." });
    }

    res.json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteSavingGoal = async (req, res) => {
  try {
    const workspaceId = await resolveWorkspaceId(req);

    const deletedGoal = await deleteUserSavingGoal({
      userId: req.user._id,
      workspaceId,
      goalId: req.params.goalId,
    });

    if (!deletedGoal) {
      return res.status(404).json({ message: "Saving goal not found." });
    }

    res.json({
      message: "Saving goal deleted successfully.",
      goalId: deletedGoal._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const upsertMonthlyBudget = async (req, res) => {
  try {
    const workspaceId = await resolveWorkspaceId(req);

    const { category, amount, month, year } = req.body;

    if (!category || !amount || !month || !year) {
      return res.status(400).json({
        message: "Category, amount, month and year are required.",
      });
    }

    const budget = await createOrUpdateMonthlyBudget({
      userId: req.user._id,
      workspaceId,
      category,
      amount: Number(amount),
      month: Number(month),
      year: Number(year),
    });

    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMonthlyBudgets = async (req, res) => {
  try {
    const workspaceId = await resolveWorkspaceId(req);

    const today = new Date();

    const month = Number(req.query.month) || today.getMonth() + 1;
    const year = Number(req.query.year) || today.getFullYear();

    const budgets = await getWorkspaceMonthlyBudgets({
      userId: req.user._id,
      workspaceId,
      month,
      year,
    });

    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};