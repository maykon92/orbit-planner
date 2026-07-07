import {
  createMessage,
  getConversationMessages,
  markConversationMessagesAsRead,
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

export const readConversationMessages = async (req, res) => {
  try {
    const messages = await markConversationMessagesAsRead({
      conversationId: req.params.conversationId,
      userId: req.user._id,
    });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

import {
  updateUserMessage,
  deleteUserMessage,
} from "../services/messageService.js";

export const updateMessage = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({ message: "Message text is required." });
    }

    const message = await updateUserMessage({
      messageId: req.params.messageId,
      userId: req.user._id,
      text,
    });

    if (!message) {
      return res.status(404).json({ message: "Message not found." });
    }

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const message = await deleteUserMessage({
      messageId: req.params.messageId,
      userId: req.user._id,
    });

    if (!message) {
      return res.status(404).json({ message: "Message not found." });
    }

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};