import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import { createTab } from "../services/tabService";
import {
  orbitFormSelectSx,
  orbitMenuProps,
  orbitDialogPaperSx,
  orbitDialogTitleSx,
  orbitDialogContentSx,
  orbitDialogActionsSx,
} from "../theme";

import OrbitButton from "./ui/OrbitButton";

const tabTypes = [
  "agenda",
  "travel",
  "movies",
  "books",
  "fitness",
  "work",
  "study",
];

const CreateTabModal = ({ open, onClose, onCreated }) => {
  const [form, setForm] = useState({
    type: "agenda",
  });

  const handleSubmit = async () => {
    try {
      const newTab = await createTab(form);
      onCreated(newTab);
      onClose();
    } catch (error) {
      console.error(error);
      alert("Error creating tab");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: orbitDialogPaperSx,
        },
      }}
    >
      <DialogTitle sx={orbitDialogTitleSx}>Create Tab</DialogTitle>

      <DialogContent sx={orbitDialogContentSx}>
        <TextField
          fullWidth
          select
          label="Type"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          sx={orbitFormSelectSx}
          slotProps={{
            select: {
              MenuProps: orbitMenuProps,
            },
          }}
        >
          {tabTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>

      <DialogActions sx={orbitDialogActionsSx}>
        <OrbitButton onClick={onClose} variant="danger">
          Cancel
        </OrbitButton>

        <OrbitButton
          variant="primary"
          onClick={handleSubmit}
        >
          Create
        </OrbitButton>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTabModal;