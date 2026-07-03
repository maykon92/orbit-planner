import Conversation from "../models/Conversation.js";
import {
  findOrCreateConversation,
  getUserConversations,
} from "../services/conversationService.js";

export const createOrGetConversation = async (req, res) => {
  try {
    const { targetUserId } = req.body;

    if (!targetUserId) {
      return res.status(400).json({ message: "Target user ID is required." });
    }

    const conversation = await findOrCreateConversation(
      req.user._id,
      targetUserId
    );

    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyConversations = async (req, res) => {
  try {
    const conversations = await getUserConversations(req.user._id);
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markConversationAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;

    await Conversation.findOneAndUpdate(
      {
        _id: conversationId,
        participants: req.user._id,
      },
      {
        $pull: {
          unreadBy: req.user._id,
        },
      }
    );

    res.json({ message: "Conversation marked as read." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};