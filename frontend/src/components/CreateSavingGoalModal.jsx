import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { createSavingGoal } from "../services/financeService";

const CreateSavingGoalModal = ({ open, onClose, onCreated }) => {
  const [form, setForm] = useState({
    title: "",
    targetAmount: "",
    deadline: "",
    purpose: "",
  });

  const handleSubmit = async () => {
    const goal = await createSavingGoal({
      ...form,
      targetAmount: Number(form.targetAmount),
    });

    onCreated(goal);
    onClose();

    setForm({
      title: "",
      targetAmount: "",
      deadline: "",
      purpose: "",
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
        New Saving Goal
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
          label="Goal Title"
          margin="normal"
          value={form.title}
          sx={fieldSx}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <TextField
          fullWidth
          label="Target Amount"
          type="number"
          margin="normal"
          value={form.targetAmount}
          sx={fieldSx}
          onChange={(e) =>
            setForm({ ...form, targetAmount: e.target.value })
          }
        />

        <TextField
          fullWidth
          label="Deadline"
          type="date"
          margin="normal"
          value={form.deadline}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={fieldSx}
          onChange={(e) => setForm({ ...form, deadline: e.target.value })}
        />

        <TextField
          fullWidth
          label="Purpose"
          margin="normal"
          multiline
          rows={3}
          value={form.purpose}
          sx={fieldSx}
          onChange={(e) => setForm({ ...form, purpose: e.target.value })}
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
          Create Goal
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateSavingGoalModal;