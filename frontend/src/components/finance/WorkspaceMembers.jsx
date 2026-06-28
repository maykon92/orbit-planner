import {
  Box,
  Stack,
  Typography,
  Skeleton,
} from "@mui/material";

import MemberCard from "./MemberCard";

const WorkspaceMembers = ({
  workspace,
  loading = false,
  onUpdated,
}) => {
  if (loading) {
    return (
      <Stack spacing={2}>
        <Skeleton
          variant="text"
          width={180}
          height={34}
        />

        {[1, 2, 3].map((item) => (
          <Skeleton
            key={item}
            variant="rounded"
            height={72}
            sx={{
              borderRadius: 3,
            }}
          />
        ))}
      </Stack>
    );
  }

  return (
    <Box>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 800,
          color: "#fff",
          mb: 2,
        }}
      >
        Members
      </Typography>

      <Stack spacing={2}>
        {workspace?.members?.length === 0 ? (
          <Typography
            sx={{
              color: "#94a3b8",
            }}
          >
            No members found.
          </Typography>
        ) : (
          workspace.members.map((member) => (
            <MemberCard
              key={member._id}
              member={member}
              workspace={workspace}
              onUpdated={onUpdated}
            />
          ))
        )}
      </Stack>
    </Box>
  );
};

export default WorkspaceMembers;