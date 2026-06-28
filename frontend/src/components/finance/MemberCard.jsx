import { Avatar, Box, Chip, Stack, Typography } from "@mui/material";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import { getImageUrl } from "../../utils/getImageUrl";

const MemberCard = ({ member }) => {
  return (
    <Box
      sx={{
        background: "rgba(15,23,42,.65)",
        border: "1px solid rgba(148,163,184,.14)",
        borderRadius: 4,
        p: 2,
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar
          src={member.avatar ? getImageUrl(member.avatar) : ""}
          sx={{ width: 64, height: 64 }}
        >
          {member.name?.charAt(0)}
        </Avatar>

        <Box>
          <Typography sx={{ color: "#fff", fontWeight: 900, fontSize: 18 }}>
            {member.name || "Unknown user"}
          </Typography>

          <Chip
            icon={
              member.role === "owner" ? (
                <WorkspacePremiumRoundedIcon />
              ) : (
                <PersonRoundedIcon />
              )
            }
            label={member.role === "owner" ? "Owner" : "Member"}
            size="small"
            variant="outlined"
            sx={{
              mt: 1,
              color: member.role === "owner" ? "#fb923c" : "#60a5fa",
              borderColor: member.role === "owner" ? "#f97316" : "#2563eb",
              fontWeight: 800,
              "& .MuiChip-icon": {
                color: member.role === "owner" ? "#f97316" : "#2563eb",
              },
            }}
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default MemberCard;