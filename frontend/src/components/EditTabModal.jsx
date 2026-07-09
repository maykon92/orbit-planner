import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
} from "@mui/material";

import OrbitButton from "./ui/OrbitButton";

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

export default EditTabModal;