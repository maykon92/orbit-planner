import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
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
        Create Tab
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <FormControl fullWidth margin="normal" sx={fieldSx}>
          <InputLabel sx={{ color: "#60a5fa" }}>Type</InputLabel>

          <Select
            label="Type"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            MenuProps={{
              paperprops: {
                sx: {
                  background: "#0f172a !important",
                  color: "#f8fafc",
                  border: "1px solid #1f2937",
                  borderRadius: 3,
                  mt: 1,

                  "& .MuiMenuItem-root": {
                    color: "#f8fafc",
                    fontSize: 15,
                    borderRadius: 2,
                    mx: 1,
                    my: 0.5,
                  },

                  "& .MuiMenuItem-root:hover": {
                    background: "rgba(37,99,235,0.18)",
                  },

                  "& .Mui-selected": {
                    background: "rgba(37,99,235,0.28) !important",
                    color: "#60a5fa",
                  },
                },
              },
            }}
            sx={{
              background: "#111827",
              borderRadius: 3,
              color: "#f8fafc",

              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#2563eb",
              },

              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#60a5fa",
              },

              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#2563eb",
              },

              "& .MuiSvgIcon-root": {
                color: "#94a3b8",
              },
            }}
          >
            {tabTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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