import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  TextField,
  IconButton,
  CircularProgress,
} from "@mui/material";

import SendIcon from "@mui/icons-material/Send";
import { Chip } from "@mui/material";

import { useState } from "react";
import { askAI } from "../../services/aiService";

const AIChatModal = ({ open, onClose, context = {} }) => {
    const [prompt, setPrompt] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSend = async (customPrompt = prompt, customType = context.currentTabType || "general") => {
        if (!customPrompt.trim()) return;

        const userMessage = {
            role: "user",
            content: customPrompt,
        };

        setMessages((prev) => [...prev, userMessage]);
        setLoading(true);

        try {
            const response = await askAI(customPrompt, customType, context);

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: response.result,
                },
            ]);

            setPrompt("");
        } catch (error) {
            console.error(error);
        }

        setLoading(false);
    };

    const quickPrompts = [
        {
            label: "Travel",
            type: "travel",
            prompt: "Based on my saved travel plans, suggest my next destination and explain why.",
        },
        {
            label: "Movies",
            type: "movies",
            prompt: "Based on my saved movie list, suggest what I should watch next.",
        },
        {
            label: "Books",
            type: "books",
            prompt: "Based on my saved books, suggest what I should read next.",
        },
        {
            label: "Agenda",
            type: "agenda",
            prompt: "Based on my saved schedule, help me organise my next priorities.",
        },
        {
            label: "Caption",
            type: "caption",
            prompt: "Create a short and engaging caption for my next post.",
        },
    ];

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            slotProps={{
                paper: {
                sx: {
                    background: "#0f172a",
                    color: "#f8fafc",
                    borderRadius: 5,
                    height: "82vh",
                    border: "1px solid #1e293b",
                    boxShadow: "0 30px 90px rgba(0,0,0,0.7)",
                    overflow: "hidden",
                },
                },
            }}
        >
        <DialogContent
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                p: 0,
                background: "#0f172a",
            }}
        >
            <Box
                sx={{
                    p: 3,
                    borderBottom: "1px solid #1e293b",
                    background:
                    "linear-gradient(135deg, rgba(37,99,235,0.25), rgba(124,58,237,0.18))",
                }}
                >
                <Typography variant="h5" sx={{ color: "#fff", fontWeight: "bold" }}>
                    Orbit AI Assistant
                </Typography>

                <Typography sx={{ color: "#94a3b8", mt: 1 }}>
                    {context.currentTabType
                    ? `Helping you organise your ${context.currentTabType} space.`
                    : "Your intelligent life planner assistant."}
                </Typography>

                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 2 }}>
                    {quickPrompts.map((item) => (
                    <Chip
                        key={item.label}
                        label={item.label}
                        onClick={() => handleSend(item.prompt, item.type)}
                        sx={{
                        background: "#1e293b",
                        color: "#bfdbfe",
                        fontWeight: 600,
                        cursor: "pointer",
                        "&:hover": {
                            background: "#2563eb",
                            color: "#fff",
                        },
                        }}
                    />
                    ))}
                </Box>
            </Box>
            <Box
                sx={{
                    flex: 1,
                    overflowY: "auto",
                    p: 3,
                    background: "#020617",
                    "&::-webkit-scrollbar": {
                    width: "7px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                    background: "#334155",
                    borderRadius: "10px",
                    },
                }}
            >
                {messages.map((message, index) => (
                    <Box
                        key={index}
                        sx={{
                            mb: 2,
                            display: "flex",
                            justifyContent:
                            message.role === "user"
                                ? "flex-end"
                                : "flex-start",
                        }}
                    >
                        <Box
                            sx={{
                                maxWidth: "78%",
                                p: 2,
                                borderRadius: 4,
                                background:
                                    message.role === "user"
                                    ? "linear-gradient(135deg, #2563eb, #1d4ed8)"
                                    : "#111827",
                                color: "#fff",
                                border: message.role === "assistant" ? "1px solid #1f2937" : "none",
                                whiteSpace: "pre-wrap",
                                lineHeight: 1.7,
                                boxShadow:
                                    message.role === "user"
                                    ? "0 12px 30px rgba(37,99,235,0.25)"
                                    : "none",
                            }}
                        >
                            {message.content}
                        </Box>
                    </Box>
                ))}

                {loading && (
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <CircularProgress />
                    </Box>
                )}
            </Box>

            <Box
                sx={{
                    p: 2,
                    borderTop: "1px solid #1e293b",
                    display: "flex",
                    gap: 2,
                }}
            >
                <TextField
                    fullWidth
                    placeholder="Ask Orbit AI..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    multiline
                    maxRows={4}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            background: "#111827",
                            color: "#fff",
                            borderRadius: 4,
                            "& fieldset": { borderColor: "#1f2937" },
                            "&:hover fieldset": { borderColor: "#334155" },
                            "&.Mui-focused fieldset": { borderColor: "#2563eb" },
                        },
                        textarea: { color: "#fff" },
                    }}
                />
                    <IconButton
                        onClick={handleSend}
                        sx={{
                            background: "#2563eb",
                            color: "#fff",
                            width: 60,
                            height: 60,

                            "&:hover": {
                                background: "#1d4ed8",
                            },
                        }}
                    >
                        <SendIcon />
                    </IconButton>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default AIChatModal;