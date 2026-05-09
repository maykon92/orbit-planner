import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Typography,
  Avatar,
} from "@mui/material";

import api from "../services/api";
import { createPost } from "../services/postService";
import { getTabs } from "../services/tabService";
import { getImageUrl } from "../utils/getImageUrl";
import { useAuth } from "../contexts/AuthContext";

const CreatePostModal = ({ open, onClose, onCreated }) => {
  const { user } = useAuth();

  const [tabs, setTabs] = useState([]);
  const [items, setItems] = useState([]);
  const [preview, setPreview] = useState("");

  const [form, setForm] = useState({
    caption: "",
    visibility: "public",
    tabId: "",
    itemId: "",
    photo: "",
  });

  useEffect(() => {
    const loadTabs = async () => {
      if (!open) return;

      const data = await getTabs();
      setTabs(data);
    };

    loadTabs();
  }, [open]);

  useEffect(() => {
    const loadItems = async () => {
      if (!form.tabId) {
        setItems([]);
        return;
      }

      const { data } = await api.get(`/items/tab/${form.tabId}`);
      setItems(data.items || data);
    };

    loadItems();
  }, [form.tabId]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const uploadForm = new FormData();
    uploadForm.append("image", file);

    const { data } = await api.post("/uploads", uploadForm, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    setForm((prev) => ({
      ...prev,
      photo: data.imageUrl,
    }));

    setPreview(getImageUrl(data.imageUrl));
  };

  const handleSubmit = async () => {
    try {
      if (!form.caption.trim()) {
        alert("Caption is required.");
        return;
      }

      const newPost = await createPost({
        caption: form.caption,
        visibility: form.visibility,
        itemId: form.itemId || null,
        photos: form.photo ? [form.photo] : [],
      });

      onCreated(newPost);

      setForm({
        caption: "",
        visibility: "public",
        tabId: "",
        itemId: "",
        photo: "",
      });

      setPreview("");
      onClose();
    } catch (error) {
      console.error(error);
      alert("Error creating post.");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 4,
          background: "#0f172a",
          color: "#f8fafc",
          border: "1px solid #1f2937",
          boxShadow: "0 30px 80px rgba(0,0,0,0.65)",
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <Avatar src={user?.avatar ? getImageUrl(user.avatar) : ""}>
          {user?.name?.charAt(0)}
        </Avatar>

        <Box>
          <Typography fontWeight="bold">{user?.name}</Typography>
          <Typography sx={{ color: "#64748b", fontSize: 13 }}>
            Share a moment, plan or memory
          </Typography>
        </Box>
      </Box>
      <DialogContent sx={{ pt: 3, background: "#0f172a" }}>
        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder="What's on your mind?"
          value={form.caption}
          onChange={(e) => setForm({ ...form, caption: e.target.value })}
          sx={{
            mb: 2,
            textarea: { color: "#f8fafc" },
            "& .MuiOutlinedInput-root": {
              background: "#111827",
              borderRadius: 3,
              "& fieldset": { borderColor: "#1f2937" },
            },
            "& .MuiInputLabel-root": {
              color: "#94a3b8",
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#60a5fa",
            },
            "& .MuiSelect-icon": {
              color: "#94a3b8",
            },
          }}
        />

        <TextField
          fullWidth
          select
          label="Visibility"
          value={form.visibility}
          onChange={(e) => setForm({ ...form, visibility: e.target.value })}
          SelectProps={{
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
          sx={{
            mb: 2,
            input: { color: "#f8fafc" },
            label: { color: "#94a3b8" },
            "& .MuiOutlinedInput-root": {
              background: "#111827",
              borderRadius: 3,
              color: "#f8fafc",
              "& fieldset": { borderColor: "#1f2937" },
            },
            "& .MuiInputLabel-root": {
              color: "#94a3b8",
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#60a5fa",
            },
            "& .MuiSelect-icon": {
              color: "#94a3b8",
            },
          }}
        >
          <MenuItem value="public">Public</MenuItem>
          <MenuItem value="private">Private</MenuItem>
        </TextField>

        <TextField
          fullWidth
          select
          label="Related Tab"
          value={form.tabId}
          onChange={(e) =>
            setForm({
              ...form,
              tabId: e.target.value,
              itemId: "",
            })
          }
          sx={{
            mb: 2,
            label: { color: "#94a3b8" },
            "& .MuiOutlinedInput-root": {
              background: "#111827",
              borderRadius: 3,
              color: "#f8fafc",
              "& fieldset": { borderColor: "#1f2937" },
            },
            "& .MuiInputLabel-root": {
              color: "#94a3b8",
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#60a5fa",
            },
            "& .MuiSelect-icon": {
              color: "#94a3b8",
            },
          }}
        >
          <MenuItem value="">None</MenuItem>
          {tabs.map((tab) => (
            <MenuItem key={tab._id} value={tab._id}>
              {tab.name} ({tab.type})
            </MenuItem>
          ))}
        </TextField>

        {form.tabId && (
          <TextField
            fullWidth
            select
            label="Related Item"
            value={form.itemId}
            onChange={(e) => setForm({ ...form, itemId: e.target.value })}
            sx={{
              mb: 2,
              label: { color: "#94a3b8" },
              "& .MuiOutlinedInput-root": {
                background: "#111827",
                borderRadius: 3,
                color: "#f8fafc",
                "& fieldset": { borderColor: "#1f2937" },
              },
              "& .MuiInputLabel-root": {
                color: "#94a3b8",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#60a5fa",
              },
              "& .MuiSelect-icon": {
                color: "#94a3b8",
              },
            }}
          >
            <MenuItem value="">None</MenuItem>
            {items.map((item) => (
              <MenuItem key={item._id} value={item._id}>
                {item.title}
              </MenuItem>
            ))}
          </TextField>
        )}

        <Button
          variant="outlined"
          component="label"
          sx={{
            borderColor: "#334155",
            color: "#e2e8f0",
            borderRadius: 3,
            mb: 2,
            "&:hover": {
              borderColor: "#60a5fa",
              background: "rgba(37,99,235,0.1)",
            },
          }}
        >
          Upload Image
          <input hidden type="file" accept="image/*" onChange={handleUpload} />
        </Button>

        {preview && (
          <Box
            component="img"
            src={preview}
            sx={{
              width: "100%",
              maxHeight: 320,
              objectFit: "contain",
              background: "#020617",
              borderRadius: 3,
              border: "1px solid #1f2937",
              mt: 1,
            }}
          />
        )}
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          borderTop: "1px solid #1f2937",
          background: "#0f172a",
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
            background: "#2563eb",
            fontWeight: 700,
          }}
        >
          Publish
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreatePostModal;