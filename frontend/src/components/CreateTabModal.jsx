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
import { createTab } from "../services/tabService";
import {
  orbitFormSelectSx,
  orbitMenuProps,
  orbitDialogPaperSx,
  orbitDialogTitleSx,
  orbitDialogContentSx,
  orbitDialogActionsSx,
  orbitPrimaryButtonSx,
} from "../theme";

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
        <Button onClick={onClose} sx={{ color: "#94a3b8", fontWeight: 800 }}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={orbitPrimaryButtonSx}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTabModal;