import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  upsertMonthlyBudget,
  updateBudget,
} from "../services/financeService";

const getWeekRange = () => {
  const today = new Date();
  const day = today.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;

  const monday = new Date(today);
  monday.setDate(today.getDate() + diffToMonday);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return {
    weekStart: monday.toISOString().split("T")[0],
    weekEnd: sunday.toISOString().split("T")[0],
  };
};

const getInitialForm = () => {
  const today = new Date();
  const currentWeek = getWeekRange();

  return {
    category: "food",
    amount: "",
    periodType: "monthly",
    month: today.getMonth() + 1,
    year: today.getFullYear(),
    weekStart: currentWeek.weekStart,
    weekEnd: currentWeek.weekEnd,
  };
};

const formatDateForInput = (date) => {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
};

const MonthlyBudgetModal = ({
  open,
  onClose,
  onSaved,
  workspaceId,
  budget = null,
}) => {
  const isEditing = !!budget;
  const [form, setForm] = useState(getInitialForm());

  useEffect(() => {
    if (budget) {
      setForm({
        category: budget.category || "food",
        amount: budget.amount || "",
        periodType: budget.periodType || "monthly",
        month: budget.month || new Date().getMonth() + 1,
        year: budget.year || new Date().getFullYear(),
        weekStart: formatDateForInput(budget.weekStart),
        weekEnd: formatDateForInput(budget.weekEnd),
      });
    } else {
      setForm(getInitialForm());
    }
  }, [budget, open]);

  const handleSubmit = async () => {
    const payload = {
      workspaceId,
      category: form.category,
      amount: Number(form.amount),
      periodType: form.periodType,
      year: Number(form.year),
    };

    if (form.periodType === "monthly") {
      payload.month = Number(form.month);
    }

    if (form.periodType === "weekly") {
      payload.weekStart = form.weekStart;
      payload.weekEnd = form.weekEnd;
    }

    if (isEditing) {
      await updateBudget(budget._id, payload);
    } else {
      await upsertMonthlyBudget(payload);
    }

    await onSaved?.();
    onClose();
    setForm(getInitialForm());
  };

  const fieldSx = {
    mb: 2,
    input: { color: "#f8fafc" },
    "& .MuiInputLabel-root": { color: "#94a3b8" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#60a5fa" },
    "& .MuiOutlinedInput-root": {
      background: "#111827",
      borderRadius: 3,
      color: "#f8fafc",
      "& fieldset": { borderColor: "#1f2937" },
      "&:hover fieldset": { borderColor: "#334155" },
      "&.Mui-focused fieldset": { borderColor: "#2563eb" },
    },
    "& .MuiSelect-icon": { color: "#94a3b8" },
  };

  const menuProps = {
    PaperProps: {
      sx: {
        background: "#0f172a",
        color: "#f8fafc",
        border: "1px solid #1f2937",
      },
    },
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: {
            backgroundColor: "#0f172a",
            color: "#f8fafc",
            borderRadius: 4,
            border: "1px solid #1f2937",
            boxShadow: "0 30px 80px rgba(0,0,0,0.65)",
            overflow: "hidden",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: "#0f172a",
          color: "#f8fafc",
          borderBottom: "1px solid #1f2937",
          fontWeight: 900,
          fontSize: "1.25rem",
          px: 3,
          py: 2,
        }}
      >
        {isEditing ? "Edit Budget" : "Budget Planner"}
      </DialogTitle>

      <DialogContent
        sx={{
          backgroundColor: "#0f172a",
          color: "#f8fafc",
          px: 3,
          py: "24px !important",
        }}
      >
        <TextField
          fullWidth
          select
          label="Budget Type"
          margin="normal"
          value={form.periodType}
          slotProps={{
            select: {
              MenuProps: menuProps,
            },
          }}
          sx={fieldSx}
          onChange={(e) =>
            setForm({
              ...form,
              periodType: e.target.value,
            })
          }
        >
          <MenuItem value="weekly">Weekly</MenuItem>
          <MenuItem value="monthly">Monthly</MenuItem>
        </TextField>

        <TextField
          fullWidth
          select
          label="Category"
          margin="normal"
          value={form.category}
          slotProps={{
            select: {
              MenuProps: menuProps,
            },
          }}
          sx={fieldSx}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
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

        <TextField
          fullWidth
          label={
            form.periodType === "weekly"
              ? "Weekly Budget Amount"
              : "Monthly Budget Amount"
          }
          type="number"
          margin="normal"
          value={form.amount}
          sx={fieldSx}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />

        {form.periodType === "weekly" ? (
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              fullWidth
              label="Week Start"
              type="date"
              margin="normal"
              value={form.weekStart}
              slotProps={{ inputLabel: { shrink: true } }}
              sx={fieldSx}
              onChange={(e) =>
                setForm({ ...form, weekStart: e.target.value })
              }
            />

            <TextField
              fullWidth
              label="Week End"
              type="date"
              margin="normal"
              value={form.weekEnd}
              slotProps={{ inputLabel: { shrink: true } }}
              sx={fieldSx}
              onChange={(e) => setForm({ ...form, weekEnd: e.target.value })}
            />
          </Stack>
        ) : (
          <>
            <TextField
              fullWidth
              select
              label="Month"
              margin="normal"
              value={form.month}
              slotProps={{
                select: {
                  MenuProps: menuProps,
                },
              }}
              sx={fieldSx}
              onChange={(e) => setForm({ ...form, month: e.target.value })}
            >
              <MenuItem value={1}>January</MenuItem>
              <MenuItem value={2}>February</MenuItem>
              <MenuItem value={3}>March</MenuItem>
              <MenuItem value={4}>April</MenuItem>
              <MenuItem value={5}>May</MenuItem>
              <MenuItem value={6}>June</MenuItem>
              <MenuItem value={7}>July</MenuItem>
              <MenuItem value={8}>August</MenuItem>
              <MenuItem value={9}>September</MenuItem>
              <MenuItem value={10}>October</MenuItem>
              <MenuItem value={11}>November</MenuItem>
              <MenuItem value={12}>December</MenuItem>
            </TextField>

            <TextField
              fullWidth
              label="Year"
              type="number"
              margin="normal"
              value={form.year}
              sx={fieldSx}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
            />
          </>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          backgroundColor: "#0f172a",
          borderTop: "1px solid #1f2937",
          p: 3,
        }}
      >
        <Button onClick={onClose} sx={{ color: "#94a3b8", fontWeight: 800 }}>
          Cancel
        </Button>

        <Button variant="contained" onClick={handleSubmit}>
          {isEditing ? "Update Budget" : "Save Budget"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MonthlyBudgetModal;