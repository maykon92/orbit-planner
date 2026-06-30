import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  CircularProgress,
  Stack,
} from "@mui/material";

import WorkspaceHeader from "./WorkspaceHeader";
import WorkspaceMembers from "./WorkspaceMembers";
import InviteMemberSection from "./InviteMemberSection";
import { getFinanceWorkspaceDetails } from "../../services/financeWorkspaceService";

const ManageWorkspaceModal = ({ open, onClose, workspace, onUpdated }) => {
  const [workspaceDetails, setWorkspaceDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadWorkspaceDetails = async () => {
    if (!workspace?._id) return;

    try {
      setLoading(true);
      const data = await getFinanceWorkspaceDetails(workspace._id);
      setWorkspaceDetails(data);
    } catch (error) {
      console.error("Error loading workspace details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadWorkspaceDetails();
    }
  }, [open, workspace?._id]);

  const handleUpdated = async () => {
    await loadWorkspaceDetails();
    await onUpdated?.();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          background:
            "linear-gradient(145deg, rgba(20,33,61,.98), rgba(15,23,42,.98))",
          color: "#f8fafc",
          borderRadius: 4,
          border: "1px solid rgba(255,255,255,.08)",
          boxShadow: "0 30px 80px rgba(0,0,0,.65)",
          overflow: "hidden",
        },
      }}
    >
      {loading ? (
        <Stack
        sx={{
            alignItems:"center",
            justifyContent:"center",
            minHeight: 420,
            background:
              "linear-gradient(145deg, rgba(20,33,61,.98), rgba(15,23,42,.98))",
          }}
        >
          <CircularProgress />
        </Stack>
      ) : (
        <>
          <DialogTitle
            sx={{
              background:
                "linear-gradient(145deg, rgba(20,33,61,.98), rgba(15,23,42,.98))",
              color: "#f8fafc",
              borderBottom: "1px solid rgba(255,255,255,.08)",
              p: 3,
            }}
          >
            <WorkspaceHeader workspace={workspaceDetails} />
          </DialogTitle>

          <DialogContent
            sx={{
              background:
                "linear-gradient(145deg, rgba(20,33,61,.98), rgba(15,23,42,.98))",
              color: "#f8fafc",
              p: "24px !important",
              maxHeight: "65vh",
              overflowY: "auto",

              "&::-webkit-scrollbar": {
                width: 8,
              },
              "&::-webkit-scrollbar-track": {
                background: "#020617",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#334155",
                borderRadius: 999,
              },
            }}
          >
            <WorkspaceMembers workspace={workspaceDetails} />

            <Divider
              sx={{
                my: 3,
                borderColor: "rgba(255,255,255,.08)",
              }}
            />

            <InviteMemberSection
              workspace={workspaceDetails}
              onUpdated={handleUpdated}
            />
          </DialogContent>

          <DialogActions
            sx={{
              background:
                "linear-gradient(145deg, rgba(20,33,61,.98), rgba(15,23,42,.98))",
              borderTop: "1px solid rgba(255,255,255,.08)",
              px: 3,
              py: 2,
            }}
          >
            <Button
              onClick={onClose}
              sx={{
                color: "#94a3b8",
                fontWeight: 900,
              }}
            >
              Close
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default ManageWorkspaceModal;