import { createContext, useContext, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

const ConfirmContext = createContext();

export const ConfirmProvider = ({ children }) => {
  const [confirm, setConfirm] = useState({
    open: false,
    title: "",
    message: "",
    resolve: null,
  });

  const confirmAction = ({ title, message }) => {
    return new Promise((resolve) => {
      setConfirm({
        open: true,
        title,
        message,
        resolve,
      });
    });
  };

  const handleClose = (result) => {
    if (confirm.resolve) {
      confirm.resolve(result);
    }

    setConfirm({
      open: false,
      title: "",
      message: "",
      resolve: null,
    });
  };

  return (
    <ConfirmContext.Provider value={{ confirmAction }}>
      {children}

      <Dialog
        open={confirm.open}
        onClose={() => handleClose(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: "#0f172a",
            color: "#f8fafc",
            border: "1px solid #1f2937",
          },
        }}
      >
        <DialogTitle fontWeight="bold">{confirm.title}</DialogTitle>

        <DialogContent>
          <Typography sx={{ color: "#94a3b8" }}>
            {confirm.message}
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => handleClose(false)} sx={{ color: "#94a3b8" }}>
            Cancel
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={() => handleClose(true)}
            sx={{ borderRadius: 2, fontWeight: 700 }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </ConfirmContext.Provider>
  );
};

export const useConfirm = () => useContext(ConfirmContext);