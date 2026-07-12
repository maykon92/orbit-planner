import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";
import { createNotification } from "./notificationService.js";

export const createMessage = async ({
  conversationId,
  senderId,
  text,
  storyId = null,
  storyPreview = null,
}) => {
  const message = await Message.create({
    conversationId,
    senderId,
    text,
    readBy: [senderId],
    storyId,
    storyPreview,
  });

  await Conversation.findByIdAndUpdate(conversationId, {
    lastMessage: message._id,
    lastMessageAt: message.createdAt,
  });

  const conversation = await Conversation.findById(conversationId);

  if (conversation?.participants?.length) {
    const recipientId = conversation.participants.find(
      (participantId) =>
        participantId.toString() !== senderId.toString()
    );

    if (recipientId) {
      await Conversation.findByIdAndUpdate(conversationId, {
        $addToSet: {
          unreadBy: recipientId,
        },
      });

      await createNotification({
        recipientId,
        senderId,
        type: "message",
        message: storyId
          ? "replied to your story"
          : "sent you a message",
        conversationId,
      });
    }
  }

  return await Message.findById(message._id)
    .populate("senderId", "name avatar email")
    .populate("storyId", "image caption userId");
};

export const getConversationMessages = async (conversationId) => {
  return await Message.find({ conversationId })
    .populate("senderId", "name avatar email")
    .sort({ createdAt: 1 });
};

export const markConversationMessagesAsRead = async ({
  conversationId,
  userId,
}) => {
  await Message.updateMany(
    {
      conversationId,
      senderId: { $ne: userId },
      readBy: { $ne: userId },
    },
    {
      $addToSet: {
        readBy: userId,
      },
    }
  );

  return await Message.find({ conversationId })
    .populate("senderId", "name avatar email")
    .sort({ createdAt: 1 });
};

export const updateUserMessage = async ({ messageId, userId, text }) => {
  return await Message.findOneAndUpdate(
    {
      _id: messageId,
      senderId: userId,
    },
    {
      text,
      editedAt: new Date(),
    },
    { new: true }
  ).populate("senderId", "name avatar email");
};

export const deleteUserMessage = async ({ messageId, userId }) => {
  return await Message.findOneAndUpdate(
    {
      _id: messageId,
      senderId: userId,
    },
    {
      isDeleted: true,
      text: "This message was deleted.",
      deletedAt: new Date(),
    },
    { new: true }
  ).populate("senderId", "name avatar email");
};