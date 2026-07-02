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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import SavingsIcon from "@mui/icons-material/Savings";
import PaidIcon from "@mui/icons-material/Paid";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import GroupsIcon from "@mui/icons-material/Groups";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

import MainLayout from "../../layouts/MainLayout";
import {
  getFinanceWorkspaces,
  createFinanceWorkspace,
  getExpenses,
  getSavingGoals,
  deleteExpense,
  deleteSavingGoal,
  getMonthlyBudgets,
  getIncomes,
  deleteIncome,
} from "../../services/financeService";
import { generateAiSuggestion } from "../../services/aiService";

import ExpenseModal from "../../components/ExpenseModal";
import CreateSavingGoalModal from "../../components/CreateSavingGoalModal";
import AddContributionModal from "../../components/AddContributionModal";
import ExpenseCategoryChart from "../../components/ExpenseCategoryChart";
import ManageWorkspaceModal from "../../components/finance/ManageWorkspaceModal";
import ConfirmDialog from "../../components/ConfirmDialog";
import MonthlyBudgetModal from "../../components/MonthlyBudgetModal";
import AddIncomeModal from "../../components/AddIncomeModal";

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

const formatCurrency = (value) => `$${Number(value || 0).toFixed(2)}`;

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString();
};

const toInputDate = (date) => date.toISOString().split("T")[0];

const isDateBetween = (date, start, end) => {
  const target = new Date(date);
  return target >= start && target <= end;
};

const getCurrentWeekRange = () => {
  const today = new Date();
  const day = today.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;

  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() + diffToMonday);
  weekStart.setHours(0, 0, 0, 0);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  return { weekStart, weekEnd };
};

const ScrollBox = ({ children, maxHeight = 320 }) => (
  <Box
    sx={{
      maxHeight,
      overflowY: "auto",
      pr: 1,
      "&::-webkit-scrollbar": {
        width: 7,
      },
      "&::-webkit-scrollbar-track": {
        background: "rgba(15,23,42,.5)",
        borderRadius: 99,
      },
      "&::-webkit-scrollbar-thumb": {
        background: "rgba(96,165,250,.35)",
        borderRadius: 99,
      },
    }}
  >
    {children}
  </Box>
);

const SectionTitle = ({ title, action }) => (
  <Stack
    direction="row"
    sx={{ 
      mb: 2,
      alignItems:"center",
      justifyContent:"space-between", 
    }}
  >
    <Typography sx={{ fontSize: 22, fontWeight: 900, color: "#fff" }}>
      {title}
    </Typography>

    {action}
  </Stack>
);

const EmptyText = ({ children }) => (
  <Typography sx={{ color: "#8fa0bf" }}>{children}</Typography>
);

const SummaryCard = ({ title, value, subtitle, icon, accent = "#60a5fa" }) => (
  <Card sx={{ ...cardSx, height: "100%" }}>
    <CardContent
      sx={{
        minHeight: 145,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Box>
        <Typography sx={{ color: "#8fa0bf", fontSize: 14 }}>
          {title}
        </Typography>

        <Typography sx={{ fontSize: 30, fontWeight: 900, mt: 1 }}>
          {value}
        </Typography>

        {subtitle && (
          <Typography sx={{ color: accent, fontSize: 13, mt: 1 }}>
            {subtitle}
          </Typography>
        )}
      </Box>

      <Box
        sx={{
          width: 52,
          height: 52,
          borderRadius: "18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `${accent}24`,
          color: accent,
          flexShrink: 0,
          "& svg": {
            fontSize: 28,
          },
        }}
      >
        {icon}
      </Box>
    </CardContent>
  </Card>
);

const actionButtonSx = {
  height: 40,
  px: 2.2,
  borderRadius: 2.5,
  color: "#fff",
  borderColor: "rgba(96,165,250,.7)",
  fontWeight: 800,
  fontSize: 12,
  whiteSpace: "nowrap",
  textTransform: "uppercase",
  "& .MuiButton-startIcon": {
    mr: 0.8,
    "& svg": {
      fontSize: 18,
    },
  },
};

const Finance = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [goals, setGoals] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [openExpenseModal, setOpenExpenseModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [openGoalModal, setOpenGoalModal] = useState(false);
  const [openContributionModal, setOpenContributionModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [openBudgetModal, setOpenBudgetModal] = useState(false);
  const [openIncomeModal, setOpenIncomeModal] = useState(false);
  const [openManageWorkspace, setOpenManageWorkspace] = useState(false);
  const [periodFilter, setPeriodFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [goalToDelete, setGoalToDelete] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);
  const [openAiAnalysisModal, setOpenAiAnalysisModal] = useState(false);
  const [selectedIncome, setSelectedIncome] = useState(null);
  const [incomeToDelete, setIncomeToDelete] = useState(null);

  const [searchParams] = useSearchParams();

  const loadFinanceData = useCallback(async () => {
    if (!selectedWorkspaceId) return;

    try {
      const today = new Date();
      const currentMonth = today.getMonth() + 1;
      const currentYear = today.getFullYear();

      const { weekStart, weekEnd  } = getCurrentWeekRange();

      const [
        expensesData,
        goalsData,
        monthlyBudgetsData,
        weeklyBudgetsData,
        incomesData,
      ] = await Promise.all([
        getExpenses(selectedWorkspaceId),
        getSavingGoals(selectedWorkspaceId),
        getMonthlyBudgets(selectedWorkspaceId, currentMonth, currentYear, "monthly"),
        getMonthlyBudgets(
          selectedWorkspaceId,
          currentMonth,
          currentYear,
          "weekly",
          toInputDate(weekStart),
          toInputDate(weekEnd )
        ),
        getIncomes(selectedWorkspaceId),
      ]);

      setExpenses(expensesData);
      setGoals(goalsData);
      setBudgets([...weeklyBudgetsData, ...monthlyBudgetsData]);
      setIncomes(incomesData);
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

  const totalGoalTarget = useMemo(() => {
    return goals.reduce(
      (total, goal) => total + Number(goal.targetAmount || 0),
      0
    );
  }, [goals]);

  const goalProgress = useMemo(() => {
    if (totalGoalTarget <= 0) return 0;
    return (totalSaved / totalGoalTarget) * 100;
  }, [totalSaved, totalGoalTarget]);

  const weeklyExpenses = useMemo(() => {
    const { weekStart, weekEnd } = getCurrentWeekRange();

    return expenses
      .filter((expense) => isDateBetween(expense.date, weekStart, weekEnd))
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

  const yearlyExpenses = useMemo(() => {
    const today = new Date();

    return expenses
      .filter((expense) => {
        const date = new Date(expense.date);
        return date.getFullYear() === today.getFullYear();
      })
      .reduce((total, expense) => total + Number(expense.amount || 0), 0);
  }, [expenses]);

  const monthlyIncome = useMemo(() => {
    const today = new Date();

    return incomes
      .filter((income) => {
        const date = new Date(income.startDate);

        return (
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear()
        );
      })
      .reduce((total, income) => total + Number(income.amount || 0), 0);
  }, [incomes]);

  const currentBalance = useMemo(() => {
    return monthlyIncome - monthlyExpenses;
  }, [monthlyIncome, monthlyExpenses]);

  const savingsRate = useMemo(() => {
    if (monthlyIncome <= 0) return 0;
    return (totalSaved / monthlyIncome) * 100;
  }, [monthlyIncome, totalSaved]);

  const expenseToIncomeRatio = useMemo(() => {
    if (monthlyIncome <= 0) return 0;
    return (monthlyExpenses / monthlyIncome) * 100;
  }, [monthlyExpenses, monthlyIncome]);

  const filteredExpenses = useMemo(() => {
    const today = new Date();

    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);

      const matchesCategory =
        categoryFilter === "all" || expense.category === categoryFilter;

      let matchesPeriod = true;

      if (periodFilter === "week") {
        const { weekStart, weekEnd } = getCurrentWeekRange();
        matchesPeriod = isDateBetween(expenseDate, weekStart, weekEnd);
      }

      if (periodFilter === "month") {
        matchesPeriod =
          expenseDate.getMonth() === today.getMonth() &&
          expenseDate.getFullYear() === today.getFullYear();
      }

      if (periodFilter === "year") {
        matchesPeriod = expenseDate.getFullYear() === today.getFullYear();
      }

      return matchesCategory && matchesPeriod;
    });
  }, [expenses, periodFilter, categoryFilter]);

  const budgetProgress = useMemo(() => {
    return budgets.map((budget) => {
      const spent = expenses
        .filter((expense) => {
          const expenseDate = new Date(expense.date);

          if (budget.periodType === "weekly") {
            return (
              expense.category === budget.category &&
              isDateBetween(expenseDate, new Date(budget.weekStart), new Date(budget.weekEnd))
            );
          }

          return (
            expense.category === budget.category &&
            expenseDate.getMonth() + 1 === Number(budget.month) &&
            expenseDate.getFullYear() === Number(budget.year)
          );
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

  useEffect(() => {
   console.log("Budget Progress Data:", budgetProgress); 
  }, [budgetProgress]);

  

  const budgetUsedPercentage = useMemo(() => {
    const totalBudget = budgetProgress.reduce(
      (total, budget) => total + Number(budget.amount || 0),
      0
    );

    const totalSpentAgainstBudget = budgetProgress.reduce(
      (total, budget) => total + Number(budget.spent || 0),
      0
    );

    if (totalBudget <= 0) return 0;

    return (totalSpentAgainstBudget / totalBudget) * 100;
  }, [budgetProgress]);

  const financialInsights = useMemo(() => {
    const insights = [];

    if (budgetProgress.length > 0) {
      const overBudget = budgetProgress.filter(
        (budget) => budget.percentage >= 100
      );
      const warningBudget = budgetProgress.filter(
        (budget) => budget.percentage >= 80 && budget.percentage < 100
      );

      overBudget.forEach((budget) => {
        insights.push({
          type: "danger",
          title: "Over budget",
          message: `You are over your ${budget.category} budget by ${formatCurrency(
            Math.abs(budget.remaining)
          )}.`,
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

    if (monthlyIncome > 0) {
      insights.push({
        type: "success",
        title: "Cash flow",
        message: `Your current monthly balance is ${formatCurrency(
          currentBalance
        )}.`,
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
          message: `${
            biggestCategory[0]
          } is your biggest category with ${formatCurrency(
            biggestCategory[1]
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
            message: `You are ${formatCurrency(remaining)} away from "${
              goal.title
            }".`,
          });
        }
      });
    }

    if (insights.length === 0) {
      insights.push({
        type: "info",
        title: "Ready for insights",
        message:
          "Add expenses, budgets, income and goals to receive smarter financial insights.",
      });
    }

    return insights.slice(0, 5);
  }, [budgetProgress, currentBalance, expenses, goals, monthlyIncome]);

  const handleGenerateAiAnalysis = async () => {
    try {
      setLoadingAi(true);

      const result = await generateAiSuggestion({
        type: "finance_analysis",
        prompt:
          "Analyze this finance workspace and return a practical financial health report with score, strengths, risks and recommendations.",
        context: {
          workspace: selectedWorkspace,
          expenses,
          goals,
          budgets,
          incomes,
          budgetProgress,
          summary: {
            totalExpenses,
            weeklyExpenses,
            monthlyExpenses,
            yearlyExpenses,
            monthlyIncome,
            currentBalance,
            savingsRate,
            budgetUsedPercentage,
            totalSaved,
            activeGoals: goals.filter((goal) => goal.status === "active")
              .length,
          },
        },
      });

      setAiAnalysis(result);
    } catch (error) {
      console.error("Error generating AI analysis:", error);
    } finally {
      setLoadingAi(false);
    }
  };

  const activeGoals = goals.filter((goal) => goal.status === "active").length;

  const planningPanel = (
    <Stack spacing={3}>
      <Card sx={cardSx}>
        <CardContent>
          <SectionTitle title="Budgets" />

          {budgetProgress.length === 0 ? (
            <EmptyText>No budgets created yet.</EmptyText>
          ) : (
            <Stack spacing={2}>
              {budgetProgress.slice(0, 4).map((budget) => {
                const isWarning =
                  budget.percentage >= 80 && budget.percentage < 100;
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
                      sx={{ 
                        mb: 1,
                        alignItems:"center",
                        justifyContent:"space-between",
                      }}
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
                          {budget.periodType === "weekly" ? "Weekly" : "Monthly"} •{" "}
                          {formatCurrency(budget.spent)} / {formatCurrency(budget.amount)}
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
                        ? `Over budget by ${formatCurrency(
                            Math.abs(budget.remaining)
                          )}`
                        : `${formatCurrency(budget.remaining)} remaining`}
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
          <SectionTitle title="Saving Goals" />

          {goals.length === 0 ? (
            <EmptyText>No saving goals created yet.</EmptyText>
          ) : (
            <ScrollBox maxHeight={340}>
              <Stack spacing={2}>
                {goals.map((goal) => {
                  const progress =
                    (Number(goal.currentAmount || 0) /
                      Number(goal.targetAmount || 1)) *
                    100;

                  return (
                    <Box
                      key={goal._id}
                      sx={{
                        p: 2,
                        borderRadius: 4,
                        background: "rgba(15,23,42,.65)",
                        border: "1px solid rgba(148,163,184,.14)",
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
                        <Typography fontWeight={900}>{goal.title}</Typography>

                        <Typography sx={{ color: "#8fa0bf", fontSize: 13 }}>
                          {formatCurrency(goal.currentAmount)} /{" "}
                          {formatCurrency(goal.targetAmount)}
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
                })}
              </Stack>
            </ScrollBox>
          )}
        </CardContent>
      </Card>
    </Stack>
  );

  return (
    <MainLayout>
      <Box
        sx={{
          maxWidth: 1380,
          mx: "auto",
          px: { xs: 2, md: 4 },
          py: 5,
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          sx={{
            mb: 4,
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", md: "center" },
          }}
        >
          <Box>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
              <Box
                component="img"
                src="/orbit_planner_logo.png"
                alt="Orbit Planner"
                sx={{
                  width: 44,
                  height: 44,
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
                  fontSize: { xs: 32, md: 38 },
                  fontWeight: 900,
                  color: "#fff",
                  letterSpacing: "-1px",
                  lineHeight: 1,
                }}
              >
                Finance Planner
              </Typography>
            </Stack>

            <Typography sx={{ color: "#8fa0bf", mt: 0.8, fontSize: 14 }}>
              Manage personal and shared finances in one place.
            </Typography>
          </Box>

          <Stack
            direction="row"
            spacing={1.5}
            sx={{
              flexWrap: "wrap",
              justifyContent: { xs: "flex-start", md: "flex-end" },
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
              sx={actionButtonSx}
            >
              Add Expense
            </Button>

            <Button
              variant="outlined"
              startIcon={<AttachMoneyIcon />}
              onClick={() => {
                setSelectedIncome(null);
                setOpenIncomeModal(true);
              }}
              disabled={!selectedWorkspaceId}
              sx={{
                ...actionButtonSx,
                borderColor: "rgba(34,197,94,.7)",
              }}
            >
              Add Income
            </Button>

            <Button
              variant="outlined"
              startIcon={<AccountBalanceWalletIcon />}
              onClick={() => setOpenBudgetModal(true)}
              disabled={!selectedWorkspaceId}
              sx={{
                ...actionButtonSx,
                borderColor: "rgba(167,139,250,.65)",
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
                ...actionButtonSx,
                border: "none",
                background: "linear-gradient(135deg,#2563eb,#7c3aed)",
              }}
            >
              New Goal
            </Button>
          </Stack>
        </Stack>

        <Card sx={{ ...cardSx, mb: 4 }}>
          <CardContent>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{
                alignItems: { xs: "stretch", sm: "center" }
              }}
            >
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
              lg: "repeat(4, 1fr)",
            },
            gap: 3,
            mb: 4,
          }}
        >
          <SummaryCard
            title="Monthly Income"
            value={formatCurrency(monthlyIncome)}
            subtitle={`${Math.round(savingsRate)}% savings rate`}
            icon={<AttachMoneyIcon />}
            accent="#22c55e"
          />

          <SummaryCard
            title="Week Expenses"
            value={formatCurrency(weeklyExpenses)}
            subtitle="Monday to Sunday"
            icon={<PaidIcon />}
            accent="#fbbf24"
          />

          <SummaryCard
            title="Month Expenses"
            value={formatCurrency(monthlyExpenses)}
            subtitle={
              monthlyIncome > 0
                ? `${Math.round(expenseToIncomeRatio)}% of income`
                : "Current month"
            }
            icon={<PaidIcon />}
            accent="#f87171"
          />

          <SummaryCard
            title="Current Balance"
            value={formatCurrency(currentBalance)}
            subtitle="Income minus monthly expenses"
            icon={<TrendingUpIcon />}
            accent={currentBalance >= 0 ? "#60a5fa" : "#f87171"}
          />

          <SummaryCard
            title="Total Saved"
            value={formatCurrency(totalSaved)}
            subtitle={
              totalGoalTarget > 0
                ? `${Math.round(goalProgress)}% of goals`
                : "No goal target yet"
            }
            icon={<SavingsIcon />}
            accent="#a78bfa"
          />

          <SummaryCard
            title="Active Goals"
            value={activeGoals}
            subtitle={
              totalGoalTarget > 0
                ? `${formatCurrency(totalGoalTarget)} target`
                : "Create your first goal"
            }
            icon={<SavingsIcon />}
            accent="#818cf8"
          />

          <SummaryCard
            title="Savings Rate"
            value={`${Math.round(savingsRate)}%`}
            subtitle="Saved compared to income"
            icon={<AttachMoneyIcon />}
            accent="#22c55e"
          />

          <SummaryCard
            title="Budget Used"
            value={`${Math.round(budgetUsedPercentage)}%`}
            subtitle="Spent against weekly/monthly budgets"
            icon={<AccountBalanceWalletIcon />}
            accent={
              budgetUsedPercentage >= 100
                ? "#f87171"
                : budgetUsedPercentage >= 80
                ? "#fbbf24"
                : "#60a5fa"
            }
          />
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "minmax(0, 1.05fr) minmax(360px, .95fr)",
            },
            gap: 3,
            mb: 4,
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
                  label="Time Range"
                  value={periodFilter}
                  onChange={(e) => setPeriodFilter(e.target.value)}
                  sx={fieldSx}
                >
                  <MenuItem value="all">All Time</MenuItem>
                  <MenuItem value="week">This Week</MenuItem>
                  <MenuItem value="month">This Month</MenuItem>
                  <MenuItem value="year">This Year</MenuItem>
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

              <SectionTitle title="Recent Expenses" />

              {filteredExpenses.length === 0 ? (
                <EmptyText>No expenses registered yet.</EmptyText>
              ) : (
                <ScrollBox maxHeight={355}>
                  {filteredExpenses.slice(0, 10).map((expense) => (
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
                        <Typography fontWeight={800}>
                          {expense.title}
                        </Typography>

                        <Typography sx={{ color: "#8fa0bf", fontSize: 13 }}>
                          {expense.category} • {formatDate(expense.date)}
                          {expense.createdBy?.name
                            ? ` • by ${expense.createdBy.name}`
                            : ""}
                        </Typography>
                      </Box>

                      <Stack direction="row" sx={{alignItems:"center"}} spacing={1.5}>
                        <Typography fontWeight={900}>
                          {formatCurrency(expense.amount)}
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
                  ))}
                </ScrollBox>
              )}
            </CardContent>
          </Card>

          <Card sx={{ ...cardSx, height: "100%" }}>
            <CardContent>
              <SectionTitle
                title="AI Financial Insights"
                action={
                  <Button
                    variant="outlined"
                    startIcon={<AutoAwesomeIcon />}
                    onClick={handleGenerateAiAnalysis}
                    disabled={loadingAi}
                    sx={{
                      borderRadius: 3,
                      textTransform: "none",
                      fontWeight: 800,
                      color: "#fff",
                      borderColor: "rgba(167,139,250,.45)",
                      "&:hover": {
                        borderColor: "#8b5cf6",
                        background: "rgba(139,92,246,.08)",
                      },
                    }}
                  >
                    {loadingAi ? "Generating..." : "Refresh Analysis"}
                  </Button>
                }
              />

              <ScrollBox maxHeight={340}>
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

                  {aiAnalysis && (
                    <Box
                      sx={{
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
                          fontSize: 16,
                        }}
                      >
                        Orbit AI Analysis
                      </Typography>

                      <Typography
                        sx={{
                          color: "#e2e8f0",
                          lineHeight: 1.8,
                          whiteSpace: "pre-line",
                        }}
                      >
                        {aiAnalysis}
                      </Typography>

                      <Button
                        size="small"
                        onClick={() => setOpenAiAnalysisModal(true)}
                        sx={{
                          mt: 1.5,
                          color: "#c4b5fd",
                          fontWeight: 900,
                          textTransform: "none",
                        }}
                      >
                        View full analysis
                      </Button>
                    </Box>
                  )}

                  {!aiAnalysis && (
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 4,
                        background: "rgba(255,255,255,.04)",
                        border: "1px solid rgba(255,255,255,.06)",
                      }}
                    >
                      <Typography sx={{ color: "#cbd5e1", lineHeight: 1.8 }}>
                        Click on <strong>"Refresh Analysis"</strong> to receive
                        an intelligent overview of your financial workspace.
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </ScrollBox>
            </CardContent>
          </Card>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "minmax(0, 1fr) minmax(360px, .8fr)",
            },
            gap: 3,
            mb: 4,
          }}
        >
          <Card sx={{ ...cardSx, height: "100%" }}>
            <CardContent>
              <SectionTitle title="Cash Flow Overview" />

              <Stack spacing={3}>
                {[
                  {
                    label: "Monthly Income",
                    value: monthlyIncome,
                    color: "#22c55e",
                  },
                  {
                    label: "Week Expenses",
                    value: weeklyExpenses,
                    color: "#fbbf24",
                  },
                  {
                    label: "Monthly Expenses",
                    value: monthlyExpenses,
                    color: "#f87171",
                  },
                  {
                    label: "Current Balance",
                    value: Math.max(currentBalance, 0),
                    color: currentBalance >= 0 ? "#60a5fa" : "#f87171",
                  },
                ].map((item) => {
                  const maxValue = Math.max(
                    monthlyIncome,
                    monthlyExpenses,
                    Math.abs(currentBalance),
                    1
                  );

                  const percentage = (item.value / maxValue) * 100;

                  return (
                    <Box key={item.label}>
                      <Stack
                        direction="row"
                        sx={{ 
                          mb: 1,
                          justifyContent:"space-between",
                        }}
                      >
                        <Typography sx={{ color: "#cbd5e1", fontWeight: 800 }}>
                          {item.label}
                        </Typography>

                        <Typography sx={{ color: item.color, fontWeight: 900 }}>
                          {formatCurrency(item.value)}
                        </Typography>
                      </Stack>

                      <LinearProgress
                        variant="determinate"
                        value={Math.min(percentage, 100)}
                        sx={{
                          height: 12,
                          borderRadius: 99,
                          background: "#1e293b",
                          "& .MuiLinearProgress-bar": {
                            borderRadius: 99,
                            background: item.color,
                          },
                        }}
                      />
                    </Box>
                  );
                })}
              </Stack>
            </CardContent>
          </Card>

          {planningPanel}
        </Box>

        <Card sx={{ ...cardSx, mb: 4 }}>
          <CardContent>
            <SectionTitle title="Expenses by Category" />
            <ExpenseCategoryChart expenses={filteredExpenses} />
          </CardContent>
        </Card>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "minmax(0, .9fr) minmax(0, 1.1fr)",
            },
            gap: 3,
          }}
        >
          <Card sx={cardSx}>
            <CardContent>
              <SectionTitle title="Recent Income" />

              {incomes.length === 0 ? (
                <EmptyText>No income registered yet.</EmptyText>
              ) : (
                <ScrollBox maxHeight={350}>
                  <Stack spacing={2}>
                    {incomes.slice(0, 8).map((income) => (
                      <Box
                        key={income._id}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: 2,
                          p: 2,
                          borderRadius: 4,
                          background: "rgba(15,23,42,.65)",
                          border: "1px solid rgba(148,163,184,.14)",
                        }}
                      >
                        <Box>
                          <Typography
                            sx={{
                              color: "#fff",
                              fontWeight: 900,
                              textTransform: "capitalize",
                            }}
                          >
                            {income.source?.replace("_", " ")}
                          </Typography>

                          <Typography sx={{ color: "#94a3b8", fontSize: 13 }}>
                            {income.period?.replace("_", " ")} •{" "}
                            {formatDate(income.startDate)}
                            {income.createdBy?.name
                              ? ` • by ${income.createdBy.name}`
                              : ""}
                          </Typography>
                        </Box>

                        <Stack direction="row" sx={{alignItems:"center"}} spacing={1.5}>
                          <Typography
                            sx={{
                              color: "#86efac",
                              fontWeight: 900,
                              fontSize: 18,
                            }}
                          >
                            +{formatCurrency(income.amount)}
                          </Typography>

                          <IconButton
                            size="small"
                            onClick={() => {
                              setSelectedIncome(income);
                              setOpenIncomeModal(true);
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
                              setIncomeToDelete(income);
                              setExpenseToDelete(null);
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
                    ))}
                  </Stack>
                </ScrollBox>
              )}
            </CardContent>
          </Card>

          <Card sx={cardSx}>
            <CardContent>
              <SectionTitle title="Expense History" />

              {expenses.length === 0 ? (
                <EmptyText>No expenses registered yet.</EmptyText>
              ) : (
                <ScrollBox maxHeight={350}>
                  <Stack spacing={2}>
                    {expenses.slice(0, 8).map((expense) => (
                      <Box
                        key={expense._id}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: 2,
                          p: 2,
                          borderRadius: 4,
                          background: "rgba(15,23,42,.65)",
                          border: "1px solid rgba(148,163,184,.14)",
                        }}
                      >
                        <Box>
                          <Typography sx={{ color: "#fff", fontWeight: 900 }}>
                            {expense.title}
                          </Typography>

                          <Typography sx={{ color: "#94a3b8", fontSize: 13 }}>
                            {expense.category} • {formatDate(expense.date)}
                            {expense.createdBy?.name
                              ? ` • by ${expense.createdBy.name}`
                              : ""}
                          </Typography>
                        </Box>

                        <Typography
                          sx={{
                            color: "#fca5a5",
                            fontWeight: 900,
                            fontSize: 18,
                          }}
                        >
                          -{formatCurrency(expense.amount)}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </ScrollBox>
              )}
            </CardContent>
          </Card>
        </Box>
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
            : incomeToDelete
            ? "Delete income"
            : "Delete expense"
        }
        message={
          goalToDelete
            ? `Are you sure you want to delete "${goalToDelete.title}"? This will also remove all contributions.`
            : incomeToDelete
            ? `Are you sure you want to delete this income record of ${formatCurrency(
                incomeToDelete.amount
              )}?`
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
          setIncomeToDelete(null);
        }}
        onConfirm={async () => {
          if (expenseToDelete) {
            await deleteExpense(expenseToDelete._id, selectedWorkspaceId);
          }

          if (goalToDelete) {
            await deleteSavingGoal(goalToDelete._id, selectedWorkspaceId);
          }

          if (incomeToDelete) {
            await deleteIncome(incomeToDelete._id, selectedWorkspaceId);
          }

          await loadFinanceData();

          setOpenDeleteDialog(false);
          setExpenseToDelete(null);
          setGoalToDelete(null);
          setIncomeToDelete(null);
        }}
      />

      <MonthlyBudgetModal
        open={openBudgetModal}
        onClose={() => setOpenBudgetModal(false)}
        workspaceId={selectedWorkspaceId}
        onSaved={loadFinanceData}
      />

      <AddIncomeModal
        open={openIncomeModal}
        onClose={() => {
          setOpenIncomeModal(false);
          setSelectedIncome(null);
        }}
        workspaceId={selectedWorkspaceId}
        income={selectedIncome}
        onSaved={loadFinanceData}
      />

      <Dialog
        open={openAiAnalysisModal}
        onClose={() => setOpenAiAnalysisModal(false)}
        fullWidth
        maxWidth="md"
        slotProps={{
          paper: {
            sx: {
              background:
                "linear-gradient(145deg, rgba(20,33,61,.98), rgba(15,23,42,.98))",
              color: "#f8fafc",
              borderRadius: 4,
              border: "1px solid rgba(255,255,255,.08)",
              boxShadow: "0 30px 80px rgba(0,0,0,.65)",
            },
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 900 }}>
          Orbit AI Financial Analysis
        </DialogTitle>

        <DialogContent>
          <Typography
            sx={{
              color: "#e2e8f0",
              lineHeight: 1.8,
              whiteSpace: "pre-line",
            }}
          >
            {aiAnalysis}
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setOpenAiAnalysisModal(false)}
            sx={{ color: "#94a3b8", fontWeight: 900 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
};

export default Finance;