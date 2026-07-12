import { useEffect, useRef, useState } from "react";

import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";

import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

import api from "../services/api";
import { createStory } from "../services/storyService";
import { getImageUrl } from "../utils/getImageUrl";

import OrbitButton from "./ui/OrbitButton";

import {
  orbitDialogActionsSx,
  orbitDialogContentSx,
  orbitDialogPaperSx,
  orbitDialogTitleSx,
  orbitTextFieldSx,
} from "../theme";

const getInitialForm = () => ({
  image: "",
  caption: "",
});

const CreateStoryModal = ({
  open,
  onClose,
  onCreated,
}) => {
  const fileInputRef = useRef(null);

  const [form, setForm] = useState(getInitialForm());
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState("");

  const isBusy = uploading || publishing;

  useEffect(() => {
    if (!open) return;

    setForm(getInitialForm());
    setPreview("");
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [open]);

  const handleClose = () => {
    if (isBusy) return;

    setForm(getInitialForm());
    setPreview("");
    setError("");
    onClose();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      return;
    }

    try {
      setUploading(true);
      setError("");

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

      const imageUrl =
        data.imageUrl ||
        data.image ||
        data.url;

      if (!imageUrl) {
        throw new Error(
          "The upload did not return an image URL."
        );
      }

      setForm((previousForm) => ({
        ...previousForm,
        image: imageUrl,
      }));

      setPreview(getImageUrl(imageUrl));
    } catch (uploadError) {
      console.error(
        "Error uploading Story image:",
        uploadError?.response?.data || uploadError
      );

      setError(
        uploadError?.response?.data?.message ||
          uploadError?.message ||
          "Error uploading image."
      );
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    if (isBusy) return;

    setForm((previousForm) => ({
      ...previousForm,
      image: "",
    }));

    setPreview("");
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (isBusy) return;

    if (!form.image) {
      setError("Please add an image before publishing.");
      return;
    }

    try {
      setPublishing(true);
      setError("");

      const newStory = await createStory({
        image: form.image,
        caption: form.caption.trim(),
      });

      await onCreated?.(newStory);

      setForm(getInitialForm());
      setPreview("");

      onClose();
    } catch (publishError) {
      console.error(
        "Error publishing Story:",
        publishError?.response?.data || publishError
      );

      setError(
        publishError?.response?.data?.message ||
          publishError?.message ||
          "Error publishing Story."
      );
    } finally {
      setPublishing(false);
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
          sx: {
            ...orbitDialogPaperSx,
            overflow: "hidden",
          },
        },
      }}
    >
      <DialogTitle sx={orbitDialogTitleSx}>
        Create Story
      </DialogTitle>

      <DialogContent sx={orbitDialogContentSx}>
        {preview ? (
          <Box
            sx={{
              position: "relative",
              mb: 2.5,
              overflow: "hidden",
              borderRadius: 4,
              background: "#020617",
              border:
                "1px solid rgba(96,165,250,.18)",
              boxShadow:
                "0 18px 45px rgba(0,0,0,.35)",
            }}
          >
            <Box
              component="img"
              src={preview}
              alt="Story preview"
              sx={{
                width: "100%",
                height: { xs: 360, sm: 480 },
                display: "block",
                objectFit: "contain",
                background: "#020617",
              }}
            />

            <Box
              sx={{
                position: "absolute",
                left: 14,
                right: 14,
                bottom: 14,
                display: "flex",
                justifyContent: "space-between",
                gap: 1.5,
              }}
            >
              <OrbitButton
                variant="secondary"
                startIcon={<PhotoCameraOutlinedIcon />}
                onClick={() =>
                  fileInputRef.current?.click()
                }
                disabled={isBusy}
                sx={{
                  flex: 1,
                  backdropFilter: "blur(12px)",
                  background: "rgba(15,23,42,.78)",
                }}
              >
                Change
              </OrbitButton>

              <OrbitButton
                variant="danger"
                startIcon={<DeleteOutlineOutlinedIcon />}
                onClick={handleRemoveImage}
                disabled={isBusy}
                sx={{
                  flex: 1,
                  backdropFilter: "blur(12px)",
                }}
              >
                Remove
              </OrbitButton>
            </Box>
          </Box>
        ) : (
          <Box
            onClick={() =>
              fileInputRef.current?.click()
            }
            sx={{
              minHeight: 300,
              mb: 2.5,
              p: 3,
              display: "grid",
              placeItems: "center",
              textAlign: "center",
              cursor: uploading
                ? "wait"
                : "pointer",
              borderRadius: 4,
              color: "#94a3b8",
              background:
                "linear-gradient(145deg, rgba(37,99,235,.08), rgba(15,23,42,.72))",
              border:
                "1px dashed rgba(96,165,250,.38)",
              transition: "all .25s ease",

              "&:hover": {
                color: "#dbeafe",
                borderColor: "#60a5fa",
                background:
                  "linear-gradient(145deg, rgba(37,99,235,.14), rgba(15,23,42,.82))",
              },
            }}
          >
            <Box>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  mx: "auto",
                  mb: 2,
                  display: "grid",
                  placeItems: "center",
                  borderRadius: "50%",
                  color: "#93c5fd",
                  background:
                    "rgba(37,99,235,.16)",
                  border:
                    "1px solid rgba(96,165,250,.2)",
                }}
              >
                <PhotoCameraOutlinedIcon
                  sx={{ fontSize: 30 }}
                />
              </Box>

              <Typography
                sx={{
                  color: "#f8fafc",
                  fontSize: 18,
                  fontWeight: 900,
                }}
              >
                {uploading
                  ? "Uploading image..."
                  : "Add a photo"}
              </Typography>

              <Typography
                sx={{
                  mt: 1,
                  color: "#7f94b2",
                  fontSize: 13,
                  lineHeight: 1.6,
                }}
              >
                Choose an image to share for the next
                24 hours.
              </Typography>
            </Box>
          </Box>
        )}

        <TextField
          fullWidth
          multiline
          rows={3}
          label="Caption"
          placeholder="Add a caption to your Story..."
          value={form.caption}
          disabled={isBusy}
          slotProps={{
            htmlInput: {
                maxLength: 300,
            },
          }}
          sx={orbitTextFieldSx}
          onChange={(event) =>
            setForm((previousForm) => ({
              ...previousForm,
              caption: event.target.value,
            }))
          }
        />

        <Typography
          sx={{
            mt: -1,
            mb: error ? 1.5 : 0,
            color: "#64748b",
            fontSize: 12,
            textAlign: "right",
          }}
        >
          {form.caption.length}/300
        </Typography>

        {error && (
          <Box
            sx={{
              mt: 1,
              p: 1.5,
              borderRadius: 3,
              color: "#fecaca",
              background: "rgba(127,29,29,.28)",
              border:
                "1px solid rgba(248,113,113,.22)",
            }}
          >
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              {error}
            </Typography>
          </Box>
        )}

        <input
          ref={fileInputRef}
          hidden
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
      </DialogContent>

      <DialogActions sx={orbitDialogActionsSx}>
        <OrbitButton
          variant="danger"
          onClick={handleClose}
          disabled={isBusy}
        >
          Cancel
        </OrbitButton>

        <OrbitButton
          variant="primary"
          onClick={handleSubmit}
          disabled={isBusy || !form.image}
        >
          {uploading
            ? "Uploading..."
            : publishing
              ? "Publishing..."
              : "Publish Story"}
        </OrbitButton>
      </DialogActions>
    </Dialog>
  );
};

export default CreateStoryModal;