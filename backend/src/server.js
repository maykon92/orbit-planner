import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import tabRoutes from "./routes/tabRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import configRoutes from "./routes/configRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import financeRoutes from "./routes/financeRoutes.js";

import { authGuard } from "./middlewares/authMiddleware.js";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";

import { createMessage } from "./services/messageService.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", process.env.FRONTEND_URL],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinConversation", (conversationId) => {
    socket.join(conversationId);
    console.log(`Socket ${socket.id} joined conversation ${conversationId}`);
  });

  socket.on("sendMessage", async (payload) => {
    try {
      const { conversationId, senderId, text } = payload;

      if (!conversationId || !senderId || !text) return;

      const savedMessage = await createMessage({
        conversationId,
        senderId,
        text,
      });

      io.to(conversationId).emit("receiveMessage", savedMessage);
    } catch (error) {
      console.error("Socket sendMessage error:", error.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    message: "Too many requests from this IP. Please try again later.",
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    message: "Too many login/register attempts. Please try again later.",
  },
});

app.use(limiter);

app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("Orbit Planner API is running...");
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Orbit Planner API is running 🚀",
    uptime: process.uptime(),
    timestamp: new Date(),
  });
});

app.get("/api/protected", authGuard, (req, res) => {
  res.json({
    message: "Protected route accessed successfully",
    user: req.user,
  });
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/tabs", tabRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/config", configRoutes);
app.use("/api/users", userRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/finance", financeRoutes);
app.use(notFound);
app.use(errorHandler);

connectDB();

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});