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
      slotProps={{
          paper: {
              sx: {
              borderRadius: 4,
              background: "#0f172a",
              color: "#f8fafc",
              border: "1px solid #1f2937",
              boxShadow: "0 30px 80px rgba(0,0,0,0.65)",
              },
          },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 800,
          borderBottom: "1px solid #1f2937",
        }}
      >
        Create Space
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <TextField
          fullWidth
          select
          label="Type"
          margin="normal"
          value={form.type}
          sx={fieldSx}
          selectprops={{
            MenuProps: {
                PaperProps: {
                sx: {
                    background: "#0f172a",
                    color: "#f8fafc",
                    border: "1px solid #1f2937",
                },
                },
            },
          }}
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