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
    name: "",
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
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Create New Tab</DialogTitle>

      <DialogContent>
        <TextField
          fullWidth
          label="Tab Name"
          margin="normal"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <TextField
          fullWidth
          select
          label="Type"
          margin="normal"
          value={form.type}
          onChange={(e) =>
            setForm({ ...form, type: e.target.value })
          }
        >
          {tabTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTabModal;