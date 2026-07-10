import { useEffect, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/en-gb";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Box,
  Typography,
} from "@mui/material";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

import api from "../services/api";
import { getImageUrl } from "../utils/getImageUrl";

import {
  orbitTextFieldSx,
  orbitFormSelectSx,
  orbitMenuProps,
  orbitDatePickerProps,
  orbitTimePickerProps,
  orbitDialogPaperSx,
  orbitDialogTitleSx,
  orbitDialogContentSx,
  orbitDialogActionsSx,
} from "../theme";

import OrbitButton from "./ui/OrbitButton";

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

  const selectSlotProps = {
    select: {
      MenuProps: orbitMenuProps,
    },
  };

  const resetForm = () => {
    setForm(getInitialForm());
    setShareAsPost(false);
    setPreview("");
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
        postCaption: form.postCaption || `${selectedType || "item"}: ${form.title}`,
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

      const { data } = await api.post("/uploads", uploadForm, {
        headers: { "Content-Type": "multipart/form-data" },
      });

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

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            ...orbitDialogPaperSx,
            overflow: "hidden",
          },
        },
      }}
    >
      <DialogTitle sx={orbitDialogTitleSx}>
        Add{" "}
        {selectedType
          ? selectedType.charAt(0).toUpperCase() + selectedType.slice(1)
          : "Item"}
      </DialogTitle>

      <DialogContent sx={orbitDialogContentSx}>
        {tabs.length > 0 && (
          <TextField
            fullWidth
            select
            label="Tab"
            margin="normal"
            value={form.selectedTabId}
            sx={orbitFormSelectSx}
            slotProps={selectSlotProps}
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
          sx={orbitTextFieldSx}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <TextField
          fullWidth
          label="Description"
          margin="normal"
          multiline
          rows={3}
          value={form.description}
          sx={orbitTextFieldSx}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          adapterLocale="en-gb"
        >
          <DatePicker
            label="Start Date"
            format="DD/MM/YYYY"
            value={form.startDate ? dayjs(form.startDate) : null}
            onChange={(value) =>
              setForm((previousForm) => ({
                ...previousForm,
                startDate:
                  value && value.isValid()
                    ? value.format("YYYY-MM-DD")
                    : "",
              }))
            }
            slotProps={orbitDatePickerProps}
          />

          <DatePicker
            label="End Date"
            format="DD/MM/YYYY"
            value={form.endDate ? dayjs(form.endDate) : null}
            onChange={(value) =>
              setForm((previousForm) => ({
                ...previousForm,
                endDate:
                  value && value.isValid()
                    ? value.format("YYYY-MM-DD")
                    : "",
              }))
            }
            slotProps={orbitDatePickerProps}
          />

          <TimePicker
            label="Start Time"
            ampm={false}
            format="HH:mm"
            value={
              form.startTime
                ? dayjs(`2000-01-01T${form.startTime}`)
                : null
            }
            onChange={(value) =>
              setForm((previousForm) => ({
                ...previousForm,
                startTime:
                  value && value.isValid()
                    ? value.format("HH:mm")
                    : "",
              }))
            }
            slotProps={orbitTimePickerProps}
          />

          <TimePicker
            label="End Time"
            ampm={false}
            format="HH:mm"
            value={
              form.endTime
                ? dayjs(`2000-01-01T${form.endTime}`)
                : null
            }
            onChange={(value) =>
              setForm((previousForm) => ({
                ...previousForm,
                endTime:
                  value && value.isValid()
                    ? value.format("HH:mm")
                    : "",
              }))
            }
            slotProps={orbitTimePickerProps}
          />
        </LocalizationProvider>

        {selectedType === "travel" && (
          <>
            <TextField
              fullWidth
              label="Destination"
              margin="normal"
              value={form.destination}
              sx={orbitTextFieldSx}
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
              sx={orbitTextFieldSx}
              onChange={(e) => setForm({ ...form, budget: e.target.value })}
            />
          </>
        )}

        {selectedType === "books" && (
          <TextField
            fullWidth
            label="Author"
            margin="normal"
            value={form.author}
            sx={orbitTextFieldSx}
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
              sx={orbitTextFieldSx}
              onChange={(e) => setForm({ ...form, platform: e.target.value })}
            />

            <TextField
              fullWidth
              label="Genre"
              margin="normal"
              value={form.genre}
              sx={orbitTextFieldSx}
              onChange={(e) => setForm({ ...form, genre: e.target.value })}
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
            sx={orbitFormSelectSx}
            slotProps={selectSlotProps}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
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
            sx={orbitTextFieldSx}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
          />
        )}

        <Box
          sx={{
            mt: 2,
            p: 2,
            borderRadius: 3,
            background: "rgba(37,99,235,.08)",
            border: "1px solid rgba(37,99,235,.25)",
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
            sx={{ color: "#f8fafc", fontWeight: 700 }}
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
                sx={orbitTextFieldSx}
                onChange={(e) =>
                  setForm({ ...form, postCaption: e.target.value })
                }
              />

              <TextField
                fullWidth
                label="Link"
                margin="normal"
                value={form.link}
                sx={orbitTextFieldSx}
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
                sx={orbitFormSelectSx}
                slotProps={selectSlotProps}
                onChange={(e) =>
                  setForm({ ...form, postVisibility: e.target.value })
                }
              >
                <MenuItem value="public">Public</MenuItem>
                <MenuItem value="private">Private</MenuItem>
              </TextField>

              <OrbitButton
                variant="secondary"
                component="label"
              >
                {uploading ? "Uploading..." : "Upload Image"}
                <input hidden type="file" accept="image/*" onChange={handleUpload} />
              </OrbitButton>
            </>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={orbitDialogActionsSx}>
        <OrbitButton 
          onClick={onClose}
          variant="danger"
        >
          Cancel
        </OrbitButton>

        <OrbitButton
          onClick={handleSubmit}
          disabled={uploading}
        >
          Create
        </OrbitButton>
      </DialogActions>
    </Dialog>
  );
};

export default CreateItemModal;