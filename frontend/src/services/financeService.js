import api from "./api";

export const getFinanceWorkspaces = async () => {
  const { data } = await api.get("/finance/workspaces");
  return data;
};

export const createFinanceWorkspace = async (workspaceData) => {
  const { data } = await api.post("/finance/workspaces", workspaceData);
  return data;
};

export const getExpenses = async (workspaceId) => {
  const { data } = await api.get("/finance/expenses", {
    params: { workspaceId },
  });

  return data;
};

export const createExpense = async (expenseData) => {
  const { data } = await api.post("/finance/expenses", expenseData);
  return data;
};

export const getSavingGoals = async (workspaceId) => {
  const { data } = await api.get("/finance/goals", {
    params: { workspaceId },
  });

  return data;
};

export const createSavingGoal = async (goalData) => {
  const { data } = await api.post("/finance/goals", goalData);
  return data;
};

export const createContribution = async (goalId, contributionData) => {
  const { data } = await api.post(
    `/finance/goals/${goalId}/contributions`,
    contributionData
  );

  return data;
};

export const inviteUserToWorkspace = async (workspaceId, userIdToInvite) => {
  const { data } = await api.post(
    `/finance/workspaces/${workspaceId}/invite`,
    { userIdToInvite }
  );

  return data;
};

export const updateExpense = async (expenseId, expenseData) => {
  const { data } = await api.put(
    `/finance/expenses/${expenseId}`,
    expenseData
  );

  return data;
};

export const deleteExpense = async (expenseId, workspaceId) => {
  const { data } = await api.delete(`/finance/expenses/${expenseId}`, {
    params: { workspaceId },
  });

  return data;
};

export const updateSavingGoal = async (goalId, goalData) => {
  const { data } = await api.put(`/finance/goals/${goalId}`, goalData);
  return data;
};

export const deleteSavingGoal = async (goalId, workspaceId) => {
  const { data } = await api.delete(`/finance/goals/${goalId}`, {
    params: { workspaceId },
  });

  return data;
};

export const getMonthlyBudgets = async (
  workspaceId,
  month,
  year,
  periodType,
  weekStart,
  weekEnd
) => {
  const { data } = await api.get("/finance/budgets", {
    params: {
      workspaceId,
      month,
      year,
      periodType,
      weekStart,
      weekEnd,
    },
  });

  return data;
};

export const upsertMonthlyBudget = async (budgetData) => {
  const { data } = await api.post("/finance/budgets", budgetData);
  return data;
};

export const getIncomes = async (workspaceId) => {
  const { data } = await api.get("/finance/incomes", {
    params: { workspaceId },
  });

  return data;
};

export const createIncome = async (incomeData) => {
  const { data } = await api.post("/finance/incomes", incomeData);
  return data;
};

export const updateIncome = async (incomeId, incomeData) => {
  const { data } = await api.put(`/finance/incomes/${incomeId}`, incomeData);

  return data;
};

export const deleteIncome = async (incomeId, workspaceId) => {
  const { data } = await api.delete(`/finance/incomes/${incomeId}`, {
    params: { workspaceId },
  });

  return data;
};