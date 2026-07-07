import api from "./api";

export const getMessages = async (conversationId) => {
  const { data } = await api.get(`/messages/${conversationId}`);
  return data;
};

export const sendMessageApi = async (messageData) => {
  const { data } = await api.post("/messages", messageData);
  return data;
};

export const markMessagesAsRead = async (conversationId) => {
  const { data } = await api.put(`/messages/conversations/${conversationId}/read`);
  return data;
};

export const updateMessage = async (messageId, text) => {
  const { data } = await api.put(`/messages/${messageId}`, { text });
  return data;
};

export const deleteMessage = async (messageId) => {
  const { data } = await api.delete(`/messages/${messageId}`);
  return data;
};