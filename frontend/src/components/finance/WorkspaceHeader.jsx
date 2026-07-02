import {
  Avatar,
  AvatarGroup,
  Box,
  Chip,
  Stack,
  Typography,
} from "@mui/material";

import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import { getImageUrl } from "../../utils/getImageUrl";

const WorkspaceHeader = ({ workspace }) => {
  if (!workspace) return null;

  const members = workspace.members || [];
  const owner =
    members.find((member) => member.role === "owner") || workspace.owner;

  return (
    <Stack spacing={2.5}>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          justifyContent:"space-between",
          alignItems:"flex-start",
        }}
      >
        <Box>
          <Stack direction="row" sx={{alignItems:"center"}} spacing={1.5}>
            <Typography
              sx={{
                fontSize: 24,
                fontWeight: 900,
                color: "#fff",
              }}
            >
              {workspace.name}
            </Typography>

            <Chip
              icon={
                workspace.type === "shared" ? (
                  <GroupsRoundedIcon />
                ) : (
                  <PersonRoundedIcon />
                )
              }
              label={workspace.type === "shared" ? "Shared" : "Personal"}
              size="small"
              sx={{
                bgcolor: "#1e3a8a",
                color: "#fff",
                fontWeight: 800,
                height: 30,
                "& .MuiChip-icon": {
                  color: "#93c5fd",
                },
              }}
            />
          </Stack>

          <Typography sx={{ color: "#94a3b8", mt: 1 }}>
            Manage members and invitations
          </Typography>
        </Box>

        <Typography
          sx={{
            color: "#64748b",
            fontSize: 13,
            mt: 0.5,
            whiteSpace: "nowrap",
          }}
        >
          Created {new Date(workspace.createdAt).toLocaleDateString()}
        </Typography>
      </Stack>

      <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
        <AvatarGroup max={5}>
          {members.map((member) => (
            <Avatar
              key={member._id}
              src={member.avatar ? getImageUrl(member.avatar) : ""}
              sx={{
                width: 42,
                height: 42,
                border: "2px solid #0f172a",
              }}
            >
              {member.name?.charAt(0)}
            </Avatar>
          ))}
        </AvatarGroup>

        <Box>
          <Typography
            sx={{
              color: "#fff",
              fontWeight: 900,
              fontSize: 16,
            }}
          >
            {members.length} {members.length === 1 ? "Member" : "Members"}
          </Typography>

          <Typography
            sx={{
              color: "#94a3b8",
              fontSize: 13,
            }}
          >
            Owner: {owner?.name || "Unknown"}
          </Typography>
        </Box>
      </Stack>
    </Stack>
  );
};

export default WorkspaceHeader;