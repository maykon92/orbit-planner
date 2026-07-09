import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";
import OrbitButton from "./ui/OrbitButton";

const EditPostModal = ({ open, onClose, post, onSave }) => {
  const [form, setForm] = useState({
    caption: "",
    visibility: "public",
  });

  useEffect(() => {
    if (post) {
      setForm({
        caption: post.caption || "",
        visibility: post.visibility || "public",
      });
    }
  }, [post]);

  const handleSubmit = () => {
    onSave(form);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Post</DialogTitle>

      <DialogContent>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Caption"
          margin="normal"
          value={form.caption}
          onChange={(e) => setForm({ ...form, caption: e.target.value })}
        />

        <TextField
          fullWidth
          select
          label="Visibility"
          margin="normal"
          value={form.visibility}
          onChange={(e) => setForm({ ...form, visibility: e.target.value })}
        >
          <MenuItem value="public">Public</MenuItem>
          <MenuItem value="private">Private</MenuItem>
        </TextField>
      </DialogContent>

      <DialogActions>
        <OrbitButton onClick={onClose} variant="danger">
          Cancel
        </OrbitButton>
        <OrbitButton variant="primary" onClick={handleSubmit}>
          Save Changes
        </OrbitButton>
      </DialogActions>
    </Dialog>
  );
};

export default EditPostModal;