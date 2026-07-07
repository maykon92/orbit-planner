import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  Menu,
  Stack,
  Typography,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import MessageIcon from "@mui/icons-material/Message";
import CommentIcon from "@mui/icons-material/Comment";
import FavoriteIcon from "@mui/icons-material/Favorite";

import {
  getNotifications,
  markAllNotificationsAsRead,
} from "../../services/notificationService";
import { getImageUrl } from "../../utils/getImageUrl";

const getNotificationIcon = (type) => {
  if (type === "message") return <MessageIcon fontSize="small" />;
  if (type === "comment" || type === "reply") return <CommentIcon fontSize="small" />;
  if (type === "like") return <FavoriteIcon fontSize="small" />;
  if (type?.startsWith("finance")) return <AttachMoneyIcon fontSize="small" />;
  return <NotificationsIcon fontSize="small" />;
};

const OrbitNotificationHub = ({ logoSize = 30 }) => {
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const open = Boolean(anchorEl);

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  const loadNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data || []);
    } catch (error) {
      console.error("Error loading notifications:", error);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleOpen = async (event) => {
    setAnchorEl(event.currentTarget);

    try {
      await loadNotifications();

      if (unreadCount > 0) {
        await markAllNotificationsAsRead();
        await loadNotifications();
      }
    } catch (error) {
      console.error("Error opening notifications:", error);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (notification) => {
    handleClose();

    if (notification.type === "message" && notification.conversation?._id) {
      navigate("/messages", {
        state: {
          conversationId: notification.conversation._id,
        },
      });
      return;
    }

    if (
      notification.type === "finance_invitation" ||
      notification.type === "finance_invitation_accepted"
    ) {
      const workspaceId = notification.financeInvitation?.workspace?._id;

      navigate(workspaceId ? `/finance?workspaceId=${workspaceId}` : "/finance");
      return;
    }

    if (notification.post?._id) {
      navigate("/feed");
      return;
    }

    if (notification.sender?._id) {
      navigate(`/users/${notification.sender._id}`);
    }
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0,
          width: logoSize + 14,
          height: logoSize + 14,
          position: "relative",
        }}
      >
        <Badge
          badgeContent={unreadCount}
          color="error"
          invisible={unreadCount === 0}
          overlap="circular"
          sx={{
            "& .MuiBadge-badge": {
              top: 3,
              right: 3,
              fontSize: 10,
              minWidth: 17,
              height: 17,
              fontWeight: 900,
              boxShadow: "0 0 12px rgba(239,68,68,.8)",
            },
          }}
        >
          <Box
            component="img"
            src="/orbit_planner_logo.png"
            alt="Orbit Planner"
            sx={{
              width: logoSize,
              height: logoSize,
              objectFit: "contain",
              filter: `
                drop-shadow(0 0 10px rgba(96,165,250,.4))
                drop-shadow(0 0 20px rgba(139,92,246,.3))
              `,
            }}
          />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: {
              mt: 1.5,
              width:390,
              maxHeight:"75vh",
              overflowY:"auto",
              background:
                "linear-gradient(145deg, rgba(20,33,61,.98), rgba(15,23,42,.98))",
              color: "#f8fafc",
              border: "1px solid rgba(255,255,255,.08)",
              borderRadius: 4,
              boxShadow: "0 25px 70px rgba(0,0,0,.65)",
            },
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Stack 
            direction="row" 
            sx={{
                alignItems:"center", 
                justifyContent:"space-between"
            }}
          >
            <Typography sx={{ fontSize: 20, fontWeight: 900 }}>
              Notifications
            </Typography>

            <Button
              size="small"
              onClick={loadNotifications}
              sx={{
                color: "#93c5fd",
                textTransform: "none",
                fontWeight: 800,
              }}
            >
              Refresh
            </Button>
          </Stack>
        </Box>

        <Divider sx={{ borderColor: "rgba(255,255,255,.08)" }} />

        {notifications.length === 0 ? (
          <Box sx={{ p: 2 }}>
            <Typography sx={{ color: "#94a3b8", fontSize: 14 }}>
              No notifications yet.
            </Typography>
          </Box>
        ) : (
          notifications.slice(0, 12).map((notification) => {
            const isUnread = !notification.isRead;

            return (
              <Box
                key={notification._id}
                onClick={() => handleNotificationClick(notification)}
                sx={{
                  mx: 1,
                  my: 1,
                  p: 1.5,
                  display: "flex",
                  gap: 1.5,
                  cursor: "pointer",
                  borderRadius: 3,
                  background: isUnread
                    ? "rgba(37,99,235,.16)"
                    : "rgba(15,23,42,.65)",
                  border: isUnread
                    ? "1px solid rgba(96,165,250,.35)"
                    : "1px solid rgba(148,163,184,.12)",
                  "&:hover": {
                    background: "rgba(30,41,59,.95)",
                  },
                }}
              >
                <Avatar
                  src={
                    notification.sender?.avatar
                      ? getImageUrl(notification.sender.avatar)
                      : ""
                  }
                  sx={{ width: 42, height: 42 }}
                >
                  {notification.sender?.name?.charAt(0)}
                </Avatar>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                    <Box sx={{ color: "#93c5fd", display: "flex" }}>
                      {getNotificationIcon(notification.type)}
                    </Box>

                    <Typography
                      sx={{
                        color: "#f8fafc",
                        fontSize: 14,
                        fontWeight: isUnread ? 900 : 600,
                      }}
                    >
                      <strong>{notification.sender?.name || "Someone"}</strong>{" "}
                      {notification.message}
                    </Typography>
                  </Stack>

                  {notification.financeInvitation?.workspace?.name && (
                    <Typography sx={{ color: "#93c5fd", fontSize: 12, mt: 0.5 }}>
                      {notification.financeInvitation.workspace.name}
                    </Typography>
                  )}

                  <Typography sx={{ color: "#64748b", fontSize: 12, mt: 0.7 }}>
                    {new Date(notification.createdAt).toLocaleString("en-AU", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Typography>
                </Box>

                {isUnread && (
                  <Box
                    sx={{
                      width: 9,
                      height: 9,
                      borderRadius: "50%",
                      background: "#ef4444",
                      boxShadow: "0 0 12px rgba(239,68,68,.8)",
                      mt: 1,
                    }}
                  />
                )}

                {!isUnread && (
                  <CheckCircleIcon sx={{ color: "#334155", fontSize: 17, mt: 0.5 }} />
                )}
              </Box>
            );
          })
        )}
      </Menu>
    </>
  );
};

export default OrbitNotificationHub;