import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";

import OrbitButton from "./ui/OrbitButton";

const ConfirmDialog = ({
  open,
  title = "Confirm action",
  message = "Are you sure?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  danger = false,
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      slotProps={{
        paper: {
          sx: {
            background:
              "linear-gradient(145deg, rgba(20,33,61,.98), rgba(15,23,42,.98))",
            color: "#f8fafc",
            borderRadius: 4,
            border: "1px solid rgba(255,255,255,.08)",
            boxShadow: "0 30px 80px rgba(0,0,0,.65)",
          },
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 900 }}>{title}</DialogTitle>

      <DialogContent>
        <Typography sx={{ color: "#94a3b8" }}>{message}</Typography>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <OrbitButton onClick={onClose} variant="danger">
          {cancelText}
        </OrbitButton>

        <OrbitButton
          variant="primary"
          color={danger ? "error" : "primary"}
          onClick={onConfirm}
        >
          {confirmText}
        </OrbitButton>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;