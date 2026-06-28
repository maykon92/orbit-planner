import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  LinearProgress,
  MenuItem,
  TextField,
  IconButton,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import SavingsIcon from "@mui/icons-material/Savings";
import PaidIcon from "@mui/icons-material/Paid";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PsychologyIcon from "@mui/icons-material/Psychology";
import GroupsIcon from "@mui/icons-material/Groups";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

import MainLayout from "../../layouts/MainLayout";
import {
  getFinanceWorkspaces,
  createFinanceWorkspace,
  getExpenses,
  getSavingGoals,
  deleteExpense,
  deleteSavingGoal,
  getMonthlyBudgets,
} from "../../services/financeService";

import ExpenseModal from "../../components/ExpenseModal";
import CreateSavingGoalModal from "../../components/CreateSavingGoalModal";
import AddContributionModal from "../../components/AddContributionModal";
import ExpenseCategoryChart from "../../components/ExpenseCategoryChart";
import ManageWorkspaceModal from "../../components/finance/ManageWorkspaceModal";
import ConfirmDialog from "../../components/ConfirmDialog";
import MonthlyBudgetModal from "../../components/MonthlyBudgetModal";

const cardSx = {
  borderRadius: 5,
  background:
    "linear-gradient(145deg, rgba(20,33,61,.98), rgba(15,23,42,.98))",
  border: "1px solid rgba(255,255,255,.07)",
  color: "#f8fafc",
  boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
};

const fieldSx = {
  minWidth: 220,
  "& .MuiOutlinedInput-root": {
    color: "#f8fafc",
    background: "#111827",
    borderRadius: 3,
  },
  "& .MuiInputLabel-root": {
    color: "#94a3b8",
  },
  "& .MuiSelect-icon": {
    color: "#94a3b8",
  },
};

const SummaryCard = ({ title, value, icon }) => (
  <Card sx={{ ...cardSx, height: "100%" }}>
    <CardContent
      sx={{
        minHeight: 125,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Box>
        <Typography sx={{ color: "#8fa0bf", fontSize: 14 }}>
          {title}
        </Typography>

        <Typography sx={{ fontSize: 27, fontWeight: 900, mt: 1 }}>
          {value}
        </Typography>
      </Box>

      <Box
        sx={{
          width: 46,
          height: 46,
          borderRadius: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(96,165,250,.16)",
          color: "#60a5fa",
          flexShrink: 0,
          "& svg": {
            fontSize: 26,
          },
        }}
      >
        {icon}
      </Box>
    </CardContent>
  </Card>
);

const Finance = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [goals, setGoals] = useState([]);
  const [openExpenseModal, setOpenExpenseModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [openGoalModal, setOpenGoalModal] = useState(false);
  const [openContributionModal, setOpenContributionModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [periodFilter, setPeriodFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [openManageWorkspace, setOpenManageWorkspace] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [goalToDelete, setGoalToDelete] = useState(null);
  const [openDeleteGoalDialog, setOpenDeleteGoalDialog] = useState(false);
  const [budgets, setBudgets] = useState([]);
  const [openBudgetModal, setOpenBudgetModal] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);

  const [searchParams] = useSearchParams();

  const loadFinanceData = useCallback(async () => {
    if (!selectedWorkspaceId) return;

    try {
      const today = new Date();
      const currentMonth = today.getMonth() + 1;
      const currentYear = today.getFullYear();

      const [expensesData, goalsData, budgetsData] = await Promise.all([
        getExpenses(selectedWorkspaceId),
        getSavingGoals(selectedWorkspaceId),
        getMonthlyBudgets(selectedWorkspaceId, currentMonth, currentYear),
      ]);

      setExpenses(expensesData);
      setGoals(goalsData);
      setBudgets(budgetsData);
    } catch (error) {
      console.error("Error loading finance data:", error);
    }
  }, [selectedWorkspaceId]);

  useEffect(() => {
    const loadWorkspaces = async () => {
      try {
        const data = await getFinanceWorkspaces();

        setWorkspaces(data);

        const workspaceIdFromUrl = searchParams.get("workspaceId");

        if (
          workspaceIdFromUrl &&
          data.some((workspace) => workspace._id === workspaceIdFromUrl)
        ) {
          setSelectedWorkspaceId(workspaceIdFromUrl);
        } else if (data.length > 0) {
          setSelectedWorkspaceId(data[0]._id);
        }
      } catch (error) {
        console.error("Error loading finance workspaces:", error);
      }
    };

    loadWorkspaces();
  }, [searchParams]);

  useEffect(() => {
    loadFinanceData();
  }, [loadFinanceData]);

  const handleCreateWorkspace = async () => {
    const name = window.prompt("Workspace name");

    if (!name?.trim()) return;

    const newWorkspace = await createFinanceWorkspace({
      name,
      type: "shared",
    });

    setWorkspaces((prev) => [...prev, newWorkspace]);
    setSelectedWorkspaceId(newWorkspace._id);
  };

  const selectedWorkspace = workspaces.find(
    (workspace) => workspace._id === selectedWorkspaceId
  );

  const totalExpenses = useMemo(() => {
    return expenses.reduce((total, item) => total + Number(item.amount || 0), 0);
  }, [expenses]);

  const totalSaved = useMemo(() => {
    return goals.reduce(
      (total, goal) => total + Number(goal.currentAmount || 0),
      0
    );
  }, [goals]);

  const weeklyExpenses = useMemo(() => {
    const today = new Date();
    const startOfWeek = new Date(today);

    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    return expenses
      .filter((expense) => new Date(expense.date) >= startOfWeek)
      .reduce((total, expense) => total + Number(expense.amount || 0), 0);
  }, [expenses]);

  const monthlyExpenses = useMemo(() => {
    const today = new Date();

    return expenses
      .filter((expense) => {
        const date = new Date(expense.date);

        return (
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear()
        );
      })
      .reduce((total, expense) => total + Number(expense.amount || 0), 0);
  }, [expenses]);

  const filteredExpenses = useMemo(() => {
    const today = new Date();

    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);

      const matchesCategory =
        categoryFilter === "all" || expense.category === categoryFilter;

      let matchesPeriod = true;

      if (periodFilter === "week") {
        const startOfWeek = new Date(today);

        startOfWeek.setDate(today.getDate() - today.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        matchesPeriod = expenseDate >= startOfWeek;
      }

      if (periodFilter === "month") {
        matchesPeriod =
          expenseDate.getMonth() === today.getMonth() &&
          expenseDate.getFullYear() === today.getFullYear();
      }

      return matchesCategory && matchesPeriod;
    });
  }, [expenses, periodFilter, categoryFilter]);

  const budgetProgress = useMemo(() => {
    return budgets.map((budget) => {
      const spent = expenses
        .filter((expense) => {
          const expenseDate = new Date(expense.date);
          const sameCategory = expense.category === budget.category;
          const sameMonth = expenseDate.getMonth() + 1 === Number(budget.month);
          const sameYear = expenseDate.getFullYear() === Number(budget.year);

          return sameCategory && sameMonth && sameYear;
        })
        .reduce((total, expense) => total + Number(expense.amount || 0), 0);

      const percentage = (spent / Number(budget.amount || 1)) * 100;

      return {
        ...budget,
        spent,
        remaining: Number(budget.amount) - spent,
        percentage,
      };
    });
  }, [budgets, expenses]);

  const financialInsights = useMemo(() => {
    const insights = [];

    if (budgetProgress.length > 0) {
      const overBudget = budgetProgress.filter((budget) => budget.percentage >= 100);
      const warningBudget = budgetProgress.filter(
        (budget) => budget.percentage >= 80 && budget.percentage < 100
      );

      overBudget.forEach((budget) => {
        insights.push({
          type: "danger",
          title: "Over budget",
          message: `You are over your ${budget.category} budget by $${Math.abs(
            budget.remaining
          ).toFixed(2)}.`,
        });
      });

      warningBudget.forEach((budget) => {
        insights.push({
          type: "warning",
          title: "Budget warning",
          message: `You have used ${Math.round(
            budget.percentage
          )}% of your ${budget.category} budget this month.`,
        });
      });
    }

    if (expenses.length > 0) {
      const categoryTotals = expenses.reduce((acc, expense) => {
        acc[expense.category] =
          (acc[expense.category] || 0) + Number(expense.amount || 0);

        return acc;
      }, {});

      const biggestCategory = Object.entries(categoryTotals).sort(
        (a, b) => b[1] - a[1]
      )[0];

      if (biggestCategory) {
        insights.push({
          type: "info",
          title: "Biggest spending category",
          message: `${biggestCategory[0]} is your biggest category with $${biggestCategory[1].toFixed(
            2
          )} spent.`,
        });
      }
    }

    if (goals.length > 0) {
      goals.forEach((goal) => {
        const remaining =
          Number(goal.targetAmount || 0) - Number(goal.currentAmount || 0);

        if (remaining > 0) {
          insights.push({
            type: "success",
            title: "Saving goal progress",
            message: `You are $${remaining.toFixed(2)} away from "${goal.title}".`,
          });
        }
      });
    }

    if (insights.length === 0) {
      insights.push({
        type: "info",
        title: "Ready for insights",
        message:
          "Add expenses, budgets and goals to receive smarter financial insights.",
      });
    }

    return insights.slice(0, 5);
  }, [budgetProgress, expenses, goals]);

  const handleGenerateAiAnalysis = async () => {
    try {
      setLoadingAi(true);

      const analysis = generateFinancialHealthAnalysis();

      setAiAnalysis(analysis);
    } catch (error) {
      console.error("Error generating AI analysis:", error);
    } finally {
      setLoadingAi(false);
    }
  };

  const generateFinancialHealthAnalysis = () => {
    let score = 100;
    const strengths = [];
    const risks = [];
    const recommendations = [];

    const overBudgets = budgetProgress.filter((b) => b.percentage >= 100);
    const warningBudgets = budgetProgress.filter(
      (b) => b.percentage >= 80 && b.percentage < 100
    );

    score -= overBudgets.length * 15;
    score -= warningBudgets.length * 8;

    if (totalSaved > 0) {
      strengths.push("You are actively saving toward your financial goals.");
    }

    if (budgetProgress.length > 0) {
      strengths.push("You are tracking monthly budgets by category.");
    }

    overBudgets.forEach((budget) => {
      risks.push(
        `${budget.category} is over budget by $${Math.abs(
          budget.remaining
        ).toFixed(2)}.`
      );

      recommendations.push(
        `Reduce ${budget.category} spending next month or increase the budget if this category is essential.`
      );
    });

    warningBudgets.forEach((budget) => {
      risks.push(
        `${budget.category} already reached ${Math.round(
          budget.percentage
        )}% of the monthly budget.`
      );

      recommendations.push(
        `Monitor ${budget.category} closely for the rest of the month.`
      );
    });

    goals.forEach((goal) => {
      const remaining =
        Number(goal.targetAmount || 0) - Number(goal.currentAmount || 0);

      if (remaining > 0) {
        recommendations.push(
          `You still need $${remaining.toFixed(2)} to reach "${goal.title}".`
        );
      }
    });

    if (expenses.length === 0) {
      score -= 20;
      risks.push("There are not enough expenses registered yet.");
      recommendations.push("Add more expenses to receive better insights.");
    }

    score = Math.max(0, Math.min(score, 100));

    return {
      score,
      strengths,
      risks,
      recommendations,
    };
  };

  const activeGoals = goals.filter((goal) => goal.status === "active").length;

  return (
    <MainLayout>
      <Box
        sx={{
          maxWidth: 1320,
          mx: "auto",
          px: { xs: 2, md: 4 },
          py: 5,
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={3}
          sx={{
            mb: 4,
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", md: "center" },
          }}
        >
          <Box>
            <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
              <Box
                component="img"
                src="/orbit_planner_logo.png"
                alt="Orbit Planner"
                sx={{
                  width: 60,
                  height: 60,
                  objectFit: "contain",
                  filter: `
                    drop-shadow(0 0 10px rgba(96, 165, 250, 0.4))
                    drop-shadow(0 0 20px rgba(139, 92, 246, 0.3))
                  `,
                }}
              />

              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: 38, md: 52 },
                  fontWeight: 900,
                  color: "#fff",
                  letterSpacing: "-1.5px",
                  lineHeight: 1,
                }}
              >
                Finance Planner
              </Typography>
            </Stack>

            <Typography sx={{ color: "#8fa0bf", mt: 1, fontSize: 16 }}>
              Manage personal and shared finances in one place.
            </Typography>
          </Box>

          <Stack
            direction="row"
            spacing={2}
            sx={{
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => {
                setSelectedExpense(null);
                setOpenExpenseModal(true);
              }}
              disabled={!selectedWorkspaceId}
              sx={{
                height: 48,
                px: 3,
                borderRadius: 3,
                color: "#fff",
                borderColor: "rgba(96,165,250,.7)",
                fontWeight: 800,
              }}
            >
              Add Expense
            </Button>

            <Button
              variant="outlined"
              startIcon={<AccountBalanceWalletIcon />}
              onClick={() => setOpenBudgetModal(true)}
              disabled={!selectedWorkspaceId}
              sx={{
                height: 48,
                px: 3,
                borderRadius: 3,
                color: "#fff",
                borderColor: "rgba(96,165,250,.7)",
                fontWeight: 800,
              }}
            >
              Set Budget
            </Button>

            <Button
              variant="contained"
              startIcon={<SavingsIcon />}
              onClick={() => {
                setSelectedGoal(null);
                setOpenGoalModal(true);
              }}
              disabled={!selectedWorkspaceId}
              sx={{
                height: 48,
                px: 3,
                borderRadius: 3,
                background: "linear-gradient(135deg,#2563eb,#7c3aed)",
                fontWeight: 900,
              }}
            >
              New Goal
            </Button>
          </Stack>
        </Stack>

        <Card sx={{ ...cardSx, mb: 4 }}>
          <CardContent>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                select
                size="small"
                label="Workspace"
                value={selectedWorkspaceId}
                onChange={(e) => setSelectedWorkspaceId(e.target.value)}
                sx={fieldSx}
              >
                {workspaces.map((workspace) => (
                  <MenuItem key={workspace._id} value={workspace._id}>
                    {workspace.name}
                  </MenuItem>
                ))}
              </TextField>

              <Button
                variant="outlined"
                startIcon={<GroupsIcon />}
                onClick={() => setOpenManageWorkspace(true)}
                disabled={!selectedWorkspace}
                sx={{
                  height: 40,
                  borderRadius: 3,
                  color: "#fff",
                  borderColor: "rgba(96,165,250,.7)",
                  fontWeight: 800,
                  textTransform: "none",
                }}
              >
                Manage
              </Button>

              <Button
                variant="outlined"
                startIcon={<GroupsIcon />}
                onClick={handleCreateWorkspace}
                sx={{
                  height: 40,
                  borderRadius: 3,
                  color: "#fff",
                  borderColor: "rgba(96,165,250,.7)",
                  fontWeight: 800,
                  textTransform: "none",
                }}
              >
                New Shared
              </Button>
            </Stack>
          </CardContent>
        </Card>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              xl: "repeat(5, 1fr)",
            },
            gap: 3,
            mb: 4,
          }}
        >
          <SummaryCard
            title="Total Expenses"
            value={`$${totalExpenses.toFixed(2)}`}
            icon={<PaidIcon />}
          />

          <SummaryCard
            title="This Week"
            value={`$${weeklyExpenses.toFixed(2)}`}
            icon={<PaidIcon />}
          />

          <SummaryCard
            title="This Month"
            value={`$${monthlyExpenses.toFixed(2)}`}
            icon={<PaidIcon />}
          />

          <SummaryCard
            title="Total Saved"
            value={`$${totalSaved.toFixed(2)}`}
            icon={<SavingsIcon />}
          />

          <SummaryCard
            title="Active Goals"
            value={activeGoals}
            icon={<TrendingUpIcon />}
          />
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "minmax(0, 1.6fr) minmax(340px, 0.9fr)",
            },
            gap: 3,
            mb: 4,
            alignItems: "stretch",
          }}
        >
          <Card sx={{ ...cardSx, height: "100%" }}>
            <CardContent>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ mb: 3 }}
              >
                <TextField
                  select
                  size="small"
                  label="Period"
                  value={periodFilter}
                  onChange={(e) => setPeriodFilter(e.target.value)}
                  sx={fieldSx}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="week">This Week</MenuItem>
                  <MenuItem value="month">This Month</MenuItem>
                </TextField>

                <TextField
                  select
                  size="small"
                  label="Category"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  sx={fieldSx}
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  <MenuItem value="food">Food</MenuItem>
                  <MenuItem value="rent">Rent</MenuItem>
                  <MenuItem value="transport">Transport</MenuItem>
                  <MenuItem value="subscriptions">Subscriptions</MenuItem>
                  <MenuItem value="health">Health</MenuItem>
                  <MenuItem value="shopping">Shopping</MenuItem>
                  <MenuItem value="fun">Fun</MenuItem>
                  <MenuItem value="education">Education</MenuItem>
                  <MenuItem value="visa">Visa</MenuItem>
                  <MenuItem value="phone">Phone</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </TextField>
              </Stack>

              <Typography sx={{ fontSize: 24, fontWeight: 900, mb: 2 }}>
                Recent Expenses
              </Typography>

              {filteredExpenses.length === 0 ? (
                <Typography sx={{ color: "#8fa0bf" }}>
                  No expenses registered yet.
                </Typography>
              ) : (
                filteredExpenses.slice(0, 8).map((expense) => (
                  <Box
                    key={expense._id}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 2,
                      py: 1.7,
                      borderBottom: "1px solid rgba(255,255,255,.06)",
                    }}
                  >
                    <Box>
                      <Typography fontWeight={800}>{expense.title}</Typography>

                      <Typography sx={{ color: "#8fa0bf", fontSize: 13 }}>
                        {expense.category} •{" "}
                        {new Date(expense.date).toLocaleDateString()}
                        {expense.createdBy?.name
                          ? ` • by ${expense.createdBy.name}`
                          : ""}
                      </Typography>
                    </Box>

                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Typography fontWeight={900}>
                        ${Number(expense.amount).toFixed(2)}
                      </Typography>

                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedExpense(expense);
                          setOpenExpenseModal(true);
                        }}
                        sx={{
                          color: "#93c5fd",
                          border: "1px solid rgba(147,197,253,.25)",
                          "&:hover": {
                            background: "rgba(147,197,253,.08)",
                          },
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>

                      <IconButton
                        size="small"
                        onClick={() => {
                          setExpenseToDelete(expense);
                          setGoalToDelete(null);
                          setOpenDeleteDialog(true);
                        }}
                        sx={{
                          color: "#fca5a5",
                          border: "1px solid rgba(252,165,165,.25)",
                          "&:hover": {
                            background: "rgba(239,68,68,.12)",
                          },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Box>
                ))
              )}
            </CardContent>
          </Card>

          <Card sx={{ ...cardSx, height: "100%" }}>
            <CardContent>
              <Typography sx={{ fontSize: 24, fontWeight: 900, mb: 3 }}>
                Saving Goals
              </Typography>

              {goals.length === 0 ? (
                <Typography sx={{ color: "#8fa0bf" }}>
                  No saving goals created yet.
                </Typography>
              ) : (
                goals.map((goal) => {
                  const progress =
                    (Number(goal.currentAmount || 0) /
                      Number(goal.targetAmount || 1)) *
                    100;

                  return (
                    <Box
                      key={goal._id}
                      sx={{
                        mb: 3,
                        pb: 3,
                        borderBottom: "1px solid rgba(255,255,255,.06)",
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={2}
                        sx={{
                          mb: 1,
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography fontWeight={800}>{goal.title}</Typography>

                        <Typography sx={{ color: "#8fa0bf", fontSize: 13 }}>
                          ${goal.currentAmount} / ${goal.targetAmount}
                        </Typography>
                      </Stack>

                      <LinearProgress
                        variant="determinate"
                        value={Math.min(progress, 100)}
                        sx={{
                          height: 9,
                          borderRadius: 99,
                          background: "#1e293b",
                          "& .MuiLinearProgress-bar": {
                            borderRadius: 99,
                            background:
                              "linear-gradient(135deg,#2563eb,#22c55e)",
                          },
                        }}
                      />

                      <Stack direction="row" spacing={1.5} sx={{ mt: 1.5 }}>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => {
                            setSelectedGoal(goal);
                            setOpenContributionModal(true);
                          }}
                          sx={{
                            borderRadius: 3,
                            color: "#fff",
                            borderColor: "rgba(96,165,250,.5)",
                            textTransform: "none",
                            fontWeight: 700,
                          }}
                        >
                          Add Money
                        </Button>

                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedGoal(goal);
                            setOpenGoalModal(true);
                          }}
                          sx={{
                            color: "#93c5fd",
                            border: "1px solid rgba(147,197,253,.25)",
                            "&:hover": {
                              background: "rgba(147,197,253,.08)",
                            },
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>

                        <IconButton
                          size="small"
                          onClick={() => {
                            setGoalToDelete(goal);
                            setExpenseToDelete(null);
                            setOpenDeleteDialog(true);
                          }}
                          sx={{
                            color: "#fca5a5",
                            border: "1px solid rgba(252,165,165,.25)",
                            "&:hover": {
                              background: "rgba(239,68,68,.12)",
                            },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </Box>
                  );
                })
              )}
            </CardContent>
          </Card>
        </Box>

        <Card sx={{ ...cardSx, mb: 4 }}>
          <CardContent>
            <Typography sx={{ fontSize: 24, fontWeight: 900, mb: 2 }}>
              Expenses by Category
            </Typography>

            <ExpenseCategoryChart expenses={filteredExpenses} />
          </CardContent>
        </Card>

        <Card sx={{ ...cardSx, mb: 4 }}>
          <CardContent>
            <Typography sx={{ fontSize: 24, fontWeight: 900, mb: 2 }}>
              Monthly Budgets
            </Typography>

            {budgetProgress.length === 0 ? (
              <Typography sx={{ color: "#8fa0bf" }}>
                No monthly budgets created yet.
              </Typography>
            ) : (
              <Stack spacing={2}>
                {budgetProgress.map((budget) => {
                  const isWarning = budget.percentage >= 80 && budget.percentage < 100;
                  const isOver = budget.percentage >= 100;

                  return (
                    <Box
                      key={budget._id}
                      sx={{
                        p: 2,
                        borderRadius: 4,
                        background: "rgba(15,23,42,.65)",
                        border: isOver
                          ? "1px solid rgba(248,113,113,.45)"
                          : isWarning
                          ? "1px solid rgba(251,191,36,.45)"
                          : "1px solid rgba(148,163,184,.14)",
                      }}
                    >
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ mb: 1 }}
                      >
                        <Box>
                          <Typography
                            sx={{
                              color: "#fff",
                              fontWeight: 900,
                              textTransform: "capitalize",
                            }}
                          >
                            {budget.category}
                          </Typography>

                          <Typography sx={{ color: "#94a3b8", fontSize: 13 }}>
                            ${budget.spent.toFixed(2)} / $
                            {Number(budget.amount).toFixed(2)}
                          </Typography>
                        </Box>

                        <Typography
                          sx={{
                            fontWeight: 900,
                            color: isOver
                              ? "#f87171"
                              : isWarning
                              ? "#fbbf24"
                              : "#22c55e",
                          }}
                        >
                          {Math.round(budget.percentage)}%
                        </Typography>
                      </Stack>

                      <LinearProgress
                        variant="determinate"
                        value={Math.min(budget.percentage, 100)}
                        sx={{
                          height: 9,
                          borderRadius: 99,
                          background: "#1e293b",
                          "& .MuiLinearProgress-bar": {
                            borderRadius: 99,
                            background: isOver
                              ? "linear-gradient(135deg,#ef4444,#f97316)"
                              : isWarning
                              ? "linear-gradient(135deg,#f59e0b,#fbbf24)"
                              : "linear-gradient(135deg,#2563eb,#22c55e)",
                          },
                        }}
                      />

                      <Typography
                        sx={{
                          mt: 1,
                          fontSize: 13,
                          color: isOver ? "#fca5a5" : "#94a3b8",
                        }}
                      >
                        {isOver
                          ? `Over budget by $${Math.abs(budget.remaining).toFixed(2)}`
                          : `$${budget.remaining.toFixed(2)} remaining`}
                      </Typography>
                    </Box>
                  );
                })}
              </Stack>
            )}
          </CardContent>
        </Card>

        <Card sx={cardSx}>
          <CardContent>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 3 }}
            >
              <Typography
                sx={{
                  fontSize: 22,
                  fontWeight: 900,
                  color: "#fff",
                }}
              >
                AI Financial Insights
              </Typography>

              <Button
                variant="outlined"
                onClick={handleGenerateAiAnalysis}
                disabled={loadingAi}
                sx={{
                  borderRadius: 3,
                  textTransform: "none",
                  fontWeight: 800,
                  color: "#fff",
                  left: "10px",
                  borderColor: "rgba(167,139,250,.45)",
                  "&:hover": {
                    borderColor: "#8b5cf6",
                    background: "rgba(139,92,246,.08)",
                  },
                }}
              >
                {loadingAi ? "Generating..." : "Generate AI Analysis"}
              </Button>
            </Stack>

            <Stack spacing={2}>
              {financialInsights.map((insight, index) => (
                <Box
                  key={`${insight.title}-${index}`}
                  sx={{
                    p: 2,
                    borderRadius: 4,
                    background: "rgba(255,255,255,.04)",
                    border:
                      insight.type === "danger"
                        ? "1px solid rgba(248,113,113,.35)"
                        : insight.type === "warning"
                        ? "1px solid rgba(251,191,36,.35)"
                        : insight.type === "success"
                        ? "1px solid rgba(34,197,94,.35)"
                        : "1px solid rgba(96,165,250,.25)",
                  }}
                >
                  <Typography
                    sx={{
                      color:
                        insight.type === "danger"
                          ? "#fca5a5"
                          : insight.type === "warning"
                          ? "#fbbf24"
                          : insight.type === "success"
                          ? "#86efac"
                          : "#93c5fd",
                      fontWeight: 900,
                      mb: 0.5,
                    }}
                  >
                    {insight.title}
                  </Typography>

                  <Typography sx={{ color: "#cbd5e1" }}>
                    {insight.message}
                  </Typography>
                </Box>
              ))}
            </Stack>

            {aiAnalysis && (
              <Box
                sx={{
                  mt: 3,
                  p: 2.5,
                  borderRadius: 4,
                  background:
                    "linear-gradient(135deg, rgba(124,58,237,.18), rgba(37,99,235,.12))",
                  border: "1px solid rgba(167,139,250,.35)",
                }}
              >
                <Typography
                  sx={{
                    color: "#c4b5fd",
                    fontWeight: 900,
                    mb: 1,
                    fontSize: 18,
                  }}
                >
                  Financial Health Score: {aiAnalysis.score}/100
                </Typography>

                <Typography sx={{ color: "#86efac", fontWeight: 900, mt: 2 }}>
                  Strengths
                </Typography>

                {aiAnalysis.strengths.length === 0 ? (
                  <Typography sx={{ color: "#cbd5e1" }}>
                    No strengths detected yet.
                  </Typography>
                ) : (
                  aiAnalysis.strengths.map((item, index) => (
                    <Typography key={index} sx={{ color: "#cbd5e1" }}>
                      • {item}
                    </Typography>
                  ))
                )}

                <Typography sx={{ color: "#fca5a5", fontWeight: 900, mt: 2 }}>
                  Risks
                </Typography>

                {aiAnalysis.risks.length === 0 ? (
                  <Typography sx={{ color: "#cbd5e1" }}>
                    No major risks detected.
                  </Typography>
                ) : (
                  aiAnalysis.risks.map((item, index) => (
                    <Typography key={index} sx={{ color: "#cbd5e1" }}>
                      • {item}
                    </Typography>
                  ))
                )}

                <Typography sx={{ color: "#93c5fd", fontWeight: 900, mt: 2 }}>
                  Recommendations
                </Typography>

                {aiAnalysis.recommendations.map((item, index) => (
                  <Typography key={index} sx={{ color: "#cbd5e1" }}>
                    • {item}
                  </Typography>
                ))}
              </Box>
            )}

            {!aiAnalysis && (
              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  borderRadius: 4,
                  background: "rgba(255,255,255,.04)",
                  border: "1px solid rgba(255,255,255,.06)",
                }}
              >
                <Typography sx={{ color: "#cbd5e1", lineHeight: 1.8 }}>
                  Click on{" "}
                  <strong>"Generate AI Analysis"</strong> to receive an intelligent
                  overview of your financial workspace. Orbit AI will analyze your
                  expenses, budgets, and saving goals to provide personalized insights
                  and recommendations.
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>

      <ExpenseModal
        open={openExpenseModal}
        onClose={() => {
          setOpenExpenseModal(false);
          setSelectedExpense(null);
        }}
        workspaceId={selectedWorkspaceId}
        expense={selectedExpense}
        onSaved={loadFinanceData}
      />

      <CreateSavingGoalModal
        open={openGoalModal}
        onClose={() => {
          setOpenGoalModal(false);
          setSelectedGoal(null);
        }}
        workspaceId={selectedWorkspaceId}
        goal={selectedGoal}
        onCreated={loadFinanceData}
      />

      <AddContributionModal
        open={openContributionModal}
        onClose={() => setOpenContributionModal(false)}
        workspaceId={selectedWorkspaceId}
        goal={selectedGoal}
        onCreated={loadFinanceData}
      />

      <ManageWorkspaceModal
        open={openManageWorkspace}
        onClose={() => setOpenManageWorkspace(false)}
        workspace={selectedWorkspace}
        onUpdated={async () => {
          const updatedWorkspaces = await getFinanceWorkspaces();
          setWorkspaces(updatedWorkspaces);
          await loadFinanceData();
        }}
      />

      <ConfirmDialog
        open={openDeleteDialog}
        title={
          goalToDelete
            ? "Delete saving goal"
            : "Delete expense"
        }
        message={
          goalToDelete
            ? `Are you sure you want to delete "${goalToDelete.title}"? This will also remove all contributions.`
            : expenseToDelete
            ? `Are you sure you want to delete "${expenseToDelete.title}"?`
            : ""
        }
        confirmText="Delete"
        danger
        onClose={() => {
          setOpenDeleteDialog(false);
          setExpenseToDelete(null);
          setGoalToDelete(null);
        }}
        onConfirm={async () => {
          if (expenseToDelete) {
            await deleteExpense(
              expenseToDelete._id,
              selectedWorkspaceId
            );
          }

          if (goalToDelete) {
            await deleteSavingGoal(
              goalToDelete._id,
              selectedWorkspaceId
            );
          }

          await loadFinanceData();

          setOpenDeleteDialog(false);
          setExpenseToDelete(null);
          setGoalToDelete(null);
        }}
      />

      <MonthlyBudgetModal
        open={openBudgetModal}
        onClose={() => setOpenBudgetModal(false)}
        workspaceId={selectedWorkspaceId}
        onSaved={loadFinanceData}
      />

    </MainLayout>
  );
};

export default Finance;