import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  createSavingGoal,
  updateSavingGoal,
} from "../services/financeService";

const getInitialForm = () => ({
  title: "",
  targetAmount: "",
  deadline: "",
  purpose: "",
});

const formatDateForInput = (date) => {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
};

const CreateSavingGoalModal = ({
  open,
  onClose,
  onCreated,
  workspaceId,
  goal = null,
}) => {
  const isEditing = !!goal;
  const [form, setForm] = useState(getInitialForm());

  useEffect(() => {
    if (goal) {
      setForm({
        title: goal.title || "",
        targetAmount: goal.targetAmount || "",
        deadline: formatDateForInput(goal.deadline),
        purpose: goal.purpose || "",
      });
    } else {
      setForm(getInitialForm());
    }
  }, [goal, open]);

  const handleSubmit = async () => {
    if (isEditing) {
      await updateSavingGoal(goal._id, {
        workspaceId,
        ...form,
        targetAmount: Number(form.targetAmount),
      });
    } else {
      await createSavingGoal({
        workspaceId,
        ...form,
        targetAmount: Number(form.targetAmount),
      });
    }

    await onCreated?.();
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
        {isEditing ? "Edit Saving Goal" : "New Saving Goal"}
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
          p: 3,
        }}
      >
        <Button onClick={onClose} sx={{ color: "#94a3b8", fontWeight: 800 }}>
          Cancel
        </Button>

        <Button variant="contained" onClick={handleSubmit}>
          {isEditing ? "Update Goal" : "Create Goal"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateSavingGoalModal;