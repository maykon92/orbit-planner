import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import { useEffect, useState } from "react";

const EditItemModal = ({ open, onClose, item, onSave }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "planned",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    destination: "",
    budget: "",
    author: "",
    platform: "",
    genre: "",
    priority: "",
    duration: "",
  });

  const selectedType = item?.type;

  useEffect(() => {
    if (item) {
      setForm({
        title: item.title || "",
        description: item.description || "",
        status: item.status || "planned",
        startDate: item.data?.startDate || "",
        endDate: item.data?.endDate || "",
        startTime: item.data?.startTime || "",
        endTime: item.data?.endTime || "",
        destination: item.data?.destination || "",
        budget: item.data?.budget || "",
        author: item.data?.author || "",
        platform: item.data?.platform || "",
        genre: item.data?.genre || "",
        priority: item.data?.priority || "",
        duration: item.data?.duration || "",
      });
    }
  }, [item]);

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

  const selectProps = {
    MenuProps: {
      paperprops: {
        sx: {
          background: "#0f172a",
          color: "#f8fafc",
          border: "1px solid #1f2937",
        },
      },
    },
  };

  const handleSubmit = () => {
    onSave({
      title: form.title,
      description: form.description,
      status: form.status,
      data: {
        startDate: form.startDate,
        endDate: form.endDate || form.startDate,
        startTime: form.startTime,
        endTime: form.endTime,

        destination: form.destination,
        budget: form.budget ? Number(form.budget) : undefined,

        author: form.author,

        platform: form.platform,
        genre: form.genre,

        priority: form.priority,

        duration: form.duration,
      },
    });
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
        Edit {selectedType ? selectedType.charAt(0).toUpperCase() + selectedType.slice(1) : "Item"}
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <TextField
          fullWidth
          label="Title"
          margin="normal"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          sx={fieldSx}
        />

        <TextField
          fullWidth
          label="Description"
          margin="normal"
          multiline
          rows={3}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          sx={fieldSx}
        />

        <TextField
          fullWidth
          select
          label="Status"
          margin="normal"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          sx={fieldSx}
          SelectProps={selectProps}
        >
          <MenuItem value="planned">Planned</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
        </TextField>

        <TextField
          fullWidth
          label="Start Date"
          type="date"
          margin="normal"
          slotProps={{ inputLabel: { shrink: true } }}
          value={form.startDate}
          onChange={(e) => setForm({ ...form, startDate: e.target.value })}
          sx={fieldSx}
        />

        <TextField
          fullWidth
          label="End Date"
          type="date"
          margin="normal"
          slotProps={{ inputLabel: { shrink: true } }}
          value={form.endDate}
          onChange={(e) => setForm({ ...form, endDate: e.target.value })}
          sx={fieldSx}
        />

        <TextField
          fullWidth
          label="Start Time"
          type="time"
          margin="normal"
          slotProps={{ inputLabel: { shrink: true } }}
          value={form.startTime}
          onChange={(e) => setForm({ ...form, startTime: e.target.value })}
          sx={fieldSx}
        />

        <TextField
          fullWidth
          label="End Time"
          type="time"
          margin="normal"
          slotProps={{ inputLabel: { shrink: true } }}
          value={form.endTime}
          onChange={(e) => setForm({ ...form, endTime: e.target.value })}
          sx={fieldSx}
        />

        {selectedType === "travel" && (
          <>
            <TextField
              fullWidth
              label="Destination"
              margin="normal"
              value={form.destination}
              onChange={(e) => setForm({ ...form, destination: e.target.value })}
              sx={fieldSx}
            />

            <TextField
              fullWidth
              label="Budget"
              type="number"
              margin="normal"
              value={form.budget}
              onChange={(e) => setForm({ ...form, budget: e.target.value })}
              sx={fieldSx}
            />
          </>
        )}

        {selectedType === "books" && (
          <TextField
            fullWidth
            label="Author"
            margin="normal"
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
            sx={fieldSx}
          />
        )}

        {selectedType === "movies" && (
          <>
            <TextField
              fullWidth
              label="Platform"
              margin="normal"
              value={form.platform}
              onChange={(e) => setForm({ ...form, platform: e.target.value })}
              sx={fieldSx}
            />

            <TextField
              fullWidth
              label="Genre"
              margin="normal"
              value={form.genre}
              onChange={(e) => setForm({ ...form, genre: e.target.value })}
              sx={fieldSx}
            />
          </>
        )}

        {selectedType === "agenda" && (
          <TextField
            fullWidth
            select
            label="Priority"
            margin="normal"
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
            sx={fieldSx}
            SelectProps={selectProps}
          >
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
          </TextField>
        )}

        {selectedType === "fitness" && (
          <TextField
            fullWidth
            label="Duration"
            margin="normal"
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
            sx={fieldSx}
          />
        )}
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          borderTop: "1px solid #1f2937",
        }}
      >
        <Button onClick={onClose} sx={{ color: "#94a3b8" }}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            borderRadius: 3,
            px: 3,
            background: "#2563eb",
            fontWeight: 800,
          }}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditItemModal;