import { Avatar, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../utils/getImageUrl";

const NotificationList = ({ notifications = [] }) => {
  const navigate = useNavigate();

  if (notifications.length === 0) {
    return (
      <Typography sx={{ color: "#64748b", fontSize: 14 }}>
        No notifications yet.
      </Typography>
    );
  }

  return notifications.map((notification) => (
    <Box
      key={notification._id}
      sx={{
        display: "flex",
        gap: 1.5,
        mb: 2,
        pb: 2,
        borderBottom: "1px solid rgba(255,255,255,.05)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          cursor: "pointer",
        }}
        onClick={() => navigate(`/users/${notification.sender?._id}`)}
      >
        <Avatar
          src={
            notification.sender?.avatar
              ? getImageUrl(notification.sender.avatar)
              : ""
          }
          sx={{ width: 42, height: 42 }}
        />
      </Box>

      <Box>
        <Typography sx={{ color: "#f8fafc", fontSize: 14 }}>
          <strong>{notification.sender?.name}</strong>{" "}
          {notification.message}
        </Typography>

        <Typography sx={{ color: "#64748b", fontSize: 12 }}>
          {new Date(notification.createdAt).toLocaleDateString()}
        </Typography>
      </Box>
    </Box>
  ));
};

export default NotificationList;