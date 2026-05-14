import Conversation from "../models/Conversation.js";

export const findOrCreateConversation = async (currentUserId, targetUserId) => {
  let conversation = await Conversation.findOne({
    participants: { $all: [currentUserId, targetUserId] },
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [currentUserId, targetUserId],
    });
  }

  return await Conversation.findById(conversation._id)
    .populate("participants", "name avatar email")
    .populate("lastMessage");
};

export const getUserConversations = async (userId) => {
  return await Conversation.find({
    participants: userId,
  })
    .populate("participants", "name avatar email")
    .populate("lastMessage")
    .sort({ updatedAt: -1 });
};