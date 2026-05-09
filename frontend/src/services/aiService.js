import api from "./api";

export const askAI = async (prompt, type = "general", context = {}) => {
  const { data } = await api.post("/ai/suggest", {
    prompt,
    type,
    context,
  });

  return data;
};