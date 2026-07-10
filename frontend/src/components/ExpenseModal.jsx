import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import {
  createExpense,
  updateExpense,
} from "../services/financeService";

import OrbitButton from "./ui/OrbitButton";

import {
  orbitTextFieldSx,
  orbitFormSelectSx,
  orbitMenuProps,
  orbitDatePickerProps,
  orbitDialogPaperSx,
  orbitDialogTitleSx,
  orbitDialogContentSx,
  orbitDialogActionsSx,
} from "../theme";

const getToday = () => dayjs().format("YYYY-MM-DD");

const formatDateForInput = (date) => {
  if (!date) return getToday();

  const parsedDate = dayjs(date);

  if (!parsedDate.isValid()) {
    return getToday();
  }

  return parsedDate.format("YYYY-MM-DD");
};

const getInitialForm = () => ({
  title: "",
  amount: "",
  category: "other",
  date: getToday(),
  paymentMethod: "card",
  notes: "",
});

const ExpenseModal = ({
  open,
  onClose,
  onSaved,
  expense = null,
  workspaceId,
}) => {
  const isEditing = Boolean(expense);

  const [form, setForm] = useState(getInitialForm());
  const [saving, setSaving] = useState(false);

  const selectSlotProps = {
    select: {
      MenuProps: orbitMenuProps,
    },
  };

  useEffect(() => {
    if (!open) return;

    if (expense) {
      setForm({
        title: expense.title || "",
        amount: expense.amount ?? "",
        category: expense.category || "other",
        date: formatDateForInput(expense.date),
        paymentMethod: expense.paymentMethod || "card",
        notes: expense.notes || "",
      });
    } else {
      setForm(getInitialForm());
    }
  }, [expense, open]);

  const handleClose = () => {
    if (saving) return;

    setForm(getInitialForm());
    onClose();
  };

  const handleSubmit = async () => {
    if (saving) return;

    if (!workspaceId) {
      alert("Workspace is required.");
      return;
    }

    if (!form.title.trim()) {
      alert("Expense title is required.");
      return;
    }

    const amount = Number(form.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      alert("Enter a valid expense amount.");
      return;
    }

    if (!form.date) {
      alert("Expense date is required.");
      return;
    }

    const payload = {
      workspaceId,
      title: form.title.trim(),
      amount,
      category: form.category,
      date: form.date,
      paymentMethod: form.paymentMethod,
      notes: form.notes.trim(),
    };

    try {
      setSaving(true);

      if (isEditing) {
        await updateExpense(expense._id, payload);
      } else {
        await createExpense(payload);
      }

      await onSaved?.();

      setForm(getInitialForm());
      onClose();
    } catch (error) {
      console.error("Error saving expense:", error);

      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Error saving expense."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: orbitDialogPaperSx,
        },
      }}
    >
      <DialogTitle sx={orbitDialogTitleSx}>
        {isEditing ? "Edit Expense" : "Add Expense"}
      </DialogTitle>

      <DialogContent sx={orbitDialogContentSx}>
        <TextField
          fullWidth
          label="Title"
          value={form.title}
          sx={orbitTextFieldSx}
          onChange={(event) =>
            setForm((previousForm) => ({
              ...previousForm,
              title: event.target.value,
            }))
          }
        />

        <TextField
          fullWidth
          label="Amount"
          type="number"
          value={form.amount}
          sx={orbitTextFieldSx}
          slotProps={{
            htmlInput: {
              min: 0,
              step: "0.01",
            },
          }}
          onChange={(event) =>
            setForm((previousForm) => ({
              ...previousForm,
              amount: event.target.value,
            }))
          }
        />

        <TextField
          fullWidth
          select
          label="Category"
          value={form.category}
          sx={orbitFormSelectSx}
          slotProps={selectSlotProps}
          onChange={(event) =>
            setForm((previousForm) => ({
              ...previousForm,
              category: event.target.value,
            }))
          }
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

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Date"
            format="DD/MM/YYYY"
            value={form.date ? dayjs(form.date) : null}
            onChange={(value) =>
              setForm((previousForm) => ({
                ...previousForm,
                date:
                  value && value.isValid()
                    ? value.format("YYYY-MM-DD")
                    : "",
              }))
            }
            slotProps={orbitDatePickerProps}
          />
        </LocalizationProvider>

        <TextField
          fullWidth
          select
          label="Payment Method"
          value={form.paymentMethod}
          sx={orbitFormSelectSx}
          slotProps={selectSlotProps}
          onChange={(event) =>
            setForm((previousForm) => ({
              ...previousForm,
              paymentMethod: event.target.value,
            }))
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
          multiline
          rows={3}
          value={form.notes}
          sx={orbitTextFieldSx}
          onChange={(event) =>
            setForm((previousForm) => ({
              ...previousForm,
              notes: event.target.value,
            }))
          }
        />
      </DialogContent>

      <DialogActions sx={orbitDialogActionsSx}>
        <OrbitButton
          variant="secondary"
          onClick={handleClose}
          disabled={saving}
        >
          Cancel
        </OrbitButton>

        <OrbitButton
          variant="primary"
          onClick={handleSubmit}
          disabled={saving}
        >
          {saving
            ? isEditing
              ? "Updating..."
              : "Saving..."
            : isEditing
              ? "Update"
              : "Save"}
        </OrbitButton>
      </DialogActions>
    </Dialog>
  );
};

export default ExpenseModal;