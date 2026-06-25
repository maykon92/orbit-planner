import { useMemo } from "react";
import {
  Box,
  Typography,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ExpenseCategoryChart = ({ expenses = [] }) => {
  const chartData = useMemo(() => {
    const totals = {};

    expenses.forEach((expense) => {
      const category = expense.category || "other";
      totals[category] =
        (totals[category] || 0) + Number(expense.amount || 0);
    });

    return Object.entries(totals)
      .map(([category, amount]) => ({
        category,
        amount,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [expenses]);

  if (chartData.length === 0) {
    return (
      <Typography sx={{ color: "#8fa0bf" }}>
        No data to display yet.
      </Typography>
    );
  }

  return (
    <Box sx={{ width: "100%", height: 320 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <XAxis
            dataKey="category"
            stroke="#94a3b8"
            tick={{ fill: "#94a3b8", fontSize: 12 }}
          />

          <YAxis
            stroke="#94a3b8"
            tick={{ fill: "#94a3b8", fontSize: 12 }}
          />

          <Tooltip
            cursor={{ fill: "rgba(96,165,250,0.08)" }}
            contentStyle={{
              background: "#0f172a",
              border: "1px solid #1f2937",
              borderRadius: 12,
              color: "#fff",
            }}
            formatter={(value) => [`$${Number(value).toFixed(2)}`, "Amount"]}
          />

          <Bar
            dataKey="amount"
            radius={[8, 8, 0, 0]}
            fill="#3b82f6"
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default ExpenseCategoryChart;