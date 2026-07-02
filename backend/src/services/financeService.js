import Expense from "../models/Expense.js";
import SavingGoal from "../models/SavingGoal.js";
import SavingContribution from "../models/SavingContribution.js";
import FinanceWorkspace from "../models/FinanceWorkspace.js";
import User from "../models/User.js";
import MonthlyBudget from "../models/MonthlyBudget.js";
import Income from "../models/Income.js";

const userHasWorkspaceAccess = async ({ workspaceId, userId }) => {
  const workspace = await FinanceWorkspace.findOne({
    _id: workspaceId,
    members: {
      $elemMatch: {
        userId,
        status: "active",
      },
    },
  });

  return Boolean(workspace);
};

export const getOrCreatePersonalWorkspace = async (userId) => {
  let workspace = await FinanceWorkspace.findOne({
    ownerId: userId,
    type: "personal",
  });

  if (!workspace) {
    workspace = await FinanceWorkspace.create({
      name: "Personal Finance",
      type: "personal",
      ownerId: userId,
      members: [
        {
          userId,
          role: "owner",
          status: "active",
        },
      ],
    });
  }

  return workspace;
};

export const getUserFinanceWorkspaces = async (userId) => {
  return await FinanceWorkspace.find({
    members: {
      $elemMatch: {
        userId,
        status: "active",
      },
    },
  }).sort({ createdAt: 1 });
};

export const createUserFinanceWorkspace = async ({ userId, name, type }) => {
  return await FinanceWorkspace.create({
    name,
    type,
    ownerId: userId,
    members: [
      {
        userId,
        role: "owner",
        status: "active",
      },
    ],
  });
};

export const createUserExpense = async ({
  userId,
  workspaceId,
  title,
  amount,
  category,
  date,
  paymentMethod,
  notes,
}) => {
  return await Expense.create({
    userId,
    workspaceId,
    createdBy: userId,
    title,
    amount,
    category,
    date,
    paymentMethod,
    notes,
  });
};

export const getUserExpenses = async ({ userId, workspaceId }) => {
  const hasAccess = await userHasWorkspaceAccess({ userId, workspaceId });

  if (!hasAccess) {
    throw new Error("Workspace access denied.");
  }

  return await Expense.find({ workspaceId })
    .populate("createdBy", "name avatar email")
    .sort({ date: -1 });
};

export const getUserSavingGoals = async ({ userId, workspaceId }) => {
  const hasAccess = await userHasWorkspaceAccess({ userId, workspaceId });

  if (!hasAccess) {
    throw new Error("Workspace access denied.");
  }

  return await SavingGoal.find({ workspaceId })
    .populate("createdBy", "name avatar email")
    .sort({ createdAt: -1 });
};

export const createUserSavingGoal = async ({
  userId,
  workspaceId,
  title,
  targetAmount,
  deadline,
  purpose,
}) => {
  return await SavingGoal.create({
    userId,
    workspaceId,
    createdBy: userId,
    title,
    targetAmount,
    deadline,
    purpose,
  });
};

export const addSavingContribution = async ({
  userId,
  workspaceId,
  goalId,
  amount,
  date,
  notes,
}) => {
  const contribution = await SavingContribution.create({
    userId,
    workspaceId,
    createdBy: userId,
    goalId,
    amount,
    date,
    notes,
  });

  await SavingGoal.findOneAndUpdate(
    {
      _id: goalId,
      workspaceId,
    },
    {
      $inc: { currentAmount: amount },
    }
  );

  return contribution;
};

export const inviteUserToFinanceWorkspace = async ({
  workspaceId,
  ownerId,
  userIdToInvite,
}) => {
  const workspace = await FinanceWorkspace.findOne({
    _id: workspaceId,
    ownerId,
  });

  if (!workspace) {
    throw new Error("Workspace not found or you are not the owner.");
  }

  const alreadyMember = workspace.members.some(
    (member) => member.userId.toString() === userIdToInvite.toString()
  );

  if (alreadyMember) {
    throw new Error("User is already a member.");
  }

  workspace.members.push({
    userId: userIdToInvite,
    role: "member",
    status: "active",
  });

  await workspace.save();

  return await FinanceWorkspace.findById(workspace._id).populate(
    "members.userId",
    "name email avatar"
  );
};

export const updateUserExpense = async ({
  userId,
  workspaceId,
  expenseId,
  expenseData,
}) => {
  const hasAccess = await userHasWorkspaceAccess({
    userId,
    workspaceId,
  });

  if (!hasAccess) {
    throw new Error("Workspace access denied.");
  }

  return await Expense.findOneAndUpdate(
    {
      _id: expenseId,
      workspaceId,
    },
    {
      ...expenseData,
      workspaceId,
    },
    { new: true }
  ).populate("createdBy", "name avatar email");
};

export const deleteUserExpense = async ({
  userId,
  workspaceId,
  expenseId,
}) => {
  const hasAccess = await userHasWorkspaceAccess({
    userId,
    workspaceId,
  });

  if (!hasAccess) {
    throw new Error("Workspace access denied.");
  }

  return await Expense.findOneAndDelete({
    _id: expenseId,
    workspaceId,
  });
};

export const updateUserSavingGoal = async ({
  userId,
  workspaceId,
  goalId,
  goalData,
}) => {
  const hasAccess = await userHasWorkspaceAccess({
    userId,
    workspaceId,
  });

  if (!hasAccess) {
    throw new Error("Workspace access denied.");
  }

  return await SavingGoal.findOneAndUpdate(
    {
      _id: goalId,
      workspaceId,
    },
    {
      ...goalData,
      workspaceId,
    },
    { new: true }
  ).populate("createdBy", "name avatar email");
};

export const deleteUserSavingGoal = async ({
  userId,
  workspaceId,
  goalId,
}) => {
  const hasAccess = await userHasWorkspaceAccess({
    userId,
    workspaceId,
  });

  if (!hasAccess) {
    throw new Error("Workspace access denied.");
  }

  await SavingContribution.deleteMany({
    goalId,
    workspaceId,
  });

  return await SavingGoal.findOneAndDelete({
    _id: goalId,
    workspaceId,
  });
};

export const createOrUpdateMonthlyBudget = async ({
  userId,
  workspaceId,
  category,
  amount,
  periodType = "monthly",
  weekStart,
  weekEnd,
  month,
  year,
}) => {
  const hasAccess = await userHasWorkspaceAccess({
    userId,
    workspaceId,
  });

  if (!hasAccess) {
    throw new Error("Workspace access denied.");
  }

  const normalizedWeekStart =
    periodType === "weekly" && weekStart
      ? new Date(weekStart)
      : undefined;

  const normalizedWeekEnd =
    periodType === "weekly" && weekEnd
      ? new Date(weekEnd)
      : undefined;

  if (normalizedWeekStart) normalizedWeekStart.setHours(0, 0, 0, 0);
  if (normalizedWeekEnd) normalizedWeekEnd.setHours(23, 59, 59, 999);

  const query = {
    workspaceId,
    category,
    periodType,
    year,
  };

  if (periodType === "weekly") {
    query.weekStart = normalizedWeekStart;
    query.weekEnd = normalizedWeekEnd;
  }

  if (periodType === "monthly") {
    query.month = month;
  }

  return await MonthlyBudget.findOneAndUpdate(
    query,
    {
      workspaceId,
      createdBy: userId,
      category,
      amount,
      periodType,
      weekStart: periodType === "weekly" ? normalizedWeekStart : undefined,
      weekEnd: periodType === "weekly" ? normalizedWeekEnd : undefined,
      month: periodType === "monthly" ? month : undefined,
      year,
    },
    {
      new: true,
      upsert: true,
    }
  );
};

export const getWorkspaceMonthlyBudgets = async ({
  userId,
  workspaceId,
  periodType,
  month,
  year,
  weekStart,
  weekEnd,
}) => {
  const hasAccess = await userHasWorkspaceAccess({
    userId,
    workspaceId,
  });

  if (!hasAccess) {
    throw new Error("Workspace access denied.");
  }

  const query = {
    workspaceId,
  };

  if (periodType) {
    query.periodType = periodType;
  }

  if (periodType === "monthly") {
    query.year = Number(year);
    query.month = Number(month);
  }

  if (periodType === "weekly") {
    const normalizedWeekStart = new Date(weekStart);
    const normalizedWeekEnd = new Date(weekEnd);

    normalizedWeekStart.setHours(0, 0, 0, 0);
    normalizedWeekEnd.setHours(23, 59, 59, 999);

    query.weekStart = { $lte: normalizedWeekEnd };
    query.weekEnd = { $gte: normalizedWeekStart };
  }

  console.log("FINAL BUDGET QUERY:", query);

  return await MonthlyBudget.find(query)
    .populate("createdBy", "name avatar email")
    .sort({ periodType: 1, category: 1 });
};

export const createUserIncome = async ({
  userId,
  workspaceId,
  source,
  amount,
  period,
  startDate,
  endDate,
  notes,
}) => {
  const hasAccess = await userHasWorkspaceAccess({
    userId,
    workspaceId,
  });

  if (!hasAccess) {
    throw new Error("Workspace access denied.");
  }

  return await Income.create({
    workspaceId,
    createdBy: userId,
    source,
    amount,
    period,
    startDate,
    endDate,
    notes,
  });
};

export const getWorkspaceIncomes = async ({
  userId,
  workspaceId,
}) => {
  const hasAccess = await userHasWorkspaceAccess({
    userId,
    workspaceId,
  });

  if (!hasAccess) {
    throw new Error("Workspace access denied.");
  }

  return await Income.find({ workspaceId })
    .populate("createdBy", "name avatar email")
    .sort({ startDate: -1 });
};

export const updateUserIncome = async ({
  userId,
  workspaceId,
  incomeId,
  incomeData,
}) => {
  const hasAccess = await userHasWorkspaceAccess({
    userId,
    workspaceId,
  });

  if (!hasAccess) {
    throw new Error("Workspace access denied.");
  }

  return await Income.findOneAndUpdate(
    {
      _id: incomeId,
      workspaceId,
    },
    {
      ...incomeData,
      workspaceId,
    },
    { new: true }
  ).populate("createdBy", "name avatar email");
};

export const deleteUserIncome = async ({
  userId,
  workspaceId,
  incomeId,
}) => {
  const hasAccess = await userHasWorkspaceAccess({
    userId,
    workspaceId,
  });

  if (!hasAccess) {
    throw new Error("Workspace access denied.");
  }

  return await Income.findOneAndDelete({
    _id: incomeId,
    workspaceId,
  });
};