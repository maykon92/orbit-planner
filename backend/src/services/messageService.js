import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";
import { createNotification } from "./notificationService.js";

export const createMessage = async ({ conversationId, senderId, text }) => {
  const message = await Message.create({
    conversationId,
    senderId,
    text,
    readBy: [senderId],
  });

  await Conversation.findByIdAndUpdate(conversationId, {
    lastMessage: message._id,
  });

  const conversation = await Conversation.findById(conversationId);

  if (conversation?.participants?.length) {
    const recipientId = conversation.participants.find(
      (participantId) => participantId.toString() !== senderId.toString()
    );

    if (recipientId) {
      await createNotification({
        recipientId,
        senderId,
        type: "message",
        message: "sent you a message",
        conversationId,
      });
    }
  }

  return await Message.findById(message._id).populate(
    "senderId",
    "name avatar email"
  );
};

export const getConversationMessages = async (conversationId) => {
  return await Message.find({ conversationId })
    .populate("senderId", "name avatar email")
    .sort({ createdAt: 1 });
};