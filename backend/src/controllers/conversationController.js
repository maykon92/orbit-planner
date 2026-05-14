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