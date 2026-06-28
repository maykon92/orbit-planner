import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { createContribution } from "../services/financeService";

const AddContributionModal = ({
  open,
  onClose,
  goal,
  workspaceId,
  onCreated,
}) => {
  const [form, setForm] = useState({
    amount: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const handleSubmit = async () => {
    if (!goal?._id) return;

    const contribution = await createContribution(goal._id, {
      workspaceId,
      ...form,
      amount: Number(form.amount),
    });

    onCreated(contribution, Number(form.amount));

    setForm({
      amount: "",
      date: new Date().toISOString().split("T")[0],
      notes: "",
    });

    onClose();
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
        Add Money to Goal
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
          label="Amount"
          type="number"
          margin="normal"
          value={form.amount}
          sx={fieldSx}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />

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
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddContributionModal;