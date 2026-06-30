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
import { createIncome, updateIncome } from "../services/financeService";

const getToday = () => new Date().toISOString().split("T")[0];

const getInitialForm = () => ({
  source: "salary",
  amount: "",
  period: "weekly",
  startDate: getToday(),
  endDate: "",
  notes: "",
});

const formatDateForInput = (date) => {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
};

const AddIncomeModal = ({
  open,
  onClose,
  onSaved,
  workspaceId,
  income = null,
}) => {
  const isEditing = !!income;
  const [form, setForm] = useState(getInitialForm());

  useEffect(() => {
    if (income) {
      setForm({
        source: income.source || "salary",
        amount: income.amount || "",
        period: income.period || "weekly",
        startDate: formatDateForInput(income.startDate),
        endDate: formatDateForInput(income.endDate),
        notes: income.notes || "",
      });
    } else {
      setForm(getInitialForm());
    }
  }, [income, open]);

  const handleSubmit = async () => {
    if (isEditing) {
      await updateIncome(income._id, {
        workspaceId,
        ...form,
        amount: Number(form.amount),
      });
    } else {
      await createIncome({
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
        {isEditing ? "Edit Income" : "Add Income"}
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
          label="Source"
          margin="normal"
          value={form.source}
          SelectProps={{ MenuProps: menuProps }}
          sx={fieldSx}
          onChange={(e) => setForm({ ...form, source: e.target.value })}
        >
          <MenuItem value="salary">Salary</MenuItem>
          <MenuItem value="freelance">Freelance</MenuItem>
          <MenuItem value="cash_job">Cash Job</MenuItem>
          <MenuItem value="refund">Refund</MenuItem>
          <MenuItem value="other">Other</MenuItem>
        </TextField>

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
          label="Period"
          margin="normal"
          value={form.period}
          SelectProps={{ MenuProps: menuProps }}
          sx={fieldSx}
          onChange={(e) => setForm({ ...form, period: e.target.value })}
        >
          <MenuItem value="weekly">Weekly</MenuItem>
          <MenuItem value="monthly">Monthly</MenuItem>
          <MenuItem value="one_time">One Time</MenuItem>
        </TextField>

        <TextField
          fullWidth
          label="Start Date"
          type="date"
          margin="normal"
          value={form.startDate}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={fieldSx}
          onChange={(e) => setForm({ ...form, startDate: e.target.value })}
        />

        <TextField
          fullWidth
          label="End Date"
          type="date"
          margin="normal"
          value={form.endDate}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={fieldSx}
          onChange={(e) => setForm({ ...form, endDate: e.target.value })}
        />

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
        <Button onClick={onClose} sx={{ color: "#94a3b8", fontWeight: 800 }}>
          Cancel
        </Button>

        <Button variant="contained" onClick={handleSubmit}>
          {isEditing ? "Update Income" : "Save Income"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddIncomeModal;