import {
  createUserExpense,
  getUserExpenses,
  createUserSavingGoal,
  getUserSavingGoals,
  addSavingContribution,
} from "../services/financeService.js";

export const createExpense = async (req, res) => {
  try {
    const expense = await createUserExpense({
      userId: req.user._id,
      ...req.body,
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getExpenses = async (req, res) => {
  try {
    const expenses = await getUserExpenses(req.user._id);
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createSavingGoal = async (req, res) => {
  try {
    const goal = await createUserSavingGoal({
      userId: req.user._id,
      ...req.body,
    });

    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSavingGoals = async (req, res) => {
  try {
    const goals = await getUserSavingGoals(req.user._id);
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createContribution = async (req, res) => {
  try {
    const contribution = await addSavingContribution({
      userId: req.user._id,
      goalId: req.params.goalId,
      ...req.body,
    });

    res.status(201).json(contribution);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};