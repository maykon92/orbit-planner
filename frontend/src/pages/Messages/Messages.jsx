import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  CircularProgress,
  IconButton,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
  Button,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from "@mui/icons-material/Send";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import MainLayout from "../../layouts/MainLayout";
import { useAuth } from "../../contexts/AuthContext";
import { getImageUrl } from "../../utils/getImageUrl";
import { socket } from "../../services/socket";
import {
  getConversations,
  markConversationAsRead,
} from "../../services/conversationService";
import {
  getMessages,
  markMessagesAsRead,
  updateMessage,
  deleteMessage,
} from "../../services/messageService";

const formatMessageTime = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleTimeString("en-AU", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatConversationTime = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleTimeString("en-AU", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatMessageDate = (date) => {
  const d = new Date(date);
  const today = new Date();
  const yesterday = new Date();

  yesterday.setDate(today.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";

  return d.toLocaleDateString("en-AU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const Messages = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [messageMenuAnchor, setMessageMenuAnchor] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const typingTimeout = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = (behavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  const getOtherUser = (conversation) => {
    return conversation?.participants?.find(
      (participant) => participant._id !== user?._id
    );
  };

  const otherUser = selectedConversation
    ? getOtherUser(selectedConversation)
    : null;

  const isOtherUserOnline = otherUser
    ? onlineUsers.includes(otherUser._id)
    : false;

  const lastOwnMessageId = useMemo(() => {
    const ownMessages = messages.filter((message) => {
      const senderId = message.senderId?._id || message.senderId;
      return senderId?.toString() === user?._id?.toString();
    });

    return ownMessages[ownMessages.length - 1]?._id;
  }, [messages, user?._id]);

  const isUnreadConversation = (conversation) => {
    return conversation.unreadBy?.some(
      (userId) => userId.toString() === user?._id?.toString()
    );
  };

  const handleSelectConversation = async (conversation) => {
    setSelectedConversation(conversation);

    if (isMobile) {
      setMobileChatOpen(true);
    }

    if (isUnreadConversation(conversation)) {
      await markConversationAsRead(conversation._id);

      setConversations((prev) =>
        prev.map((item) =>
          item._id === conversation._id
            ? {
                ...item,
                unreadBy: item.unreadBy?.filter(
                  (id) => id.toString() !== user?._id?.toString()
                ),
              }
            : item
        )
      );
    }
  };

  const handleTypingChange = (value) => {
    setText(value);

    if (!selectedConversation?._id || !user?._id) return;

    socket.emit("typing", {
      conversationId: selectedConversation._id,
      userId: user._id,
      userName: user.name,
    });

    clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit("stopTyping", {
        conversationId: selectedConversation._id,
        userId: user._id,
      });
    }, 1200);
  };

  const handleSend = () => {
    if (!text.trim() || !selectedConversation?._id) return;

    socket.emit("sendMessage", {
      conversationId: selectedConversation._id,
      senderId: user._id,
      text,
    });

    socket.emit("stopTyping", {
      conversationId: selectedConversation._id,
      userId: user._id,
    });

    clearTimeout(typingTimeout.current);
    setText("");
  };

  useEffect(() => {
    const loadConversations = async () => {
      try {
        const data = await getConversations();
        setConversations(data);

        const conversationIdFromState = location.state?.conversationId;

        if (conversationIdFromState) {
          const selected = data.find(
            (conversation) => conversation._id === conversationIdFromState
          );

          setSelectedConversation(selected || data[0]);
        } else if (data.length > 0) {
          setSelectedConversation(data[0]);
        }
      } catch (error) {
        console.error("Error loading conversations:", error);
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, [location.state]);

  useEffect(() => {
    if (!selectedConversation?._id) return;

    const loadMessages = async () => {
      try {
        const data = await getMessages(selectedConversation._id);
        setMessages(data);

        const updatedMessages = await markMessagesAsRead(
          selectedConversation._id
        );

        setMessages(updatedMessages);

        await markConversationAsRead(selectedConversation._id);

        setConversations((prev) =>
          prev.map((conversation) =>
            conversation._id === selectedConversation._id
              ? {
                  ...conversation,
                  unreadBy: conversation.unreadBy?.filter(
                    (id) => id.toString() !== user?._id?.toString()
                  ),
                }
              : conversation
          )
        );

        socket.connect();
        socket.emit("joinConversation", selectedConversation._id);

        setTimeout(() => scrollToBottom("auto"), 100);
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    };

    loadMessages();

    return () => {
      socket.off("receiveMessage");
    };
  }, [selectedConversation, user?._id]);

  useEffect(() => {
    const handleReceiveMessage = (message) => {
      const isCurrentConversation =
        message.conversationId === selectedConversation?._id;

      if (isCurrentConversation) {
        setMessages((prev) => [...prev, message]);

        markConversationAsRead(message.conversationId).catch(console.error);

        markMessagesAsRead(message.conversationId)
          .then((updatedMessages) => setMessages(updatedMessages))
          .catch(console.error);
      }

      setConversations((prev) => {
        const updated = prev.map((conversation) => {
          if (conversation._id !== message.conversationId) {
            return conversation;
          }

          return {
            ...conversation,
            lastMessage: message,
            lastMessageAt: message.createdAt,
            unreadBy: isCurrentConversation
              ? conversation.unreadBy?.filter(
                  (id) => id.toString() !== user?._id?.toString()
                )
              : conversation.unreadBy?.some(
                  (id) => id.toString() === user?._id?.toString()
                )
              ? conversation.unreadBy
              : [...(conversation.unreadBy || []), user?._id],
          };
        });

        return updated.sort(
          (a, b) =>
            new Date(b.lastMessageAt || b.updatedAt) -
            new Date(a.lastMessageAt || a.updatedAt)
        );
      });
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [selectedConversation, user?._id]);

  useEffect(() => {
    scrollToBottom("smooth");
  }, [messages]);

  useEffect(() => {
    const handleTyping = (data) => {
      if (data.conversationId !== selectedConversation?._id) return;
      if (data.userId === user?._id) return;

      setTypingUsers((prev) => {
        if (prev.some((item) => item.userId === data.userId)) return prev;
        return [...prev, data];
      });
    };

    const handleStopTyping = (data) => {
      setTypingUsers((prev) =>
        prev.filter((item) => item.userId !== data.userId)
      );
    };

    socket.on("userTyping", handleTyping);
    socket.on("userStoppedTyping", handleStopTyping);

    return () => {
      socket.off("userTyping", handleTyping);
      socket.off("userStoppedTyping", handleStopTyping);
    };
  }, [selectedConversation, user?._id]);

  useEffect(() => {
    if (!user?._id) return;

    socket.connect();
    socket.emit("userOnline", user._id);

    const handleUserOnline = ({ userId }) => {
      setOnlineUsers((prev) =>
        prev.includes(userId) ? prev : [...prev, userId]
      );
    };

    const handleUserOffline = ({ userId }) => {
      setOnlineUsers((prev) => prev.filter((id) => id !== userId));
    };

    socket.on("userOnline", handleUserOnline);
    socket.on("userOffline", handleUserOffline);

    return () => {
      socket.off("userOnline", handleUserOnline);
      socket.off("userOffline", handleUserOffline);
    };
  }, [user?._id]);

  const handleOpenMessageMenu = (event, message) => {
    event.stopPropagation();
    setSelectedMessage(message);
    setMessageMenuAnchor(event.currentTarget);
  };

  const handleCloseMessageMenu = () => {
    setSelectedMessage(null);
    setMessageMenuAnchor(null);
  };

  const handleStartEditMessage = () => {
    if (!selectedMessage) return;

    setEditingMessageId(selectedMessage._id);
    setEditingText(selectedMessage.text);
    setMessageMenuAnchor(null);
  };

  const handleCancelEditMessage = () => {
    setEditingMessageId(null);
    setEditingText("");
  };

  const handleSaveEditMessage = async () => {
    if (!editingMessageId || !editingText.trim()) return;

    const updated = await updateMessage(editingMessageId, editingText);

    setMessages((prev) =>
      prev.map((message) =>
        message._id === updated._id ? updated : message
      )
    );

    setEditingMessageId(null);
    setEditingText("");
  };

  const handleDeleteSelectedMessage = async () => {
    if (!selectedMessage) return;

    const deleted = await deleteMessage(selectedMessage._id);

    setMessages((prev) =>
      prev.map((message) =>
        message._id === deleted._id ? deleted : message
      )
    );

    handleCloseMessageMenu();
  };

  return (
    <MainLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" fontWeight="bold" sx={{ color: "#f8fafc" }}>
          Messages
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "320px 1fr",
          },
          gap: 3,
          height: {
            xs: "calc(100vh - 150px)",
            md: "calc(100vh - 180px)",
          },
        }}
      >
        <Box
          sx={{
            display: isMobile && mobileChatOpen ? "none" : "block",
            borderRadius: 4,
            background: "#0f172a",
            border: "1px solid #1f2937",
            overflow: "hidden",
          }}
        >
          <Box sx={{ p: 3, borderBottom: "1px solid #1f2937" }}>
            <Typography fontWeight="bold" sx={{ color: "#fff" }}>
              Conversations
            </Typography>
          </Box>

          <Box sx={{ overflowY: "auto", height: "calc(100% - 73px)" }}>
            {loading ? (
              <Box sx={{ p: 3 }}>
                <CircularProgress size={24} />
              </Box>
            ) : conversations.length === 0 ? (
              <Typography sx={{ p: 3, color: "#64748b" }}>
                No conversations yet.
              </Typography>
            ) : (
              conversations.map((conversation) => {
                const other = getOtherUser(conversation);
                const isActive =
                  selectedConversation?._id === conversation._id;
                const isUnread = isUnreadConversation(conversation);
                const conversationTime =
                  conversation.lastMessageAt ||
                  conversation.lastMessage?.createdAt;

                return (
                  <Box
                    key={conversation._id}
                    onClick={() => handleSelectConversation(conversation)}
                    sx={{
                      p: 2,
                      display: "flex",
                      gap: 2,
                      cursor: "pointer",
                      background: isActive ? "#111827" : "transparent",
                      borderBottom: "1px solid #1f2937",
                      "&:hover": {
                        background: "#111827",
                      },
                    }}
                  >
                    <Avatar src={other?.avatar ? getImageUrl(other.avatar) : ""}>
                      {other?.name?.charAt(0)}
                    </Avatar>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Stack
                        direction="row"
                        sx={{
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 1,
                        }}
                      >
                        <Typography
                          fontWeight={isUnread ? 900 : 700}
                          sx={{ color: "#f8fafc" }}
                          noWrap
                        >
                          {other?.name || "User"}
                        </Typography>

                        <Typography
                          sx={{
                            color: isUnread ? "#60a5fa" : "#64748b",
                            fontSize: 11,
                            flexShrink: 0,
                          }}
                        >
                          {formatConversationTime(conversationTime)}
                        </Typography>
                      </Stack>

                      <Stack
                        direction="row"
                        sx={{
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 1,
                          mt: 0.5,
                        }}
                      >
                        <Typography
                          noWrap
                          sx={{
                            color: isUnread ? "#cbd5e1" : "#64748b",
                            fontSize: 13,
                            fontWeight: isUnread ? 800 : 400,
                          }}
                        >
                          {conversation.lastMessage?.text ||
                            "Start a conversation"}
                        </Typography>

                        {isUnread && (
                          <Box
                            sx={{
                              width: 10,
                              height: 10,
                              borderRadius: "50%",
                              background: "#2563eb",
                              boxShadow: "0 0 12px rgba(37,99,235,.8)",
                              flexShrink: 0,
                            }}
                          />
                        )}
                      </Stack>
                    </Box>
                  </Box>
                );
              })
            )}
          </Box>
        </Box>

        <Box
          sx={{
            display: isMobile && !mobileChatOpen ? "none" : "flex",
            borderRadius: 4,
            background: "#0f172a",
            border: "1px solid #1f2937",
            flexDirection: "column",
            overflow: "hidden",
            minHeight: 0,
          }}
        >
          {selectedConversation ? (
            <>
              <Box
                sx={{
                  p: 3,
                  borderBottom: "1px solid #1f2937",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                {isMobile && (
                  <IconButton
                    onClick={() => setMobileChatOpen(false)}
                    sx={{ color: "#f8fafc" }}
                  >
                    <ArrowBackIcon />
                  </IconButton>
                )}

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(`/users/${otherUser?._id}`)}
                >
                  <Avatar
                    src={
                      otherUser?.avatar ? getImageUrl(otherUser.avatar) : ""
                    }
                  >
                    {otherUser?.name?.charAt(0)}
                  </Avatar>

                  <Box>
                    <Typography fontWeight="bold" sx={{ color: "#fff" }}>
                      {otherUser?.name || "User"}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.8,
                        mt: 0.3,
                      }}
                    >
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: isOtherUserOnline
                            ? "#22c55e"
                            : "#64748b",
                          boxShadow: isOtherUserOnline
                            ? "0 0 10px rgba(34,197,94,.8)"
                            : "none",
                        }}
                      />

                      <Typography sx={{ color: "#94a3b8", fontSize: 12 }}>
                        {isOtherUserOnline ? "Online" : "Offline"}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              <Box
                sx={{
                  flex: 1,
                  p: 3,
                  overflowY: "auto",
                  background: "#020617",
                }}
              >
                {messages.map((message, index) => {
                  const senderId = message.senderId?._id || message.senderId;

                  const isMine =
                    senderId?.toString() === user?._id?.toString();

                  const isLastOwnMessage = message._id === lastOwnMessageId;

                  const isSeen =
                    isMine &&
                    isLastOwnMessage &&
                    message.readBy?.some(
                      (id) => id.toString() !== user?._id?.toString()
                    );

                  const isEditing = editingMessageId === message._id;
                  const previous = messages[index - 1];

                  const showDay =
                    !previous ||
                    new Date(previous.createdAt).toDateString() !==
                      new Date(message.createdAt).toDateString();

                  return (
                    <Box key={message._id || `${message.createdAt}-${index}`}>
                      {showDay && (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            my: 3,
                          }}
                        >
                          <Typography
                            sx={{
                              px: 2,
                              py: 0.6,
                              borderRadius: 20,
                              background: "#111827",
                              color: "#94a3b8",
                              fontSize: 12,
                              border: "1px solid #1f2937",
                            }}
                          >
                            {formatMessageDate(message.createdAt)}
                          </Typography>
                        </Box>
                      )}

                      <Box
                        sx={{
                          mb: 2,
                          display: "flex",
                          justifyContent: isMine ? "flex-end" : "flex-start",
                        }}
                      >
                          <Box
                            sx={{
                              mb: 2,
                              display: "flex",
                              justifyContent: isMine ? "flex-end" : "flex-start",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            {isMine && !message.isDeleted && !isEditing && (
                              <IconButton
                                size="small"
                                onClick={(event) => handleOpenMessageMenu(event, message)}
                                sx={{
                                  color: "#94a3b8",
                                  opacity: 0.7,
                                  "&:hover": {
                                    opacity: 1,
                                    background: "rgba(255,255,255,.06)",
                                  },
                                }}
                              >
                                <MoreVertIcon fontSize="small" />
                              </IconButton>
                            )}

                            <Box
                              sx={{
                                maxWidth: "72%",
                                px: 2,
                                py: 1.4,
                                borderRadius: 3,
                                background: isMine ? "#2563eb" : "#111827",
                                color: "#fff",
                                border: isMine ? "none" : "1px solid #1f2937",
                              }}
                            >
                            {isEditing ? (
                              <Box>
                                <TextField
                                  fullWidth
                                  size="small"
                                  value={editingText}
                                  onChange={(e) => setEditingText(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                      e.preventDefault();
                                      handleSaveEditMessage();
                                    }

                                    if (e.key === "Escape") {
                                      handleCancelEditMessage();
                                    }
                                  }}
                                  sx={{
                                    input: { color: "#fff" },
                                    "& .MuiOutlinedInput-root": {
                                      background: "rgba(15,23,42,.75)",
                                      borderRadius: 2,
                                    },
                                  }}
                                />

                                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                  <Button size="small" variant="contained" onClick={handleSaveEditMessage}>
                                    Save
                                  </Button>

                                  <Button size="small" onClick={handleCancelEditMessage} sx={{ color: "#cbd5e1" }}>
                                    Cancel
                                  </Button>
                                </Stack>
                              </Box>
                            ) : (
                              <Typography
                                sx={{
                                  whiteSpace: "pre-wrap",
                                  wordBreak: "break-word",
                                  lineHeight: 1.6,
                                  fontStyle: message.isDeleted ? "italic" : "normal",
                                  color: message.isDeleted ? "#94a3b8" : "#fff",
                                }}
                              >
                                {message.text}
                              </Typography>
                            )}

                            <Typography
                              variant="caption"
                              sx={{
                                display: "block",
                                mt: 1,
                                fontSize: 11,
                                color: isMine
                                  ? "rgba(255,255,255,.75)"
                                  : "#94a3b8",
                                textAlign: "right",
                              }}
                            >
                              {formatMessageTime(message.createdAt)}
                            </Typography>

                            {message.editedAt && !message.isDeleted && (
                              <Typography
                                variant="caption"
                                sx={{
                                  display: "block",
                                  mt: 0.3,
                                  fontSize: 10,
                                  color: isMine ? "rgba(255,255,255,.65)" : "#94a3b8",
                                  textAlign: "right",
                                }}
                              >
                                edited
                              </Typography>
                            )}

                            {isMine && isLastOwnMessage && (
                              <Typography
                                variant="caption"
                                sx={{
                                  display: "block",
                                  mt: 0.4,
                                  fontSize: 10,
                                  color: "rgba(255,255,255,.72)",
                                  textAlign: "right",
                                }}
                              >
                                {isSeen ? "Seen" : "Sent"}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  );
                })}

                <div ref={messagesEndRef} />
              </Box>

              {typingUsers.length > 0 && (
                <Box
                  sx={{
                    px: 3,
                    pb: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.2,
                    background: "#020617",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#60a5fa",
                      fontSize: 13,
                      fontStyle: "italic",
                    }}
                  >
                    {typingUsers[0].userName} is typing
                  </Typography>

                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    {[0, 1, 2].map((dot) => (
                      <Box
                        key={dot}
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: "#60a5fa",
                          animation: "typingBounce 1.2s infinite ease-in-out",
                          animationDelay: `${dot * 0.18}s`,
                          "@keyframes typingBounce": {
                            "0%, 80%, 100%": {
                              transform: "translateY(0)",
                              opacity: 0.35,
                            },
                            "40%": {
                              transform: "translateY(-5px)",
                              opacity: 1,
                            },
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              <Box
                sx={{
                  p: { xs: 1.5, md: 2 },
                  borderTop: "1px solid #1f2937",
                  display: "flex",
                  gap: 2,
                }}
              >
                <TextField
                  fullWidth
                  placeholder="Write a message..."
                  value={text}
                  onChange={(e) => handleTypingChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  sx={{
                    input: { color: "#fff" },
                    "& .MuiOutlinedInput-root": {
                      minHeight: 48,
                      background: "#111827",
                      borderRadius: 4,
                    },
                  }}
                />

                <IconButton
                  onClick={handleSend}
                  sx={{
                    width: { xs: 48, md: 54 },
                    height: { xs: 48, md: 54 },
                    flexShrink: 0,
                    background: "#2563eb",
                    color: "#fff",
                    "&:hover": {
                      background: "#1d4ed8",
                    },
                  }}
                >
                  <SendIcon />
                </IconButton>
              </Box>
            </>
          ) : (
            <Box
              sx={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#64748b",
              }}
            >
              Select a conversation to start chatting.
            </Box>
          )}
        </Box>
      </Box>
      <Menu
        anchorEl={messageMenuAnchor}
        open={Boolean(messageMenuAnchor)}
        onClose={handleCloseMessageMenu}
        slotProps={{
          paper: {
            sx: {
              background: "#0f172a",
              color: "#f8fafc",
              border: "1px solid #1f2937",
              borderRadius: 3,
            },
          },
        }}
      >
        <MenuItem onClick={handleStartEditMessage}>
          <EditIcon fontSize="small" style={{ marginRight: 8 }} />
          Edit
        </MenuItem>

        <MenuItem onClick={handleDeleteSelectedMessage} sx={{ color: "#fca5a5" }}>
          <DeleteIcon fontSize="small" style={{ marginRight: 8 }} />
          Delete
        </MenuItem>
      </Menu>
    </MainLayout>
  );
};

export default Messages;