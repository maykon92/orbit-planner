import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";

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
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditPostModal;