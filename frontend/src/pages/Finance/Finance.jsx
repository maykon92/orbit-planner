import { useEffect, useMemo, useState } from "react";
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
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import SavingsIcon from "@mui/icons-material/Savings";
import PaidIcon from "@mui/icons-material/Paid";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PsychologyIcon from "@mui/icons-material/Psychology";

import MainLayout from "../../layouts/MainLayout";
import { getExpenses, getSavingGoals } from "../../services/financeService";
import AddExpenseModal from "../../components/AddExpenseModal";
import CreateSavingGoalModal from "../../components/CreateSavingGoalModal";
import AddContributionModal from "../../components/AddContributionModal";
import ExpenseCategoryChart from "../../components/ExpenseCategoryChart";

const cardSx = {
  borderRadius: 5,
  background:
    "linear-gradient(145deg, rgba(20,33,61,.98), rgba(15,23,42,.98))",
  border: "1px solid rgba(255,255,255,.07)",
  color: "#f8fafc",
  boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
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
  const [expenses, setExpenses] = useState([]);
  const [goals, setGoals] = useState([]);

  const [openExpenseModal, setOpenExpenseModal] = useState(false);
  const [openGoalModal, setOpenGoalModal] = useState(false);
  const [openContributionModal, setOpenContributionModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);

  const [periodFilter, setPeriodFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    const loadFinanceData = async () => {
      try {
        const [expensesData, goalsData] = await Promise.all([
          getExpenses(),
          getSavingGoals(),
        ]);

        setExpenses(expensesData);
        setGoals(goalsData);
      } catch (error) {
        console.error("Error loading finance data:", error);
      }
    };

    loadFinanceData();
  }, []);

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

  const activeGoals = goals.filter((goal) => goal.status === "active").length;

  return (
    <MainLayout>
      <Box
        sx={{
          maxWidth: 1180,
          mx: "auto",
          px: { xs: 2, md: 4 },
          py: 5,
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
          spacing={3}
          sx={{ mb: 4 }}
        >
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
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
                  fontWeight: 400,
                  color: "#fff",
                  letterSpacing: "-1.5px",
                  lineHeight: 1,
                }}
              >
                Finance Planner
              </Typography>
            </Box>

            <Typography 
              sx={{
                color: "#8fa0bf",
                mt: 1,
                fontSize: 16,
              }}
            >
              Manage expenses, saving goals and AI-powered financial insights.
            </Typography>
          </Box>

          <Stack 
            direction="row"
            spacing={2}
            alignitems="left"
            sx={{
              flexShrink: 0,
            }}
          >
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => setOpenExpenseModal(true)}
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
              variant="contained"
              startIcon={<SavingsIcon />}
              onClick={() => setOpenGoalModal(true)}
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
                  sx={{
                    minWidth: 170,
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
                  }}
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
                  sx={{
                    minWidth: 210,
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
                  }}
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
                      </Typography>
                    </Box>

                    <Typography fontWeight={900}>
                      ${Number(expense.amount).toFixed(2)}
                    </Typography>
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
                        justifyContent="space-between"
                        spacing={2}
                        sx={{ mb: 1 }}
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

                      <Button
                        size="small"
                        variant="outlined"
                        sx={{
                          mt: 1.5,
                          borderRadius: 3,
                          color: "#fff",
                          borderColor: "rgba(96,165,250,.5)",
                          textTransform: "none",
                          fontWeight: 700,
                        }}
                        onClick={() => {
                          setSelectedGoal(goal);
                          setOpenContributionModal(true);
                        }}
                      >
                        Add Money
                      </Button>
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

        <Card sx={{ ...cardSx }}>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(124,58,237,.18)",
                  color: "#a78bfa",
                }}
              >
                <PsychologyIcon />
              </Box>

              <Box>
                <Typography sx={{ fontSize: 24, fontWeight: 900 }}>
                  AI Financial Insights
                </Typography>

                <Typography sx={{ color: "#8fa0bf", fontSize: 14 }}>
                  Smart suggestions based on your expenses and saving goals.
                </Typography>
              </Box>
            </Stack>

            <Box
              sx={{
                mt: 3,
                p: 2,
                borderRadius: 4,
                background: "rgba(255,255,255,.04)",
                border: "1px solid rgba(255,255,255,.06)",
              }}
            >
              <Typography sx={{ color: "#cbd5e1" }}>
                Soon, Orbit AI will analyze your spending patterns, detect your
                biggest expense categories and suggest how much you should save
                each week to reach your goals.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <AddExpenseModal
        open={openExpenseModal}
        onClose={() => setOpenExpenseModal(false)}
        onCreated={(newExpense) => {
          setExpenses((prev) => [newExpense, ...prev]);
        }}
      />

      <CreateSavingGoalModal
        open={openGoalModal}
        onClose={() => setOpenGoalModal(false)}
        onCreated={(newGoal) => {
          setGoals((prev) => [newGoal, ...prev]);
        }}
      />

      <AddContributionModal
        open={openContributionModal}
        onClose={() => setOpenContributionModal(false)}
        goal={selectedGoal}
        onCreated={(contribution, amount) => {
          setGoals((prev) =>
            prev.map((goal) =>
              goal._id === contribution.goalId
                ? {
                    ...goal,
                    currentAmount: Number(goal.currentAmount || 0) + amount,
                  }
                : goal
            )
          );
        }}
      />
    </MainLayout>
  );
};

export default Finance;