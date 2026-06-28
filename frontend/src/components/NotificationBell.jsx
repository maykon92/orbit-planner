import { useEffect, useState } from "react";
import {
  Badge,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Button,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

import {
  getNotifications,
  markAllNotificationsAsRead,
} from "../services/notificationService";
import FinanceInvitationNotification from "./finance/FinanceInvitationNotification";

const NotificationBell = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const open = Boolean(anchorEl);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const loadNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleOpen = async (event) => {
    setAnchorEl(event.currentTarget);

    if (unreadCount > 0) {
      await markAllNotificationsAsRead();
      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <IconButton
        onClick={handleOpen}
        sx={{
          width: 48,
          height: 48,
          borderRadius: "14px",
          border: "1px solid rgba(72,127,255,.8)",
          background: "rgba(15,23,42,.6)",
          color: "#fff",
          position: "relative",

          "&:hover": {
            borderColor: "#5b8cff",
            background: "rgba(47,109,246,.16)",
          },
        }}
      >
        <Badge
          badgeContent={unreadCount}
          color="error"
        >
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: {
              width: 380,
              maxHeight: 560,
              overflowY: "auto",
              borderRadius: 4,
              background:
                "linear-gradient(145deg, rgba(20,33,61,.98), rgba(15,23,42,.98))",
              color: "#f8fafc",
              border: "1px solid rgba(255,255,255,.08)",
              boxShadow: "0 30px 80px rgba(0,0,0,.65)",

              "& .MuiMenuItem-root": {
                color: "#f8fafc",
                alignItems: "flex-start",
                whiteSpace: "normal",
                borderRadius: 3,
                mx: 1,
                my: 0.5,
                p: 1.5,
              },
            },
          },
        }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography fontWeight={700}>Notifications</Typography>
        </Box>

        {notifications.length === 0 ? (
          <MenuItem>
            <Typography variant="body2" color="text.secondary">
              No notifications yet.
            </Typography>
          </MenuItem>
        ) : (
          notifications.map((notification) =>
            notification.type === "finance_invitation" ? (
              <FinanceInvitationNotification
                key={notification._id}
                notification={notification}
                onUpdated={loadNotifications}
              />
            ) : (
              <MenuItem
                key={notification._id}
                sx={{
                  alignItems: "flex-start",
                  whiteSpace: "normal",
                  bgcolor: notification.isRead ? "transparent" : "#2a2a40",
                }}
              >
                <Box>
                  <Typography variant="body2">
                    <strong>{notification.sender?.name || "Someone"}</strong>{" "}
                    {notification.message}
                  </Typography>

                  <Typography variant="caption" color="gray">
                    {new Date(notification.createdAt).toLocaleString()}
                  </Typography>
                </Box>
              </MenuItem>
            )
          )
        )}

        {notifications.length > 0 && (
          <Box sx={{ p: 1 }}>
            <Button fullWidth size="small" onClick={loadNotifications}>
              Refresh
            </Button>
          </Box>
        )}

      </Menu>
    </Box>
  );
};

export default NotificationBell;