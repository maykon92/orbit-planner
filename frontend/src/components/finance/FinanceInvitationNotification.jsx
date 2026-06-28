import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  acceptFinanceInvitation,
  declineFinanceInvitation,
} from "../../services/financeWorkspaceService";
import { getImageUrl } from "../../utils/getImageUrl";

const FinanceInvitationNotification = ({
  notification,
  onUpdated,
}) => {
  const navigate = useNavigate();
  const invitation = notification.financeInvitation;
  const sender = notification.sender;

  const handleAccept = async () => {
    if (!invitation?._id) return;

    const response = await acceptFinanceInvitation(invitation._id);

    await onUpdated?.();

    const workspaceId = response?.workspace?._id;

    if (workspaceId) {
        navigate(`/finance?workspaceId=${workspaceId}`);
    } else {
        navigate("/finance");
    }
};

  const handleDecline = async () => {
    if (!invitation?._id) return;

    await declineFinanceInvitation(invitation._id);
    await onUpdated?.();
  };

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 3,
        background: "rgba(37, 99, 235, 0.08)",
        border: "1px solid rgba(96, 165, 250, 0.25)",
        mb: 2,
      }}
    >
      <Stack direction="row" spacing={1.5} sx={{ alignItems: "flex-start" }}>
        <Avatar
          src={sender?.avatar ? getImageUrl(sender.avatar) : ""}
          sx={{ width: 42, height: 42 }}
        >
          {sender?.name?.charAt(0)}
        </Avatar>

        <Box sx={{ flex: 1 }}>
          <Typography sx={{ color: "#fff", fontSize: 14 }}>
            <strong>{sender?.name}</strong>{" "}
            invited you to join a shared finance.
          </Typography>

          <Typography sx={{ color: "#94a3b8", fontSize: 13, mt: 0.5 }}>
            {invitation?.workspace?.name || "Finance Workspace"}
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
            <Button
              size="small"
              variant="contained"
              onClick={handleAccept}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 800,
              }}
            >
              Accept
            </Button>

            <Button
              size="small"
              variant="outlined"
              onClick={handleDecline}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 800,
                color: "#cbd5e1",
                borderColor: "#334155",
              }}
            >
              Decline
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default FinanceInvitationNotification;