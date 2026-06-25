import Expense from "../models/Expense.js";
import SavingGoal from "../models/SavingGoal.js";
import SavingContribution from "../models/SavingContribution.js";

export const createUserExpense = async ({ userId, title, amount, category, date, paymentMethod, notes }) => {
  return await Expense.create({ userId, title, amount, category, date, paymentMethod, notes });
};

export const getUserExpenses = async (userId) => {
  return await Expense.find({ userId }).sort({ date: -1 });
};

export const createUserSavingGoal = async ({ userId, title, targetAmount, deadline, purpose }) => {
  return await SavingGoal.create({ userId, title, targetAmount, deadline, purpose });
};

export const getUserSavingGoals = async (userId) => {
  return await SavingGoal.find({ userId }).sort({ createdAt: -1 });
};

export const addSavingContribution = async ({ userId, goalId, amount, date, notes }) => {
  const contribution = await SavingContribution.create({
    userId,
    goalId,
    amount,
    date,
    notes,
  });

  await SavingGoal.findOneAndUpdate(
    { _id: goalId, userId },
    { $inc: { currentAmount: amount } }
  );

  return contribution;
};