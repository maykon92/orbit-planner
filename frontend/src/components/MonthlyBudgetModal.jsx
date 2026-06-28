import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import { upsertMonthlyBudget } from "../services/financeService";

const MonthlyBudgetModal = ({
  open,
  onClose,
  onSaved,
  workspaceId,
}) => {
  const today = new Date();

  const [form, setForm] = useState({
    category: "food",
    amount: "",
    month: today.getMonth() + 1,
    year: today.getFullYear(),
  });

  const handleSubmit = async () => {
    await upsertMonthlyBudget({
      workspaceId,
      ...form,
      amount: Number(form.amount),
      month: Number(form.month),
      year: Number(form.year),
    });

    await onSaved?.();
    onClose();

    setForm({
      category: "food",
      amount: "",
      month: today.getMonth() + 1,
      year: today.getFullYear(),
    });
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
          fontWeight: 800,
          fontSize: "1.25rem",
          px: 3,
          py: 2,
        }}
      >
        Monthly Budget
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
          label="Category"
          margin="normal"
          value={form.category}
          SelectProps={{ MenuProps: menuProps }}
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
          label="Budget Amount"
          type="number"
          margin="normal"
          value={form.amount}
          sx={fieldSx}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />

        <TextField
          fullWidth
          select
          label="Month"
          margin="normal"
          value={form.month}
          SelectProps={{ MenuProps: menuProps }}
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
          Save Budget
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MonthlyBudgetModal;