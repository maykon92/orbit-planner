import { Box, Typography, Avatar } from "@mui/material";
import EventIcon from "@mui/icons-material/Event";

const UpcomingEvents = ({ events = [] }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingEvents = events
    .filter((event) => {
      if (!event.data?.startDate) return false;
      return new Date(event.data.startDate) >= today;
    })
    .sort(
      (a, b) =>
        new Date(a.data.startDate) - new Date(b.data.startDate)
    );

  if (upcomingEvents.length === 0) {
    return (
      <Typography sx={{ color: "#64748b", fontSize: 14 }}>
        No upcoming events
      </Typography>
    );
  }

  return upcomingEvents.map((event) => (
    <Box
      key={event._id}
      sx={{
        display: "flex",
        gap: 1.5,
        mb: 2,
        pb: 2,
        borderBottom: "1px solid rgba(255,255,255,.05)",
      }}
    >
      <Avatar sx={{ bgcolor: "#2f6df6", width: 40, height: 40 }}>
        <EventIcon />
      </Avatar>

      <Box>
        <Typography
          sx={{
            color: "#fff",
            fontWeight: 700,
            textTransform: "capitalize",
          }}
        >
          {event.type}: {event.title}
        </Typography>

        <Typography sx={{ color: "#8fa0bf", fontSize: 13 }}>
          {new Date(event.data?.startDate).toLocaleDateString()}
        </Typography>
      </Box>
    </Box>
  ));
};

export default UpcomingEvents;