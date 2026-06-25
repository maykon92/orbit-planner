import api from "./api";

export const getExpenses = async () => {
  const { data } = await api.get("/finance/expenses");
  return data;
};

export const createExpense = async (expenseData) => {
  const { data } = await api.post(
    "/finance/expenses",
    expenseData
  );

  return data;
};

export const getSavingGoals = async () => {
  const { data } = await api.get("/finance/goals");
  return data;
};

export const createSavingGoal = async (goalData) => {
  const { data } = await api.post(
    "/finance/goals",
    goalData
  );

  return data;
};

export const createContribution = async (
  goalId,
  contributionData
) => {
  const { data } = await api.post(
    `/finance/goals/${goalId}/contributions`,
    contributionData
  );

  return data;
};