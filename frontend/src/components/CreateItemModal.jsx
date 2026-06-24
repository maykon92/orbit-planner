import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Box,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import api from "../services/api";
import { getImageUrl } from "../utils/getImageUrl";

const CreateItemModal = ({
  open,
  onClose,
  tabId,
  tabs = [],
  onCreated,
  initialDate,
}) => {
  const getInitialForm = () => ({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    selectedTabId: tabId || "",
    destination: "",
    budget: "",
    author: "",
    platform: "",
    genre: "",
    priority: "",
    duration: "",
    startTime: "",
    endTime: "",
    link: "",
    photos: [],
    postCaption: "",
    postVisibility: "public",
  });

  const [form, setForm] = useState(getInitialForm);
  const [shareAsPost, setShareAsPost] = useState(false);
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);

  const selectedTab = tabs.find((tab) => tab._id === form.selectedTabId);
  const selectedType = selectedTab?.type;

  const resetForm = () => {
    setForm(getInitialForm());
    setShareAsPost(false);
  };

  const handleSubmit = async () => {
    try {
      const { data } = await api.post("/items", {
        tabId: form.selectedTabId || tabId,
        title: form.title,
        description: form.description,
        status: "planned",

        data: {
            startDate: form.startDate,
            endDate: form.endDate || form.startDate,
            destination: form.destination,
            budget: form.budget ? Number(form.budget) : undefined,
            author: form.author,
            platform: form.platform,
            genre: form.genre,
            priority: form.priority,
            duration: form.duration,
            startTime: form.startTime,
            endTime: form.endTime,
        },

        photos: form.photos,
        shareAsPost,
        link: form.link,
        postCaption:
          form.postCaption ||
          `${selectedType || "item"}: ${form.title}`,
        postVisibility: form.postVisibility,
      });

      onCreated(data.item || data);
      resetForm();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Error creating item");
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    try {
        setUploading(true);

        const uploadForm = new FormData();
        uploadForm.append("image", file);

        const { data } = await api.post(
        "/uploads",
        uploadForm,
        {
            headers: {
            "Content-Type": "multipart/form-data",
            },
        }
        );

        setForm((prev) => ({
        ...prev,
        photos: [data.imageUrl],
        }));

        setPreview(getImageUrl(data.imageUrl));
    } catch (error) {
        console.error(error);
        alert("Error uploading image.");
    } finally {
        setUploading(false);
    }
  };

  useEffect(() => {
    if (initialDate) {
      setForm((prev) => ({
        ...prev,
        startDate: initialDate,
        endDate: initialDate,
      }));
    }
  }, [initialDate]);

  useEffect(() => {
    if (tabId) {
      setForm((prev) => ({
        ...prev,
        selectedTabId: tabId,
      }));
    }
  }, [tabId]);

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
      maxWidth="sm"
      fullWidth
      paperprops={{
        sx: {
          backgroundColor: "#0f172a",
          color: "#f8fafc",
          borderRadius: 4,
          border: "1px solid #1f2937",
          boxShadow: "0 30px 80px rgba(0,0,0,0.65)",
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontSize: "1.25rem",
          fontWeight: 800,
          color: "#f8fafc",
          backgroundColor: "#0f172a",
          borderBottom: "1px solid #1f2937",
          px: 3,
          py: 2,
        }}
      >
        Add{" "}
        {selectedType
          ? selectedType.charAt(0).toUpperCase() + selectedType.slice(1)
          : "Item"}
      </DialogTitle>

      <DialogContent
        sx={{
          backgroundColor: "#0f172a",
          color: "#cbd5e1",
          px: 3,
          py: "24px !important",
        }}
      >
        {tabs.length > 0 && (
          <TextField
            fullWidth
            select
            label="Tab"
            margin="normal"
            value={form.selectedTabId}
            sx={fieldSx}
            onChange={(e) =>
              setForm({ ...form, selectedTabId: e.target.value })
            }
          >
            {tabs.map((tab) => (
              <MenuItem key={tab._id} value={tab._id}>
                {tab.type}
              </MenuItem>
            ))}
          </TextField>
        )}

        <TextField
          fullWidth
          label="Title"
          margin="normal"
          value={form.title}
          sx={fieldSx}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <TextField
          fullWidth
          label="Description"
          margin="normal"
          multiline
          rows={3}
          value={form.description}
          sx={fieldSx}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <TextField
          fullWidth
          label="Start Date"
          type="date"
          margin="normal"
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          sx={fieldSx}
          value={form.startDate}
          onChange={(e) =>
            setForm({ ...form, startDate: e.target.value })
          }
        />

        <TextField
          fullWidth
          label="End Date"
          type="date"
          margin="normal"
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          value={form.endDate}
          sx={fieldSx}
          onChange={(e) => setForm({ ...form, endDate: e.target.value })}
        />

        <TextField
          fullWidth
          label="Start Time"
          type="time"
          margin="normal"
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          value={form.startTime}
          onChange={(e) =>
            setForm({ ...form, startTime: e.target.value })
          }
          sx={fieldSx}
        />

        <TextField
          fullWidth
          label="End Time"
          type="time"
          margin="normal"
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
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
              sx={fieldSx}
              onChange={(e) =>
                setForm({ ...form, destination: e.target.value })
              }
            />

            <TextField
              fullWidth
              label="Budget"
              type="number"
              margin="normal"
              value={form.budget}
              sx={fieldSx}
              onChange={(e) =>
                setForm({ ...form, budget: e.target.value })
              }
            />
          </>
        )}

        {selectedType === "books" && (
          <TextField
            fullWidth
            label="Author"
            margin="normal"
            value={form.author}
            sx={fieldSx}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
          />
        )}

        {selectedType === "movies" && (
          <>
            <TextField
              fullWidth
              label="Platform"
              margin="normal"
              value={form.platform}
              sx={fieldSx}
              onChange={(e) =>
                setForm({ ...form, platform: e.target.value })
              }
            />

            <TextField
              fullWidth
              label="Genre"
              margin="normal"
              value={form.genre}
              sx={fieldSx}
              onChange={(e) =>
                setForm({ ...form, genre: e.target.value })
              }
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
            sx={fieldSx}
            selectprops={{
              MenuProps: {
                paperprops: {
                  sx: {
                    background: "#0f172a",
                    color: "#f8fafc",
                    border: "1px solid #1f2937",
                  },
                },
              },
            }}
            onChange={(e) =>
              setForm({ ...form, priority: e.target.value })
            }
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
            sx={fieldSx}
            onChange={(e) =>
              setForm({ ...form, duration: e.target.value })
            }
          />
        )}

        <Box
          sx={{
            mt: 2,
            p: 2,
            borderRadius: 3,
            background: "rgba(37, 99, 235, 0.08)",
            border: "1px solid rgba(37, 99, 235, 0.25)",
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={shareAsPost}
                onChange={(e) => setShareAsPost(e.target.checked)}
                sx={{
                  color: "#60a5fa",
                  "&.Mui-checked": {
                    color: "#60a5fa",
                  },
                }}
              />
            }
            label="Share this item on feed"
            sx={{
              color: "#f8fafc",
              fontWeight: 700,
            }}
          />

          <Typography
            sx={{
              color: "#94a3b8",
              fontSize: 13,
              mt: 0.5,
              mb: shareAsPost ? 2 : 0,
            }}
          >
            Create a public post automatically linked to this item.
          </Typography>

          {shareAsPost && (
            <>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Post caption"
                margin="normal"
                value={form.postCaption}
                placeholder={`Share something about ${form.title || "this item"}...`}
                sx={fieldSx}
                onChange={(e) =>
                  setForm({ ...form, postCaption: e.target.value })
                }
              />

              <TextField
                  fullWidth
                  label="Link"
                  margin="normal"
                  value={form.link}
                  sx={fieldSx}
                  placeholder="https://..."
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
              />

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
                    mb: 2,
                    }}
                />
              )}

              <TextField
                fullWidth
                select
                label="Post visibility"
                margin="normal"
                value={form.postVisibility}
                sx={fieldSx}
                selectprops={{
                  MenuProps: {
                    paperprops: {
                      sx: {
                        background: "#0f172a",
                        color: "#f8fafc",
                        border: "1px solid #1f2937",
                      },
                    },
                  },
                }}
                onChange={(e) =>
                  setForm({ ...form, postVisibility: e.target.value })
                }
              >
                <MenuItem value="public">Public</MenuItem>
                <MenuItem value="private">Private</MenuItem>
              </TextField>
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
                  {uploading ? "Uploading..." : "Upload Image"}

                  <input
                      hidden
                      type="file"
                      accept="image/*"
                      onChange={handleUpload}
                  />
              </Button>
            </>
          )}
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          borderTop: "1px solid #1f2937",
          backgroundColor: "#0f172a",
        }}
      >
        <Button onClick={onClose} sx={{ color: "#94a3b8" }}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={uploading}
          sx={{
            borderRadius: 3,
            px: 3,
            background: "#2563eb",
            fontWeight: 800,
          }}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateItemModal;