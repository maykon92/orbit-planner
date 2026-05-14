import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Avatar,
  TextField,
  IconButton,
  CircularProgress,
} from "@mui/material";

import SendIcon from "@mui/icons-material/Send";

import MainLayout from "../../layouts/MainLayout";
import { useAuth } from "../../contexts/AuthContext";
import { getImageUrl } from "../../utils/getImageUrl";
import { socket } from "../../services/socket";
import { getConversations } from "../../services/conversationService";
import { getMessages } from "../../services/messageService";

const Messages = () => {
  const { user } = useAuth();
  const location = useLocation();

  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  const getOtherUser = (conversation) => {
    return conversation.participants.find(
      (participant) => participant._id !== user?._id
    );
  };

  useEffect(() => {
    const loadConversations = async () => {
      try {
        const data = await getConversations();
        setConversations(data);

        const conversationIdFromState = location.state?.conversationId;

        if (conversationIdFromState) {
            const selected = data.find((conv) => conv._id === conversationIdFromState);
            setSelectedConversation(selected || data[0]);
        } else if (data.length > 0) {
            setSelectedConversation(data[0]);
        }
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, [location.state]);

  useEffect(() => {
    if (!selectedConversation?._id) return;

    const loadMessages = async () => {
      const data = await getMessages(selectedConversation._id);
      setMessages(data);

      socket.connect();
      socket.emit("joinConversation", selectedConversation._id);
    };

    loadMessages();

    return () => {
      socket.off("receiveMessage");
    };
  }, [selectedConversation]);

  useEffect(() => {
    socket.on("receiveMessage", (message) => {
      if (message.conversationId === selectedConversation?._id) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [selectedConversation]);

  const handleSend = () => {
    if (!text.trim() || !selectedConversation?._id) return;

    socket.emit("sendMessage", {
      conversationId: selectedConversation._id,
      senderId: user._id,
      text,
    });

    setText("");
  };

  const otherUser = selectedConversation
    ? getOtherUser(selectedConversation)
    : null;

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
          gridTemplateColumns: { xs: "1fr", md: "320px 1fr" },
          gap: 3,
          height: "calc(100vh - 180px)",
        }}
      >
        <Box
          sx={{
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

                return (
                  <Box
                    key={conversation._id}
                    onClick={() => setSelectedConversation(conversation)}
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

                    <Box sx={{ minWidth: 0 }}>
                      <Typography fontWeight="bold" sx={{ color: "#f8fafc" }}>
                        {other?.name || "User"}
                      </Typography>

                      <Typography
                        noWrap
                        sx={{ color: "#64748b", fontSize: 13 }}
                      >
                        {conversation.lastMessage?.text || "Start a conversation"}
                      </Typography>
                    </Box>
                  </Box>
                );
              })
            )}
          </Box>
        </Box>

        <Box
          sx={{
            borderRadius: 4,
            background: "#0f172a",
            border: "1px solid #1f2937",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
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
                <Avatar src={otherUser?.avatar ? getImageUrl(otherUser.avatar) : ""}>
                  {otherUser?.name?.charAt(0)}
                </Avatar>

                <Box>
                  <Typography fontWeight="bold" sx={{ color: "#fff" }}>
                    {otherUser?.name || "User"}
                  </Typography>
                  <Typography sx={{ color: "#64748b", fontSize: 13 }}>
                    Real-time conversation
                  </Typography>
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
                {messages.map((message) => {
                  const isMine =
                    message.senderId?._id === user?._id ||
                    message.senderId === user?._id;

                  return (
                    <Box
                      key={message._id || `${message.createdAt}-${message.text}`}
                      sx={{
                        mb: 2,
                        display: "flex",
                        justifyContent: isMine ? "flex-end" : "flex-start",
                      }}
                    >
                      <Box
                        sx={{
                          maxWidth: "70%",
                          p: 2,
                          borderRadius: 4,
                          background: isMine ? "#2563eb" : "#111827",
                          color: "#fff",
                          border: isMine ? "none" : "1px solid #1f2937",
                          lineHeight: 1.6,
                        }}
                      >
                        {message.text}
                      </Box>
                    </Box>
                  );
                })}
              </Box>

              <Box
                sx={{
                  p: 2,
                  borderTop: "1px solid #1f2937",
                  display: "flex",
                  gap: 2,
                }}
              >
                <TextField
                  fullWidth
                  placeholder="Write a message..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  sx={{
                    input: { color: "#fff" },
                    "& .MuiOutlinedInput-root": {
                      background: "#111827",
                      borderRadius: 4,
                      "& fieldset": { borderColor: "#1f2937" },
                      "&:hover fieldset": { borderColor: "#334155" },
                      "&.Mui-focused fieldset": { borderColor: "#2563eb" },
                    },
                  }}
                />

                <IconButton
                  onClick={handleSend}
                  sx={{
                    width: 54,
                    height: 54,
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
    </MainLayout>
  );
};

export default Messages;