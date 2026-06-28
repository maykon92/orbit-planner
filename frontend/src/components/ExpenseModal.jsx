import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import { useEffect, useState } from "react";
import { createExpense, updateExpense } from "../services/financeService";

const getToday = () => new Date().toISOString().split("T")[0];

const formatDateForInput = (date) => {
  if (!date) return getToday();
  return new Date(date).toISOString().split("T")[0];
};

const getInitialForm = () => ({
  title: "",
  amount: "",
  category: "other",
  date: getToday(),
  paymentMethod: "card",
  notes: "",
});

const ExpenseModal = ({ open, onClose, onSaved, expense = null, workspaceId }) => {
  const isEditing = !!expense;
  const [form, setForm] = useState(getInitialForm());

  useEffect(() => {
    if (expense) {
      setForm({
        title: expense.title || "",
        amount: expense.amount || "",
        category: expense.category || "other",
        date: formatDateForInput(expense.date),
        paymentMethod: expense.paymentMethod || "card",
        notes: expense.notes || "",
      });
    } else {
      setForm(getInitialForm());
    }
  }, [expense, open]);

  const handleSubmit = async () => {
    if (isEditing) {
      await updateExpense(expense._id, {
        workspaceId,
        ...form,
        amount: Number(form.amount),
      });
    } else {
      await createExpense({
        workspaceId,
        ...form,
        amount: Number(form.amount),
      });
    }

    await onSaved?.();
    onClose();
    setForm(getInitialForm());
  };

  const fieldSx = {
    mb: 2,
    input: { color: "#f8fafc" },
    textarea: { color: "#f8fafc" },
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
      PaperProps={{
        sx: {
          backgroundColor: "#0f172a",
          color: "#f8fafc",
          borderRadius: 4,
          border: "1px solid #1f2937",
          boxShadow: "0 30px 80px rgba(0,0,0,0.65)",
          overflow: "hidden",
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
        {isEditing ? "Edit Expense" : "Add Expense"}
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
          label="Title"
          margin="normal"
          value={form.title}
          sx={fieldSx}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <TextField
          fullWidth
          label="Amount"
          type="number"
          margin="normal"
          value={form.amount}
          sx={fieldSx}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />

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
          label="Date"
          type="date"
          margin="normal"
          value={form.date}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={fieldSx}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />

        <TextField
          fullWidth
          select
          label="Payment Method"
          margin="normal"
          value={form.paymentMethod}
          SelectProps={{ MenuProps: menuProps }}
          sx={fieldSx}
          onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
        >
          <MenuItem value="card">Card</MenuItem>
          <MenuItem value="cash">Cash</MenuItem>
          <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
          <MenuItem value="other">Other</MenuItem>
        </TextField>

        <TextField
          fullWidth
          label="Notes"
          margin="normal"
          multiline
          rows={3}
          value={form.notes}
          sx={fieldSx}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
      </DialogContent>

      <DialogActions
        sx={{
          backgroundColor: "#0f172a",
          borderTop: "1px solid #1f2937",
          p: 3,
        }}
      >
        <Button onClick={onClose} sx={{ color: "#94a3b8" }}>
          Cancel
        </Button>

        <Button variant="contained" onClick={handleSubmit}>
          {isEditing ? "Update" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExpenseModal;