import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";

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