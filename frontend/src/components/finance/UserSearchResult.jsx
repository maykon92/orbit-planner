import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { createFinanceInvitation } from "../../services/financeWorkspaceService";
import { getImageUrl } from "../../utils/getImageUrl";

const UserSearchResult = ({ user, workspace, clearSearch, onUpdated }) => {
  const handleInvite = async () => {
    await createFinanceInvitation({
      workspaceId: workspace._id,
      recipientId: user._id,
    });

    clearSearch();
    await onUpdated?.();
  };

  return (
    <Box
      sx={{
        background: "rgba(15,23,42,.65)",
        border: "1px solid rgba(148,163,184,.14)",
        borderRadius: 4,
        p: 2,
        mt: 2,
      }}
    >
      <Stack direction="row" sx={{ justifyContent: "space-between", position: "relative" }}>
        <Stack direction="row" spacing={2} sx={{alignItems:"center"}}>
          <Avatar
            src={user.avatar ? getImageUrl(user.avatar) : ""}
            sx={{ width: 56, height: 56 }}
          >
            {user.name?.charAt(0)}
          </Avatar>

          <Box>
            <Typography sx={{ color: "#fff", fontWeight: 900, fontSize: 17 }}>
              {user.name}
            </Typography>

            <Typography sx={{ color: "#94a3b8", fontSize: 14 }}>
              {user.bio || user.email}
            </Typography>
          </Box>
        </Stack>

        <Button
          variant="contained"
          startIcon={<SendRoundedIcon />}
          onClick={handleInvite}
          sx={{
            height: 48,
            px: 3,
            borderRadius: 3,
            fontWeight: 900,
            background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
            alignItems: "right",
          }}
        >
          Invite
        </Button>
      </Stack>
    </Box>
  );
};

export default UserSearchResult;