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