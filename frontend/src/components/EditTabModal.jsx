import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Switch,
  FormControlLabel,
} from "@mui/material";

const EditTabModal = ({ open, onClose, tab, onSave }) => {
  const [form, setForm] = useState({
    name: "",
    icon: "",
    isPublic: false,
    aiEnabled: true,
  });

  useEffect(() => {
    if (tab) {
      setForm({   
        icon: tab.icon || "",
        isPublic: tab.isPublic || false,
        aiEnabled: tab.aiEnabled ?? true,
      });
    }
  }, [tab]);

  const handleSubmit = () => {
    onSave(form);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Tab</DialogTitle>

      <DialogContent>
        <TextField
          fullWidth
          label="Tab Name"
          margin="normal"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <TextField
          fullWidth
          label="Icon"
          margin="normal"
          value={form.icon}
          onChange={(e) => setForm({ ...form, icon: e.target.value })}
        />

        <FormControlLabel
          control={
            <Switch
              checked={form.aiEnabled}
              onChange={(e) =>
                setForm({ ...form, aiEnabled: e.target.checked })
              }
            />
          }
          label="AI Enabled"
        />

        <FormControlLabel
          control={
            <Switch
              checked={form.isPublic}
              onChange={(e) =>
                setForm({ ...form, isPublic: e.target.checked })
              }
            />
          }
          label="Public Tab"
        />
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

export default EditTabModal;