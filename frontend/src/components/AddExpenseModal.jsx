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
import { createExpense } from "../services/financeService";

const AddExpenseModal = ({ open, onClose, onCreated }) => {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "other",
    date: new Date().toISOString().split("T")[0],
    paymentMethod: "card",
    notes: "",
  });

  const handleSubmit = async () => {
    const expense = await createExpense({
      ...form,
      amount: Number(form.amount),
    });

    onCreated(expense);
    onClose();

    setForm({
      title: "",
      amount: "",
      category: "other",
      date: new Date().toISOString().split("T")[0],
      paymentMethod: "card",
      notes: "",
    });
  };

  const fieldSx = {
    mb: 2,
    input: { color: "#f8fafc" },
    textarea: { color: "#f8fafc" },
    "& .MuiInputLabel-root": {
      color: "#94a3b8",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#60a5fa",
    },
    "& .MuiOutlinedInput-root": {
      background: "#111827",
      borderRadius: 3,
      color: "#f8fafc",
      "& fieldset": {
        borderColor: "#1f2937",
      },
      "&:hover fieldset": {
        borderColor: "#334155",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#2563eb",
      },
    },
    "& .MuiSelect-icon": {
      color: "#94a3b8",
    },
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth="sm"
      paperprops={{
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
        Add Expense
      </DialogTitle>

      <DialogContent
        sx={{
          backgroundColor: "#0f172a",
          color: "#f8fafc",
          borderBottom: "1px solid #1f2937",
          fontWeight: 800,
          px: 3,
          py: 2,
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
          selectprops={{
            MenuProps: {
              paperprops: {
                sx: {
                  background: "#0f172a",
                  color: "#f8fafc",
                  border: "1px solid #1f2937",
                },
              },
            },
          }}
          sx={fieldSx}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />

        <TextField
          fullWidth
          select
          label="Category"
          margin="normal"
          value={form.category}
          selectprops={{
            MenuProps: {
              paperprops: {
                sx: {
                  background: "#0f172a",
                  color: "#f8fafc",
                  border: "1px solid #1f2937",
                },
              },
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
          selectprops={{
            MenuProps: {
              paperprops: {
                sx: {
                  background: "#0f172a",
                  color: "#f8fafc",
                  border: "1px solid #1f2937",
                },
              },
            },
          }}
          sx={fieldSx}
          onChange={(e) =>
            setForm({ ...form, paymentMethod: e.target.value })
          }
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
          color: "#f8fafc",
          p: 3,
        }}
      >
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddExpenseModal;