import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";

import OrbitButton from "./ui/OrbitButton";

import {
  orbitTextFieldSx,
  orbitDialogPaperSx,
  orbitDialogTitleSx,
  orbitDialogContentSx,
  orbitDialogActionsSx,
} from "../theme";

const getInitialForm = () => ({
  name: "",
});

const CreateFinanceWorkspaceModal = ({
  open,
  onClose,
  onSubmit,
  saving = false,
}) => {
  const [form, setForm] = useState(getInitialForm());
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    setForm(getInitialForm());
    setError("");
  }, [open]);

  const handleClose = () => {
    if (saving) return;

    setForm(getInitialForm());
    setError("");
    onClose();
  };

  const handleSubmit = async () => {
    const name = form.name.trim();

    if (!name) {
      setError("Workspace name is required.");
      return;
    }

    setError("");

    await onSubmit({
      name,
      type: "shared",
    });
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit();
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
        Create Shared Workspace
      </DialogTitle>

      <DialogContent sx={orbitDialogContentSx}>
        <TextField
          autoFocus
          fullWidth
          label="Workspace name"
          placeholder="Example: Partner Finance"
          value={form.name}
          error={Boolean(error)}
          helperText={error}
          sx={orbitTextFieldSx}
          onKeyDown={handleKeyDown}
          onChange={(event) => {
            setForm({
              name: event.target.value,
            });

            if (error) {
              setError("");
            }
          }}
        />
      </DialogContent>

      <DialogActions sx={orbitDialogActionsSx}>
        <OrbitButton
          variant="danger"
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
          {saving ? "Creating..." : "Create Workspace"}
        </OrbitButton>
      </DialogActions>
    </Dialog>
  );
};

export default CreateFinanceWorkspaceModal;