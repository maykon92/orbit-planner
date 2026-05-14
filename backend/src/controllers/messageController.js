import {
  createMessage,
  getConversationMessages,
} from "../services/messageService.js";

export const sendMessage = async (req, res) => {
  try {
    const { conversationId, text } = req.body;

    if (!conversationId || !text) {
      return res.status(400).json({
        message: "Conversation ID and text are required.",
      });
    }

    const message = await createMessage({
      conversationId,
      senderId: req.user._id,
      text,
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const messages = await getConversationMessages(req.params.conversationId);

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};