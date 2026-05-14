import api from "./api";

export const getConversations = async () => {
  const { data } = await api.get("/conversations");
  return data;
};

export const createOrGetConversation = async (targetUserId) => {
  const { data } = await api.post("/conversations", { targetUserId });
  return data;
};